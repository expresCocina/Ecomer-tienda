import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, Users, Settings, Tag, Globe } from 'lucide-react';
import { LiveUserMap } from '../../components/admin/LiveUserMap';

/**
 * Página del dashboard - Panel principal del administrador
 */
export const Dashboard = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            title: 'Inventario',
            description: 'Gestiona tus productos',
            icon: Package,
            path: '/admin/inventario',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'from-blue-50 to-indigo-50'
        },
        {
            title: 'Pedidos',
            description: 'Revisa los pedidos',
            icon: ShoppingCart,
            path: '/admin/pedidos',
            color: 'from-green-500 to-green-600',
            bgColor: 'from-green-50 to-emerald-50'
        },
        {
            title: 'Finanzas',
            description: 'Analiza tus ventas',
            icon: DollarSign,
            path: '/admin/finanzas',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'from-purple-50 to-pink-50'
        },
        {
            title: 'Categorías',
            description: 'Organiza tu catálogo',
            icon: Tag,
            path: '/admin/categorias',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'from-orange-50 to-yellow-50'
        },
        {
            title: 'Configuración',
            description: 'Ajustes de la tienda',
            icon: Settings,
            path: '/admin/configuracion',
            color: 'from-gray-500 to-gray-600',
            bgColor: 'from-gray-50 to-slate-50'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Bienvenido al panel de administración
                    </p>
                </div>

                {/* Quick Access Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="group"
                        >
                            <div className={`bg-gradient-to-br ${item.bgColor} rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Live User Map Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Usuarios en Vivo
                            </h2>
                            <p className="text-sm text-gray-500">
                                Monitoreo geográfico en tiempo real
                            </p>
                        </div>
                    </div>

                    {/* Mapa */}
                    <div className="h-[600px]">
                        <LiveUserMap />
                    </div>
                </div>
            </div>
        </div>
    );
};
