// ============================================
// OrdenaTEC — Express Application Setup
// Configures Express app with middleware and routes.
// ============================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';

const app = express();

// --- Middlewares globales ---

// Seguridad HTTP headers
app.use(helmet());

// CORS (permite peticiones del frontend en desarrollo)
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// Parse JSON body
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// --- Rutas de la API ---
app.use('/api', routes);

// --- Ruta raíz ---
app.get('/', (_req, res) => {
    res.json({
        nombre: 'OrdenaTEC API',
        version: '1.0.0',
        descripcion: 'E-Commerce PC Configurator API',
        docs: '/api/health',
    });
});

// --- Manejo de errores ---
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
