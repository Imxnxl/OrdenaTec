// ============================================
// OrdenaTEC — PasoComponente (Generic Step)
// Generic step component for the PC builder.
// Used by PasoCPU, PasoMotherboard, etc.
// ============================================

import React, { useEffect, useState } from 'react';
import { Componente, TipoComponente } from '../../types';
import { componenteService } from '../../services/componente.service';
import { useAppDispatch, useAppSelector } from '../../store';
import { seleccionarComponente } from '../../store/slices/configuracion.slice';
import { formatearPrecio } from '../../utils/formatters';
import Loading from '../common/Loading';

interface PasoComponenteProps {
    tipo: TipoComponente;
    titulo: string;
    descripcion: string;
}

const PasoComponente: React.FC<PasoComponenteProps> = ({ tipo, titulo, descripcion }) => {
    const dispatch = useAppDispatch();
    const seleccionado = useAppSelector(
        (state) => state.configuracion.componentesSeleccionados[tipo]
    );

    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const cargar = async () => {
            try {
                setLoading(true);
                const resultado = await componenteService.listar({
                    tipo,
                    enStock: true,
                    porPagina: 50,
                });
                setComponentes(resultado.datos);
            } catch (err) {
                setError('Error al cargar componentes');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [tipo]);

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
                    <p>No se encontraron componentes disponibles</p>
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
                                <div className="componente-card__header">
                                    <h3 className="componente-card__nombre">{componente.nombre}</h3>
                                    <span className="componente-card__sku">{componente.sku}</span>
                                </div>

                                <div className="componente-card__specs">
                                    {Object.entries(attrs).slice(0, 5).map(([key, value]) => (
                                        <div key={key} className="spec-item">
                                            <span className="spec-label">{key}</span>
                                            <span className="spec-value">{String(value)}</span>
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
