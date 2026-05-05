// ============================================
// OrdenaTEC — IA Configurador Page
// Chat-style AI PC builder interface.
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { seleccionarComponente, resetearConfiguracion } from '../store/slices/configuracion.slice';
import { agregarAlCarrito } from '../store/slices/carrito.slice';
import { iaService, IAResponse } from '../services/ia.service';
import { Configuracion } from '../types';
import { formatearPrecio } from '../utils/formatters';

const SUGERENCIAS = [
    'PC gaming para jugar a 1440p con presupuesto de $25,000 MXN',
    'PC económica para Fortnite y Valorant a 1080p',
    'Workstation para edición de video 4K y renderizado 3D',
    'La PC más potente posible para gaming 4K',
    'PC balanceada para gaming y trabajo, máximo $20,000 MXN',
    'PC streaming con buena CPU y GPU para OBS',
];

const getTipoEmoji = (tipo: string): string => {
    const map: Record<string, string> = {
        CPU: '🔲', MOTHERBOARD: '🟩', RAM: '📊',
        GPU: '🎮', ALMACENAMIENTO: '💾', PSU: '⚡', GABINETE: '🖥️',
    };
    return map[tipo] || '📦';
};

const IAConfiguradorPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultado, setResultado] = useState<IAResponse | null>(null);

    const handleSubmit = async (textoPrompt: string) => {
        if (!textoPrompt.trim()) return;

        setLoading(true);
        setError(null);
        setResultado(null);

        try {
            const data = await iaService.configurar(textoPrompt.trim());
            setResultado(data);
        } catch (err: any) {
            setError(
                err.response?.data?.mensaje ||
                'Error al comunicarse con la IA. Intenta de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCargarEnConfigurador = () => {
        if (!resultado) return;
        dispatch(resetearConfiguracion());
        for (const comp of resultado.componentes) {
            dispatch(seleccionarComponente(comp));
        }
        navigate('/configurador');
    };

    const handleAgregarAlCarrito = () => {
        if (!resultado) return;
        const configuracionTemp: Configuracion = {
            id: `temp-ia-${Date.now()}`,
            nombre: 'Configuración IA',
            precioTotal: resultado.precioTotal,
            consumoEstimado: resultado.consumoEstimado,
            componentes: resultado.componentes.map((c) => ({
                configuracionId: '',
                componenteId: c.id,
                componente: c,
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        dispatch(agregarAlCarrito(configuracionTemp));
        navigate('/carrito');
    };

    return (
        <div className="ia-page">
            <div className="ia-header">
                <h1 className="page-title">
                    🤖 Configurador con <span className="gradient-text">Inteligencia Artificial</span>
                </h1>
                <p className="page-subtitle">
                    Describe qué tipo de PC quieres y nuestra IA seleccionará los mejores componentes para ti.
                </p>
            </div>

            {/* Input area */}
            <div className="ia-input-section">
                <div className="ia-input-wrapper">
                    <textarea
                        className="ia-textarea"
                        placeholder="Describe tu PC ideal... Ejemplo: 'Quiero una PC para jugar Cyberpunk 2077 a 1440p con presupuesto de $20,000'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(prompt);
                            }
                        }}
                    />
                    <button
                        className="btn btn-primary ia-send-btn"
                        onClick={() => handleSubmit(prompt)}
                        disabled={loading || !prompt.trim()}
                    >
                        {loading ? '⏳' : '🚀'} {loading ? 'Pensando...' : 'Generar'}
                    </button>
                </div>

                {/* Suggestion chips */}
                {!resultado && !loading && (
                    <div className="ia-sugerencias">
                        <span className="ia-sugerencias__label">💡 Prueba con:</span>
                        <div className="ia-chips">
                            {SUGERENCIAS.map((sug, i) => (
                                <button
                                    key={i}
                                    className="ia-chip"
                                    onClick={() => {
                                        setPrompt(sug);
                                        handleSubmit(sug);
                                    }}
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Loading state */}
            {loading && (
                <div className="ia-loading">
                    <div className="ia-loading__spinner"></div>
                    <h3>La IA está armando tu PC...</h3>
                    <p>Analizando componentes, verificando compatibilidad y optimizando tu configuración</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="ia-error">
                    <span>❌ {error}</span>
                    <button className="btn btn-outline btn-sm" onClick={() => setError(null)}>
                        Cerrar
                    </button>
                </div>
            )}

            {/* Result */}
            {resultado && !loading && (
                <div className="ia-resultado">
                    {/* AI explanation */}
                    <div className="ia-explicacion">
                        <h3>🧠 Razonamiento de la IA</h3>
                        <p>{resultado.explicacion}</p>
                    </div>

                    {/* Compatibility status */}
                    <div className={`ia-compatibilidad ${resultado.compatibilidad.compatible ? 'ia-compatibilidad--ok' : 'ia-compatibilidad--error'}`}>
                        {resultado.compatibilidad.compatible ? (
                            <span>✅ Configuración 100% compatible</span>
                        ) : (
                            <div>
                                <span>⚠️ Problemas de compatibilidad:</span>
                                <ul>
                                    {resultado.compatibilidad.errores.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {resultado.compatibilidad.advertencias.length > 0 && (
                            <div className="ia-advertencias">
                                {resultado.compatibilidad.advertencias.map((adv, i) => (
                                    <span key={i}>⚠️ {adv}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Component cards */}
                    <div className="ia-componentes">
                        {resultado.componentes.map((comp) => (
                            <div key={comp.id} className="ia-componente-card">
                                <div className="ia-componente-card__icon">
                                    {getTipoEmoji(comp.tipo)}
                                </div>
                                <div className="ia-componente-card__info">
                                    <span className="ia-componente-card__tipo">{comp.tipo}</span>
                                    <span className="ia-componente-card__nombre">{comp.nombre}</span>
                                </div>
                                <span className="ia-componente-card__precio">
                                    {formatearPrecio(comp.precio)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="ia-totales">
                        <div className="ia-total">
                            <span>💰 Total:</span>
                            <strong>{formatearPrecio(resultado.precioTotal)}</strong>
                        </div>
                        {resultado.consumoEstimado > 0 && (
                            <div className="ia-consumo">
                                <span>⚡ Consumo estimado:</span>
                                <strong>{resultado.consumoEstimado}W</strong>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="ia-acciones">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleAgregarAlCarrito}
                        >
                            🛒 Agregar al carrito
                        </button>
                        <button
                            className="btn btn-outline btn-lg"
                            onClick={handleCargarEnConfigurador}
                        >
                            🔧 Modificar en configurador
                        </button>
                        <button
                            className="btn btn-outline btn-lg"
                            onClick={() => {
                                setResultado(null);
                                setPrompt('');
                            }}
                        >
                            🔄 Intentar de nuevo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IAConfiguradorPage;
