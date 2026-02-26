// ============================================
// OrdenaTEC — ComponenteCard Component
// Displays a single component card with specs
// and select button for the configurator.
// ============================================

import React from 'react';
import { Componente } from '../../types';
import { formatearPrecio } from '../../utils/formatters';

interface ComponenteCardProps {
    componente: Componente;
    seleccionado?: boolean;
    onSeleccionar?: (componente: Componente) => void;
}

const ComponenteCard: React.FC<ComponenteCardProps> = ({
    componente,
    seleccionado = false,
    onSeleccionar,
}) => {
    const attrs = componente.atributos as Record<string, unknown>;

    return (
        <div className={`componente-card ${seleccionado ? 'componente-card--selected' : ''}`}>
            <div className="componente-card__header">
                <h3 className="componente-card__nombre">{componente.nombre}</h3>
                <span className="componente-card__sku">{componente.sku}</span>
            </div>

            <div className="componente-card__specs">
                {Object.entries(attrs).map(([key, value]) => (
                    <div key={key} className="spec-item">
                        <span className="spec-label">{key}:</span>
                        <span className="spec-value">{String(value)}</span>
                    </div>
                ))}
            </div>

            <div className="componente-card__footer">
                <span className="componente-card__precio">
                    {formatearPrecio(componente.precio)}
                </span>
                <span className={`componente-card__stock ${componente.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                    {componente.stock > 0 ? `${componente.stock} en stock` : 'Agotado'}
                </span>
            </div>

            {onSeleccionar && (
                <button
                    className={`btn ${seleccionado ? 'btn-success' : 'btn-primary'} btn-block`}
                    onClick={() => onSeleccionar(componente)}
                    disabled={componente.stock <= 0}
                >
                    {seleccionado ? '✓ Seleccionado' : 'Seleccionar'}
                </button>
            )}
        </div>
    );
};

export default ComponenteCard;
