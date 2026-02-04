import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TestimonialCard } from './TestimonialCard';

/**
 * Datos de testimonios (hardcoded)
 */
const TESTIMONIALS = [
    {
        id: 1,
        name: 'Carlos Mendoza',
        location: 'Bogotá, Colombia',
        rating: 5,
        comment: 'Excelente servicio y productos de alta calidad. Mi reloj llegó en perfectas condiciones y justo como lo esperaba. Totalmente recomendado.',
        product: 'Reloj Clásico Elegante',
        initials: 'CM'
    },
    {
        id: 2,
        name: 'María Rodríguez',
        location: 'Medellín, Colombia',
        rating: 5,
        comment: 'Quedé encantada con mi compra. El reloj es hermoso y la atención al cliente fue excepcional. Sin duda volveré a comprar aquí.',
        product: 'Reloj Deportivo Premium',
        initials: 'MR'
    },
    {
        id: 3,
        name: 'Andrés López',
        location: 'Cali, Colombia',
        rating: 5,
        comment: 'La mejor relojería online que he encontrado. Precios justos, envío rápido y productos auténticos. ¡Muy satisfecho!',
        product: 'Reloj Minimalista',
        initials: 'AL'
    },
    {
        id: 4,
        name: 'Laura Gómez',
        location: 'Barranquilla, Colombia',
        rating: 4,
        comment: 'Muy buena experiencia de compra. El reloj es tal cual las fotos y llegó antes de lo esperado. Recomendado 100%.',
        product: 'Reloj Femenino Dorado',
        initials: 'LG'
    },
    {
        id: 5,
        name: 'Jorge Martínez',
        location: 'Cartagena, Colombia',
        rating: 5,
        comment: 'Compré un reloj como regalo y fue todo un éxito. Excelente calidad y presentación. El servicio al cliente es de primera.',
        initials: 'JM'
    },
    {
        id: 6,
        name: 'Diana Torres',
        location: 'Bucaramanga, Colombia',
        rating: 5,
        comment: 'Me encantó mi reloj! Es elegante, funcional y de muy buena calidad. La entrega fue rápida y el empaque impecable.',
        product: 'Reloj Ejecutivo',
        initials: 'DT'
    },
    {
        id: 7,
        name: 'Felipe Ramírez',
        location: 'Pereira, Colombia',
        rating: 4,
        comment: 'Gran variedad de relojes y excelentes precios. El proceso de compra fue muy fácil y la atención por WhatsApp fue rápida.',
        initials: 'FR'
    },
    {
        id: 8,
        name: 'Valentina Castro',
        location: 'Manizales, Colombia',
        rating: 5,
        comment: 'Súper recomendados! Mi reloj es precioso y la calidad es excepcional. Definitivamente volveré a comprar.',
        product: 'Reloj Casual Moderno',
        initials: 'VC'
    },
    {
        id: 9,
        name: 'Santiago Herrera',
        location: 'Cúcuta, Colombia',
        rating: 5,
        comment: 'Excelente relación calidad-precio. El reloj superó mis expectativas y el servicio postventa es muy bueno.',
        initials: 'SH'
    },
    {
        id: 10,
        name: 'Camila Vargas',
        location: 'Santa Marta, Colombia',
        rating: 5,
        comment: 'Estoy feliz con mi compra! El reloj es hermoso y llegó muy bien empacado. La atención fue personalizada y profesional.',
        product: 'Reloj Vintage',
        initials: 'CV'
    }
];

/**
 * Sección de testimonios con carrusel
 */
export const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);

    // Responsive: ajustar items por vista
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, TESTIMONIALS.length - itemsPerView);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    const visibleTestimonials = TESTIMONIALS.slice(
        currentIndex,
        currentIndex + itemsPerView
    );

    return (
        <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Quote className="w-8 h-8 text-gold-400" />
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-400">
                            Lo que Dicen Nuestros Clientes
                        </h2>
                        <Quote className="w-8 h-8 text-gold-400 transform rotate-180" />
                    </div>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        La satisfacción de nuestros clientes es nuestra mayor recompensa
                    </p>
                </div>

                {/* Carrusel */}
                <div className="relative">
                    {/* Testimonios */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {visibleTestimonials.map((testimonial) => (
                            <TestimonialCard
                                key={testimonial.id}
                                testimonial={testimonial}
                            />
                        ))}
                    </div>

                    {/* Navegación */}
                    {TESTIMONIALS.length > itemsPerView && (
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform shadow-lg shadow-gold-500/20"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-5 h-5 text-primary-900" />
                            </button>

                            {/* Indicadores */}
                            <div className="flex gap-2">
                                {[...Array(maxIndex + 1)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                                                ? 'bg-gold-400 w-8'
                                                : 'bg-gray-600 hover:bg-gray-500'
                                            }`}
                                        aria-label={`Ir a página ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentIndex === maxIndex}
                                className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform shadow-lg shadow-gold-500/20"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="w-5 h-5 text-primary-900" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
