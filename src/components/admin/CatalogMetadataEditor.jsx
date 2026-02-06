import { AutocompleteInput } from '../ui/AutocompleteInput';
import { googleCategories } from '../../lib/googleCategories';
import { Tag, Users, Baby, Package } from 'lucide-react';

/**
 * CatalogMetadataEditor - Editor de metadatos para Facebook/Google Catalog
 * @param {object} metadata - Objeto con metadatos actuales
 * @param {function} onChange - Callback cuando cambian los metadatos
 */
export const CatalogMetadataEditor = ({ metadata = {}, onChange }) => {
    const handleChange = (field, value) => {
        onChange({
            ...metadata,
            [field]: value
        });
    };

    return (
        <div className="space-y-6">
            {/* Categoría Google */}
            <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-primary-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Categoría de Google</h3>
                </div>
                <AutocompleteInput
                    options={googleCategories}
                    value={metadata.google_product_category || ''}
                    onChange={(value) => handleChange('google_product_category', value)}
                    placeholder="Buscar categoría (ej: Apparel & Accessories > Jewelry > Watches)"
                    label="Google Product Category (GPC)"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Ayuda a Google y Facebook a clasificar tu producto correctamente
                </p>
            </div>

            {/* Atributos Obligatorios */}
            <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Atributos Obligatorios</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Género */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Género
                        </label>
                        <select
                            value={metadata.gender || ''}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="male">Hombre</option>
                            <option value="female">Mujer</option>
                            <option value="unisex">Unisex</option>
                        </select>
                    </div>

                    {/* Grupo de Edad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Grupo de Edad
                        </label>
                        <select
                            value={metadata.age_group || ''}
                            onChange={(e) => handleChange('age_group', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="adult">Adulto</option>
                            <option value="kids">Niños</option>
                            <option value="infant">Bebé</option>
                        </select>
                    </div>

                    {/* Condición */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Condición
                        </label>
                        <select
                            value={metadata.condition || 'new'}
                            onChange={(e) => handleChange('condition', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="new">Nuevo</option>
                            <option value="used">Usado</option>
                            <option value="refurbished">Reacondicionado</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Atributos Técnicos */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-primary-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Atributos Técnicos</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Marca */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Marca <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={metadata.brand || ''}
                            onChange={(e) => handleChange('brand', e.target.value)}
                            placeholder="Ej: Invicta, Casio, Rolex"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <p className="text-xs text-red-500 mt-1">
                            Obligatorio para sincronización con Facebook
                        </p>
                    </div>

                    {/* Material */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Material
                        </label>
                        <input
                            type="text"
                            value={metadata.material || ''}
                            onChange={(e) => handleChange('material', e.target.value)}
                            placeholder="Ej: Acero inoxidable, Cuero, Plástico"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Ayuda */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> Completar estos metadatos mejora la visibilidad de tus productos en Facebook y Google Shopping.
                </p>
            </div>
        </div>
    );
};
