import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import {
    removerDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
} from '../store/slices/carrito.slice';
import { formatearPrecio } from '../utils/formatters';

const CarritoPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, total } = useAppSelector((state) => state.carrito);
    const { usuario } = useAppSelector((state) => state.auth);

    if (items.length === 0) {
        return (
            <div className="page-empty">
                <h2>🛒 Carrito vacío</h2>
                <p>No tienes configuraciones en tu carrito aún.</p>
                <Link to="/configurador" className="btn btn-primary">
                    ⚙️ Ir al PC Builder
                </Link>
            </div>
        );
    }

    const handleCheckout = () => {
        if (!usuario) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="carrito-page">
            <h1 className="page-title">🛒 Tu Carrito</h1>

            <div className="carrito-content">
                <div className="carrito-items">
                    {items.map((item) => (
                        <div key={item.id} className="carrito-item">
                            <div className="carrito-item__info">
                                <h3>{item.configuracion.nombre || 'Configuración personalizada'}</h3>
                                <div className="carrito-item__componentes">
                                    {item.configuracion.componentes.map((cc) => (
                                        <span key={cc.componenteId} className="componente-badge">
                                            {cc.componente.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="carrito-item__precio">
                                {formatearPrecio(item.configuracion.precioTotal)}
                            </div>

                            <div className="carrito-item__cantidad">
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() =>
                                        dispatch(
                                            actualizarCantidad({ id: item.id, cantidad: item.cantidad - 1 })
                                        )
                                    }
                                    disabled={item.cantidad <= 1}
                                >
                                    −
                                </button>
                                <span>{item.cantidad}</span>
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() =>
                                        dispatch(
                                            actualizarCantidad({ id: item.id, cantidad: item.cantidad + 1 })
                                        )
                                    }
                                >
                                    +
                                </button>
                            </div>

                            <div className="carrito-item__subtotal">
                                {formatearPrecio(item.configuracion.precioTotal * item.cantidad)}
                            </div>

                            <button
                                className="btn-remove"
                                onClick={() => dispatch(removerDelCarrito(item.id))}
                                title="Quitar del carrito"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <div className="carrito-resumen">
                    <div className="carrito-total">
                        <span>Total:</span>
                        <strong>{formatearPrecio(total)}</strong>
                    </div>

                    <button className="btn btn-success btn-block" onClick={handleCheckout}>
                        Proceder al pago →
                    </button>

                    <button
                        className="btn btn-outline btn-block"
                        onClick={() => dispatch(vaciarCarrito())}
                    >
                        🗑️ Vaciar carrito
                    </button>

                    <Link to="/configurador" className="btn btn-outline btn-block">
                        ⚙️ Seguir armando
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CarritoPage;
