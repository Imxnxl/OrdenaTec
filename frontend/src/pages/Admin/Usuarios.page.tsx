import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatearFecha } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import { useToast } from '../../components/common/Toast';

interface Usuario {
    id: string;
    email: string;
    nombre: string;
    rol: 'CLIENTE' | 'ADMIN';
    createdAt: string;
    _count: { pedidos: number; configuraciones: number };
}

const UsuariosPage: React.FC = () => {
    const toast = useToast();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);

    const cargar = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/usuarios');
            setUsuarios(res.data);
        } catch {
            toast.mostrar('Error al cargar usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const toggleRol = async (usuario: Usuario) => {
        const nuevoRol = usuario.rol === 'ADMIN' ? 'CLIENTE' : 'ADMIN';
        try {
            await api.put(`/admin/usuarios/${usuario.id}/rol`, { rol: nuevoRol });
            toast.mostrar(`${usuario.nombre} ahora es ${nuevoRol === 'ADMIN' ? 'admin' : 'cliente'}`, 'success');
            cargar();
        } catch {
            toast.mostrar('Error al actualizar rol', 'error');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="page-title">👥 Usuarios</h1>
                <span style={{ opacity: 0.6 }}>{usuarios.length} registrados</span>
            </div>

            {loading ? <Loading mensaje="Cargando usuarios..." /> : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Pedidos</th>
                                <th>Configs</th>
                                <th>Registro</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => (
                                <tr key={u.id}>
                                    <td><strong>{u.nombre}</strong></td>
                                    <td><code>{u.email}</code></td>
                                    <td>
                                        <span className={`badge badge--${u.rol.toLowerCase()}`}>
                                            {u.rol === 'ADMIN' ? '🔑 Admin' : '👤 Cliente'}
                                        </span>
                                    </td>
                                    <td>{u._count.pedidos}</td>
                                    <td>{u._count.configuraciones}</td>
                                    <td>{formatearFecha(u.createdAt)}</td>
                                    <td>
                                        <button
                                            className={`btn btn-sm ${u.rol === 'ADMIN' ? 'btn-outline' : 'btn-primary'}`}
                                            onClick={() => toggleRol(u)}
                                        >
                                            {u.rol === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UsuariosPage;
