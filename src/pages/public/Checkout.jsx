import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, Watch } from 'lucide-react';
import { useCartStore, selectSubtotal } from '../../store/cartStore';
import { createOrder } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';
import { checkoutSchema } from '../../lib/validators';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { trackInitiateCheckout, trackPurchase } from '../../lib/fbPixel';
import { capiInitiateCheckout, capiPurchase } from '../../lib/fbCapi';

/**
 * Página de Checkout - Tema oscuro/dorado
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-950">
                <div className="text-center mobile-padding">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gold-400" />
                    </div>
                    <h2 className="text-mobile-2xl font-bold text-gold-400 mb-3">
                        Tu carrito está vacío
                    </h2>
                    <p className="text-mobile-base text-gray-400 mb-8 leading-relaxed">
                        Añade productos antes de proceder al checkout
                    </p>
                    <Button
                        onClick={() => navigate('/tienda')}
                        className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-primary-900 font-bold"
                    >
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

            const order = await createOrder(orderData, items);

            // Track Purchase event (Pixel + CAPI)
            const purchaseData = {
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: subtotal
            };
            const eventId = trackPurchase(purchaseData);
            capiPurchase(purchaseData, eventId);

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
        <div className="min-h-screen bg-gradient-to-b from-primary-900 via-primary-900 to-primary-950 pt-20 sm:pt-24 md:pt-28 pb-8">
            <div className="container-mobile">
                {/* Logo - Estilo Navbar */}
                <div className="flex justify-center mb-8 sm:mb-10">
                    <div className="flex items-center space-x-3 group">
                        {/* Icon con gradiente dorado */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-500 via-gold-600 to-gold-700 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/30">
                            <Watch className="w-7 h-7 sm:w-8 sm:h-8 text-primary-900" />
                        </div>

                        {/* Texto del logo con gradiente */}
                        <div className="flex flex-col">
                            <span className="font-display text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent tracking-tight">
                                C&J
                            </span>
                            <span className="text-sm sm:text-base font-bold text-gold-400 tracking-widest uppercase">
                                Relojería
                            </span>
                        </div>
                    </div>
                </div>

                <h1 className="text-mobile-3xl font-bold text-gold-400 mb-6 sm:mb-8 text-center">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <h2 className="text-mobile-xl font-bold text-gold-400">
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
                                <h2 className="text-mobile-xl font-bold text-gold-400">
                                    Resumen del Pedido
                                </h2>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    {/* Items */}
                                    <div className="space-y-3">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="w-16 h-16 flex-shrink-0 bg-primary-800/50 border border-gold-500/20 rounded-lg overflow-hidden">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gold-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-gold-400 truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-400">
                                                        Cantidad: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-bold text-gold-500">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t-2 border-gold-500/20 pt-4">
                                        {/* Subtotal */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-mobile-base text-gray-400">Subtotal</span>
                                            <span className="font-semibold text-gold-400">
                                                {formatPrice(subtotal)}
                                            </span>
                                        </div>

                                        {/* Envío */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-mobile-base text-gray-400">Envío</span>
                                            <span className="font-semibold text-gold-400">
                                                A calcular
                                            </span>
                                        </div>

                                        {/* Total */}
                                        <div className="border-t-2 border-gold-500/20 pt-4 mt-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-mobile-lg font-bold text-gold-400">
                                                    Total
                                                </span>
                                                <span className="text-mobile-2xl font-bold text-gold-500">
                                                    {formatPrice(subtotal)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nota de envío */}
                                    <div className="bg-blue-900/30 border-2 border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
                                        <p className="text-sm text-blue-300 leading-relaxed">
                                            <strong className="text-blue-200">Nota:</strong> El costo de envío se calculará según tu ubicación y será confirmado por WhatsApp.
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
