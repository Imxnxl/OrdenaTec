// ============================================
// OrdenaTEC — Server Entry Point
// Starts the Express server.
// ============================================

import dotenv from 'dotenv';

// Cargar variables de entorno antes de importar la app
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('============================================');
    console.log(`  🖥️  OrdenaTEC API`);
    console.log(`  🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`  📡 Health check: http://localhost:${PORT}/api/health`);
    console.log('============================================');
});
