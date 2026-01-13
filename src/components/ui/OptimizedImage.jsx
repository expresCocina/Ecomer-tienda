import { useState } from 'react';

/**
 * OptimizedImage - Componente de imagen optimizado con lazy loading
 */
export const OptimizedImage = ({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    if (hasError) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                style={{ width, height }}
            >
                <span className="text-gray-400 text-sm">Sin imagen</span>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden" style={{ width, height }}>
            {/* Blur placeholder */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse"
                    style={{ width, height }}
                />
            )}

            {/* Actual image */}
            <img
                src={src}
                alt={alt}
                className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                width={width}
                height={height}
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        </div>
    );
};
