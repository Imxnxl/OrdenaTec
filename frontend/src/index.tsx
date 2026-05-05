// ============================================
// OrdenaTEC — Entry Point
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <ToastProvider>
                    <App />
                </ToastProvider>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>
);
