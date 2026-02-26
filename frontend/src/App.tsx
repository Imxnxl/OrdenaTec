// ============================================
// OrdenaTEC — App Router
// Main application component with routing.
// ============================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store';
import Navbar from './components/layout/Navbar';

// Pages
import ConfiguradorPage from './pages/Configurador.page';
import CarritoPage from './pages/Carrito.page';
import CheckoutPage from './pages/Checkout.page';
import LoginPage from './pages/Login.page';
import RegisterPage from './pages/Register.page';
import DashboardPage from './pages/Admin/Dashboard.page';
import CatalogoPage from './pages/Admin/Catalogo.page';

/**
 * Componente para rutas protegidas (sólo usuarios autenticados).
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { usuario } = useAppSelector((state) => state.auth);
    if (!usuario) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

/**
 * Componente para rutas de administrador.
 */
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { usuario } = useAppSelector((state) => state.auth);
    if (!usuario) return <Navigate to="/login" replace />;
    if (usuario.rol !== 'ADMIN') return <Navigate to="/" replace />;
    return <>{children}</>;
};

/**
 * Página de inicio (landing).
 */
const HomePage: React.FC = () => (
    <div className="home-page">
        <div className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    Arma tu PC <span className="gradient-text">perfecta</span>
                </h1>
                <p className="hero-subtitle">
                    Configurador inteligente con validación de compatibilidad en tiempo real.
                    Elige cada componente paso a paso y nosotros verificamos que todo sea compatible.
                </p>
                <div className="hero-actions">
                    <a href="/configurador" className="btn btn-primary btn-lg">
                        ⚙️ Comenzar a armar
                    </a>
                </div>
            </div>
            <div className="hero-features">
                <div className="feature-card">
                    <span className="feature-icon">🔧</span>
                    <h3>Paso a paso</h3>
                    <p>Selecciona cada componente guiado por nuestro configurador intuitivo.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">✅</span>
                    <h3>Compatibilidad</h3>
                    <p>Validamos socket, RAM, consumo y dimensiones en tiempo real.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">💡</span>
                    <h3>Sugerencias</h3>
                    <p>Te sugerimos alternativas compatibles si algo no está disponible.</p>
                </div>
            </div>
        </div>
    </div>
);

/**
 * Página de confirmación de pedido.
 */
const PedidoConfirmadoPage: React.FC = () => (
    <div className="page-empty">
        <h2>🎉 ¡Pedido confirmado!</h2>
        <p>Tu pedido ha sido procesado exitosamente. Recibirás un correo de confirmación.</p>
        <a href="/configurador" className="btn btn-primary">
            Armar otra PC
        </a>
    </div>
);

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/configurador" element={<ConfiguradorPage />} />
                        <Route path="/carrito" element={<CarritoPage />} />
                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <CheckoutPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/pedido-confirmado" element={<PedidoConfirmadoPage />} />
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <DashboardPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/catalogo"
                            element={
                                <AdminRoute>
                                    <CatalogoPage />
                                </AdminRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <footer className="footer">
                    <p>© 2025 OrdenaTEC — Proyecto de Ingeniería de Software</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;
