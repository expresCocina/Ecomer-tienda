import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, TrendingUp, ShoppingBag } from 'lucide-react';
import { getProducts } from '../../lib/supabase';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import { ProductCard } from '../../components/shop/ProductCard';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { InfoBanner } from '../../components/ui/InfoBanner';

/**
 * Página de inicio / Landing
 */
export const Landing = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [specialOffers, setSpecialOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        loadProducts();
    }, []);

    // Auto-rotate carousel
    useEffect(() => {
        if (featuredProducts.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.min(featuredProducts.length, 3));
        }, 4000); // Cambia cada 4 segundos

        return () => clearInterval(timer);
    }, [featuredProducts]);

    const loadProducts = async () => {
        try {
            setLoading(true);

            // Obtener productos para el carrusel
            const carousel = await getProducts({ showInCarousel: true });
            setFeaturedProducts(carousel.slice(0, 4));

            // Obtener productos en oferta
            const offers = await getProducts({ isOffer: true });
            setSpecialOffers(offers.slice(0, 4));
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Contenido Izquierda */}
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up text-shadow-lg">
                                Encuentra los <span className="text-gradient-gold">Mejores Productos</span>
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
                                Calidad excepcional, precios increíbles. Todo lo que necesitas en un solo lugar.
                            </p>
                            <div className="flex flex-wrap gap-4 animate-slide-up">
                                <Link to="/tienda">
                                    <Button size="lg" variant="secondary">
                                        Ver Catálogo
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/ofertas">
                                    <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                                        <Tag className="mr-2 w-5 h-5" />
                                        Ver Ofertas
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Carrusel de Productos */}
                        <div className="relative h-[450px] lg:h-[500px] mt-8 lg:mt-0">
                            {featuredProducts.slice(0, 3).map((product, index) => {
                                const discount = calculateDiscount(product.price, product.sale_price);
                                const hasOffer = product.is_offer && product.sale_price < product.price;
                                const finalPrice = hasOffer ? product.sale_price : product.price;

                                return (
                                    <div
                                        key={product.id}
                                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                                                ? 'opacity-100 translate-x-0 scale-100'
                                                : index < currentSlide
                                                    ? 'opacity-0 -translate-x-full scale-95'
                                                    : 'opacity-0 translate-x-full scale-95'
                                            }`}
                                    >
                                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-2xl h-full flex flex-col">
                                            <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden mb-4 lg:mb-6 relative group">
                                                <img
                                                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {hasOffer && (
                                                    <div className="absolute top-3 right-3 lg:top-4 lg:right-4 bg-red-500 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-sm lg:text-base font-bold shadow-lg">
                                                        -{discount}%
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-3 text-gray-900 line-clamp-2">{product.name}</h3>
                                            <div className="flex items-baseline gap-2 lg:gap-3 mb-4 lg:mb-6">
                                                <span className="text-3xl lg:text-4xl font-bold text-primary-600">
                                                    {formatPrice(finalPrice)}
                                                </span>
                                                {hasOffer && (
                                                    <span className="text-lg lg:text-xl text-gray-500 line-through">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <Link to={`/producto/${product.id}`}>
                                                <Button
                                                    size="lg"
                                                    className="w-full group"
                                                >
                                                    Ver Producto
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Indicadores */}
                            {featuredProducts.length > 0 && (
                                <div className="absolute -bottom-6 lg:-bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                                    {featuredProducts.slice(0, 3).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`h-2 rounded-full transition-all ${index === currentSlide
                                                    ? 'bg-white w-8'
                                                    : 'bg-white/40 hover:bg-white/60 w-2'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decoración */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Productos Destacados */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Productos Destacados
                            </h2>
                            <p className="text-gray-600">Los más populares de nuestra tienda</p>
                        </div>
                        <Link to="/tienda">
                            <Button variant="ghost">
                                Ver todos
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Ofertas Especiales */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                                <Tag className="w-8 h-8 text-red-500 mr-3" />
                                Ofertas Especiales
                            </h2>
                            <p className="text-gray-600">¡No te pierdas estas increíbles ofertas!</p>
                        </div>
                        <Link to="/ofertas">
                            <Button variant="ghost">
                                Ver todas
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {specialOffers.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Banner Informativo */}
            <InfoBanner />
        </div>
    );
};
