// ============================================
// OrdenaTEC — PasoGPU
// ============================================

import React from 'react';
import PasoComponente from './PasoComponente';
import { TipoComponente } from '../../types';

const PasoGPU: React.FC = () => (
    <PasoComponente
        tipo={TipoComponente.GPU}
        titulo="Tarjeta Gráfica (GPU)"
        descripcion="Selecciona la tarjeta gráfica ideal para gaming, diseño o trabajo profesional."
    />
);

export default PasoGPU;
