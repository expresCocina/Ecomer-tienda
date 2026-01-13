import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Tag, Info, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../../lib/supabase';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { ImageGallery } from '../../components/shop/ImageGallery';
import { QuantitySelector } from '../../components/shop/QuantitySelector';
import { VariantSelector } from '../../components/shop/VariantSelector';
import { ProductCard } from '../../components/shop/ProductCard';
import { ReviewSection } from '../../components/reviews/ReviewSection';
import { StarRating } from '../../components/ui/StarRating';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardBody } from '../../components/ui/Card';
import { trackViewContent } from '../../lib/fbPixel';
import { capiViewContent } from '../../lib/fbCapi';

/**
 * Página de detalle de producto
 */
export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [calculatingShipping, setCalculatingShipping] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState({});
    const { addItem, openCart } = useCartStore();

    useEffect(() => {
        loadProduct();

        // Simular cálculo de envío (2 segundos)
        const timer = setTimeout(() => {
            setCalculatingShipping(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [id]);

    // Efecto para mostrar/ocultar barra sticky en móvil
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowStickyBar(true);
            } else {
                setShowStickyBar(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const detectUserCity = async () => {
        try {
            setLoadingCity(true);

            // Primero verificar si hay una ciudad guardada manualmente
            const savedCity = localStorage.getItem('userCity');
            if (savedCity) {
                setUserCity(savedCity);
                setLoadingCity(false);
                return;
            }

            // Si no hay ciudad guardada, detectar por IP
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            setUserCity(data.city || 'Colombia');
        } catch (error) {
            console.error('Error detecting city:', error);
            setUserCity('Colombia');
        } finally {
            setLoadingCity(false);
        }
    };

    const changeCity = () => {
        const colombianCities = [
            'Neiva', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla',
            'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales',
            'Santa Marta', 'Cúcuta', 'Ibagué', 'Pasto', 'Villavicencio',
            'Armenia', 'Popayán', 'Montería', 'Valledupar', 'Tunja'
        ];

        const cityList = colombianCities.join('\n');
        const newCity = prompt(
            `Tu ciudad actual: ${userCity}\n\nCiudades disponibles:\n${cityList}\n\nEscribe tu ciudad:`
        );

        if (newCity && newCity.trim()) {
            const selectedCity = newCity.trim();
            setUserCity(selectedCity);
            localStorage.setItem('userCity', selectedCity);
        }
    };

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await getProductById(id);
            setProduct(data);

            // Track ViewContent event (Pixel + CAPI)
            if (data) {
                const eventId = trackViewContent(data);
                capiViewContent(data, eventId);
            }

            // Cargar productos relacionados
            if (data?.category_id) {
                loadRelatedProducts(data.id, data.category_id);
            }
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRelatedProducts = async (productId, categoryId) => {
        try {
            setLoadingRelated(true);
            const data = await getRelatedProducts(productId, categoryId, 4);
            setRelatedProducts(data);
        } catch (error) {
            console.error('Error loading related products:', error);
        } finally {
            setLoadingRelated(false);
        }
    };

    const handleAddToCart = () => {
        // Validar si el producto tiene variantes y si están seleccionadas
        if (product.variants && Object.keys(product.variants).length > 0) {
            // Mapear tipos de variantes (plural) a claves de selección (singular)
            const variantTypeMap = {
                'sizes': 'size',
                'colors': 'color',
                'materials': 'material',
                'styles': 'style'
            };

            const requiredVariants = Object.keys(product.variants);
            const missingVariants = requiredVariants.filter(type => {
                const selectionKey = variantTypeMap[type] || type;
                return !selectedVariants[selectionKey];
            });

            if (missingVariants.length > 0) {
                // Convertir nombres técnicos a nombres amigables
                const friendlyNames = missingVariants.map(type => {
                    const names = {
                        'sizes': 'talla',
                        'colors': 'color',
                        'materials': 'material',
                        'styles': 'estilo'
                    };
                    return names[type] || type;
                });
                alert(`Por favor selecciona: ${friendlyNames.join(', ')}`);
                return;
            }
        }

        addItem(product, quantity, selectedVariants);
        openCart();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Producto no encontrado
                    </h2>
                    <Link to="/tienda">
                        <Button>Volver a la tienda</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const discount = calculateDiscount(product.price, product.offer_price);
    const finalPrice = product.offer_price || product.price;
    const hasOffer = product.is_offer && product.offer_price;
    const inStock = product.stock > 0;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 md:pt-28 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Galería de imágenes */}
                    <div>
                        <ImageGallery images={product.images} alt={product.name} />
                    </div>

                    {/* Información del producto */}
                    <div>
                        {/* Categoría y badges */}
                        <div className="flex items-center gap-2 mb-3">
                            {product.categories && (
                                <span className="text-sm text-gray-500">
                                    {product.categories.name}
                                </span>
                            )}
                            {hasOffer && (
                                <Badge variant="offer">
                                    -{discount}% OFF
                                </Badge>
                            )}
                            {product.is_featured && (
                                <Badge variant="new">
                                    Nuevo
                                </Badge>
                            )}
                        </div>

                        {/* Nombre */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <StarRating rating={product.rating || 0} size="md" />
                            <span className="text-sm text-gray-600">
                                ({product.rating || 0} estrellas)
                            </span>
                        </div>

                        {/* Precio */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-primary-600">
                                    {formatPrice(finalPrice)}
                                </span>
                                {hasOffer && (
                                    <span className="text-xl text-gray-400 line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>
                            {hasOffer && (
                                <p className="text-green-600 font-medium mt-2">
                                    ¡Ahorras {formatPrice(product.price - finalPrice)}!
                                </p>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="mb-6">
                            {inStock ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <Package className="w-5 h-5" />
                                    <span className="font-medium">
                                        {product.stock > 10
                                            ? 'En stock'
                                            : `Últimas ${product.stock} unidades`}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600">
                                    <Package className="w-5 h-5" />
                                    <span className="font-medium">Agotado</span>
                                </div>
                            )}
                        </div>

                        {/* Descripción */}
                        {product.description && (
                            <Card className="mb-6">
                                <CardBody>
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div className="w-full">
                                            <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                                            <div className="relative">
                                                <p className={`text-gray-600 whitespace-pre-line transition-all duration-300 ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                                                    {product.description}
                                                </p>
                                                {product.description.length > 150 && (
                                                    <button
                                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                                        className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline focus:outline-none flex items-center transition-colors"
                                                    >
                                                        {isDescriptionExpanded ? 'Leer menos' : 'Leer más...'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <Badge key={index} variant="default">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Selector de Variantes */}
                        {product.variants && Object.keys(product.variants).length > 0 && (
                            <div className="mb-6">
                                <VariantSelector
                                    variants={product.variants}
                                    selected={selectedVariants}
                                    onChange={setSelectedVariants}
                                />
                            </div>
                        )}

                        {/* Selector de cantidad */}
                        {inStock && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cantidad
                                </label>
                                <QuantitySelector
                                    quantity={quantity}
                                    onQuantityChange={setQuantity}
                                    max={Math.min(product.stock, 99)}
                                />
                            </div>
                        )}

                        {/* Botón agregar al carrito */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="w-full"
                                size="lg"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {inStock ? 'Agregar al Carrito' : 'Agotado'}
                            </Button>

                            {/* Mensaje de envío */}
                            {calculatingShipping ? (
                                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <MapPin className="w-5 h-5 text-gray-600 animate-pulse" />
                                        <p className="text-sm font-medium text-gray-700">
                                            Calculando envío a tu ciudad...
                                        </p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-progress"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg animate-slide-up">
                                    <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-green-900">
                                            🎉 ¡Felicidades! Tienes envío gratis
                                        </p>
                                        <p className="text-xs text-green-700">
                                            Recibe en 2-5 días hábiles
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Compartir en Redes Sociales */}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 font-medium">Compartir:</span>
                                    <div className="flex gap-2">
                                        {/* WhatsApp */}
                                        <button
                                            onClick={() => {
                                                const url = window.location.href;
                                                const text = `¡Mira este producto! ${product.name} - ${formatPrice(finalPrice)}`;
                                                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                                            }}
                                            className="flex items-center justify-center w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                                            title="Compartir en WhatsApp"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                        </button>

                                        {/* Facebook */}
                                        <button
                                            onClick={() => {
                                                const url = window.location.href;
                                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                                            }}
                                            className="flex items-center justify-center w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                                            title="Compartir en Facebook"
                                        >
                                            <Facebook className="w-4 h-4" />
                                        </button>

                                        {/* Instagram - Copiar link */}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                alert('¡Link copiado! Pégalo en Instagram');
                                            }}
                                            className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                                            title="Copiar link para Instagram"
                                        >
                                            <Instagram className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de reseñas */}
                <ReviewSection productId={product.id} />

                {/* Productos Relacionados */}
                {relatedProducts.length > 0 && (
                    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                    También te puede interesar
                                </h2>
                                <p className="text-gray-600">
                                    Productos similares que podrían gustarte
                                </p>
                            </div>

                            {loadingRelated ? (
                                <div className="flex justify-center py-12">
                                    <Spinner size="lg" />
                                </div>
                            ) : (
                                <div className="relative group">
                                    {/* Carrusel horizontal */}
                                    <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                                        {relatedProducts.map((relatedProduct) => (
                                            <div
                                                key={relatedProduct.id}
                                                className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
                                            >
                                                <ProductCard product={relatedProduct} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Gradient overlays para indicar scroll */}
                                    <div className="hidden sm:block absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-blue-50 to-transparent pointer-events-none"></div>
                                    <div className="hidden sm:block absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-indigo-50 to-transparent pointer-events-none"></div>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {/* Barra Sticky Flotante para Móvil */}
            {product && inStock && (
                <div
                    className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl transition-transform duration-300 z-50 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'
                        }`}
                >
                    <div className="px-4 py-3">
                        <div className="flex items-center gap-3">
                            {/* Precio compacto */}
                            <div className="flex-shrink-0">
                                <p className="text-xs text-gray-500">Precio</p>
                                <p className="text-lg font-bold text-primary-600">
                                    {formatPrice(finalPrice)}
                                </p>
                            </div>

                            {/* Selector de cantidad compacto */}
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-gray-600 hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
                                >
                                    <span className="text-lg font-semibold">−</span>
                                </button>
                                <span className="w-8 text-center font-semibold text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(Math.min(product.stock, 99), quantity + 1))}
                                    className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-gray-600 hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
                                >
                                    <span className="text-lg font-semibold">+</span>
                                </button>
                            </div>

                            {/* Botón agregar al carrito */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span className="text-sm">Agregar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
