import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { getOrders, updateOrderStatus } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';

/**
 * Página de gestión de pedidos
 */
export const Pedidos = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Cargar pedidos
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

    // Ver detalle
    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    // Cambiar estado
    const handleStatusChange = async (orderId, newStatus, orderItems) => {
        if (!confirm('¿Estás seguro de cambiar el estado de este pedido?')) return;

        try {
            await updateOrderStatus(orderId, newStatus, orderItems);
            // Actualizar lista
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            alert('Estado actualizado correctamente');
            setShowDetailModal(false);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado');
        }
    };

    // Filtrar pedidos
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_phone?.includes(searchTerm);
        const matchesStatus = !filterStatus || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Calcular estadísticas
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Badge de estado
    const getStatusBadge = (status) => {
        const variants = {
            pending: { variant: 'warning', icon: Clock, text: 'Pendiente' },
            delivered: { variant: 'success', icon: CheckCircle, text: 'Entregado' },
            cancelled: { variant: 'danger', icon: XCircle, text: 'Cancelado' },
        };
        const config = variants[status] || variants.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant}>
                <Icon className="w-3 h-3 mr-1" />
                {config.text}
            </Badge>
        );
    };

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
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-primary-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
                            <p className="text-sm text-gray-600">{filteredOrders.length} pedidos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">Pendientes</div>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">Entregados</div>
                        <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">Cancelados</div>
                        <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Buscar por cliente, email o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search className="w-5 h-5" />}
                        />
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">Todos los estados</option>
                            <option value="pending">Pendiente</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de pedidos */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No se encontraron pedidos
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                                {order.id.slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{order.customer_name}</div>
                                                    <div className="text-sm text-gray-500">{order.customer_email}</div>
                                                    <div className="text-sm text-gray-500">{order.customer_phone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {formatPrice(order.total)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewDetail(order)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Ver detalle
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de detalle */}
            {selectedOrder && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title={`Pedido #${selectedOrder.id.slice(0, 8)}`}
                >
                    <div className="space-y-6">
                        {/* Información del cliente */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Cliente</h3>
                            <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Nombre:</span> {selectedOrder.customer_name}</div>
                                <div><span className="font-medium">Email:</span> {selectedOrder.customer_email || 'No proporcionado'}</div>
                                <div><span className="font-medium">Teléfono:</span> {selectedOrder.customer_phone}</div>
                                <div><span className="font-medium">Dirección:</span> {selectedOrder.customer_address}</div>
                                {selectedOrder.notes && (
                                    <div><span className="font-medium">Notas:</span> {selectedOrder.notes}</div>
                                )}
                            </div>
                        </div>

                        {/* Productos */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Productos</h3>
                            <div className="space-y-3">
                                {selectedOrder.order_items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <div className="font-medium">{item.product_name}</div>
                                            <div className="text-sm text-gray-600">
                                                {formatPrice(item.price)} × {item.quantity}
                                            </div>
                                        </div>
                                        <div className="font-medium">{formatPrice(item.subtotal)}</div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-2 text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Estado y acciones */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cambiar Estado</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant={selectedOrder.status === 'pending' ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => handleStatusChange(selectedOrder.id, 'pending', selectedOrder.order_items)}
                                    disabled={selectedOrder.status === 'pending'}
                                >
                                    <Clock className="w-4 h-4 mr-1" />
                                    Pendiente
                                </Button>
                                <Button
                                    variant={selectedOrder.status === 'delivered' ? 'success' : 'outline'}
                                    size="sm"
                                    onClick={() => handleStatusChange(selectedOrder.id, 'delivered', selectedOrder.order_items)}
                                    disabled={selectedOrder.status === 'delivered'}
                                >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Entregado
                                </Button>
                                <Button
                                    variant={selectedOrder.status === 'cancelled' ? 'danger' : 'outline'}
                                    size="sm"
                                    onClick={() => handleStatusChange(selectedOrder.id, 'cancelled', selectedOrder.order_items)}
                                    disabled={selectedOrder.status === 'cancelled'}
                                >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Cancelado
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {selectedOrder.status === 'pending' && '⚠️ Al marcar como "Entregado" se restará el stock automáticamente'}
                                {selectedOrder.status === 'delivered' && '✅ El stock ya ha sido restado de este pedido'}
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
