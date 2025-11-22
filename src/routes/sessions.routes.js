import { Router } from 'express';
import passport from 'passport';
import * as sessionsController from '../controllers/sessions.controller.js';

const router = Router();

// ========================================
// RUTA DE REGISTRO
// ========================================
router.post('/register', 
  passport.authenticate('register', { 
    session: false,
    failWithError: true 
  }),
  sessionsController.register
);

// ========================================
// RUTA DE LOGIN
// ========================================
router.post('/login',
  passport.authenticate('login', { 
    session: false,
    failWithError: true 
  }),
  sessionsController.login
);

// ========================================
// RUTA CURRENT (Usuario actual)
// ========================================
router.get('/current',
  passport.authenticate('current', { 
    session: false,
    failWithError: true 
  }),
  sessionsController.current
);

// ========================================
// RUTA DE LOGOUT
// ========================================
router.post('/logout', sessionsController.logout);

// ========================================
// RUTAS DE RECUPERACIÓN DE CONTRASEÑA
// ========================================

// Solicitar recuperación de contraseña
router.post('/forgot-password', sessionsController.forgotPassword);

// Restablecer contraseña con token
router.post('/reset-password/:token', sessionsController.resetPassword);

export default router;