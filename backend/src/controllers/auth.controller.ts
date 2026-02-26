// ============================================
// OrdenaTEC — Auth Controller
// Maneja registro e inicio de sesión.
// ============================================

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload, Rol } from '../types';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_EXPIRATION = '7d';

/**
 * POST /api/auth/register
 * Registra un nuevo usuario.
 */
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, nombre, password } = req.body;

        // Verificar si el email ya está registrado
        const existente = await prisma.usuario.findUnique({ where: { email } });
        if (existente) {
            res.status(409).json({
                error: 'Email ya registrado',
                mensaje: 'Ya existe una cuenta con este correo electrónico',
            });
            return;
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Crear usuario
        const usuario = await prisma.usuario.create({
            data: {
                email,
                nombre,
                password: hashedPassword,
                rol: 'CLIENTE',
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
            },
        });

        // Generar JWT
        const payload: JwtPayload = {
            userId: usuario.id,
            email: usuario.email,
            rol: usuario.rol as Rol,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'default-secret', {
            expiresIn: JWT_EXPIRATION,
        });

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario,
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/login
 * Inicia sesión y retorna un JWT.
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            res.status(401).json({
                error: 'Credenciales inválidas',
                mensaje: 'Email o contraseña incorrectos',
            });
            return;
        }

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            res.status(401).json({
                error: 'Credenciales inválidas',
                mensaje: 'Email o contraseña incorrectos',
            });
            return;
        }

        // Generar JWT
        const payload: JwtPayload = {
            userId: usuario.id,
            email: usuario.email,
            rol: usuario.rol as Rol,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'default-secret', {
            expiresIn: JWT_EXPIRATION,
        });

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};
