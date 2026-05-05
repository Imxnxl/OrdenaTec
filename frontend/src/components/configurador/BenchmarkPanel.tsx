// ============================================
// OrdenaTEC — BenchmarkPanel Component
// Compact sidebar preview + full-screen modal
// for FPS estimates and creative performance.
// ============================================

import React, { useState } from 'react';
import { useBenchmarks } from '../../hooks/useBenchmarks';

type Resolution = '1080p' | '1440p' | '4K';
type Tab = 'gaming' | 'creative';

const getFPSColor = (fps: number): string => {
    if (fps >= 120) return '#00e676';
    if (fps >= 60) return '#66bb6a';
    if (fps >= 30) return '#ffca28';
    return '#ef5350';
};

const getFPSLabel = (fps: number): string => {
    if (fps >= 120) return 'Excelente';
    if (fps >= 60) return 'Fluido';
    if (fps >= 30) return 'Jugable';
    return 'Bajo';
};

const getScoreColor = (score: number): string => {
    if (score >= 80) return '#00e676';
    if (score >= 60) return '#66bb6a';
    if (score >= 40) return '#ffca28';
    return '#ef5350';
};

const BenchmarkPanel: React.FC = () => {
    const { benchmarks, loading, error, hasCpuGpu } = useBenchmarks();
    const [showModal, setShowModal] = useState(false);
    const [resolution, setResolution] = useState<Resolution>('1080p');
    const [tab, setTab] = useState<Tab>('gaming');

    if (!hasCpuGpu) return null;

    // --- Compact sidebar preview (top 3 games only) ---
    const renderPreview = () => {
        if (loading) {
            return (
                <div className="benchmark-loading">
                    <div className="benchmark-spinner"></div>
                    <span>Calculando rendimiento...</span>
                </div>
            );
        }

        if (error) {
            return <div className="benchmark-error">⚠️ {error}</div>;
        }

        if (!benchmarks) return null;

        const previewGames = benchmarks.juegos.slice(0, 3);

        return (
            <>
                {benchmarks.fuente === 'ia' && (
                    <div className="benchmark-fuente">🤖 Estimación por IA</div>
                )}
                <div className="benchmark-info">
                    <span className="benchmark-combo">
                        {benchmarks.gpu} + {benchmarks.cpu}
                    </span>
                </div>
                <div className="benchmark-preview-games">
                    {previewGames.map((juego) => {
                        const fps = juego.fps['1080p'];
                        if (!fps) return null;
                        const ultraFPS = fps.ultra;
                        return (
                            <div key={juego.nombre} className="benchmark-preview-row">
                                <span className="benchmark-preview-name">{juego.nombre}</span>
                                <span
                                    className="benchmark-preview-fps"
                                    style={{ color: getFPSColor(ultraFPS) }}
                                >
                                    {ultraFPS} FPS
                                </span>
                            </div>
                        );
                    })}
                </div>
                <button
                    className="btn btn-outline btn-sm benchmark-expand-btn"
                    onClick={() => setShowModal(true)}
                >
                    📊 Ver estadísticas completas
                </button>
            </>
        );
    };

    // --- Full-screen modal with all data ---
    const renderModal = () => {
        if (!benchmarks || !showModal) return null;

        return (
            <div className="modal-overlay benchmark-modal-overlay" onClick={() => setShowModal(false)}>
                <div className="benchmark-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="benchmark-modal__header">
                        <div>
                            <h2>📊 Rendimiento Estimado</h2>
                            <span className="benchmark-modal__combo">
                                {benchmarks.gpu} + {benchmarks.cpu}
                            </span>
                            {benchmarks.fuente === 'ia' && (
                                <span className="benchmark-fuente">🤖 Estimación por IA</span>
                            )}
                        </div>
                        <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                    </div>

                    {/* Tabs */}
                    <div className="benchmark-modal__tabs">
                        <button
                            className={`benchmark-modal__tab ${tab === 'gaming' ? 'benchmark-modal__tab--active' : ''}`}
                            onClick={() => setTab('gaming')}
                        >
                            🎮 Gaming
                        </button>
                        <button
                            className={`benchmark-modal__tab ${tab === 'creative' ? 'benchmark-modal__tab--active' : ''}`}
                            onClick={() => setTab('creative')}
                        >
                            🎬 Creativo
                        </button>
                    </div>

                    <div className="benchmark-modal__body">
                        {tab === 'gaming' && (
                            <>
                                {/* Resolution toggle */}
                                <div className="benchmark-modal__resolutions">
                                    {(['1080p', '1440p', '4K'] as Resolution[]).map((res) => (
                                        <button
                                            key={res}
                                            className={`benchmark-modal__res-btn ${resolution === res ? 'benchmark-modal__res-btn--active' : ''}`}
                                            onClick={() => setResolution(res)}
                                        >
                                            {res}
                                        </button>
                                    ))}
                                </div>

                                {/* Game FPS grid */}
                                <div className="benchmark-modal__games-grid">
                                    {benchmarks.juegos.map((juego) => {
                                        const fps = juego.fps[resolution];
                                        if (!fps) return null;
                                        const ultraFPS = fps.ultra;
                                        const barWidth = Math.min((ultraFPS / 200) * 100, 100);

                                        return (
                                            <div key={juego.nombre} className="benchmark-modal__game">
                                                <div className="benchmark-modal__game-header">
                                                    <span className="benchmark-modal__game-name">{juego.nombre}</span>
                                                    <span
                                                        className="benchmark-modal__game-label"
                                                        style={{ color: getFPSColor(ultraFPS) }}
                                                    >
                                                        {getFPSLabel(ultraFPS)}
                                                    </span>
                                                </div>
                                                <div className="benchmark-modal__game-fps-big" style={{ color: getFPSColor(ultraFPS) }}>
                                                    {ultraFPS} <small>FPS</small>
                                                </div>
                                                <div className="benchmark-game__bar-bg benchmark-modal__bar">
                                                    <div
                                                        className="benchmark-game__bar"
                                                        style={{
                                                            width: `${barWidth}%`,
                                                            backgroundColor: getFPSColor(ultraFPS),
                                                        }}
                                                    />
                                                </div>
                                                <div className="benchmark-modal__game-presets">
                                                    <div className="benchmark-modal__preset">
                                                        <span className="benchmark-modal__preset-label">Low</span>
                                                        <span style={{ color: getFPSColor(fps.low) }}>{fps.low}</span>
                                                    </div>
                                                    <div className="benchmark-modal__preset">
                                                        <span className="benchmark-modal__preset-label">Med</span>
                                                        <span style={{ color: getFPSColor(fps.medium) }}>{fps.medium}</span>
                                                    </div>
                                                    <div className="benchmark-modal__preset">
                                                        <span className="benchmark-modal__preset-label">High</span>
                                                        <span style={{ color: getFPSColor(fps.high) }}>{fps.high}</span>
                                                    </div>
                                                    <div className="benchmark-modal__preset">
                                                        <span className="benchmark-modal__preset-label">Ultra</span>
                                                        <span style={{ color: getFPSColor(fps.ultra) }}>{fps.ultra}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {tab === 'creative' && (
                            <div className="benchmark-modal__creative-grid">
                                {benchmarks.creative.map((app) => (
                                    <div key={app.programa} className="benchmark-modal__creative-card">
                                        <div className="benchmark-modal__creative-header">
                                            <span className="benchmark-modal__creative-name">{app.programa}</span>
                                            <span
                                                className="benchmark-modal__creative-score"
                                                style={{ color: getScoreColor(app.score) }}
                                            >
                                                {app.score}/100
                                            </span>
                                        </div>
                                        <div className="benchmark-app__bar-bg">
                                            <div
                                                className="benchmark-app__bar"
                                                style={{
                                                    width: `${app.score}%`,
                                                    backgroundColor: getScoreColor(app.score),
                                                }}
                                            />
                                        </div>
                                        <p className="benchmark-modal__creative-desc">{app.descripcion}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="benchmark-panel">
                <h3 className="benchmark-titulo">📊 Rendimiento Estimado</h3>
                {renderPreview()}
            </div>
            {renderModal()}
        </>
    );
};

export default BenchmarkPanel;
