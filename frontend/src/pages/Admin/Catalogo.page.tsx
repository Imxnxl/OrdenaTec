// ============================================
// OrdenaTEC — Admin Catalogo Page
// CRUD table for managing components.
// ============================================

import React, { useState, useEffect } from 'react';
import { Componente, TipoComponente } from '../../types';
import { componenteService } from '../../services/componente.service';
import { formatearPrecio, traducirTipoComponente } from '../../utils/formatters';
import Loading from '../../components/common/Loading';

const CatalogoPage: React.FC = () => {
    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState<Componente | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        sku: '',
        nombre: '',
        tipo: 'CPU' as string,
        precio: 0,
        stock: 0,
        atributos: '{}',
        imagenUrl: '',
    });

    const cargarComponentes = async () => {
        try {
            setLoading(true);
            const res = await componenteService.listar({
                tipo: filtroTipo ? (filtroTipo as TipoComponente) : undefined,
                porPagina: 100,
            });
            setComponentes(res.datos);
        } catch (err) {
            console.error('Error cargando componentes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarComponentes();
    }, [filtroTipo]);

    const handleEditar = (comp: Componente) => {
        setEditando(comp);
        setFormData({
            sku: comp.sku,
            nombre: comp.nombre,
            tipo: comp.tipo,
            precio: comp.precio,
            stock: comp.stock,
            atributos: JSON.stringify(comp.atributos, null, 2),
            imagenUrl: comp.imagenUrl || '',
        });
        setShowModal(true);
    };

    const handleNuevo = () => {
        setEditando(null);
        setFormData({
            sku: '',
            nombre: '',
            tipo: 'CPU',
            precio: 0,
            stock: 0,
            atributos: '{}',
            imagenUrl: '',
        });
        setShowModal(true);
    };

    const handleGuardar = async () => {
        try {
            const data = {
                sku: formData.sku,
                nombre: formData.nombre,
                tipo: formData.tipo,
                precio: Number(formData.precio),
                stock: Number(formData.stock),
                atributos: JSON.parse(formData.atributos),
                imagenUrl: formData.imagenUrl || null,
            };

            if (editando) {
                await componenteService.actualizar(editando.id, data);
            } else {
                await componenteService.crear(data);
            }

            setShowModal(false);
            cargarComponentes();
        } catch (err) {
            console.error('Error guardando componente:', err);
            alert('Error al guardar el componente. Verifica los datos.');
        }
    };

    const handleEliminar = async (id: string) => {
        if (confirm('¿Estás seguro de desactivar este componente?')) {
            try {
                await componenteService.eliminar(id);
                cargarComponentes();
            } catch (err) {
                console.error('Error eliminando componente:', err);
            }
        }
    };

    if (loading) return <Loading mensaje="Cargando catálogo..." />;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="page-title">📋 Catálogo de Componentes</h1>
                <button className="btn btn-primary" onClick={handleNuevo}>
                    + Nuevo componente
                </button>
            </div>

            {/* Filtro por tipo */}
            <div className="admin-filters">
                <select
                    className="input-field"
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                >
                    <option value="">Todos los tipos</option>
                    {Object.values(TipoComponente).map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {traducirTipoComponente(tipo)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla de componentes */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {componentes.map((comp) => (
                            <tr key={comp.id}>
                                <td><code>{comp.sku}</code></td>
                                <td>{comp.nombre}</td>
                                <td>
                                    <span className="badge">{traducirTipoComponente(comp.tipo)}</span>
                                </td>
                                <td>{formatearPrecio(comp.precio)}</td>
                                <td>{comp.stock}</td>
                                <td>
                                    <span className={`status ${comp.activo ? 'status--active' : 'status--inactive'}`}>
                                        {comp.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleEditar(comp)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleEliminar(comp.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de crear/editar */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{editando ? 'Editar componente' : 'Nuevo componente'}</h2>

                        <div className="form-group">
                            <label>SKU</label>
                            <input
                                className="input-field"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                className="input-field"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo</label>
                            <select
                                className="input-field"
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            >
                                {Object.values(TipoComponente).map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {traducirTipoComponente(tipo)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Precio (MXN)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={formData.precio}
                                    onChange={(e) =>
                                        setFormData({ ...formData, precio: Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={formData.stock}
                                    onChange={(e) =>
                                        setFormData({ ...formData, stock: Number(e.target.value) })
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Atributos (JSON)</label>
                            <textarea
                                className="input-field"
                                rows={5}
                                value={formData.atributos}
                                onChange={(e) =>
                                    setFormData({ ...formData, atributos: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>URL de imagen</label>
                            <input
                                className="input-field"
                                value={formData.imagenUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, imagenUrl: e.target.value })
                                }
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" onClick={handleGuardar}>
                                {editando ? 'Guardar cambios' : 'Crear componente'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CatalogoPage;
