import { Router } from 'express';
import passport from 'passport';
import { getMyTickets, getTicketById } from '../controllers/tickets.controller.js';
import { isUser } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware de autenticación
const authenticate = passport.authenticate('current', { session: false });

// Obtener tickets del usuario actual
router.get('/my-tickets', authenticate, isUser, getMyTickets);

// Obtener ticket por ID
router.get('/:id', authenticate, isUser, getTicketById);

export default router;
