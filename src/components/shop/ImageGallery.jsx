import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Galería de imágenes para detalle de producto
 */
export const ImageGallery = ({ images = [], alt = 'Product' }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
            </div>
        );
    }

    const hasMultipleImages = images.length > 1;

    const goToPrevious = () => {
        setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Imagen Principal */}
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                <img
                    src={images[selectedImage]}
                    alt={`${alt} - ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                />

                {/* Botones de navegación */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Indicador de posición */}
                {hasMultipleImages && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={cn(
                                    'w-2 h-2 rounded-full transition-all',
                                    index === selectedImage
                                        ? 'bg-white w-6'
                                        : 'bg-white/50 hover:bg-white/75'
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Miniaturas */}
            {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                                'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                                index === selectedImage
                                    ? 'border-primary-600 ring-2 ring-primary-200'
                                    : 'border-gray-200 hover:border-gray-300'
                            )}
                        >
                            <img
                                src={image}
                                alt={`${alt} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
