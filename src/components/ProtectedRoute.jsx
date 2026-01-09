import { Navigate } from 'react-router-dom';
import { useAuthStore, selectIsAdmin } from '../store/authStore';
import { Spinner } from '../components/ui/Spinner';

/**
 * Componente para proteger rutas que requieren autenticación de admin
 */
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthStore();
    const isAdmin = useAuthStore(selectIsAdmin);

    // Mientras carga la sesión
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Si no es admin, redirigir al inicio
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Si es admin, mostrar el contenido
    return children;
};
