// ============================================
// OrdenaTEC — ErrorBoundary global
// Evita que un error en un componente deje la app en blanco.
// ============================================

import React from 'react';

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary]', error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h1>💥 Algo salió mal</h1>
                    <p>
                        La aplicación encontró un error inesperado. Puedes volver al inicio
                        o recargar la página.
                    </p>
                    {this.state.error && (
                        <pre className="error-boundary__detalle">{this.state.error.message}</pre>
                    )}
                    <button className="btn btn-primary" onClick={this.handleReload}>
                        ↩ Volver al inicio
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
