// ============================================
// OrdenaTEC — Admin Catalogo Page
// CRUD de componentes con formulario de atributos
// generado dinámicamente a partir del tipo seleccionado
// (sin JSON crudo).
// ============================================

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Componente, TipoComponente } from '../../types';
import { componenteService } from '../../services/componente.service';
import { formatearPrecio, traducirTipoComponente } from '../../utils/formatters';
import { ATRIBUTOS_POR_TIPO, CampoAtributo } from '../../utils/atributosSchema';
import Loading from '../../components/common/Loading';
import { useToast } from '../../components/common/Toast';

interface FormState {
    sku: string;
    nombre: string;
    tipo: TipoComponente;
    precio: number;
    stock: number;
    imagenUrl: string;
    atributos: Record<string, string | number | boolean>;
}

const formInicial = (tipo: TipoComponente = TipoComponente.CPU): FormState => ({
    sku: '',
    nombre: '',
    tipo,
    precio: 0,
    stock: 0,
    imagenUrl: '',
    atributos: {},
});

const prepararAtributosPayload = (
    atributos: Record<string, string | number | boolean>,
    campos: CampoAtributo[]
): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const campo of campos) {
        const valor = atributos[campo.key];
        if (valor === undefined || valor === '' || valor === null) continue;
        if (campo.tipo === 'number') {
            const n = typeof valor === 'number' ? valor : Number(valor);
            if (!Number.isNaN(n)) out[campo.key] = n;
        } else if (campo.tipo === 'boolean') {
            out[campo.key] = Boolean(valor);
        } else {
            out[campo.key] = String(valor);
        }
    }
    return out;
};

const parseAtributosExistentes = (
    atributos: Record<string, unknown>,
    campos: CampoAtributo[]
): Record<string, string | number | boolean> => {
    const out: Record<string, string | number | boolean> = {};
    for (const campo of campos) {
        const v = atributos[campo.key];
        if (v === undefined || v === null) continue;
        if (campo.tipo === 'boolean') out[campo.key] = Boolean(v);
        else if (campo.tipo === 'number') out[campo.key] = Number(v);
        else out[campo.key] = String(v);
    }
    return out;
};

