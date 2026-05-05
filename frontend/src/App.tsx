// ============================================
// OrdenaTEC — App Router
// Main application component with routing.
// ============================================

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
import PrearmadasPage from './pages/Prearmadas.page';
import IAConfiguradorPage from './pages/IAConfigurador.page';
import PerifericosPage from './pages/Perifericos.page';
import MisPedidosPage from './pages/MisPedidos.page';

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
                    <Link to="/configurador" className="btn btn-primary btn-lg">
                        Comenzar a armar
                    </Link>
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
        <Link to="/configurador" className="btn btn-primary">
            Armar otra PC
        </Link>
    </div>
);

const DisclaimerModal: React.FC = () => {
    const [isVisible, setIsVisible] = useState(() => {
        return !sessionStorage.getItem('disclaimer_seen');
    });

    if (!isVisible) return null;

    const handleClose = () => {
        sessionStorage.setItem('disclaimer_seen', 'true');
        setIsVisible(false);
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <div className="modal" style={{ maxWidth: '500px', textAlign: 'center' }}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>⚠️ Aviso de Desarrollo</h3>
                    <button type="button" className="btn-close" onClick={handleClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>
                <div className="modal-body">
                    <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                        ¡Aviso de construcción! Seguimos trabajando duro en el código de OrdenaTEC. Lo que ves aquí todavía no es nuestra versión final.
                    </p>
                    <img
                        src="https://media1.tenor.com/m/ZV_HU24jHj0AAAAd/treyreloaded-dog.gif"
                        alt="Working dog"
                        style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
                    />
                </div>
                <div className="modal-footer" style={{ justifyContent: 'center' }}>
                    <button type="button" className="btn btn-primary" onClick={handleClose}>
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <DisclaimerModal />
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/configurador" element={<ConfiguradorPage />} />
                        <Route path="/prearmadas" element={<PrearmadasPage />} />
                        <Route path="/perifericos" element={<PerifericosPage />} />
                        <Route path="/ia-configurador" element={<IAConfiguradorPage />} />
                        <Route
                            path="/mis-pedidos"
                            element={
                                <ProtectedRoute>
                                    <MisPedidosPage />
                                </ProtectedRoute>
                            }
                        />
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
                    <p>© 2026 OrdenaTEC — Proyecto de Ingeniería de Software</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;
