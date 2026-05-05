// ============================================
// OrdenaTEC — PasoRAM
// ============================================

import React from 'react';
import PasoComponente from './PasoComponente';
import { TipoComponente } from '../../types';

const PasoRAM: React.FC = () => (
    <PasoComponente
        tipo={TipoComponente.RAM}
        titulo="Memoria RAM"
        descripcion="Elige la memoria RAM. Verifica que sea compatible con tu motherboard (DDR4/DDR5)."
    />
);

export default PasoRAM;
