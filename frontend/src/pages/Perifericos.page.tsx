// ============================================
// OrdenaTEC — Periféricos Page
// Listado de periféricos (monitor, teclado, mouse, audífonos)
// con filtro por tipo. Se agregan individualmente al carrito.
// ============================================

import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../store';
import { agregarAlCarrito } from '../store/slices/carrito.slice';
import { Componente, Configuracion, TipoComponente, TIPOS_PERIFERICOS } from '../types';
import { componenteService } from '../services/componente.service';
import {
    formatearPrecio,
    traducirAtributo,
    formatearAtributo,
    traducirTipoComponente,
} from '../utils/formatters';
import Loading from '../components/common/Loading';
import { useToast } from '../components/common/Toast';

const ICONOS: Record<string, string> = {
    MONITOR: '🖥️',
    TECLADO: '⌨️',
    MOUSE: '🖱️',
    AUDIFONOS: '🎧',
    SILLA: '🪑',
    MOUSEPAD: '🟦',
    WEBCAM: '📹',
    MICROFONO: '🎤',
    BOCINAS: '🔊',
};

const PerifericosPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const toast = useToast();

    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tipoActivo, setTipoActivo] = useState<TipoComponente | 'TODOS'>('TODOS');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        let cancelado = false;
        const cargar = async () => {
            try {
                setLoading(true);
                const resultados = await Promise.all(
                    TIPOS_PERIFERICOS.map((t) =>
                        componenteService.listar({ tipo: t, enStock: true, porPagina: 50 })
                    )
                );
                if (!cancelado) {
                    setComponentes(resultados.flatMap((r) => r.datos));
                }
            } catch (err) {
                if (!cancelado) setError('Error al cargar periféricos');
            } finally {
                if (!cancelado) setLoading(false);
            }
        };
        cargar();
        return () => {
            cancelado = true;
        };
    }, []);

    const componentesFiltrados = useMemo(() => {
        return componentes
            .filter((c) => tipoActivo === 'TODOS' || c.tipo === tipoActivo)
            .filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    }, [componentes, tipoActivo, busqueda]);

    const handleAgregar = (comp: Componente) => {
        const config: Configuracion = {
            id: `temp-perif-${comp.id}-${Date.now()}`,
            nombre: comp.nombre,
            precioTotal: comp.precio,
            consumoEstimado: 0,
            componentes: [
                {
                    configuracionId: '',
                    componenteId: comp.id,
                    componente: comp,
                },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        dispatch(agregarAlCarrito(config));
        toast.mostrar(`${comp.nombre} agregado al carrito`, 'success');
    };

    if (loading) return <Loading mensaje="Cargando periféricos..." />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="perifericos-page">
            <div className="prearmadas-header">
                <h1 className="page-title">
                    🎮 Tienda de <span className="gradient-text">Periféricos</span>
                </h1>
                <p className="page-subtitle">
                    Complementa tu PC con monitores, teclados, mouses, audífonos, sillas, webcams,
                    micrófonos y más.
                </p>
            </div>

            <div className="prearmadas-categorias">
                <button
                    className={`categoria-tab ${tipoActivo === 'TODOS' ? 'categoria-tab--active' : ''}`}
                    onClick={() => setTipoActivo('TODOS')}
                >
                    Todos
                </button>
                {TIPOS_PERIFERICOS.map((t) => (
                    <button
                        key={t}
                        className={`categoria-tab ${tipoActivo === t ? 'categoria-tab--active' : ''}`}
                        onClick={() => setTipoActivo(t)}
                    >
                        {ICONOS[t]} {traducirTipoComponente(t)}
                    </button>
                ))}
            </div>

            <div className="paso-busqueda" style={{ maxWidth: 500, margin: '0 auto 1.5rem' }}>
                <input
                    type="text"
                    placeholder="Buscar periférico..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="input-busqueda"
                />
            </div>

            {componentesFiltrados.length === 0 ? (
                <div className="no-results">
                    <p>No se encontraron periféricos para tu búsqueda.</p>
                </div>
            ) : (
                <div className="componentes-grid">
                    {componentesFiltrados.map((comp) => {
                        const attrs = comp.atributos as Record<string, unknown>;
                        return (
                            <div key={comp.id} className="componente-card">
                                {comp.imagenUrl && (
                                    <div className="componente-card__imagen">
                                        <img
                                            src={comp.imagenUrl}
                                            alt={comp.nombre}
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="componente-card__header">
                                    <span style={{ fontSize: '1.5rem' }}>
                                        {ICONOS[comp.tipo] || '📦'}
                                    </span>
                                    <h3 className="componente-card__nombre">{comp.nombre}</h3>
                                    <span className="componente-card__sku">{comp.sku}</span>
                                </div>

                                <div className="componente-card__specs">
                                    {Object.entries(attrs).slice(0, 5).map(([key, value]) => (
                                        <div key={key} className="spec-item">
                                            <span className="spec-label">{traducirAtributo(key)}</span>
                                            <span className="spec-value">{formatearAtributo(value)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="componente-card__footer">
                                    <span className="componente-card__precio">
                                        {formatearPrecio(comp.precio)}
                                    </span>
                                    <span className={`componente-card__stock ${comp.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                                        {comp.stock > 0 ? `${comp.stock} disponibles` : 'Agotado'}
                                    </span>
                                </div>

                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={() => handleAgregar(comp)}
                                    disabled={comp.stock <= 0}
                                >
                                    🛒 Agregar al carrito
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PerifericosPage;
