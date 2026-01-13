import { useState } from 'react';
import { Check } from 'lucide-react';

/**
 * VariantSelector - Componente para seleccionar variantes de producto
 * @param {Object} variants - Objeto con las variantes disponibles { sizes: [...], colors: [...] }
 * @param {Object} selected - Variantes seleccionadas { size: "M", color: "Rojo" }
 * @param {Function} onChange - Callback cuando cambia la selección
 */
export const VariantSelector = ({ variants = {}, selected = {}, onChange }) => {
    if (!variants || Object.keys(variants).length === 0) {
        return null;
    }

    const handleSelect = (type, value) => {
        onChange({
            ...selected,
            [type]: value
        });
    };

    const renderSizeSelector = (sizes) => (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                Talla
            </label>
            <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                    const isSelected = selected.size === size;
                    return (
                        <button
                            key={size}
                            onClick={() => handleSelect('size', size)}
                            className={`
                                relative min-w-[3rem] px-4 py-2 rounded-lg font-medium
                                transition-all duration-200 transform
                                ${isSelected
                                    ? 'bg-primary-600 text-white shadow-lg scale-105 ring-2 ring-primary-300'
                                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-400 hover:scale-105'
                                }
                            `}
                        >
                            {size}
                            {isSelected && (
                                <Check className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full p-0.5" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderColorSelector = (colors) => (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                Color
            </label>
            <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                    const isSelected = selected.color === color;
                    return (
                        <button
                            key={color}
                            onClick={() => handleSelect('color', color)}
                            className={`
                                relative px-4 py-2 rounded-lg font-medium
                                transition-all duration-200 transform
                                ${isSelected
                                    ? 'bg-primary-600 text-white shadow-lg scale-105 ring-2 ring-primary-300'
                                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-400 hover:scale-105'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2">
                                <span
                                    className="w-4 h-4 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: getColorHex(color) }}
                                />
                                {color}
                            </span>
                            {isSelected && (
                                <Check className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full p-0.5" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderGenericSelector = (type, options) => (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 capitalize">
                {type}
            </label>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = selected[type] === option;
                    return (
                        <button
                            key={option}
                            onClick={() => handleSelect(type, option)}
                            className={`
                                relative px-4 py-2 rounded-lg font-medium
                                transition-all duration-200 transform
                                ${isSelected
                                    ? 'bg-primary-600 text-white shadow-lg scale-105 ring-2 ring-primary-300'
                                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-400 hover:scale-105'
                                }
                            `}
                        >
                            {option}
                            {isSelected && (
                                <Check className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full p-0.5" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {variants.sizes && renderSizeSelector(variants.sizes)}
            {variants.colors && renderColorSelector(variants.colors)}
            {Object.entries(variants).map(([type, options]) => {
                if (type === 'sizes' || type === 'colors') return null;
                return (
                    <div key={type}>
                        {renderGenericSelector(type, options)}
                    </div>
                );
            })}
        </div>
    );
};

// Helper para obtener código de color
const getColorHex = (colorName) => {
    const colorMap = {
        'negro': '#000000',
        'blanco': '#FFFFFF',
        'rojo': '#EF4444',
        'azul': '#3B82F6',
        'verde': '#10B981',
        'amarillo': '#F59E0B',
        'rosa': '#EC4899',
        'morado': '#8B5CF6',
        'gris': '#6B7280',
        'naranja': '#F97316',
        'café': '#92400E',
        'beige': '#D4C5B9',
    };

    return colorMap[colorName.toLowerCase()] || '#9CA3AF';
};
