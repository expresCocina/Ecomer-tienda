import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, TrendingUp, ShoppingBag } from 'lucide-react';
import { getProducts } from '../../lib/supabase';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import { ProductCard } from '../../components/shop/ProductCard';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { TestimonialsSection } from '../../components/testimonials/TestimonialsSection';
import { SEO } from '../../components/seo/SEO';

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
            {/* SEO Meta Tags */}
            <SEO
                title="C&J Relojería - Relojes de Lujo Premium para Hombre en Colombia | Envío Gratis"
                description="🕐 Descubre la colección más exclusiva de relojes de lujo para hombre en Colombia. ✨ Elegancia premium, calidad garantizada y envío gratis. Compra ahora en C&J Relojería."
                keywords="relojes de lujo Colombia, relojes premium hombre, relojes elegantes, comprar relojes online, relojería Colombia, relojes suizos, relojes clásicos, relojes deportivos, relojes minimalistas"
                type="website"
            />
            {/* Hero Section - Optimizado para móvil */}
            <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
                <div className="container-mobile py-16 sm:py-20 md:py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
                        {/* Contenido Izquierda - Responsive */}
                        <div className="text-center lg:text-left">
                            <h1 className="font-display text-mobile-3xl font-bold mb-4 sm:mb-6 animate-fade-in-up text-shadow-lg leading-tight">
                                Elegancia <span className="text-gradient-gold">Atemporal</span> en tu Muñeca
                            </h1>
                            <p className="text-mobile-lg mb-6 sm:mb-8 text-gray-100 animate-slide-up leading-relaxed font-medium">
                                Descubre nuestra exclusiva colección de relojes para hombre. Precisión, estilo y distinción.
                            </p>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 animate-slide-up justify-center lg:justify-start">
                                <Link to="/tienda" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full sm:w-auto btn-mobile bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-primary-900 font-semibold border-2 border-gold-400 tap-highlight-none">
                                        Ver Colección
                                        <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                    </Button>
                                </Link>
                                <Link to="/ofertas" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto btn-mobile bg-white/10 border-2 border-gold-500 text-gold-400 hover:bg-gold-500/20 hover:text-gold-300 active:bg-gold-500/30 tap-highlight-none">
                                        <Tag className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                                        Ofertas Exclusivas
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Carrusel de Productos */}
                        <div className="relative h-[450px] lg:h-[500px] mt-8 lg:mt-0">
                            {featuredProducts.slice(0, 3).map((product, index) => {
                                const discount = calculateDiscount(product.price, product.offer_price);
                                const hasOffer = product.is_offer && product.offer_price && product.offer_price < product.price;
                                const finalPrice = hasOffer ? product.offer_price : product.price;

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
                                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 lg:p-8 shadow-2xl h-full flex flex-col border-2 border-gold-500/20">
                                            <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden mb-4 lg:mb-6 relative group">
                                                <img
                                                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {hasOffer && (
                                                    <div className="absolute top-3 right-3 lg:top-4 lg:right-4 bg-gradient-to-r from-gold-500 to-gold-600 text-primary-900 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-sm lg:text-base font-bold shadow-lg">
                                                        -{discount}%
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-display text-xl lg:text-2xl font-bold mb-2 lg:mb-3 text-primary-900 line-clamp-2">{product.name}</h3>
                                            <div className="flex items-baseline gap-2 lg:gap-3 mb-4 lg:mb-6">
                                                <span className="text-3xl lg:text-4xl font-bold text-gold-600">
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
                                                    className="w-full group bg-primary-900 hover:bg-primary-800 text-gold-400 border-2 border-gold-500/30"
                                                >
                                                    Ver Detalles
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
                                                ? 'bg-gold-500 w-8'
                                                : 'bg-gold-500/40 hover:bg-gold-500/60 w-2'
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
                        <defs>
                            {/* Gradiente dorado principal */}
                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#d4af37', stopOpacity: 0.9 }} />
                                <stop offset="25%" style={{ stopColor: '#f4e5c2', stopOpacity: 0.95 }} />
                                <stop offset="50%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                                <stop offset="75%" style={{ stopColor: '#f4e5c2', stopOpacity: 0.95 }} />
                                <stop offset="100%" style={{ stopColor: '#d4af37', stopOpacity: 0.9 }} />
                            </linearGradient>

                            {/* Gradiente de textura */}
                            <linearGradient id="textureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 0.3 }} />
                                <stop offset="50%" style={{ stopColor: '#262626', stopOpacity: 0.1 }} />
                                <stop offset="100%" style={{ stopColor: '#1a1a1a', stopOpacity: 0.3 }} />
                            </linearGradient>

                            {/* Filtro de textura granulada */}
                            <filter id="noiseFilter">
                                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
                                <feColorMatrix type="saturate" values="0" />
                                <feComponentTransfer>
                                    <feFuncA type="discrete" tableValues="0 0 0 0 1" />
                                </feComponentTransfer>
                                <feBlend mode="overlay" in="SourceGraphic" />
                            </filter>
                        </defs>

                        {/* Capa base con gradiente dorado */}
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="url(#goldGradient)"
                            opacity="0.15" />

                        {/* Capa de textura oscura */}
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="url(#textureGradient)" />

                        {/* Capa de brillo dorado sutil */}
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="url(#goldGradient)"
                            opacity="0.08"
                            filter="url(#noiseFilter)" />
                    </svg>
                </div>
            </section>

            {/* Productos Destacados */}
            <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                                Relojes Destacados
                            </h2>
                            <p className="text-gray-300">Los modelos más exclusivos de nuestra colección</p>
                        </div>
                        <Link to="/tienda" className="hidden sm:block">
                            <Button variant="ghost" className="text-gold-400 hover:text-gold-300 hover:bg-gold-500/10">
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
                        <div className="relative group">
                            {/* Carrusel horizontal */}
                            <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                                {featuredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex-shrink-0 w-[240px] snap-start"
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            {/* Gradient overlays para indicar scroll */}
                            <div className="hidden sm:block absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-primary-900 to-transparent pointer-events-none"></div>
                            <div className="hidden sm:block absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-primary-900 to-transparent pointer-events-none"></div>
                        </div>
                    )}

                    {/* Link "Ver todos" para móvil */}
                    <div className="sm:hidden mt-6 text-center">
                        <Link to="/tienda">
                            <Button variant="outline" className="w-full">
                                Ver todos los productos
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Ofertas Especiales */}
            <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-400 mb-2 flex items-center">
                                <Tag className="w-8 h-8 md:w-10 md:h-10 text-gold-400 mr-3" />
                                Ofertas Exclusivas
                            </h2>
                            <p className="text-gray-300">Elegancia premium a precios excepcionales</p>
                        </div>
                        <Link to="/ofertas" className="hidden sm:block">
                            <Button variant="ghost" className="text-gold-400 hover:text-gold-300 hover:bg-gold-500/10">
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
                        <div className="relative group">
                            {/* Carrusel horizontal */}
                            <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                                {specialOffers.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex-shrink-0 w-[240px] snap-start"
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            {/* Gradient overlays para indicar scroll */}
                            <div className="hidden sm:block absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-primary-900 to-transparent pointer-events-none"></div>
                            <div className="hidden sm:block absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-primary-900 to-transparent pointer-events-none"></div>
                        </div>
                    )}

                    {/* Link "Ver todas" para móvil */}
                    <div className="sm:hidden mt-6 text-center">
                        <Link to="/ofertas">
                            <Button variant="outline" className="w-full bg-primary-800/50 border-gold-500/30 text-gold-400 hover:bg-primary-800 hover:border-gold-500">
                                Ver todas las ofertas
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonios de Clientes */}
            <TestimonialsSection />

            {/* Banner Informativo */}
            <InfoBanner />
        </div>
    );
};
