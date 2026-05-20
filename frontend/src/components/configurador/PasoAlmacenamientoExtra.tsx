import React from 'react';
import PasoComponente from './PasoComponente';
import { TipoComponente } from '../../types';

const PasoAlmacenamientoExtra: React.FC = () => (
    <PasoComponente
        tipo={TipoComponente.ALMACENAMIENTO_EXTRA}
        titulo="Almacenamiento Extra"
        descripcion="Añade un segundo disco de almacenamiento. Ideal para ampliar capacidad con un HDD o añadir velocidad con un NVMe adicional."
    />
);

export default PasoAlmacenamientoExtra;
