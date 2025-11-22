import { Router } from 'express';
import passport from 'passport';
import * as productsController from '../controllers/products.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware de autenticación
const authenticate = passport.authenticate('current', { session: false });

// ========================================
// RUTAS PÚBLICAS
// ========================================

// Obtener todos los productos
router.get('/', productsController.getAllProducts);

// Obtener producto por ID
router.get('/:id', productsController.getProductById);

// ========================================
// RUTAS PROTEGIDAS (Solo Admin)
// ========================================

// Crear producto (solo admin)
router.post('/', authenticate, isAdmin, productsController.createProduct);

// Actualizar producto (solo admin)
router.put('/:id', authenticate, isAdmin, productsController.updateProduct);

// Eliminar producto (solo admin)
router.delete('/:id', authenticate, isAdmin, productsController.deleteProduct);

export default router;