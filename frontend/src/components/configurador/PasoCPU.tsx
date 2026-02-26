// ============================================
// OrdenaTEC — PasoCPU
// CPU selection step for the PC builder.
// ============================================

import React from 'react';
import PasoComponente from './PasoComponente';
import { TipoComponente } from '../../types';

const PasoCPU: React.FC = () => (
    <PasoComponente
        tipo={TipoComponente.CPU}
        titulo="Procesador (CPU)"
        descripcion="Elige el procesador que será el cerebro de tu PC. Considera los núcleos, frecuencia y socket compatible."
    />
);

export default PasoCPU;
