import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

/**
 * VariantEditor - Editor de variantes para el formulario de productos (Admin)
 * @param {Object} variants - Variantes actuales { sizes: [...], colors: [...] }
 * @param {Function} onChange - Callback cuando cambian las variantes
 */
export const VariantEditor = ({ variants = {}, onChange }) => {
    const [newVariantType, setNewVariantType] = useState('');
    const [newOptionValue, setNewOptionValue] = useState({});

    const variantTypeLabels = {
        sizes: 'Tallas',
        colors: 'Colores',
        materials: 'Materiales',
        styles: 'Estilos',
    };

    const handleAddVariantType = () => {
        if (!newVariantType.trim()) return;

        const type = newVariantType.trim().toLowerCase();
        if (variants[type]) {
            alert('Este tipo de variante ya existe');
            return;
        }

        onChange({
            ...variants,
            [type]: []
        });
        setNewVariantType('');
    };

    const handleRemoveVariantType = (type) => {
        const newVariants = { ...variants };
        delete newVariants[type];
        onChange(newVariants);
    };

    const handleAddOption = (type) => {
        const value = newOptionValue[type]?.trim();
        if (!value) return;

        const currentOptions = variants[type] || [];
        if (currentOptions.includes(value)) {
            alert('Esta opción ya existe');
            return;
        }

        onChange({
            ...variants,
            [type]: [...currentOptions, value]
        });

        setNewOptionValue({ ...newOptionValue, [type]: '' });
    };

    const handleRemoveOption = (type, option) => {
        onChange({
            ...variants,
            [type]: variants[type].filter(o => o !== option)
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    Variantes del Producto
                </label>
            </div>

            {/* Variantes existentes */}
            <div className="space-y-4">
                {Object.entries(variants).map(([type, options]) => (
                    <div key={type} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 capitalize">
                                {variantTypeLabels[type] || type}
                            </h4>
                            <button
                                type="button"
                                onClick={() => handleRemoveVariantType(type)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Opciones existentes */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {options.map((option, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                                >
                                    {option}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOption(type, option)}
                                        className="hover:text-primary-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Agregar nueva opción */}
                        <div className="flex gap-2">
                            <Input
                                placeholder={`Agregar ${variantTypeLabels[type] || type}...`}
                                value={newOptionValue[type] || ''}
                                onChange={(e) => setNewOptionValue({
                                    ...newOptionValue,
                                    [type]: e.target.value
                                })}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddOption(type);
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                onClick={() => handleAddOption(type)}
                                size="sm"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Agregar nuevo tipo de variante */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agregar Tipo de Variante
                </label>
                <div className="flex gap-2">
                    <select
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={newVariantType}
                        onChange={(e) => setNewVariantType(e.target.value)}
                    >
                        <option value="">Seleccionar tipo...</option>
                        {!variants.sizes && <option value="sizes">Tallas</option>}
                        {!variants.colors && <option value="colors">Colores</option>}
                        {!variants.materials && <option value="materials">Materiales</option>}
                        {!variants.styles && <option value="styles">Estilos</option>}
                        <option value="custom">Personalizado...</option>
                    </select>
                    <Button
                        type="button"
                        onClick={handleAddVariantType}
                        disabled={!newVariantType}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar
                    </Button>
                </div>
                {newVariantType === 'custom' && (
                    <Input
                        className="mt-2"
                        placeholder="Nombre del tipo (ej: acabado, tamaño)"
                        value={newVariantType === 'custom' ? '' : newVariantType}
                        onChange={(e) => setNewVariantType(e.target.value)}
                    />
                )}
            </div>

            {Object.keys(variants).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    No hay variantes configuradas. Agrega un tipo de variante para comenzar.
                </p>
            )}
        </div>
    );
};
