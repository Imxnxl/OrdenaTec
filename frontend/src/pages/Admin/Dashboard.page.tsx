// ============================================
// OrdenaTEC — Admin Dashboard Page
// Admin panel overview with quick stats.
// ============================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface Stats {
    totalComponentes: number;
    totalPedidos: number;
}

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<Stats>({ totalComponentes: 0, totalPedidos: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [compRes, pedRes] = await Promise.all([
                    api.get('/componentes?porPagina=1'),
                    api.get('/pedidos'),
                ]);
                setStats({
                    totalComponentes: compRes.data.total || 0,
                    totalPedidos: Array.isArray(pedRes.data) ? pedRes.data.length : 0,
                });
            } catch {
                // Silently handle — stats are non-critical
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    return (
        <div className="admin-page">
            <h1 className="page-title">📊 Panel de Administración</h1>

            <div className="admin-stats">
                <div className="stat-card">
                    <span className="stat-icon">🔧</span>
                    <div className="stat-info">
                        <span className="stat-value">
                            {loading ? '...' : stats.totalComponentes}
                        </span>
                        <span className="stat-label">Componentes</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-info">
                        <span className="stat-value">
                            {loading ? '...' : stats.totalPedidos}
                        </span>
                        <span className="stat-label">Pedidos</span>
                    </div>
                </div>
            </div>

            <div className="admin-links">
                <Link to="/admin/catalogo" className="admin-link-card">
                    <span className="admin-link-icon">📋</span>
                    <div>
                        <h3>Catálogo de componentes</h3>
                        <p>Gestionar componentes, precios y stock</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default DashboardPage;
