import { useState, useEffect } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { ImageUploader } from '../ui/ImageUploader';
import { SyncStatusBadge } from './SyncStatusBadge';
import { Input } from '../ui/Input';

/**
 * VariantCombinationTable - Tabla de combinaciones de variantes
 * @param {object} variantTypes - Tipos de variantes { colors: [...], sizes: [...] }
 * @param {array} combinations - Array de combinaciones actuales
 * @param {function} onChange - Callback cuando cambian las combinaciones
 * @param {string} productBrand - Marca del producto
 */
export const VariantCombinationTable = ({
    variantTypes = {},
    combinations = [],
    onChange,
    productBrand
}) => {
    const [localCombinations, setLocalCombinations] = useState(combinations);

    // Generar combinaciones automáticamente cuando cambian los tipos
    useEffect(() => {
        const types = Object.keys(variantTypes).filter(key => variantTypes[key].length > 0);

        if (types.length === 0) {
            setLocalCombinations([]);
            onChange([]);
            return;
        }

        // Generar todas las combinaciones posibles
        const generateCombinations = () => {
            const result = [];
            const generate = (index, current) => {
                if (index === types.length) {
                    // Crear ID único para la combinación
                    const id = `var_${Object.values(current).join('_').toLowerCase().replace(/\s+/g, '_')}`;

                    // Buscar si ya existe esta combinación
                    const existing = localCombinations.find(c => c.id === id);

                    // Crear nombre descriptivo
                    const name = Object.values(current).join(' - ');

                    result.push({
                        id,
                        sku: existing?.sku || '',
                        name: existing?.name || name,
                        price: existing?.price || '',
                        offer_price: existing?.offer_price || '',
                        stock: existing?.stock || 0,
                        image_url: existing?.image_url || '',
                        ...current
                    });
                    return;
                }

                const type = types[index];
                const options = variantTypes[type];

                for (const option of options) {
                    generate(index + 1, { ...current, [type]: option });
                }
            };

            generate(0, {});
            return result;
        };

        const newCombinations = generateCombinations();
        setLocalCombinations(newCombinations);
        onChange(newCombinations);
    }, [variantTypes]);

    const handleCombinationChange = (index, field, value) => {
        const updated = [...localCombinations];
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        setLocalCombinations(updated);
        onChange(updated);
    };

    const handleRemoveCombination = (index) => {
        const updated = localCombinations.filter((_, i) => i !== index);
        setLocalCombinations(updated);
        onChange(updated);
    };

    if (localCombinations.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No hay combinaciones de variantes.</p>
                <p className="text-sm">Agrega tipos de variantes arriba para generar combinaciones.</p>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                    Combinaciones de Variantes ({localCombinations.length})
                </h3>
                <p className="text-xs text-gray-500">
                    Configura precio, stock e imagen para cada variante
                </p>
            </div>

            {/* Tabla responsive */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Imagen
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Variante
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Precio <span className="text-red-500">*</span>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Oferta
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Stock <span className="text-red-500">*</span>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {localCombinations.map((combination, index) => (
                            <tr key={combination.id} className="hover:bg-gray-50">
                                {/* Imagen */}
                                <td className="px-4 py-3">
                                    <ImageUploader
                                        value={combination.image_url}
                                        onChange={(url) => handleCombinationChange(index, 'image_url', url)}
                                    />
                                </td>

                                {/* Variante */}
                                <td className="px-4 py-3">
                                    <input
                                        type="text"
                                        value={combination.name}
                                        onChange={(e) => handleCombinationChange(index, 'name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Nombre"
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {Object.entries(combination)
                                            .filter(([key]) => ['colors', 'sizes', 'materials', 'styles'].includes(key))
                                            .map(([key, value]) => (
                                                <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                    {value}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </td>

                                {/* SKU */}
                                <td className="px-4 py-3">
                                    <input
                                        type="text"
                                        value={combination.sku}
                                        onChange={(e) => handleCombinationChange(index, 'sku', e.target.value)}
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="SKU"
                                    />
                                </td>

                                {/* Precio */}
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        value={combination.price}
                                        onChange={(e) => handleCombinationChange(index, 'price', e.target.value)}
                                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="0"
                                        min="0"
                                        step="100"
                                    />
                                </td>

                                {/* Oferta */}
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        value={combination.offer_price}
                                        onChange={(e) => handleCombinationChange(index, 'offer_price', e.target.value)}
                                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="0"
                                        min="0"
                                        step="100"
                                    />
                                </td>

                                {/* Stock */}
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        value={combination.stock}
                                        onChange={(e) => handleCombinationChange(index, 'stock', parseInt(e.target.value) || 0)}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="0"
                                        min="0"
                                    />
                                </td>

                                {/* Estado */}
                                <td className="px-4 py-3">
                                    <SyncStatusBadge
                                        variant={combination}
                                        productBrand={productBrand}
                                    />
                                </td>

                                {/* Acciones */}
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCombination(index)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="Eliminar variante"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Resumen */}
            <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                        Total de variantes: <strong>{localCombinations.length}</strong>
                    </span>
                    <span className="text-gray-600">
                        Stock total: <strong>{localCombinations.reduce((sum, c) => sum + (parseInt(c.stock) || 0), 0)}</strong>
                    </span>
                </div>
                <div className="text-xs text-gray-500">
                    <span className="text-red-500">*</span> Campos obligatorios
                </div>
            </div>
        </div>
    );
};
