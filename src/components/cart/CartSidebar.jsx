import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore, selectTotalItems, selectSubtotal } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';
import { CartItem } from './CartItem';
import { Button } from '../ui/Button';

/**
 * Sidebar del carrito de compras - Tema oscuro/dorado
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
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
                onClick={closeCart}
            />

            {/* Sidebar - Tema oscuro/dorado */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-gradient-to-b from-primary-900 to-primary-950 shadow-2xl shadow-gold-500/20 z-50 flex flex-col animate-slide-in border-l-2 border-gold-500/30">
                {/* Header */}
                <div className="flex items-center justify-between mobile-padding py-4 sm:py-5 border-b-2 border-gold-500/20">
                    <h2 className="text-mobile-xl font-bold text-gold-400">
                        Carrito ({totalItems})
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 sm:p-2.5 rounded-xl hover:bg-gold-500/10 active:bg-gold-500/20 transition-all duration-200 touch-target tap-highlight-none"
                        aria-label="Cerrar carrito"
                    >
                        <X className="w-6 h-6 text-gold-400 hover:text-gold-300" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto mobile-padding scrollbar-hide">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gold-500/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gold-400" />
                            </div>
                            <h3 className="text-mobile-lg font-semibold text-gold-400 mb-2">
                                Tu carrito está vacío
                            </h3>
                            <p className="text-mobile-sm text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                                Agrega productos para comenzar tu compra
                            </p>
                            <Button
                                onClick={closeCart}
                                className="btn-mobile bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-primary-900 font-semibold border-2 border-gold-400"
                            >
                                Ir a la tienda
                            </Button>
                        </div>
                    ) : (
                        <div className="py-4 sm:py-5 space-y-3 sm:space-y-4">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con totales */}
                {items.length > 0 && (
                    <div className="border-t-2 border-gold-500/20 mobile-padding py-4 sm:py-5 bg-primary-950/50 backdrop-blur-sm">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between mb-4 sm:mb-5">
                            <span className="text-mobile-lg font-semibold text-gold-400">Subtotal</span>
                            <span className="text-mobile-2xl font-bold text-gold-500">
                                {formatPrice(subtotal)}
                            </span>
                        </div>

                        {/* Botón Checkout */}
                        <Button
                            onClick={handleCheckout}
                            className="w-full btn-mobile bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 active:from-gold-700 active:to-gold-800 text-primary-900 font-bold border-2 border-gold-400 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50"
                            size="lg"
                        >
                            Finalizar Compra
                        </Button>

                        <p className="text-xs sm:text-sm text-gray-400 text-center mt-3 leading-relaxed">
                            Los costos de envío se calcularán en el checkout
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};
