import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';

/**
 * Página de login para administradores
 */
export const Login = () => {
    const navigate = useNavigate();
    const { user, isAdmin, signIn, loading, error: authError } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    // Si ya está autenticado como admin, redirigir al dashboard
    if (user && isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Limpiar error del campo
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validación básica
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email es requerido';
        }
        if (!formData.password) {
            newErrors.password = 'Contraseña es requerida';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const result = await signIn(formData.email, formData.password);
            if (result.success) {
                // Redirigir al dashboard después del login exitoso
                navigate('/admin/dashboard');
            }
        } catch (error) {
            // El error ya está manejado en el authStore
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 px-4">
            <div className="w-full max-w-md">
                {/* Logo/Título */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                        <Lock className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Panel Administrativo
                    </h1>
                    <p className="text-primary-100">
                        Inicia sesión para acceder al panel
                    </p>
                </div>

                {/* Formulario */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Iniciar Sesión
                        </h2>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error general de autenticación */}
                            {authError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-red-800">
                                        {authError}
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="admin@ejemplo.com"
                                icon={<Mail className="w-5 h-5" />}
                                required
                                autoFocus
                            />

                            {/* Contraseña */}
                            <Input
                                label="Contraseña"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            {/* Botón de login */}
                            <Button
                                type="submit"
                                loading={loading}
                                disabled={loading}
                                className="w-full"
                                size="lg"
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>
                        </form>

                        {/* Nota de ayuda */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                                <strong>Nota:</strong> Solo los usuarios con rol de administrador pueden acceder al panel.
                            </p>
                        </div>
                    </CardBody>
                </Card>

                {/* Link de regreso */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-white hover:text-primary-100 transition-colors"
                    >
                        ← Volver a la tienda
                    </button>
                </div>
            </div>
        </div>
    );
};
