import { Link } from 'react-router-dom';
import { ShoppingCart, Tag, Star } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

/**
 * Card de producto para el catálogo - Optimizado para móvil
 */
export const ProductCard = ({ product }) => {
    const { addItem, openCart } = useCartStore();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addItem(product);
        openCart();
    };

    const discount = calculateDiscount(product.price, product.offer_price);
    const finalPrice = product.offer_price || product.price;
    const hasOffer = product.is_offer && product.offer_price;

    return (
        <Link
            to={`/producto/${product.id}`}
            className="group block tap-highlight-none"
        >
            <div className="relative bg-white rounded-xl shadow-mobile overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-br before:from-gold-400 before:via-gold-500 before:to-gold-600 before:-z-10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 h-[400px] sm:h-[420px]">
                <div className="relative bg-white rounded-xl overflow-hidden h-full flex flex-col">
                    {/* Imagen */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
                            </div>
                        )}

                        {/* Badges - Optimizados para móvil */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
                            {hasOffer && (
                                <Badge variant="offer" className="bg-gradient-to-r from-gold-500 to-gold-600 text-primary-900 border-gold-400 text-xs sm:text-sm px-2 py-1">
                                    -{discount}%
                                </Badge>
                            )}
                            {product.is_featured && (
                                <Badge variant="new" className="bg-primary-900 text-gold-400 border-gold-500 text-xs sm:text-sm px-2 py-1">
                                    Exclusivo
                                </Badge>
                            )}
                            {product.stock <= 5 && product.stock > 0 && (
                                <Badge variant="warning" className="bg-gold-600 text-white text-xs sm:text-sm px-2 py-1">
                                    ¡Últimas!
                                </Badge>
                            )}
                            {product.stock === 0 && (
                                <Badge variant="danger" className="text-xs sm:text-sm px-2 py-1">
                                    Agotado
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Contenido - Mejorado para móvil */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                        {/* Categoría */}
                        {product.categories && (
                            <p className="text-[10px] sm:text-xs text-gold-600 mb-1 font-semibold uppercase tracking-wider">
                                {product.categories.name}
                            </p>
                        )}

                        {/* Nombre - Más legible en móvil */}
                        <h3 className="font-display text-sm sm:text-base font-semibold text-primary-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors leading-snug">
                            {product.name}
                        </h3>

                        {/* Rating - Tamaño adaptativo */}
                        <div className="flex items-center gap-1 mb-2 sm:mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating || 0)
                                            ? 'text-gold-500 fill-gold-500'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                            <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                                ({product.rating || 0})
                            </span>
                        </div>

                        {/* Precio - Más prominente en móvil */}
                        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-grow">
                            <span className="text-lg sm:text-xl font-bold text-gold-600">
                                {formatPrice(finalPrice)}
                            </span>
                            {hasOffer && (
                                <span className="text-xs sm:text-sm text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Botón Agregar al Carrito - Tamaño táctil adecuado */}
                        <Button
                            onClick={handleAddToCart}
                            className="w-full text-sm sm:text-base py-2.5 sm:py-3 bg-primary-900 hover:bg-primary-800 active:bg-primary-700 text-gold-400 border-2 border-gold-500/30 hover:border-gold-500 transition-all duration-200 touch-target"
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.stock === 0 ? 'Agotado' : 'Agregar'}
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};
