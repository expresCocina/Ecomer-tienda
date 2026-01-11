import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle } from 'lucide-react';
import { useCartStore, selectSubtotal } from '../../store/cartStore';
import { createOrder } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';
import { checkoutSchema } from '../../lib/validators';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { trackInitiateCheckout } from '../../lib/fbPixel';
import { capiInitiateCheckout } from '../../lib/fbCapi';

/**
 * Página de Checkout
 */
export const Checkout = () => {
    const navigate = useNavigate();
    const { items, clearCart } = useCartStore();
    const subtotal = useCartStore(selectSubtotal);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        notes: '',
    });

    // Track InitiateCheckout event when page loads
    useEffect(() => {
        if (items.length > 0) {
            const eventId = trackInitiateCheckout(items, subtotal);
            capiInitiateCheckout(items, subtotal, eventId);
        }
    }, []);

    // Redirigir si el carrito está vacío
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Tu carrito está vacío
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Añade productos antes de proceder al checkout
                    </p>
                    <Button onClick={() => navigate('/tienda')}>
                        Ir a la tienda
                    </Button>
                </div>
            </div>
        );
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

        try {
            setLoading(true);
            setErrors({});

            // Validar con Zod
            const validatedData = checkoutSchema.parse(formData);

            // Crear pedido
            const orderData = {
                ...validatedData,
                total: subtotal,
                status: 'pending',
            };

            await createOrder(orderData, items);

            // Limpiar carrito
            clearCart();

            // Redirigir a página de éxito
            navigate('/checkout/success');
        } catch (error) {
            if (error.errors) {
                // Errores de validación de Zod
                const fieldErrors = {};
                error.errors.forEach((err) => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                console.error('Error creating order:', error);
                alert('Hubo un error al procesar tu pedido. Intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 md:pt-28 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Información de Envío
                                </h2>
                            </CardHeader>
                            <CardBody>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Nombre completo */}
                                    <Input
                                        label="Nombre completo"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        onChange={handleChange}
                                        error={errors.customer_name}
                                        placeholder="Juan Pérez"
                                        required
                                    />

                                    {/* Email */}
                                    <Input
                                        label="Email (opcional)"
                                        name="customer_email"
                                        type="email"
                                        value={formData.customer_email}
                                        onChange={handleChange}
                                        error={errors.customer_email}
                                        placeholder="juan@ejemplo.com"
                                    />

                                    {/* Teléfono */}
                                    <Input
                                        label="Teléfono"
                                        name="customer_phone"
                                        type="tel"
                                        value={formData.customer_phone}
                                        onChange={handleChange}
                                        error={errors.customer_phone}
                                        placeholder="+57 300 123 4567"
                                        required
                                    />

                                    {/* Dirección */}
                                    <Textarea
                                        label="Dirección de envío"
                                        name="customer_address"
                                        value={formData.customer_address}
                                        onChange={handleChange}
                                        error={errors.customer_address}
                                        placeholder="Calle 123 #45-67, Apartamento 8B, Ciudad"
                                        rows={3}
                                        required
                                    />

                                    {/* Notas adicionales */}
                                    <Textarea
                                        label="Notas adicionales (opcional)"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        error={errors.notes}
                                        placeholder="Instrucciones especiales de entrega..."
                                        rows={3}
                                    />

                                    {/* Botón de envío */}
                                    <Button
                                        type="submit"
                                        loading={loading}
                                        disabled={loading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {loading ? 'Procesando...' : 'Confirmar Pedido'}
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Resumen del pedido */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Resumen del Pedido
                                </h2>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    {/* Items */}
                                    <div className="space-y-3">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Cantidad: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-semibold text-primary-600">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200 pt-4">
                                        {/* Subtotal */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium text-gray-900">
                                                {formatPrice(subtotal)}
                                            </span>
                                        </div>

                                        {/* Envío */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">Envío</span>
                                            <span className="font-medium text-gray-900">
                                                A calcular
                                            </span>
                                        </div>

                                        {/* Total */}
                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-semibold text-gray-900">
                                                    Total
                                                </span>
                                                <span className="text-2xl font-bold text-primary-600">
                                                    {formatPrice(subtotal)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nota de envío */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-900">
                                            <strong>Nota:</strong> El costo de envío se calculará según tu ubicación y será confirmado por WhatsApp.
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
