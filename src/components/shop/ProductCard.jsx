import { Link } from 'react-router-dom';
import { ShoppingCart, Tag, Star } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

/**
 * Card de producto para el catálogo
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
            className="group block"
        >
            <div className="relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-br before:from-gold-400 before:via-gold-500 before:to-gold-600 before:-z-10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 h-[420px]">
                <div className="relative bg-white rounded-xl overflow-hidden h-full flex flex-col">
                    {/* Imagen */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-16 h-16 text-gray-300" />
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {hasOffer && (
                                <Badge variant="offer" className="bg-gradient-to-r from-gold-500 to-gold-600 text-primary-900 border-gold-400">
                                    -{discount}%
                                </Badge>
                            )}
                            {product.is_featured && (
                                <Badge variant="new" className="bg-primary-900 text-gold-400 border-gold-500">
                                    Exclusivo
                                </Badge>
                            )}
                            {product.stock <= 5 && product.stock > 0 && (
                                <Badge variant="warning" className="bg-gold-600 text-white">
                                    ¡Últimas unidades!
                                </Badge>
                            )}
                            {product.stock === 0 && (
                                <Badge variant="danger">
                                    Agotado
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-3 flex-1 flex flex-col">
                        {/* Categoría */}
                        {product.categories && (
                            <p className="text-[10px] text-gold-600 mb-1 font-semibold uppercase tracking-wider">
                                {product.categories.name}
                            </p>
                        )}

                        {/* Nombre */}
                        <h3 className="font-display text-sm font-semibold text-primary-900 mb-1.5 line-clamp-2 group-hover:text-gold-600 transition-colors">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.floor(product.rating || 0)
                                        ? 'text-gold-500 fill-gold-500'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))}
                            <span className="text-[10px] text-gray-500 ml-1">
                                ({product.rating || 0})
                            </span>
                        </div>

                        {/* Precio */}
                        <div className="flex items-baseline gap-1.5 mb-3 flex-grow">
                            <span className="text-xl font-bold text-gold-600">
                                {formatPrice(finalPrice)}
                            </span>
                            {hasOffer && (
                                <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Botón Agregar al Carrito */}
                        <Button
                            onClick={handleAddToCart}
                            className="w-full text-xs py-2 bg-primary-900 hover:bg-primary-800 text-gold-400 border-2 border-gold-500/30 hover:border-gold-500"
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart className="w-3 h-3 mr-1.5" />
                            {product.stock === 0 ? 'Agotado' : 'Agregar'}
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};
