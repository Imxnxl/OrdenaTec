// ============================================
// OrdenaTEC — Auth Routes
// ============================================

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { registroSchema, loginSchema } from '../utils/validators';

const router = Router();

// POST /api/auth/register — Registro de usuario
router.post('/register', validateBody(registroSchema), authController.register);

// POST /api/auth/login — Inicio de sesión
router.post('/login', validateBody(loginSchema), authController.login);

export default router;
