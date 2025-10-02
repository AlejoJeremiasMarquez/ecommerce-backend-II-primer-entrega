import User from '../models/user.js';
import bcrypt from 'bcrypt';

// ========================================
// OBTENER TODOS LOS USUARIOS
// ========================================
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().populate('cart');
        
        res.json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// OBTENER USUARIO POR ID
// ========================================
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('cart');

        if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'Usuario no encontrado'
        });
        }

        res.json({
        status: 'success',
        data: {
            user
        }
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// ACTUALIZAR USUARIO
// ========================================
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { password, email, ...updateData } = req.body;

        // Si se incluye una nueva contraseña, hashearla
        if (password) {
        updateData.password = bcrypt.hashSync(password, 10);
        }

        // Verificar si el email ya existe (si se está intentando cambiar)
        if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            return res.status(400).json({
            status: 'error',
            message: 'El email ya está en uso'
            });
        }
        updateData.email = email;
        }

        const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
        ).populate('cart');

        if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'Usuario no encontrado'
        });
        }

        res.json({
        status: 'success',
        message: 'Usuario actualizado exitosamente',
        data: {
            user
        }
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// ELIMINAR USUARIO
// ========================================
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'Usuario no encontrado'
        });
        }

        res.json({
        status: 'success',
        message: 'Usuario eliminado exitosamente',
        data: null
        });
    } catch (error) {
        next(error);
    }
};