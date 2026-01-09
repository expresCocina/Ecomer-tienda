import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, LogOut, Settings, FolderTree } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';

/**
 * Dashboard principal del panel administrativo
 */
export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuthStore();

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const menuItems = [
        {
            title: 'Inventario',
            description: 'Gestiona productos y stock',
            icon: Package,
            path: '/admin/inventario',
            color: 'bg-blue-500',
        },
        {
            title: 'Pedidos',
            description: 'Ver y gestionar pedidos',
            icon: ShoppingCart,
            path: '/admin/pedidos',
            color: 'bg-green-500',
        },
        {
            title: 'Finanzas',
            description: 'Ingresos y ganancias',
            icon: DollarSign,
            path: '/admin/finanzas',
            color: 'bg-purple-500',
        },
        {
            title: 'Categorías',
            description: 'Gestionar categorías',
            icon: FolderTree,
            path: '/admin/categorias',
            color: 'bg-orange-500',
        },
        {
            title: 'Configuración',
            description: 'Ajustes del negocio',
            icon: Settings,
            path: '/admin/configuracion',
            color: 'bg-gray-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
                            <p className="text-sm text-gray-600 mt-1">Bienvenido, {user?.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/">
                                <Button variant="outline" size="sm">
                                    Ver Tienda
                                </Button>
                            </Link>
                            <Button onClick={handleSignOut} variant="ghost" size="sm">
                                <LogOut className="w-4 h-4 mr-2" />
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">¿Qué deseas hacer?</h2>
                    <p className="text-gray-600">Selecciona una opción para comenzar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="block group"
                        >
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${item.color}`}>
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};
