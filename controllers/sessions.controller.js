import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
const JWT_EXPIRATION = '24h';

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
// OBTENER USUARIO ACTUAL (CURRENT)
// ========================================
export const current = async (req, res, next) => {
try {
    // El usuario ya fue validado por Passport en la estrategia 'current'
    const user = req.user;

    res.json({
    status: 'success',
    message: 'Usuario autenticado',
    data: {
        user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
        }
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