// ============================================
// OrdenaTEC — Auth Routes
// ============================================

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { registroSchema, loginSchema } from '../utils/validators';

const router = Router();

// Límite contra fuerza bruta: 10 intentos por IP cada 15 minutos.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Demasiados intentos',
        mensaje: 'Has hecho demasiados intentos de autenticación. Intenta de nuevo en 15 minutos.',
    },
});

// POST /api/auth/register — Registro de usuario
router.post('/register', authLimiter, validateBody(registroSchema), authController.register);

// POST /api/auth/login — Inicio de sesión
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);

export default router;
