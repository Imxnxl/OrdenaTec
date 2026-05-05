// ============================================
// OrdenaTEC — Historial de Pedidos
// Lista los pedidos del usuario autenticado.
// ============================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
    formatearPrecio,
    formatearFecha,
    traducirEstadoPedido,
    formatearDireccion,
} from '../utils/formatters';
import { Pedido } from '../types';
import Loading from '../components/common/Loading';

const ESTADO_COLOR: Record<string, string> = {
    PENDIENTE: 'status--pending',
    PAGADO: 'status--paid',
    ENVIADO: 'status--shipped',
    ENTREGADO: 'status--delivered',
    CANCELADO: 'status--cancelled',
};

const MisPedidosPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandido, setExpandido] = useState<string | null>(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                setLoading(true);
                const res = await api.get<Pedido[]>('/pedidos');
                setPedidos(res.data);
            } catch (err: any) {
                setError(err.response?.data?.mensaje || 'Error al cargar tus pedidos');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    if (loading) return <Loading mensaje="Cargando tus pedidos..." />;
    if (error) return <div className="error-message">{error}</div>;

    if (pedidos.length === 0) {
        return (
            <div className="page-empty">
                <h2>📦 Aún no tienes pedidos</h2>
                <p>Cuando realices tu primera compra, la verás aquí.</p>
                <Link to="/configurador" className="btn btn-primary">
                    ⚙️ Armar una PC
                </Link>
            </div>
        );
    }

    return (
        <div className="mis-pedidos-page">
            <h1 className="page-title">📦 Mis Pedidos</h1>
            <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>
                Historial completo de tus compras en OrdenaTEC.
            </p>

            <div className="pedidos-lista">
                {pedidos.map((p) => {
                    const abierto = expandido === p.id;
                    const dir = formatearDireccion(p);
                    return (
                        <div key={p.id} className="pedido-card">
                            <div
                                className="pedido-card__header"
                                onClick={() => setExpandido(abierto ? null : p.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div>
                                    <span className="pedido-card__id">#{p.id.slice(0, 8)}</span>
                                    <span className="pedido-card__fecha">{formatearFecha(p.createdAt)}</span>
                                </div>
                                <div className="pedido-card__meta">
                                    <span className={`status ${ESTADO_COLOR[p.estado] || ''}`}>
                                        {traducirEstadoPedido(p.estado)}
                                    </span>
                                    <strong className="pedido-card__total">
                                        {formatearPrecio(p.total)}
                                    </strong>
                                    <span className="pedido-card__chevron">{abierto ? '▲' : '▼'}</span>
                                </div>
                            </div>

                            {abierto && (
                                <div className="pedido-card__body">
                                    <div className="pedido-card__seccion">
                                        <h4>🧰 Componentes</h4>
                                        {p.configuracion?.componentes?.length ? (
                                            <ul className="pedido-card__componentes">
                                                {p.configuracion.componentes.map((cc) => (
                                                    <li key={cc.componenteId}>
                                                        <span>{cc.componente.nombre}</span>
                                                        <span>{formatearPrecio(cc.componente.precio)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="pedido-card__vacio">Sin detalle de componentes.</p>
                                        )}
                                    </div>

                                    <div className="pedido-card__seccion">
                                        <h4>📦 Dirección de envío</h4>
                                        {dir ? (
                                            <>
                                                <p className="pedido-card__destinatario">
                                                    {[
                                                        p.nombreDestinatarioPila,
                                                        p.apellidoPaterno,
                                                        p.apellidoMaterno,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' ') || p.nombreDestinatario}
                                                    {p.telefonoContacto && ` · ${p.telefonoContacto}`}
                                                    {p.telefonoAlternativo && ` / ${p.telefonoAlternativo}`}
                                                </p>
                                                <pre className="pedido-card__direccion">{dir}</pre>
                                                {p.referenciasEnvio && (
                                                    <p className="pedido-card__referencias">
                                                        <em>Referencias: {p.referenciasEnvio}</em>
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p className="pedido-card__vacio">Sin dirección registrada.</p>
                                        )}
                                    </div>

                                    {p.pagos && p.pagos.length > 0 && (
                                        <div className="pedido-card__seccion">
                                            <h4>💳 Pagos</h4>
                                            <ul className="pedido-card__componentes">
                                                {p.pagos.map((pago) => (
                                                    <li key={pago.id}>
                                                        <span>
                                                            {pago.metodo} · {pago.estado}
                                                        </span>
                                                        <span>{formatearPrecio(pago.monto)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MisPedidosPage;
