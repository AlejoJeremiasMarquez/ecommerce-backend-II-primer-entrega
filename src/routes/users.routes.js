import { Router } from 'express';
import passport from 'passport';
import * as usersController from '../controllers/users.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware de autenticación para todas las rutas
const authenticate = passport.authenticate('current', { session: false });

// ========================================
// CRUD DE USUARIOS
// ========================================

// Obtener todos los usuarios (solo admin)
router.get('/', authenticate, isAdmin, usersController.getAllUsers);

// Obtener usuario por ID
router.get('/:id', authenticate, usersController.getUserById);

// Actualizar usuario
router.put('/:id', authenticate, usersController.updateUser);

// Eliminar usuario (solo admin)
router.delete('/:id', authenticate, isAdmin, usersController.deleteUser);

export default router;