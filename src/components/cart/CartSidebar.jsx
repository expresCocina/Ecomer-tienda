import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore, selectTotalItems, selectSubtotal } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';
import { CartItem } from './CartItem';
import { Button } from '../ui/Button';

/**
 * Sidebar del carrito de compras
 */
export const CartSidebar = () => {
    const navigate = useNavigate();
    const { items, isOpen, closeCart } = useCartStore();
    const totalItems = useCartStore(selectTotalItems);
    const subtotal = useCartStore(selectSubtotal);

    // Prevenir scroll del body cuando está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        Carrito ({totalItems})
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Tu carrito está vacío
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Agrega productos para comenzar tu compra
                            </p>
                            <Button onClick={closeCart}>
                                Ir a la tienda
                            </Button>
                        </div>
                    ) : (
                        <div className="py-4">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con totales */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-medium text-gray-900">Subtotal</span>
                            <span className="text-2xl font-bold text-primary-600">
                                {formatPrice(subtotal)}
                            </span>
                        </div>

                        {/* Botón Checkout */}
                        <Button
                            onClick={handleCheckout}
                            className="w-full"
                            size="lg"
                        >
                            Finalizar Compra
                        </Button>

                        <p className="text-xs text-gray-500 text-center mt-3">
                            Los costos de envío se calcularán en el checkout
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};