const CatalogoPage: React.FC = () => {
    const toast = useToast();

    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState<Componente | null>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Componente | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);

    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [guardando, setGuardando] = useState(false);
    const [formData, setFormData] = useState<FormState>(formInicial());

    const cargarComponentes = useCallback(async () => {
        try {
            setLoading(true);
            const res = await componenteService.listar({
                tipo: filtroTipo ? (filtroTipo as TipoComponente) : undefined,
                porPagina: 100,
            });
            setComponentes(res.datos);
        } catch (err) {
            console.error('Error cargando componentes:', err);
            toast.mostrar('Error al cargar el catálogo', 'error');
        } finally {
            setLoading(false);
        }
    }, [filtroTipo, toast]);

    useEffect(() => {
        cargarComponentes();
    }, [cargarComponentes]);

    const camposAtributos = useMemo(
        () => ATRIBUTOS_POR_TIPO[formData.tipo] || [],
        [formData.tipo]
    );

    const handleEditar = (comp: Componente) => {
        const tipo = comp.tipo as TipoComponente;
        const campos = ATRIBUTOS_POR_TIPO[tipo] || [];
        setEditando(comp);
        setFormData({
            sku: comp.sku,
            nombre: comp.nombre,
            tipo,
            precio: comp.precio,
            stock: comp.stock,
            imagenUrl: comp.imagenUrl || '',
            atributos: parseAtributosExistentes(
                comp.atributos as Record<string, unknown>,
                campos
            ),
        });
        setFormErrors([]);
        setShowModal(true);
    };

    const handleNuevo = () => {
        setEditando(null);
        setFormData(formInicial(TipoComponente.CPU));
        setFormErrors([]);
        setShowModal(true);
    };

    const handleChangeTipo = (nuevoTipo: TipoComponente) => {
        // Al cambiar el tipo, reiniciamos atributos porque ya no aplican.
        setFormData((prev) => ({ ...prev, tipo: nuevoTipo, atributos: {} }));
    };

    const handleAtributoChange = (campo: CampoAtributo, valor: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            atributos: { ...prev.atributos, [campo.key]: valor as any },
        }));
    };

    const handleGuardar = async () => {
        const errores: string[] = [];
        if (!formData.sku.trim()) errores.push('El SKU es obligatorio');
        if (!formData.nombre.trim()) errores.push('El nombre es obligatorio');
        if (Number(formData.precio) <= 0) errores.push('El precio debe ser mayor a 0');
        if (Number(formData.stock) < 0) errores.push('El stock no puede ser negativo');

        for (const campo of camposAtributos) {
            if (!campo.requerido) continue;
            const v = formData.atributos[campo.key];
            if (v === undefined || v === '' || v === null) {
                errores.push(`${campo.label} es obligatorio`);
            }
            if (campo.tipo === 'number' && typeof v === 'number' && Number.isNaN(v)) {
                errores.push(`${campo.label} debe ser un número válido`);
            }
        }

        if (errores.length > 0) {
            setFormErrors(errores);
            return;
        }

        setFormErrors([]);
        setGuardando(true);

        try {
            const payload = {
                sku: formData.sku.trim(),
                nombre: formData.nombre.trim(),
                tipo: formData.tipo,
                precio: Number(formData.precio),
                stock: Number(formData.stock),
                atributos: prepararAtributosPayload(formData.atributos, camposAtributos),
                imagenUrl: formData.imagenUrl.trim() || null,
            };

            if (editando) {
                await componenteService.actualizar(editando.id, payload as any);
                toast.mostrar(`Componente "${formData.nombre}" actualizado`, 'success');
            } else {
                await componenteService.crear(payload as any);
                toast.mostrar(`Componente "${formData.nombre}" creado`, 'success');
            }

            setShowModal(false);
            cargarComponentes();
        } catch (err: any) {
            const respuesta = err.response?.data;
            if (respuesta?.errores && Array.isArray(respuesta.errores)) {
                setFormErrors(
                    respuesta.errores.map((e: any) => {
                        const campo = e.path?.join('.') || 'campo';
                        return `${campo}: ${e.message}`;
                    })
                );
            } else {
                setFormErrors([respuesta?.mensaje || 'Error al guardar el componente']);
            }
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = (comp: Componente) => {
        setDeleteTarget(comp);
        setDeleteConfirmText('');
        setShowDeleteModal(true);
    };

    const confirmarEliminacion = async () => {
        if (!deleteTarget || deleteConfirmText !== 'ELIMINAR') return;
        setDeleting(true);
        try {
            const nombreEliminado = deleteTarget.nombre;
            await componenteService.eliminar(deleteTarget.id);
            setShowDeleteModal(false);
            setDeleteTarget(null);
            setDeleteConfirmText('');
            toast.mostrar(`"${nombreEliminado}" eliminado`, 'success');
            cargarComponentes();
        } catch (err: any) {
            const mensaje = err.response?.data?.mensaje || 'Error al eliminar';
            toast.mostrar(mensaje, 'error');
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
            <div className="admin-header">
                <h1 className="page-title">📋 Catálogo de Componentes</h1>
                <button className="btn btn-primary" onClick={handleNuevo}>
                    + Nuevo componente
                </button>
            </div>

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
                                <td><span className="badge">{traducirTipoComponente(comp.tipo)}</span></td>
                                <td>{formatearPrecio(comp.precio)}</td>
                                <td>{comp.stock}</td>
                                <td>
                                    <span className={`status ${comp.activo ? 'status--active' : 'status--inactive'}`}>
                                        {comp.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn btn-sm btn-outline" onClick={() => handleEditar(comp)}>
                                            ✏️ Editar
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(comp)}>
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
                    <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
                        <h2>{editando ? 'Editar componente' : 'Nuevo componente'}</h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label>SKU <span className="req">*</span></label>
                                <input
                                    className="input-field"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tipo de componente <span className="req">*</span></label>
                                <select
                                    className="input-field"
                                    value={formData.tipo}
                                    onChange={(e) => handleChangeTipo(e.target.value as TipoComponente)}
                                    disabled={!!editando}
                                >
                                    {Object.values(TipoComponente).map((tipo) => (
                                        <option key={tipo} value={tipo}>
                                            {traducirTipoComponente(tipo)}
                                        </option>
                                    ))}
                                </select>
                                {editando && (
                                    <small className="form-help">
                                        No se puede cambiar el tipo de un componente existente.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nombre <span className="req">*</span></label>
                            <input
                                className="input-field"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Precio (MXN) <span className="req">*</span></label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                                    min={0}
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock <span className="req">*</span></label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    min={0}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>URL de imagen</label>
                            <input
                                className="input-field"
                                value={formData.imagenUrl}
                                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <h3 className="form-section-title">
                            🔧 Atributos específicos de {traducirTipoComponente(formData.tipo)}
                        </h3>

                        <div className="admin-atributos-grid">
                            {camposAtributos.map((campo) => (
                                <AtributoInput
                                    key={campo.key}
                                    campo={campo}
                                    valor={formData.atributos[campo.key]}
                                    onChange={(v) => handleAtributoChange(campo, v)}
                                />
                            ))}
                        </div>

                        {formErrors.length > 0 && (
                            <div className="form-error" style={{ marginTop: 16 }}>
                                <strong>⚠️ Corrige los siguientes errores:</strong>
                                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
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
                                {guardando ? '⏳ Guardando...' : editando ? 'Guardar cambios' : 'Crear componente'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && deleteTarget && (
                <div className="modal-overlay" onClick={cerrarDeleteModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ color: '#ef4444' }}>⚠️ Eliminar componente</h2>

                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 20,
                        }}>
                            <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Estás a punto de eliminar:</p>
                            <p style={{ margin: 0, fontSize: '1.1em' }}>
                                <strong>{deleteTarget.nombre}</strong>
                                <br />
                                <code style={{ opacity: 0.7 }}>{deleteTarget.sku}</code>
                            </p>
                        </div>

                        <p style={{ margin: '0 0 12px 0', opacity: 0.8 }}>
                            Para confirmar, escribe{' '}
                            <strong style={{ color: '#ef4444' }}>ELIMINAR</strong> en el campo:
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
                                    letterSpacing: 2,
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
                            >
                                {deleting ? '⏳ Eliminando...' : '🗑️ Confirmar eliminación'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Input individual de atributo, renderizado según el tipo de campo.
 * Aisla la lógica para que el render del formulario sea legible.
 */
const AtributoInput: React.FC<{
    campo: CampoAtributo;
    valor: string | number | boolean | undefined;
    onChange: (valor: string | boolean) => void;
}> = ({ campo, valor, onChange }) => {
    if (campo.tipo === 'boolean') {
        return (
            <div className="form-group form-group--check">
                <label>
                    <input
                        type="checkbox"
                        checked={Boolean(valor)}
                        onChange={(e) => onChange(e.target.checked)}
                    />{' '}
                    {campo.label}
                </label>
            </div>
        );
    }

    return (
        <div className="form-group">
            <label>
                {campo.label}
                {campo.requerido && <span className="req"> *</span>}
                {campo.sufijo && <span className="form-sufijo"> ({campo.sufijo})</span>}
            </label>
            {campo.tipo === 'select' ? (
                <select
                    className="input-field"
                    value={(valor as string) ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">— Selecciona —</option>
                    {campo.opciones?.map((op) => (
                        <option key={op} value={op}>
                            {op}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={campo.tipo === 'number' ? 'number' : 'text'}
                    className="input-field"
                    value={(valor as string | number) ?? ''}
                    placeholder={campo.placeholder}
                    min={campo.min}
                    max={campo.max}
                    onChange={(e) =>
                        onChange(
                            campo.tipo === 'number'
                                ? e.target.value
                                : e.target.value
                        )
                    }
                />
            )}
            {campo.ayuda && <small className="form-help">{campo.ayuda}</small>}
        </div>
    );
};

export default CatalogoPage;
