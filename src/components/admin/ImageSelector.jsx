import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Check } from 'lucide-react';
import { ImageUploader } from '../ui/ImageUploader';

/**
 * ImageSelector - Selector de imágenes con galería
 * Permite seleccionar una imagen de la galería del producto o subir una nueva
 */
export const ImageSelector = ({
    availableImages = [],
    value = '',
    onChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowUploader(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectImage = (imageUrl) => {
        onChange(imageUrl);
        setIsOpen(false);
    };

    const handleUploadComplete = (url) => {
        onChange(url);
        setShowUploader(false);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Preview actual */}
            <div className="flex items-center gap-2">
                {value ? (
                    <div className="relative group">
                        <img
                            src={value}
                            alt="Imagen variante"
                            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                        >
                            <ImageIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gold-500 hover:bg-gold-50 transition-all"
                    >
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Dropdown con galería */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
                    {!showUploader ? (
                        <>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                Seleccionar Imagen
                            </h4>

                            {/* Galería de imágenes disponibles */}
                            {availableImages.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 mb-3 max-h-60 overflow-y-auto">
                                    {availableImages.map((img, index) => {
                                        const imageUrl = typeof img === 'string' ? img : (img.url || URL.createObjectURL(img));
                                        const isSelected = imageUrl === value;

                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleSelectImage(imageUrl)}
                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${isSelected
                                                        ? 'border-gold-500 ring-2 ring-gold-500/50'
                                                        : 'border-gray-200 hover:border-gold-400'
                                                    }`}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={`Opción ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-gold-500/20 flex items-center justify-center">
                                                        <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No hay imágenes disponibles
                                </p>
                            )}

                            {/* Botón subir nueva */}
                            <button
                                type="button"
                                onClick={() => setShowUploader(true)}
                                className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gold-500 hover:text-gold-600 hover:bg-gold-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Subir Nueva Imagen
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Subir Nueva Imagen
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => setShowUploader(false)}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Cancelar
                                </button>
                            </div>
                            <ImageUploader
                                value={value}
                                onChange={handleUploadComplete}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
