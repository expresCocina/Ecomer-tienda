import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Package, ShoppingCart, Calendar } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { getOrders } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';

/**
 * Página de finanzas y métricas
 */
export const Finanzas = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar pedidos por fecha
    const getFilteredOrders = () => {
        const now = new Date();
        return orders.filter(order => {
            const orderDate = new Date(order.created_at);

            switch (dateFilter) {
                case 'today':
                    return orderDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return orderDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return orderDate >= monthAgo;
                default:
                    return true;
            }
        });
    };

    const filteredOrders = getFilteredOrders();
    const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered');

    // Calcular métricas
    const metrics = {
        totalRevenue: deliveredOrders.reduce((sum, order) => sum + order.total, 0),
        totalOrders: filteredOrders.length,
        deliveredOrders: deliveredOrders.length,
        pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
        cancelledOrders: filteredOrders.filter(o => o.status === 'cancelled').length,
    };

    // Calcular ganancias (necesitamos costo de productos)
    const calculateProfit = () => {
        let totalCost = 0;
        let totalRevenue = 0;

        deliveredOrders.forEach(order => {
            totalRevenue += order.total;
            order.order_items?.forEach(item => {
                // Si el producto tiene cost_price, lo usamos, sino estimamos 60% del precio
                const estimatedCost = item.price * 0.6;
                totalCost += estimatedCost * item.quantity;
            });
        });

        return totalRevenue - totalCost;
    };

    const profit = calculateProfit();
    const profitMargin = metrics.totalRevenue > 0
        ? ((profit / metrics.totalRevenue) * 100).toFixed(1)
        : 0;

    // Productos más vendidos
    const getTopProducts = () => {
        const productSales = {};

        deliveredOrders.forEach(order => {
            order.order_items?.forEach(item => {
                if (!productSales[item.product_name]) {
                    productSales[item.product_name] = {
                        name: item.product_name,
                        quantity: 0,
                        revenue: 0,
                    };
                }
                productSales[item.product_name].quantity += item.quantity;
                productSales[item.product_name].revenue += item.subtotal;
            });
        });

        return Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    };

    const topProducts = getTopProducts();

    // Ventas por día (últimos 7 días)
    const getSalesByDay = () => {
        const salesByDay = {};
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            last7Days.push(dateStr);
            salesByDay[dateStr] = 0;
        }

        deliveredOrders.forEach(order => {
            const orderDate = new Date(order.created_at);
            const dateStr = orderDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            if (salesByDay[dateStr] !== undefined) {
                salesByDay[dateStr] += order.total;
            }
        });

        return last7Days.map(date => ({
            date,
            sales: salesByDay[date] || 0,
        }));
    };

    const salesByDay = getSalesByDay();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-primary-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Finanzas</h1>
                                <p className="text-sm text-gray-600">Análisis de ingresos y ganancias</p>
                            </div>
                        </div>

                        {/* Filtro de fecha */}
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <option value="all">Todo el tiempo</option>
                            <option value="today">Hoy</option>
                            <option value="week">Última semana</option>
                            <option value="month">Último mes</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Ingresos Totales</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {formatPrice(metrics.totalRevenue)}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Ganancias Estimadas</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {formatPrice(profit)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Margen: {profitMargin}%</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pedidos Totales</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {metrics.totalOrders}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {metrics.deliveredOrders} entregados
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Ticket Promedio</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {formatPrice(deliveredOrders.length > 0
                                            ? metrics.totalRevenue / deliveredOrders.length
                                            : 0
                                        )}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Package className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ventas por día */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-semibold">Ventas Últimos 7 Días</h2>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                {salesByDay.map((day, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{day.date}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min((day.sales / Math.max(...salesByDay.map(d => d.sales))) * 100, 100)}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 w-24 text-right">
                                                {formatPrice(day.sales)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Productos más vendidos */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-semibold">Top 5 Productos</h2>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {topProducts.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                    No hay ventas para mostrar
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div key={index} className="border-b pb-3 last:border-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-lg text-gray-900">
                                                            #{index + 1}
                                                        </span>
                                                        <span className="font-medium text-gray-900">
                                                            {product.name}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {product.quantity} unidades vendidas
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-green-600">
                                                        {formatPrice(product.revenue)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Resumen de estados */}
                <Card className="mt-6">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Resumen de Pedidos</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Pendientes</p>
                                <p className="text-3xl font-bold text-yellow-600">{metrics.pendingOrders}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Entregados</p>
                                <p className="text-3xl font-bold text-green-600">{metrics.deliveredOrders}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Cancelados</p>
                                <p className="text-3xl font-bold text-red-600">{metrics.cancelledOrders}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
