import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./AdminUsersPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminUsersPage() {
    const { user, isLoggedIn, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        
        if (!isLoggedIn || !user) {
            navigate("/login");
            return;
        }

        // Verificar si el usuario es admin
        if (!user.isAdmin) {
            navigate("/");
            return;
        }

        const storedToken = localStorage.getItem('authToken');
        
        axios
            .get(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then((response) => {
                console.log("Usuarios recibidos:", response.data);
                setUsers(response.data);
            })
            .catch((err) => {
                console.error("Error obteniendo usuarios:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Error al obtener los usuarios");
            });
    }, [user, isLoggedIn, isLoading, navigate]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            setLoading(true);
            setError(null);

            try {
                const storedToken = localStorage.getItem('authToken');
                await axios.delete(
                    `${API_URL}/api/admin/users/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    }
                );

                setUsers(users.filter((u) => u._id !== userId));
            } catch (err) {
                console.error("Error eliminando usuario:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Error al eliminar el usuario");
            } finally {
                setLoading(false);
            }
        }
    };

    if (isLoading) {
        return <Loader message="Autenticando..." />;
    }

    if (users === null) {
        return <Loader message="Cargando usuarios..." />;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }

    return (
        <div className="admin-users-container">
            <h1>Gestión de Usuarios</h1>
            <p className="subtitle">Total de usuarios: {users.length}</p>
            
            {users.length === 0 ? (
                <p>No hay usuarios registrados</p>
            ) : (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Fecha de Registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((userItem) => (
                                <tr key={userItem._id}>
                                    <td>{userItem.name}</td>
                                    <td>{userItem.email}</td>
                                    <td>
                                        <span className={`role-badge ${userItem.isAdmin ? 'admin' : 'user'}`}>
                                            {userItem.isAdmin ? 'Admin' : 'Usuario'}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(userItem.createdAt).toLocaleDateString('es-ES')}
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleDeleteUser(userItem._id)}
                                            disabled={loading || userItem._id === user._id}
                                            className="btn-delete-user"
                                        >
                                            Eliminar
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
}

export default AdminUsersPage;
