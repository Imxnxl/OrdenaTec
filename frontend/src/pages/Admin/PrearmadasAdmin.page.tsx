import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Configuracion, Componente } from '../../types';
import { formatearPrecio, traducirTipoComponente } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import { useToast } from '../../components/common/Toast';

const PrearmadasAdminPage: React.FC = () => {
    const toast = useToast();
    const [prearmadas, setPrearmadas] = useState<Configuracion[]>([]);
    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState<Configuracion | null>(null);

    const [formData, setFormData] = useState({
        nombre: '',
        categoria: 'Gaming',
        descripcion: '',
        imagenUrl: '',
        destacada: false,
        componenteIds: [] as string[],
    });

    const cargar = async () => {
        try {
            setLoading(true);
            const [preRes, compRes] = await Promise.all([
                api.get('/prearmadas'),
                api.get('/componentes', { params: { porPagina: 200 } }),
            ]);
            setPrearmadas(preRes.data);
            setComponentes(compRes.data.datos);
        } catch {
            toast.mostrar('Error al cargar datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const abrirNueva = () => {
        setEditando(null);
        setFormData({ nombre: '', categoria: 'Gaming', descripcion: '', imagenUrl: '', destacada: false, componenteIds: [] });
        setShowModal(true);
    };

    const abrirEditar = (pc: Configuracion) => {
        setEditando(pc);
        setFormData({
            nombre: pc.nombre || '',
            categoria: (pc as any).categoria || 'Gaming',
            descripcion: (pc as any).descripcion || '',
            imagenUrl: (pc as any).imagenUrl || '',
            destacada: (pc as any).destacada || false,
            componenteIds: pc.componentes?.map((c: any) => c.componente?.id || c.componenteId) || [],
        });
        setShowModal(true);
    };

    const toggleComponente = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            componenteIds: prev.componenteIds.includes(id)
                ? prev.componenteIds.filter((c) => c !== id)
                : [...prev.componenteIds, id],
        }));
    };

    const guardar = async () => {
        if (!formData.nombre || formData.componenteIds.length === 0) {
            toast.mostrar('Nombre y al menos un componente son requeridos', 'error');
            return;
        }
        try {
            if (editando) {
                await api.put(`/admin/prearmadas/${editando.id}`, formData);
                toast.mostrar('PC pre-armada actualizada', 'success');
            } else {
                await api.post('/admin/prearmadas', formData);
                toast.mostrar('PC pre-armada creada', 'success');
            }
            setShowModal(false);
            cargar();
        } catch {
            toast.mostrar('Error al guardar', 'error');
        }
    };

    const eliminar = async (pc: Configuracion) => {
        if (!window.confirm(`¿Eliminar "${pc.nombre}"?`)) return;
        try {
            await api.delete(`/admin/prearmadas/${pc.id}`);
            toast.mostrar('PC pre-armada eliminada', 'success');
            cargar();
        } catch {
            toast.mostrar('Error al eliminar', 'error');
        }
    };

    const agruparPorTipo = (ids: string[]) => {
        const map: Record<string, Componente[]> = {};
        for (const id of ids) {
            const c = componentes.find((x) => x.id === id);
            if (!c) continue;
            if (!map[c.tipo]) map[c.tipo] = [];
            map[c.tipo].push(c);
        }
        return map;
    };

    if (loading) return <Loading mensaje="Cargando PCs pre-armadas..." />;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="page-title">🖥️ PCs Pre-Armadas</h1>
                <button className="btn btn-primary" onClick={abrirNueva}>+ Nueva PC</button>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Componentes</th>
                            <th>Precio</th>
                            <th>Destacada</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prearmadas.map((pc) => (
                            <tr key={pc.id}>
                                <td><strong>{pc.nombre}</strong></td>
                                <td><span className="badge">{(pc as any).categoria || '—'}</span></td>
                                <td>{pc.componentes?.length || 0} componentes</td>
                                <td>{formatearPrecio(pc.precioTotal)}</td>
                                <td>{(pc as any).destacada ? '⭐ Sí' : '—'}</td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn btn-sm btn-outline" onClick={() => abrirEditar(pc)}>✏️</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => eliminar(pc)}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
                        <h2>{editando ? 'Editar PC Pre-Armada' : 'Nueva PC Pre-Armada'}</h2>

                        <div className="form-group">
                            <label>Nombre <span className="req">*</span></label>
                            <input className="input-field" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Categoría</label>
                                <select className="input-field" value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}>
                                    <option value="Gaming">Gaming</option>
                                    <option value="Workstation">Workstation</option>
                                    <option value="Budget">Budget</option>
                                    <option value="Streaming">Streaming</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Destacada</label>
                                <label className="form-group--check" style={{ marginTop: 8 }}>
                                    <input type="checkbox" checked={formData.destacada} onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })} />
                                    {' '}Mostrar como destacada
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea className="input-field" rows={3} value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
                        </div>

                        <div className="form-group">
                            <label>URL de imagen</label>
                            <input className="input-field" value={formData.imagenUrl} onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })} placeholder="https://..." />
                        </div>

                        <h3 className="form-section-title">🔧 Componentes <span className="req">*</span></h3>
                        <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 12 }}>
                            {Object.entries(agruparPorTipo(componentes.map((c) => c.id))).map(([tipo, comps]) => (
                                <div key={tipo} style={{ marginBottom: 12 }}>
                                    <strong style={{ display: 'block', marginBottom: 4, opacity: 0.7 }}>{traducirTipoComponente(tipo)}</strong>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {comps.map((c) => (
                                            <label key={c.id} style={{
                                                display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
                                                borderRadius: 6, cursor: 'pointer', fontSize: '0.85em',
                                                background: formData.componenteIds.includes(c.id) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                                                border: formData.componenteIds.includes(c.id) ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
                                            }}>
                                                <input type="checkbox" checked={formData.componenteIds.includes(c.id)} onChange={() => toggleComponente(c.id)} />
                                                {c.nombre} <small style={{ opacity: 0.6 }}>({formatearPrecio(c.precio)})</small>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={guardar}>{editando ? 'Guardar cambios' : 'Crear PC'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrearmadasAdminPage;
