import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { vaciarCarrito } from '../store/slices/carrito.slice';
import { formatearPrecio } from '../utils/formatters';
import { TipoVivienda } from '../types';
import api from '../services/api';
import { useToast } from '../components/common/Toast';

interface DireccionForm {
    // Nombre desglosado (el legacy `nombreDestinatario` se compone al enviar).
    nombreDestinatarioPila: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefonoContacto: string;
    telefonoAlternativo: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    entreCalles: string;
    colonia: string;
    alcaldiaMunicipio: string;
    ciudad: string;
    estadoEnvio: string;
    codigoPostal: string;
    pais: string;
    tipoVivienda: TipoVivienda | '';
    referenciasEnvio: string;
}

const DIRECCION_INICIAL: DireccionForm = {
    nombreDestinatarioPila: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefonoContacto: '',
    telefonoAlternativo: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    entreCalles: '',
    colonia: '',
    alcaldiaMunicipio: '',
    ciudad: '',
    estadoEnvio: '',
    codigoPostal: '',
    pais: 'México',
    tipoVivienda: '',
    referenciasEnvio: '',
};

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const toast = useToast();
    const { items, total } = useAppSelector((state) => state.carrito);
    const { usuario } = useAppSelector((state) => state.auth);

    // Pre-llenamos el nombre de pila con el primer token del usuario y
    // el resto como apellido paterno (heurística simple).
    const partesNombre = (usuario?.nombre || '').trim().split(/\s+/).filter(Boolean);
    const [direccion, setDireccion] = useState<DireccionForm>({
        ...DIRECCION_INICIAL,
        nombreDestinatarioPila: partesNombre[0] || '',
        apellidoPaterno: partesNombre.slice(1).join(' ') || '',
    });
    const [metodoPago, setMetodoPago] = useState('tarjeta');
    const [procesando, setProcesando] = useState(false);
    const [errores, setErrores] = useState<Record<string, string>>({});

    if (!usuario) {
        navigate('/login');
        return null;
    }

    if (items.length === 0) {
        navigate('/carrito');
        return null;
    }

    // Acepta string para campos de texto y TipoVivienda|'' para el select.
    const actualizar = <K extends keyof DireccionForm>(
        campo: K,
        valor: DireccionForm[K]
    ) => {
        setDireccion((prev) => ({ ...prev, [campo]: valor }));
        if (errores[campo]) {
            setErrores((prev) => {
                const { [campo]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const validar = (): boolean => {
        const nuevos: Record<string, string> = {};
        if (direccion.nombreDestinatarioPila.trim().length < 2)
            nuevos.nombreDestinatarioPila = 'El nombre es obligatorio';
        if (direccion.apellidoPaterno.trim().length < 2)
            nuevos.apellidoPaterno = 'El apellido paterno es obligatorio';
        if (!/^[0-9+\s()-]{7,20}$/.test(direccion.telefonoContacto.trim()))
            nuevos.telefonoContacto = 'Teléfono inválido (7–20 caracteres, solo números y + - ( ))';
        if (
            direccion.telefonoAlternativo.trim().length > 0 &&
            !/^[0-9+\s()-]{7,20}$/.test(direccion.telefonoAlternativo.trim())
        )
            nuevos.telefonoAlternativo = 'Teléfono alternativo inválido';
        if (direccion.calle.trim().length < 2) nuevos.calle = 'La calle es obligatoria';
        if (direccion.numeroExterior.trim().length < 1)
            nuevos.numeroExterior = 'Número exterior obligatorio';
        if (direccion.colonia.trim().length < 2) nuevos.colonia = 'La colonia es obligatoria';
        if (direccion.ciudad.trim().length < 2) nuevos.ciudad = 'La ciudad es obligatoria';
        if (direccion.estadoEnvio.trim().length < 2) nuevos.estadoEnvio = 'El estado es obligatorio';
        if (!/^[0-9A-Za-z\s-]{4,10}$/.test(direccion.codigoPostal.trim()))
            nuevos.codigoPostal = 'Código postal inválido';
        if (direccion.pais.trim().length < 2) nuevos.pais = 'El país es obligatorio';
        setErrores(nuevos);
        return Object.keys(nuevos).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validar()) {
            toast.mostrar('Revisa los campos marcados en rojo', 'warning');
            return;
        }

        setProcesando(true);
        try {
            const nombreCompleto = [
                direccion.nombreDestinatarioPila.trim(),
                direccion.apellidoPaterno.trim(),
                direccion.apellidoMaterno.trim(),
            ]
                .filter(Boolean)
                .join(' ');

            const payloadDireccion = {
                // Legacy: nombre concatenado para que el backend siga validando "nombreDestinatario".
                nombreDestinatario: nombreCompleto,
                nombreDestinatarioPila: direccion.nombreDestinatarioPila.trim(),
                apellidoPaterno: direccion.apellidoPaterno.trim(),
                apellidoMaterno: direccion.apellidoMaterno.trim() || null,
                telefonoContacto: direccion.telefonoContacto.trim(),
                telefonoAlternativo: direccion.telefonoAlternativo.trim() || null,
                calle: direccion.calle.trim(),
                numeroExterior: direccion.numeroExterior.trim(),
                numeroInterior: direccion.numeroInterior.trim() || null,
                entreCalles: direccion.entreCalles.trim() || null,
                colonia: direccion.colonia.trim(),
                alcaldiaMunicipio: direccion.alcaldiaMunicipio.trim() || null,
                ciudad: direccion.ciudad.trim(),
                estadoEnvio: direccion.estadoEnvio.trim(),
                codigoPostal: direccion.codigoPostal.trim(),
                pais: direccion.pais.trim(),
                tipoVivienda: direccion.tipoVivienda || null,
                referenciasEnvio: direccion.referenciasEnvio.trim() || null,
            };

            for (const item of items) {
                const isTemp = item.configuracion.id.startsWith('temp-');
                await api.post('/pedidos', {
                    configuracionId: isTemp ? undefined : item.configuracion.id,
                    componenteIds: isTemp
                        ? item.configuracion.componentes.map((c) => c.componenteId)
                        : undefined,
                    total: item.configuracion.precioTotal * item.cantidad,
                    metodoPago,
                    ...payloadDireccion,
                });
            }

            dispatch(vaciarCarrito());
            toast.mostrar('Pedido confirmado exitosamente', 'success');
            navigate('/pedido-confirmado');
        } catch (err: any) {
            const mensaje = err.response?.data?.mensaje || 'Error al procesar el pedido';
            toast.mostrar(mensaje, 'error');
        } finally {
            setProcesando(false);
        }
    };

    const inputClass = (campo: keyof DireccionForm) =>
        `input-field${errores[campo] ? ' input-field--error' : ''}`;

    return (
        <div className="checkout-page">
            <h1 className="page-title">💳 Checkout</h1>

            <div className="checkout-content">
                <form className="checkout-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-section">
                        <h3>👤 Datos del destinatario</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre(s) <span className="req">*</span></label>
                                <input
                                    className={inputClass('nombreDestinatarioPila')}
                                    value={direccion.nombreDestinatarioPila}
                                    onChange={(e) => actualizar('nombreDestinatarioPila', e.target.value)}
                                    maxLength={100}
                                />
                                {errores.nombreDestinatarioPila && (
                                    <small className="form-error-msg">{errores.nombreDestinatarioPila}</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Apellido paterno <span className="req">*</span></label>
                                <input
                                    className={inputClass('apellidoPaterno')}
                                    value={direccion.apellidoPaterno}
                                    onChange={(e) => actualizar('apellidoPaterno', e.target.value)}
                                    maxLength={100}
                                />
                                {errores.apellidoPaterno && (
                                    <small className="form-error-msg">{errores.apellidoPaterno}</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Apellido materno</label>
                                <input
                                    className={inputClass('apellidoMaterno')}
                                    value={direccion.apellidoMaterno}
                                    onChange={(e) => actualizar('apellidoMaterno', e.target.value)}
                                    placeholder="Opcional"
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Teléfono de contacto <span className="req">*</span></label>
                                <input
                                    className={inputClass('telefonoContacto')}
                                    value={direccion.telefonoContacto}
                                    onChange={(e) => actualizar('telefonoContacto', e.target.value)}
                                    placeholder="Ej: 55 1234 5678"
                                    maxLength={20}
                                />
                                {errores.telefonoContacto && (
                                    <small className="form-error-msg">{errores.telefonoContacto}</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Teléfono alternativo</label>
                                <input
                                    className={inputClass('telefonoAlternativo')}
                                    value={direccion.telefonoAlternativo}
                                    onChange={(e) => actualizar('telefonoAlternativo', e.target.value)}
                                    placeholder="Opcional, fallback de paquetería"
                                    maxLength={20}
                                />
                                {errores.telefonoAlternativo && (
                                    <small className="form-error-msg">{errores.telefonoAlternativo}</small>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>📦 Dirección de envío</h3>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 2 }}>
                                <label>Calle <span className="req">*</span></label>
                                <input
                                    className={inputClass('calle')}
                                    value={direccion.calle}
                                    onChange={(e) => actualizar('calle', e.target.value)}
                                    placeholder="Ej: Av. Reforma"
                                    maxLength={200}
                                />
                                {errores.calle && <small className="form-error-msg">{errores.calle}</small>}
                            </div>
                            <div className="form-group">
                                <label>Núm. exterior <span className="req">*</span></label>
                                <input
                                    className={inputClass('numeroExterior')}
                                    value={direccion.numeroExterior}
                                    onChange={(e) => actualizar('numeroExterior', e.target.value)}
                                    maxLength={20}
                                />
                                {errores.numeroExterior && (
                                    <small className="form-error-msg">{errores.numeroExterior}</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Núm. interior</label>
                                <input
                                    className={inputClass('numeroInterior')}
                                    value={direccion.numeroInterior}
                                    onChange={(e) => actualizar('numeroInterior', e.target.value)}
                                    placeholder="Opcional"
                                    maxLength={20}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Entre calles</label>
                            <input
                                className={inputClass('entreCalles')}
                                value={direccion.entreCalles}
                                onChange={(e) => actualizar('entreCalles', e.target.value)}
                                placeholder="Ej: entre Av. Insurgentes y Calle Madero (opcional)"
                                maxLength={200}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Colonia / Barrio <span className="req">*</span></label>
                                <input
                                    className={inputClass('colonia')}
                                    value={direccion.colonia}
                                    onChange={(e) => actualizar('colonia', e.target.value)}
                                    maxLength={150}
                                />
                                {errores.colonia && <small className="form-error-msg">{errores.colonia}</small>}
                            </div>
                            <div className="form-group">
                                <label>Alcaldía / Municipio</label>
                                <input
                                    className={inputClass('alcaldiaMunicipio')}
                                    value={direccion.alcaldiaMunicipio}
                                    onChange={(e) => actualizar('alcaldiaMunicipio', e.target.value)}
                                    placeholder="Ej: Cuauhtémoc, Zapopan…"
                                    maxLength={100}
                                />
                            </div>
                            <div className="form-group">
                                <label>Código postal <span className="req">*</span></label>
                                <input
                                    className={inputClass('codigoPostal')}
                                    value={direccion.codigoPostal}
                                    onChange={(e) => actualizar('codigoPostal', e.target.value)}
                                    maxLength={10}
                                />
                                {errores.codigoPostal && (
                                    <small className="form-error-msg">{errores.codigoPostal}</small>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Ciudad <span className="req">*</span></label>
                                <input
                                    className={inputClass('ciudad')}
                                    value={direccion.ciudad}
                                    onChange={(e) => actualizar('ciudad', e.target.value)}
                                    maxLength={100}
                                />
                                {errores.ciudad && <small className="form-error-msg">{errores.ciudad}</small>}
                            </div>
                            <div className="form-group">
                                <label>Estado <span className="req">*</span></label>
                                <input
                                    className={inputClass('estadoEnvio')}
                                    value={direccion.estadoEnvio}
                                    onChange={(e) => actualizar('estadoEnvio', e.target.value)}
                                    placeholder="Ej: CDMX, Jalisco…"
                                    maxLength={100}
                                />
                                {errores.estadoEnvio && (
                                    <small className="form-error-msg">{errores.estadoEnvio}</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label>País <span className="req">*</span></label>
                                <input
                                    className={inputClass('pais')}
                                    value={direccion.pais}
                                    onChange={(e) => actualizar('pais', e.target.value)}
                                    maxLength={80}
                                />
                                {errores.pais && <small className="form-error-msg">{errores.pais}</small>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tipo de vivienda</label>
                            <select
                                className={inputClass('tipoVivienda')}
                                value={direccion.tipoVivienda}
                                onChange={(e) =>
                                    actualizar('tipoVivienda', e.target.value as TipoVivienda | '')
                                }
                            >
                                <option value="">— Selecciona (opcional) —</option>
                                <option value={TipoVivienda.CASA}>Casa</option>
                                <option value={TipoVivienda.DEPARTAMENTO}>Departamento</option>
                                <option value={TipoVivienda.OFICINA}>Oficina</option>
                                <option value={TipoVivienda.OTRO}>Otro</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Referencias de entrega (opcional)</label>
                            <textarea
                                className="input-field"
                                rows={2}
                                value={direccion.referenciasEnvio}
                                onChange={(e) => actualizar('referenciasEnvio', e.target.value)}
                                placeholder="Ej: casa azul, entre calle X y calle Y..."
                                maxLength={300}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>💳 Método de pago</h3>
                        <div className="payment-options">
                            <label className={`payment-option ${metodoPago === 'tarjeta' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="pago"
                                    value="tarjeta"
                                    checked={metodoPago === 'tarjeta'}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                />
                                💳 Tarjeta de crédito/débito
                            </label>
                            <label className={`payment-option ${metodoPago === 'transferencia' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="pago"
                                    value="transferencia"
                                    checked={metodoPago === 'transferencia'}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                />
                                🏦 Transferencia bancaria
                            </label>
                        </div>
                    </div>

                    <div className="checkout-summary">
                        <div className="checkout-total">
                            <span>Total a pagar:</span>
                            <strong>{formatearPrecio(total)}</strong>
                        </div>
                        <p className="checkout-note">
                            ⚠️ Este es un pago simulado para propósitos de desarrollo.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg"
                        disabled={procesando}
                    >
                        {procesando ? '⏳ Procesando...' : '✅ Confirmar pedido'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
