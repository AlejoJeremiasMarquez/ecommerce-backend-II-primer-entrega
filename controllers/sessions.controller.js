import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/user.repository.js';
import userRepository from '../repositories/user.repository.js';
import EmailService from '../services/email.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
const JWT_EXPIRATION = '24h';

// ========================================
// RESTABLECER CONTRASEÑA
// ========================================
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash del token para comparar
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con token válido y no expirado
    const user = await UserRepository.getUserByResetToken(resetTokenHash);

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token inválido o expirado'
      });
    }

    // Verificar que la nueva contraseña no sea igual a la anterior
    const isSamePassword = bcrypt.compareSync(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        status: 'error',
        message: 'La nueva contraseña no puede ser igual a la anterior'
      });
    }

    // Hashear nueva contraseña
    user.password = bcrypt.hashSync(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      status: 'success',
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
// ========================================
// REGISTRO DE USUARIO
// ========================================
export const register = async (req, res, next) => {
  try {
    // El usuario ya fue creado por Passport en la estrategia 'register'
    const user = req.user;

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// LOGIN DE USUARIO
// ========================================
export const login = async (req, res, next) => {
  try {
    // El usuario ya fue autenticado por Passport en la estrategia 'login'
    const user = req.user;

    // Generar JWT
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Enviar token en cookie (httpOnly para mayor seguridad)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.json({
      status: 'success',
      message: 'Login exitoso',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// OBTENER USUARIO ACTUAL (CURRENT) con DTO
// ========================================
export const current = async (req, res, next) => {
  try {
    // El usuario ya fue validado por Passport en la estrategia 'current'
    // Usar DTO para no enviar información sensible
    const userDTO = await UserRepository.getCurrentUser(req.user);

    res.json({
      status: 'success',
      message: 'Usuario autenticado',
      data: {
        user: userDTO
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// LOGOUT DE USUARIO
// ========================================
export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({
    status: 'success',
    message: 'Logout exitoso'
  });
};

// ========================================
// SOLICITAR RECUPERACIÓN DE CONTRASEÑA
// ========================================
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return res.json({
        status: 'success',
        message: 'Si el email existe, recibirás un correo con instrucciones'
      });
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Guardar token y expiración (1 hora)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Enviar email
    await EmailService.sendPasswordResetEmail(email, resetToken);

    res.json({
      status: 'success',
      message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña'
    });
  } catch (error) {
    next(error);
  }
};