// ============================================
// OrdenaTEC — ResumenPanel
// Summary panel showing selected components,
// total price, consumption, and compatibility.
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import {
    removerComponente,
    guardarConfiguracion,
    resetearConfiguracion,
} from '../../store/slices/configuracion.slice';
import { agregarAlCarrito } from '../../store/slices/carrito.slice';
import { useCompatibilidad } from '../../hooks/useCompatibilidad';
import { formatearPrecio, formatearConsumo, traducirTipoComponente } from '../../utils/formatters';
import { PASOS_CONFIGURADOR, TipoComponente, Configuracion } from '../../types';

const ResumenPanel: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { componentesSeleccionados, precioTotal, consumoEstimado, guardando } =
        useAppSelector((state) => state.configuracion);
    const { usuario } = useAppSelector((state) => state.auth);
    const { errores, advertencias, validando, tieneErrores } = useCompatibilidad();

    const componentesCount = Object.keys(componentesSeleccionados).length;

    const handleGuardar = async () => {
        if (!usuario) {
            navigate('/login');
            return;
        }
        await dispatch(guardarConfiguracion('Mi configuración'));
    };

    const handleAgregarAlCarrito = async () => {
        // Crear una configuración temporal para agregar al carrito
        const configuracionTemp: Configuracion = {
            id: `temp-${Date.now()}`,
            precioTotal,
            consumoEstimado,
            componentes: Object.values(componentesSeleccionados)
                .filter(Boolean)
                .map((c) => ({
                    configuracionId: '',
                    componenteId: c!.id,
                    componente: c!,
                })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        dispatch(agregarAlCarrito(configuracionTemp));
        dispatch(resetearConfiguracion());
        navigate('/carrito');
    };

    return (
        <div className="resumen-panel">
            <h3 className="resumen-titulo">📋 Resumen de tu PC</h3>

            {/* Lista de componentes seleccionados */}
            <div className="resumen-componentes">
                {PASOS_CONFIGURADOR.map((paso) => {
                    const componente = componentesSeleccionados[paso.tipo];
                    return (
                        <div key={paso.tipo} className="resumen-item">
                            <div className="resumen-item__header">
                                <span className="resumen-item__icono">{paso.icono}</span>
                                <span className="resumen-item__tipo">{paso.nombre}</span>
                            </div>
                            {componente ? (
                                <div className="resumen-item__detalle">
                                    <span className="resumen-item__nombre">{componente.nombre}</span>
                                    <span className="resumen-item__precio">
                                        {formatearPrecio(componente.precio)}
                                    </span>
                                    <button
                                        className="btn-remove"
                                        onClick={() => dispatch(removerComponente(paso.tipo))}
                                        title="Quitar componente"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <span className="resumen-item__vacio">No seleccionado</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Totales */}
            <div className="resumen-totales">
                <div className="resumen-total">
                    <span>💰 Total:</span>
                    <strong>{formatearPrecio(precioTotal)}</strong>
                </div>
                {consumoEstimado > 0 && (
                    <div className="resumen-consumo">
                        <span>⚡ Consumo estimado:</span>
                        <strong>{formatearConsumo(consumoEstimado)}</strong>
                    </div>
                )}
            </div>

            {/* Alertas de compatibilidad */}
            {validando && (
                <div className="resumen-alert resumen-alert--info">
                    🔄 Validando compatibilidad...
                </div>
            )}

            {errores.length > 0 && (
                <div className="resumen-alert resumen-alert--error">
                    <strong>❌ Errores de compatibilidad:</strong>
                    <ul>
                        {errores.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {advertencias.length > 0 && (
                <div className="resumen-alert resumen-alert--warning">
                    <strong>⚠️ Advertencias:</strong>
                    <ul>
                        {advertencias.map((adv, i) => (
                            <li key={i}>{adv}</li>
                        ))}
                    </ul>
                </div>
            )}

            {componentesCount > 0 && !tieneErrores && !validando && (
                <div className="resumen-alert resumen-alert--success">
                    ✅ Configuración compatible
                </div>
            )}

            {/* Acciones */}
            <div className="resumen-acciones">
                <button
                    className="btn btn-primary btn-block"
                    onClick={handleGuardar}
                    disabled={componentesCount === 0 || guardando}
                >
                    {guardando ? 'Guardando...' : '💾 Guardar configuración'}
                </button>

                <button
                    className="btn btn-success btn-block"
                    onClick={handleAgregarAlCarrito}
                    disabled={componentesCount === 0 || tieneErrores}
                >
                    🛒 Agregar al carrito
                </button>

                <button
                    className="btn btn-outline btn-block"
                    onClick={() => dispatch(resetearConfiguracion())}
                    disabled={componentesCount === 0}
                >
                    🗑️ Limpiar todo
                </button>
            </div>
        </div>
    );
};

export default ResumenPanel;
