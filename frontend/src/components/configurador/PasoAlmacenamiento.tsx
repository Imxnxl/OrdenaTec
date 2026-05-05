// ============================================
// OrdenaTEC — PasoAlmacenamiento
// Storage selection step for the PC builder.
// ============================================

import React from 'react';
import PasoComponente from './PasoComponente';
import { TipoComponente } from '../../types';

const PasoAlmacenamiento: React.FC = () => (
    <PasoComponente
        tipo={TipoComponente.ALMACENAMIENTO}
        titulo="Almacenamiento"
        descripcion="Elige tu disco SSD o HDD. Los NVMe ofrecen mayor velocidad, mientras que los HDD ofrecen mayor capacidad por menor precio."
    />
);

export default PasoAlmacenamiento;
