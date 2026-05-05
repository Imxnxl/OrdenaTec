// ============================================
// OrdenaTEC — Navbar Component
// Main navigation bar with cart and auth links.
// ============================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/slices/auth.slice';
import './Layout.css';

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { usuario } = useAppSelector((state) => state.auth);
    const { items } = useAppSelector((state) => state.carrito);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🖥️</span>
                    <span className="logo-text">OrdenaTEC</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/configurador" className="nav-link nav-link-primary">
                        ⚙️ PC Builder
                    </Link>
                    <Link to="/prearmadas" className="nav-link">
                        🖥️ Pre-armadas
                    </Link>
                    <Link to="/perifericos" className="nav-link">
                        🎮 Periféricos
                    </Link>
                    <Link to="/ia-configurador" className="nav-link nav-link-ia">
                        🤖 IA Builder
                    </Link>

                    <Link to="/carrito" className="nav-link nav-link-cart">
                        🛒 Carrito
                        {items.length > 0 && (
                            <span className="cart-badge">{items.length}</span>
                        )}
                    </Link>

                    {usuario ? (
                        <div className="nav-user">
                            <Link to="/mis-pedidos" className="nav-link">
                                📦 Mis pedidos
                            </Link>
                            <span className="nav-user-name">👤 {usuario.nombre}</span>
                            {usuario.rol === 'ADMIN' && (
                                <Link to="/admin" className="nav-link">
                                    📊 Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-sm btn-outline">
                                Cerrar sesión
                            </button>
                        </div>
                    ) : (
                        <div className="nav-auth">
                            <Link to="/login" className="nav-link">
                                Iniciar sesión
                            </Link>
                            <Link to="/register" className="btn btn-sm btn-primary">
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
