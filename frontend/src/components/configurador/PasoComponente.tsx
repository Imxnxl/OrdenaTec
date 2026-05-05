// ============================================
// OrdenaTEC — PasoComponente (Generic Step)
// Generic step component for the PC builder.
// Filtra automáticamente los componentes incompatibles
// con los ya seleccionados para no mostrarlos al usuario.
// ============================================

import React, { useEffect, useMemo, useState } from 'react';
import { Componente, TipoComponente, PASOS_CONFIGURADOR } from '../../types';
import { componenteService } from '../../services/componente.service';
import { useAppDispatch, useAppSelector } from '../../store';
import {
    seleccionarComponente,
    removerComponente,
    setPaso,
} from '../../store/slices/configuracion.slice';
import {
    formatearPrecio,
    traducirAtributo,
    formatearAtributo,
    traducirTipoComponente,
} from '../../utils/formatters';
import Loading from '../common/Loading';

interface PasoComponenteProps {
    tipo: TipoComponente;
    titulo: string;
    descripcion: string;
}

const PasoComponente: React.FC<PasoComponenteProps> = ({ tipo, titulo, descripcion }) => {
    const dispatch = useAppDispatch();
    const componentesSeleccionados = useAppSelector(
        (state) => state.configuracion.componentesSeleccionados
    );
    const seleccionado = componentesSeleccionados[tipo];

    // IDs de los demás componentes seleccionados — se usan para filtrar incompatibles.
    const idsOtrosSeleccionados = useMemo(
        () =>
            Object.entries(componentesSeleccionados)
                .filter(([t, c]) => t !== tipo && c)
                .map(([, c]) => (c as Componente).id),
        [componentesSeleccionados, tipo]
    );

    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState('');

    // El endpoint devuelve sólo los compatibles; si no hay otros seleccionados,
    // se comporta como listar normal.
    const llaveOtros = idsOtrosSeleccionados.join(',');

    useEffect(() => {
        let cancelado = false;
        const cargar = async () => {
            try {
                setLoading(true);
                setError(null);
                const resultado = await componenteService.listarCompatibles(
                    tipo,
                    idsOtrosSeleccionados
                );
                if (!cancelado) {
                    setComponentes(resultado.datos);
                }
            } catch (err) {
                if (!cancelado) setError('Error al cargar componentes');
            } finally {
                if (!cancelado) setLoading(false);
            }
        };
        cargar();
        return () => {
            cancelado = true;
        };
    }, [tipo, llaveOtros]); // eslint-disable-line react-hooks/exhaustive-deps

    const componentesFiltrados = componentes.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleSeleccionar = (componente: Componente) => {
        dispatch(seleccionarComponente(componente));
    };

    if (loading) return <Loading mensaje={`Cargando ${titulo.toLowerCase()}...`} />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="paso-componente">
            <div className="paso-header">
                <h2 className="paso-titulo">{titulo}</h2>
                <p className="paso-descripcion">{descripcion}</p>
                {idsOtrosSeleccionados.length > 0 && (
                    <p className="paso-filtro-aviso">
                        🔎 Mostrando solo opciones compatibles con tu selección actual
                    </p>
                )}
            </div>

            <div className="paso-busqueda">
                <input
                    type="text"
                    placeholder={`Buscar ${titulo.toLowerCase()}...`}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="input-busqueda"
                />
            </div>

            {componentesFiltrados.length === 0 ? (
                <div className="no-results">
                    <p>
                        {idsOtrosSeleccionados.length > 0
                            ? 'No hay componentes compatibles con tu selección actual. Cambia un componente previo para seguir avanzando.'
                            : 'No se encontraron componentes disponibles.'}
                    </p>

                    {idsOtrosSeleccionados.length > 0 && (
                        <div className="cambiar-seleccion">
                            <p style={{ marginTop: '1rem', fontWeight: 600 }}>
                                Selección actual (haz clic en uno para volver a elegirlo):
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    justifyContent: 'center',
                                    marginTop: '0.75rem',
                                }}
                            >
                                {Object.entries(componentesSeleccionados)
                                    .filter(([t, c]) => t !== tipo && c)
                                    .map(([t, c]) => {
                                        const tipoComp = t as TipoComponente;
                                        const componente = c as Componente;
                                        const idxPaso = PASOS_CONFIGURADOR.findIndex(
                                            (p) => p.tipo === tipoComp
                                        );
                                        return (
                                            <button
                                                key={tipoComp}
                                                className="btn btn-outline"
                                                onClick={() => {
                                                    dispatch(removerComponente(tipoComp));
                                                    if (idxPaso >= 0) dispatch(setPaso(idxPaso));
                                                }}
                                                title={`Quitar ${componente.nombre} y volver al paso de ${traducirTipoComponente(tipoComp)}`}
                                            >
                                                ✕ {traducirTipoComponente(tipoComp)}: {componente.nombre}
                                            </button>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="componentes-grid">
                    {componentesFiltrados.map((componente) => {
                        const isSelected = seleccionado?.id === componente.id;
                        const attrs = componente.atributos as Record<string, unknown>;

                        return (
                            <div
                                key={componente.id}
                                className={`componente-card ${isSelected ? 'componente-card--selected' : ''}`}
                                onClick={() => handleSeleccionar(componente)}
                            >
                                {componente.imagenUrl && (
                                    <div className="componente-card__imagen">
                                        <img
                                            src={componente.imagenUrl}
                                            alt={componente.nombre}
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="componente-card__header">
                                    <h3 className="componente-card__nombre">{componente.nombre}</h3>
                                    <span className="componente-card__sku">{componente.sku}</span>
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
                                        {formatearPrecio(componente.precio)}
                                    </span>
                                    <span className={`componente-card__stock ${componente.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                                        {componente.stock > 0 ? `${componente.stock} disponibles` : 'Agotado'}
                                    </span>
                                </div>

                                <button
                                    className={`btn btn-block ${isSelected ? 'btn-success' : 'btn-primary'}`}
                                    disabled={componente.stock <= 0}
                                >
                                    {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PasoComponente;
