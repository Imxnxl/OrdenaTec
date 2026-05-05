// ============================================
// OrdenaTEC — PasoGabinete
// ============================================

import React from 'react';
import PasoComponente from './PasoComponente';
import { TipoComponente } from '../../types';

const PasoGabinete: React.FC = () => (
    <PasoComponente
        tipo={TipoComponente.GABINETE}
        titulo="Gabinete (Case)"
        descripcion="Selecciona el gabinete. Verifica que soporte el tamaño de tu GPU y factor de forma de tu motherboard."
    />
);

export default PasoGabinete;
