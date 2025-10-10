import { Router } from 'express';
import passport from 'passport';
import * as cartsController from '../controllers/carts.controller.js';
import { isUser } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware de autenticación
const authenticate = passport.authenticate('current', { session: false });

// ========================================
// RUTAS DE CARRITOS
// ========================================

// Obtener carrito del usuario actual
router.get('/current', authenticate, isUser, cartsController.getCurrentCart);

// Agregar producto al carrito
router.post('/:cartId/products/:productId', authenticate, isUser, cartsController.addProductToCart);

// Actualizar cantidad de un producto
router.put('/:cartId/products/:productId', authenticate, isUser, cartsController.updateProductQuantity);

// Eliminar producto del carrito
router.delete('/:cartId/products/:productId', authenticate, isUser, cartsController.removeProductFromCart);

// Vaciar carrito
router.delete('/:cartId', authenticate, isUser, cartsController.clearCart);

// Procesar compra
router.post('/:cartId/purchase', authenticate, isUser, cartsController.purchaseCart);

export default router;
