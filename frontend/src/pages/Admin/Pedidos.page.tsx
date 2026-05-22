import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatearPrecio, formatearFecha, traducirEstadoPedido } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import { useToast } from '../../components/common/Toast';

interface Pedido {
    id: string;
    usuario: { id: string; nombre: string; email: string };
    estado: string;
    total: number;
    createdAt: string;
    configuracion: any;
    pagos: any[];
}

const ESTADOS = ['', 'PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

const PedidosPage: React.FC = () => {
    const toast = useToast();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [cambiando, setCambiando] = useState<string | null>(null);

    const cargar = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/pedidos', {
                params: { estado: filtroEstado || undefined, pagina, porPagina: 20 },
            });
            setPedidos(res.data.datos);
            setTotalPaginas(res.data.totalPaginas);
        } catch {
            toast.mostrar('Error al cargar pedidos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, [filtroEstado, pagina]);

    const cambiarEstado = async (id: string, estado: string) => {
        setCambiando(id);
        try {
            await api.put(`/admin/pedidos/${id}/estado`, { estado });
            toast.mostrar(`Pedido actualizado a ${traducirEstadoPedido(estado)}`, 'success');
            cargar();
        } catch {
            toast.mostrar('Error al actualizar estado', 'error');
        } finally {
            setCambiando(null);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="page-title">📦 Pedidos</h1>
                <select className="input-field" value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPagina(1); }} style={{ maxWidth: 200 }}>
                    <option value="">Todos los estados</option>
                    {ESTADOS.filter(Boolean).map((e) => (
                        <option key={e} value={e}>{traducirEstadoPedido(e)}</option>
                    ))}
                </select>
            </div>

            {loading ? <Loading mensaje="Cargando pedidos..." /> : (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((p) => (
                                    <tr key={p.id}>
                                        <td><code>{p.id.slice(0, 8)}...</code></td>
                                        <td>{p.usuario?.nombre || '—'}<br /><small>{p.usuario?.email}</small></td>
                                        <td>{formatearPrecio(p.total)}</td>
                                        <td><span className={`badge badge--${p.estado.toLowerCase()}`}>{traducirEstadoPedido(p.estado)}</span></td>
                                        <td>{formatearFecha(p.createdAt)}</td>
                                        <td>
                                            <select
                                                className="input-field"
                                                value={p.estado}
                                                onChange={(e) => cambiarEstado(p.id, e.target.value)}
                                                disabled={cambiando === p.id}
                                                style={{ minWidth: 130 }}
                                            >
                                                {ESTADOS.filter(Boolean).map((e) => (
                                                    <option key={e} value={e}>{traducirEstadoPedido(e)}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPaginas > 1 && (
                        <div className="pagination" style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                            <button className="btn btn-outline" disabled={pagina <= 1} onClick={() => setPagina(p => p - 1)}>← Anterior</button>
                            <span style={{ alignSelf: 'center' }}>Página {pagina} de {totalPaginas}</span>
                            <button className="btn btn-outline" disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PedidosPage;
