// ============================================
// OrdenaTEC — Prearmadas Page
// Displays pre-built PC configurations for
// direct purchase without the step-by-step wizard.
// ============================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { prearmadaService } from '../services/prearmada.service';
import { useAppDispatch } from '../store';
import { agregarAlCarrito } from '../store/slices/carrito.slice';
import { Configuracion } from '../types';
import { formatearPrecio } from '../utils/formatters';
import Loading from '../components/common/Loading';

const CATEGORIAS = ['Todas', 'Gaming', 'Workstation'];

const PrearmadasPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [prearmadas, setPrearmadas] = useState<Configuracion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');
    const [detalle, setDetalle] = useState<Configuracion | null>(null);
    const [showMeme, setShowMeme] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                setLoading(true);
                const data = await prearmadaService.listar(
                    categoriaActiva === 'Todas' ? undefined : categoriaActiva
                );
                setPrearmadas(data);
            } catch (err) {
                setError('Error al cargar computadoras pre-armadas');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [categoriaActiva]);

    // Detect the meme PC by its imagenUrl field
    const isMemePC = (pc: Configuracion) => !!(pc as any).imagenUrl;

    const handleAgregarAlCarrito = (config: Configuracion) => {
        // April Fools: if it's the meme PC, show the meme instead of buying
        if (isMemePC(config)) {
            setShowMeme(true);
            return;
        }
        dispatch(agregarAlCarrito(config));
        navigate('/carrito');
    };

    const getTipoEmoji = (tipo: string): string => {
        const map: Record<string, string> = {
            CPU: '🔲', MOTHERBOARD: '🟩', RAM: '📊',
            GPU: '🎮', ALMACENAMIENTO: '💾', PSU: '⚡', GABINETE: '🖥️',
        };
        return map[tipo] || '📦';
    };

    if (loading) return <Loading mensaje="Cargando computadoras pre-armadas..." />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="prearmadas-page">
            <div className="prearmadas-header">
                <h1 className="page-title">
                    🖥️ Computadoras <span className="gradient-text">Pre-Armadas</span>
                </h1>
                <p className="page-subtitle">
                    PCs listas para comprar, armadas por expertos con compatibilidad garantizada.
                </p>
            </div>

            {/* Category tabs */}
            <div className="prearmadas-categorias">
                {CATEGORIAS.map((cat) => (
                    <button
                        key={cat}
                        className={`categoria-tab ${categoriaActiva === cat ? 'categoria-tab--active' : ''}`}
                        onClick={() => setCategoriaActiva(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Cards grid */}
            {prearmadas.length === 0 ? (
                <div className="no-results">
                    <p>No hay computadoras pre-armadas disponibles en esta categoría.</p>
                </div>
            ) : (
                <div className="prearmadas-grid">
                    {prearmadas.map((pc) => {
                        const attrs = (tipo: string) => {
                            const comp = pc.componentes?.find(
                                (c) => c.componente.tipo === tipo
                            );
                            return comp?.componente;
                        };

                        const cpu = attrs('CPU');
                        const gpu = attrs('GPU');
                        const ram = attrs('RAM');

                        return (
                            <div
                                key={pc.id}
                                className={`prearmada-card ${(pc as any).destacada ? 'prearmada-card--featured' : ''}`}
                            >
                                {(pc as any).destacada && (
                                    <div className="prearmada-badge">⭐ Destacada</div>
                                )}

                                <div className="prearmada-card__header">
                                    <span className="prearmada-card__categoria">
                                        {(pc as any).categoria || 'General'}
                                    </span>
                                    <h3 className="prearmada-card__nombre">{pc.nombre}</h3>
                                </div>

                                <p className="prearmada-card__desc">
                                    {(pc as any).descripcion || ''}
                                </p>

                                {/* Key specs */}
                                <div className="prearmada-card__specs">
                                    {cpu && (
                                        <div className="prearmada-spec">
                                            <span className="prearmada-spec__icon">🔲</span>
                                            <span>{cpu.nombre}</span>
                                        </div>
                                    )}
                                    {gpu && (
                                        <div className="prearmada-spec">
                                            <span className="prearmada-spec__icon">🎮</span>
                                            <span>{gpu.nombre}</span>
                                        </div>
                                    )}
                                    {ram && (
                                        <div className="prearmada-spec">
                                            <span className="prearmada-spec__icon">📊</span>
                                            <span>{ram.nombre}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="prearmada-card__footer">
                                    <div className="prearmada-card__price">
                                        {formatearPrecio(pc.precioTotal)}
                                    </div>
                                    <div className="prearmada-card__actions">
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => setDetalle(pc)}
                                        >
                                            Ver detalles
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleAgregarAlCarrito(pc)}
                                        >
                                            🛒 Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail modal */}
            {detalle && (
                <div className="modal-overlay" onClick={() => setDetalle(null)}>
                    <div className="modal prearmada-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{detalle.nombre}</h3>
                            <button className="btn-close" onClick={() => setDetalle(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p className="prearmada-modal__desc">
                                {(detalle as any).descripcion}
                            </p>

                            <h4>📋 Componentes incluidos</h4>
                            <div className="prearmada-modal__componentes">
                                {detalle.componentes?.map((cc) => (
                                    <div key={cc.componenteId} className="prearmada-modal__comp">
                                        <span className="prearmada-modal__comp-icon">
                                            {getTipoEmoji(cc.componente.tipo)}
                                        </span>
                                        <div className="prearmada-modal__comp-info">
                                            <span className="prearmada-modal__comp-name">
                                                {cc.componente.nombre}
                                            </span>
                                            <span className="prearmada-modal__comp-price">
                                                {formatearPrecio(cc.componente.precio)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="prearmada-modal__total">
                                <span>💰 Total:</span>
                                <strong>{formatearPrecio(detalle.precioTotal)}</strong>
                            </div>

                            {detalle.consumoEstimado && detalle.consumoEstimado > 0 && (
                                <div className="prearmada-modal__consumo">
                                    <span>⚡ Consumo estimado:</span>
                                    <strong>{detalle.consumoEstimado}W</strong>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                    handleAgregarAlCarrito(detalle);
                                    if (!isMemePC(detalle)) {
                                        setDetalle(null);
                                    }
                                }}
                            >
                                🛒 Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Meme popup — April Fools! */}
            {showMeme && (
                <div className="modal-overlay meme-overlay" onClick={() => setShowMeme(false)}>
                    <div className="meme-popup" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-close meme-close" onClick={() => setShowMeme(false)}>×</button>
                        <img
                            src="/meme-skynet.png"
                            alt="April Fools!"
                            className="meme-image"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="meme-placeholder"><p>💀</p><h2>APRIL FOOLS!</h2><p>Pon tu meme en:</p><code>frontend/public/meme-skynet.png</code></div>';
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrearmadasPage;
