// ============================================
// OrdenaTEC — Admin Catalogo Page
// CRUD table for managing components.
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
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

    // Estado para el modal de confirmacion de eliminacion
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Componente | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);

    // Estado para notificaciones toast
    const [toast, setToast] = useState<{ mensaje: string; tipo: 'success' | 'error' } | null>(null);

    // Estado para errores de validacion en el modal
    const [formError, setFormError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [guardando, setGuardando] = useState(false);

    // Auto-dismiss toast despues de 3.5 segundos
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3500);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const mostrarToast = useCallback((mensaje: string, tipo: 'success' | 'error') => {
        setToast({ mensaje, tipo });
    }, []);

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
        setFormError(null);
        setFormErrors([]);
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
        setFormError(null);
        setFormErrors([]);
        setShowModal(true);
    };

    const handleGuardar = async () => {
        setFormError(null);
        setFormErrors([]);

        // Validacion local antes de enviar
        const erroresLocales: string[] = [];
        if (!formData.sku.trim()) erroresLocales.push('El SKU es obligatorio');
        if (!formData.nombre.trim()) erroresLocales.push('El nombre es obligatorio');
        if (Number(formData.precio) <= 0) erroresLocales.push('El precio debe ser mayor a 0');
        if (Number(formData.stock) < 0) erroresLocales.push('El stock no puede ser negativo');

        try {
            JSON.parse(formData.atributos);
        } catch {
            erroresLocales.push('Los atributos deben ser un JSON valido');
        }

        if (erroresLocales.length > 0) {
            setFormErrors(erroresLocales);
            return;
        }

        setGuardando(true);

        try {
            const data = {
                sku: formData.sku,
                nombre: formData.nombre,
                tipo: formData.tipo as TipoComponente,
                precio: Number(formData.precio),
                stock: Number(formData.stock),
                atributos: JSON.parse(formData.atributos),
                imagenUrl: formData.imagenUrl || null,
            };

            if (editando) {
                await componenteService.actualizar(editando.id, data);
                mostrarToast(`Componente "${formData.nombre}" actualizado exitosamente`, 'success');
            } else {
                await componenteService.crear(data);
                mostrarToast(`Componente "${formData.nombre}" creado exitosamente`, 'success');
            }

            setShowModal(false);
            cargarComponentes();
        } catch (err: any) {
            console.error('Error guardando componente:', err);

            // Parsear errores del backend (Zod validation o mensajes genericos)
            const respuesta = err.response?.data;
            if (respuesta?.errores && Array.isArray(respuesta.errores)) {
                // Errores de validacion Zod del backend
                const mensajes = respuesta.errores.map((e: any) => {
                    const campo = e.path?.join('.') || 'campo';
                    return `${campo}: ${e.message}`;
                });
                setFormErrors(mensajes);
            } else if (respuesta?.mensaje) {
                setFormError(respuesta.mensaje);
            } else {
                setFormError('Error al guardar el componente. Verifica los datos e intenta de nuevo.');
            }
        } finally {
            setGuardando(false);
        }
    };

    // Abrir modal de confirmacion de eliminacion
    const handleEliminar = (comp: Componente) => {
        setDeleteTarget(comp);
        setDeleteConfirmText('');
        setShowDeleteModal(true);
    };

    // Confirmar eliminacion (solo si escribio "ELIMINAR")
    const confirmarEliminacion = async () => {
        if (!deleteTarget || deleteConfirmText !== 'ELIMINAR') return;
        setDeleting(true);
        try {
            const nombreEliminado = deleteTarget.nombre;
            await componenteService.eliminar(deleteTarget.id);
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleteConfirmText('');
            mostrarToast(`Componente "${nombreEliminado}" eliminado exitosamente`, 'success');
            cargarComponentes();
        } catch (err: any) {
            console.error('Error eliminando componente:', err);
            const mensaje = err.response?.data?.mensaje || 'Error al eliminar el componente';
            mostrarToast(mensaje, 'error');
        } finally {
            setDeleting(false);
        }
    };

    const cerrarDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteTarget(null);
        setDeleteConfirmText('');
    };

    if (loading) return <Loading mensaje="Cargando catálogo..." />;

    return (
        <div className="admin-page">
            {/* Toast de notificacion */}
            {toast && (
                <div
                    className={`toast toast--${toast.tipo}`}
                    onClick={() => setToast(null)}
                >
                    <span className="toast-icon">
                        {toast.tipo === 'success' ? '✅' : '❌'}
                    </span>
                    <span className="toast-mensaje">{toast.mensaje}</span>
                    <button className="toast-close" onClick={() => setToast(null)}>✕</button>
                </div>
            )}

            <div className="admin-header">
                <h1 className="page-title">📋 Catalogo de Componentes</h1>
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
                                            onClick={() => handleEliminar(comp)}
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

                        {/* Errores de validacion */}
                        {formError && (
                            <div className="form-error" style={{ marginBottom: '16px' }}>
                                ❌ {formError}
                            </div>
                        )}
                        {formErrors.length > 0 && (
                            <div className="form-error" style={{ marginBottom: '16px' }}>
                                <strong>⚠️ Corrige los siguientes errores:</strong>
                                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', textAlign: 'left' }}>
                                    {formErrors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleGuardar}
                                disabled={guardando}
                            >
                                {guardando
                                    ? '⏳ Guardando...'
                                    : editando
                                        ? 'Guardar cambios'
                                        : 'Crear componente'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmacion de eliminacion */}
            {showDeleteModal && deleteTarget && (
                <div className="modal-overlay" onClick={cerrarDeleteModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ color: '#ef4444' }}>⚠️ Eliminar componente</h2>

                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '20px',
                        }}>
                            <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
                                Estas a punto de eliminar:
                            </p>
                            <p style={{ margin: '0', fontSize: '1.1em' }}>
                                <strong>{deleteTarget.nombre}</strong>
                                <br />
                                <code style={{ opacity: 0.7 }}>{deleteTarget.sku}</code>
                            </p>
                        </div>

                        <p style={{ margin: '0 0 12px 0', opacity: 0.8 }}>
                            Esta accion desactivara el componente del catalogo.
                            Para confirmar, escribe <strong style={{ color: '#ef4444' }}>ELIMINAR</strong> en el campo de abajo:
                        </p>

                        <div className="form-group">
                            <input
                                className="input-field"
                                placeholder="Escribe ELIMINAR para confirmar"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                autoFocus
                                style={{
                                    borderColor: deleteConfirmText === 'ELIMINAR' ? '#22c55e' : undefined,
                                    textAlign: 'center',
                                    fontSize: '1.1em',
                                    letterSpacing: '2px',
                                    fontWeight: 600,
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && deleteConfirmText === 'ELIMINAR') {
                                        confirmarEliminacion();
                                    }
                                }}
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-outline" onClick={cerrarDeleteModal}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={confirmarEliminacion}
                                disabled={deleteConfirmText !== 'ELIMINAR' || deleting}
                                style={{
                                    opacity: deleteConfirmText !== 'ELIMINAR' ? 0.5 : 1,
                                    cursor: deleteConfirmText !== 'ELIMINAR' ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {deleting ? '⏳ Eliminando...' : '🗑️ Confirmar eliminacion'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CatalogoPage;
