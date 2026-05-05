// ============================================
// OrdenaTEC — Toast global
// Notificaciones no bloqueantes accesibles desde
// cualquier componente vía el hook useToast().
// ============================================

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type TipoToast = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    mensaje: string;
    tipo: TipoToast;
}

interface ToastContextValue {
    mostrar: (mensaje: string, tipo?: TipoToast) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const ICONOS: Record<TipoToast, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
};

const DURACION_MS = 3500;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const mostrar = useCallback((mensaje: string, tipo: TipoToast = 'info') => {
        setToasts((prev) => [...prev, { id: Date.now() + Math.random(), mensaje, tipo }]);
    }, []);

    const cerrar = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ mostrar }}>
            {children}
            <div className="toast-container" role="region" aria-live="polite">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onClose={() => cerrar(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    useEffect(() => {
        const id = window.setTimeout(onClose, DURACION_MS);
        return () => window.clearTimeout(id);
    }, [onClose]);

    return (
        <div className={`toast toast--${toast.tipo}`} onClick={onClose}>
            <span className="toast-icon">{ICONOS[toast.tipo]}</span>
            <span className="toast-mensaje">{toast.mensaje}</span>
            <button className="toast-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
    );
};

export const useToast = (): ToastContextValue => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast debe usarse dentro de un ToastProvider');
    }
    return ctx;
};
