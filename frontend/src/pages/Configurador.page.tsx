import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { setPaso, siguientePaso, pasoAnterior } from '../store/slices/configuracion.slice';
import PasoCPU from '../components/configurador/PasoCPU';
import PasoMotherboard from '../components/configurador/PasoMotherboard';
import PasoRAM from '../components/configurador/PasoRAM';
import PasoGPU from '../components/configurador/PasoGPU';
import PasoAlmacenamiento from '../components/configurador/PasoAlmacenamiento';
import PasoPSU from '../components/configurador/PasoPSU';
import PasoGabinete from '../components/configurador/PasoGabinete';
import ResumenPanel from '../components/configurador/ResumenPanel';
import { PASOS_CONFIGURADOR } from '../types';

const pasoComponentes: React.ReactNode[] = [
    <PasoCPU key="cpu" />,
    <PasoMotherboard key="mb" />,
    <PasoRAM key="ram" />,
    <PasoGPU key="gpu" />,
    <PasoAlmacenamiento key="storage" />,
    <PasoPSU key="psu" />,
    <PasoGabinete key="case" />,
];

const ConfiguradorPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { pasoActual, componentesSeleccionados } = useAppSelector(
        (state) => state.configuracion
    );

    return (
        <div className="configurador-page">
            <div className="configurador-steps">
                {PASOS_CONFIGURADOR.map((paso, index) => {
                    const isActive = index === pasoActual;
                    const isCompleted = !!componentesSeleccionados[paso.tipo];

                    return (
                        <button
                            key={paso.tipo}
                            className={`step-indicator ${isActive ? 'step--active' : ''} ${isCompleted ? 'step--completed' : ''}`}
                            onClick={() => dispatch(setPaso(index))}
                        >
                            <span className="step-icon">{isCompleted ? '✓' : paso.icono}</span>
                            <span className="step-name">{paso.nombre}</span>
                        </button>
                    );
                })}
            </div>

            <div className="configurador-content">
                <div className="configurador-main">
                    {pasoComponentes[pasoActual]}

                    <div className="configurador-nav">
                        <button
                            className="btn btn-outline"
                            onClick={() => dispatch(pasoAnterior())}
                            disabled={pasoActual === 0}
                        >
                            ← Anterior
                        </button>
                        <span className="step-counter">
                            Paso {pasoActual + 1} de {PASOS_CONFIGURADOR.length}
                        </span>
                        <button
                            className="btn btn-primary"
                            onClick={() => dispatch(siguientePaso())}
                            disabled={pasoActual === PASOS_CONFIGURADOR.length - 1}
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>

                <aside className="configurador-sidebar">
                    <ResumenPanel />
                </aside>
            </div>
        </div>
    );
};

export default ConfiguradorPage;
