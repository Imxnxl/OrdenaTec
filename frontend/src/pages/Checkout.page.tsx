import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { vaciarCarrito } from '../store/slices/carrito.slice';
import { formatearPrecio } from '../utils/formatters';
import api from '../services/api';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items, total } = useAppSelector((state) => state.carrito);
    const { usuario } = useAppSelector((state) => state.auth);

    const [direccion, setDireccion] = useState('');
    const [metodoPago, setMetodoPago] = useState('tarjeta');
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!usuario) {
        navigate('/login');
        return null;
    }

    if (items.length === 0) {
        navigate('/carrito');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!direccion.trim()) {
            setError('Por favor ingresa una dirección de envío');
            return;
        }

        setProcesando(true);

        try {
            for (const item of items) {
                await api.post('/pedidos', {
                    configuracionId: item.configuracion.id.startsWith('temp-')
                        ? undefined
                        : item.configuracion.id,
                    direccionEnvio: direccion,
                    metodoPago,
                });
            }

            dispatch(vaciarCarrito());
            navigate('/pedido-confirmado');
        } catch (err: any) {
            setError(err.response?.data?.mensaje || 'Error al procesar el pedido');
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="checkout-page">
            <h1 className="page-title">💳 Checkout</h1>

            <div className="checkout-content">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>📦 Dirección de envío</h3>
                        <textarea
                            className="input-field"
                            placeholder="Ingresa tu dirección completa de envío..."
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="form-section">
                        <h3>💳 Método de pago</h3>
                        <div className="payment-options">
                            <label className={`payment-option ${metodoPago === 'tarjeta' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="pago"
                                    value="tarjeta"
                                    checked={metodoPago === 'tarjeta'}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                />
                                💳 Tarjeta de crédito/débito
                            </label>
                            <label className={`payment-option ${metodoPago === 'transferencia' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="pago"
                                    value="transferencia"
                                    checked={metodoPago === 'transferencia'}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                />
                                🏦 Transferencia bancaria
                            </label>
                        </div>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <div className="checkout-summary">
                        <div className="checkout-total">
                            <span>Total a pagar:</span>
                            <strong>{formatearPrecio(total)}</strong>
                        </div>
                        <p className="checkout-note">
                            ⚠️ Este es un pago simulado para propósitos de desarrollo.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg"
                        disabled={procesando}
                    >
                        {procesando ? '⏳ Procesando...' : '✅ Confirmar pedido'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
