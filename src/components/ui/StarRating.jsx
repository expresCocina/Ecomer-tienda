import { Star } from 'lucide-react';

/**
 * Componente de estrellas para calificación
 * @param {number} rating - Calificación actual (0-5)
 * @param {number} maxStars - Número máximo de estrellas (default: 5)
 * @param {function} onChange - Callback cuando cambia el rating (modo interactivo)
 * @param {boolean} interactive - Si las estrellas son clickeables
 * @param {string} size - Tamaño: 'sm', 'md', 'lg'
 */
export const StarRating = ({
    rating = 0,
    maxStars = 5,
    onChange,
    interactive = false,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const handleClick = (value) => {
        if (interactive && onChange) {
            onChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= rating;
                const isPartial = !isFilled && starValue - 0.5 <= rating;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(starValue)}
                        disabled={!interactive}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                    >
                        <Star
                            className={`${sizeClasses[size]} ${isFilled
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : isPartial
                                        ? 'fill-yellow-200 text-yellow-400'
                                        : 'fill-none text-gray-300'
                                }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};
