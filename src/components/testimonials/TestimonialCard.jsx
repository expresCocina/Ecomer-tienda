import { Star } from 'lucide-react';

/**
 * Tarjeta individual de testimonio
 */
export const TestimonialCard = ({ testimonial }) => {
    const { name, location, rating, comment, product, initials } = testimonial;

    return (
        <div className="bg-primary-800/50 rounded-xl shadow-lg border-2 border-gold-500/20 p-6 hover:border-gold-500/40 transition-all duration-300 h-full flex flex-col">
            {/* Header con avatar y nombre */}
            <div className="flex items-center gap-4 mb-4">
                {/* Avatar con iniciales */}
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/20">
                    <span className="text-primary-900 font-bold text-sm">
                        {initials}
                    </span>
                </div>

                {/* Nombre y ubicación */}
                <div className="flex-1">
                    <h4 className="font-semibold text-gold-400">{name}</h4>
                    <p className="text-xs text-gray-400">{location}</p>
                </div>
            </div>

            {/* Estrellas */}
            <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating
                                ? 'fill-gold-400 text-gold-400'
                                : 'text-gray-600'
                            }`}
                    />
                ))}
            </div>

            {/* Comentario */}
            <p className="text-gray-300 text-sm leading-relaxed mb-3 flex-1">
                "{comment}"
            </p>

            {/* Producto mencionado (si aplica) */}
            {product && (
                <p className="text-xs text-gold-400/70 italic">
                    Producto: {product}
                </p>
            )}
        </div>
    );
};
