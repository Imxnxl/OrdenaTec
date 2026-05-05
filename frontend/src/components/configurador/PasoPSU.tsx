// ============================================
// OrdenaTEC — PasoPSU
// ============================================

import React from 'react';
import PasoComponente from './PasoComponente';
import { TipoComponente } from '../../types';

const PasoPSU: React.FC = () => (
    <PasoComponente
        tipo={TipoComponente.PSU}
        titulo="Fuente de Poder (PSU)"
        descripcion="Elige la fuente de poder adecuada. Debe cubrir el consumo total de tu configuración con margen."
    />
);

export default PasoPSU;
