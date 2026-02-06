import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * ImageUploader - Componente para subir imágenes a Supabase Storage
 * @param {string} value - URL de la imagen actual
 * @param {function} onChange - Callback cuando se sube una nueva imagen
 * @param {string} bucket - Nombre del bucket (default: 'product-images')
 * @param {string} folder - Carpeta dentro del bucket (default: 'variants')
 */
export const ImageUploader = ({ value, onChange, bucket = 'product-images', folder = 'variants' }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            return;
        }

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no debe superar 5MB');
            return;
        }

        try {
            setUploading(true);

            // Generar nombre único
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Subir a Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            setPreview(publicUrl);
            onChange(publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex items-center gap-3">
            {/* Preview */}
            <div className="relative w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-1 hover:bg-red-600 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </>
                ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
            </div>

            {/* Upload button */}
            <div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id={`image-upload-${Math.random()}`}
                />
                <label
                    htmlFor={`image-upload-${Math.random()}`}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Subiendo...' : preview ? 'Cambiar' : 'Subir'}
                </label>
            </div>
        </div>
    );
};
