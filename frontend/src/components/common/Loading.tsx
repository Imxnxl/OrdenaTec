// ============================================
// OrdenaTEC — Loading Spinner Component
// ============================================

import React from 'react';

interface LoadingProps {
    mensaje?: string;
}

const Loading: React.FC<LoadingProps> = ({ mensaje = 'Cargando...' }) => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">{mensaje}</p>
        </div>
    );
};

export default Loading;
