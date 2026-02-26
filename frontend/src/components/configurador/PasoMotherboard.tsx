// ============================================
// OrdenaTEC — PasoMotherboard
// ============================================

import React from 'react';
import PasoComponente from './PasoComponente';
import { TipoComponente } from '../../types';

const PasoMotherboard: React.FC = () => (
    <PasoComponente
        tipo={TipoComponente.MOTHERBOARD}
        titulo="Motherboard"
        descripcion="Selecciona la placa madre. Asegúrate de que el socket sea compatible con tu CPU."
    />
);

export default PasoMotherboard;
