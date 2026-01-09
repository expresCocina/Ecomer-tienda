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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Imagen */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
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
                            <Badge variant="offer">
                                -{discount}%
                            </Badge>
                        )}
                        {product.is_featured && (
                            <Badge variant="new">
                                Nuevo
                            </Badge>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                            <Badge variant="warning">
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
                <div className="p-4">
                    {/* Categoría */}
                    {product.categories && (
                        <p className="text-xs text-gray-500 mb-1">
                            {product.categories.name}
                        </p>
                    )}

                    {/* Nombre */}
                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                            ({product.rating || 0})
                        </span>
                    </div>

                    {/* Precio */}
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-primary-600">
                            {formatPrice(finalPrice)}
                        </span>
                        {hasOffer && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>

                    {/* Botón Agregar al Carrito */}
                    <Button
                        onClick={handleAddToCart}
                        className="w-full"
                        disabled={product.stock === 0}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                    </Button>
                </div>
            </div>
        </Link>
    );
};
