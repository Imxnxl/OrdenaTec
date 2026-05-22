import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatearPrecio } from '../../utils/formatters';
import Loading from '../../components/common/Loading';

interface Stats {
    totalComponentes: number;
    totalPedidos: number;
    totalUsuarios: number;
    totalPrearmadas: number;
    ingresosTotales: number;
    pedidosPorEstado: { estado: string; cantidad: number }[];
    componentesBajoStock: { id: string; nombre: string; sku: string; stock: number }[];
}

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await api.get('/admin/estadisticas');
                setStats(res.data);
            } catch {
                // Silently handle
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    if (loading) return <div className="admin-page"><Loading mensaje="Cargando estadísticas..." /></div>;

    return (
        <div className="admin-page">
            <h1 className="page-title">📊 Panel de Administración</h1>

            <div className="admin-stats">
                <div className="stat-card">
                    <span className="stat-icon">🔧</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats?.totalComponentes || 0}</span>
                        <span className="stat-label">Componentes activos</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats?.totalPedidos || 0}</span>
                        <span className="stat-label">Pedidos totales</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">👥</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats?.totalUsuarios || 0}</span>
                        <span className="stat-label">Usuarios registrados</span>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🖥️</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats?.totalPrearmadas || 0}</span>
                        <span className="stat-label">PCs Pre-Armadas</span>
                    </div>
                </div>
                <div className="stat-card stat-card--accent">
                    <span className="stat-icon">💰</span>
                    <div className="stat-info">
                        <span className="stat-value">{formatearPrecio(stats?.ingresosTotales || 0)}</span>
                        <span className="stat-label">Ingresos totales</span>
                    </div>
                </div>
            </div>

            {stats?.pedidosPorEstado && stats.pedidosPorEstado.length > 0 && (
                <div className="admin-card" style={{ marginTop: 24 }}>
                    <h3>📋 Pedidos por estado</h3>
                    <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                        {stats.pedidosPorEstado.map((p) => (
                            <div key={p.estado} style={{ flex: 1, minWidth: 100, display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)' }}>
                                <span>{p.estado}</span>
                                <strong>{p.cantidad}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                <div className="admin-links" style={{ margin: 0 }}>
                    <Link to="/admin/catalogo" className="admin-link-card">
                        <span className="admin-link-icon">📋</span>
                        <div>
                            <h3>Catálogo de componentes</h3>
                            <p>Gestionar componentes, precios y stock</p>
                        </div>
                    </Link>
                    <Link to="/admin/pedidos" className="admin-link-card">
                        <span className="admin-link-icon">📦</span>
                        <div>
                            <h3>Pedidos</h3>
                            <p>Ver y gestionar pedidos de clientes</p>
                        </div>
                    </Link>
                    <Link to="/admin/prearmadas" className="admin-link-card">
                        <span className="admin-link-icon">🖥️</span>
                        <div>
                            <h3>PCs Pre-Armadas</h3>
                            <p>Crear y gestionar computadoras pre-armadas</p>
                        </div>
                    </Link>
                <Link to="/admin/catalogo?cat=perifericos" className="admin-link-card">
                    <span className="admin-link-icon">🖥️</span>
                    <div>
                        <h3>Periféricos</h3>
                        <p>Gestionar monitores, teclados, mouses y más</p>
                    </div>
                </Link>
                <Link to="/admin/usuarios" className="admin-link-card">
                    <span className="admin-link-icon">👥</span>
                    <div>
                        <h3>Usuarios</h3>
                    </div>
                </Link>
                </div>

                {stats?.componentesBajoStock && stats.componentesBajoStock.length > 0 && (
                    <div className="admin-card">
                        <h3>⚠️ Stock bajo (&le;5 unidades)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                            {stats.componentesBajoStock.map((c) => (
                                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.1)' }}>
                                    <span><strong>{c.nombre}</strong><br /><small style={{ opacity: 0.6 }}>{c.sku}</small></span>
                                    <strong style={{ color: c.stock === 0 ? '#ef4444' : '#f59e0b' }}>{c.stock} uds.</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
