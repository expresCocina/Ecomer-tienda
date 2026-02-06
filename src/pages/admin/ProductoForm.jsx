import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Package, DollarSign, Image as ImageIcon, Settings, Watch, Tag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { VariantEditor } from '../../components/admin/VariantEditor';
import { CatalogMetadataEditor } from '../../components/admin/CatalogMetadataEditor';
import { VariantCombinationTable } from '../../components/admin/VariantCombinationTable';
import { supabase, uploadProductImage, getProductById } from '../../lib/supabase';

/**
 * Formulario para crear/editar productos
 */
export const ProductoForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        offer_price: '',
        cost_price: '',
        stock: '',
        category_id: '',
        is_featured: false,
        is_offer: false,
        show_in_carousel: false,
        tags: '',
        // Metadatos de catálogo
        google_product_category: '',
        gender: '',
        age_group: '',
        condition: 'new',
        brand: '',
        material: '',
    });
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [variants, setVariants] = useState({});
    const [variantCombinations, setVariantCombinations] = useState([]);
    const [errors, setErrors] = useState({});

    // Cargar categorías y producto si es edición
    useEffect(() => {
        loadCategories();
        if (isEditing) {
            loadProduct();
        }
    }, [id]);

    const loadCategories = async () => {
        const { data } = await supabase
            .from('categories')
            .select('*')
            .order('name');
        setCategories(data || []);
    };

    const loadProduct = async () => {
        try {
            const product = await getProductById(id);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                offer_price: product.offer_price || '',
                cost_price: product.cost_price || '',
                stock: product.stock,
                category_id: product.category_id || '',
                is_featured: product.is_featured,
                is_offer: product.is_offer,
                show_in_carousel: product.show_in_carousel || false,
                tags: product.tags?.join(', ') || '',
                // Metadatos de catálogo
                google_product_category: product.google_product_category || '',
                gender: product.gender || '',
                age_group: product.age_group || '',
                condition: product.condition || 'new',
                brand: product.brand || '',
                material: product.material || '',
            });
            setExistingImages(product.images || []);

            // Cargar variantes: si es array, es el nuevo formato, si es objeto, es el viejo
            if (Array.isArray(product.variants)) {
                // Mapear claves singulares (DB) a plurales (UI)
                const mappedVariants = product.variants.map(v => ({
                    ...v,
                    colors: v.color || v.colors, // Fallback por si ya tiene plural
                    sizes: v.size || v.sizes,
                    materials: v.material || v.materials,
                    styles: v.style || v.styles
                }));

                setVariantCombinations(mappedVariants);

                // Reconstruir variantTypes desde las combinaciones mapeadas
                const types = {};
                mappedVariants.forEach(v => {
                    ['colors', 'sizes', 'materials', 'styles'].forEach(key => {
                        if (v[key]) {
                            if (!types[key]) types[key] = [];
                            if (!types[key].includes(v[key])) {
                                types[key].push(v[key]);
                            }
                        }
                    });
                });
                setVariants(types);
            } else {
                setVariants(product.variants || {});
            }
        } catch (error) {
            console.error('Error loading product:', error);
            alert('Error al cargar el producto');
            navigate('/admin/inventario');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    const removeNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors = {};

        // Validaciones básicas
        if (!formData.name) newErrors.name = 'Nombre es requerido';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Precio debe ser mayor a 0';
        if (!formData.stock || formData.stock < 0) newErrors.stock = 'Stock debe ser mayor o igual a 0';

        // Validación de marca (obligatorio para Facebook)
        if (!formData.brand || formData.brand.trim() === '') {
            newErrors.brand = 'Marca es obligatoria para sincronización con Facebook';
        }

        // Validación de variantes
        if (variantCombinations.length > 0) {
            const invalidVariants = variantCombinations.filter(v =>
                !v.price || parseFloat(v.price) <= 0 || v.stock === undefined || parseInt(v.stock) < 0
            );

            if (invalidVariants.length > 0) {
                newErrors.variants = `${invalidVariants.length} variante(s) tienen precio o stock inválido. Todas las variantes deben tener precio > 0 y stock >= 0.`;
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);

            // Subir nuevas imágenes
            const uploadedImageUrls = [];
            for (const image of images) {
                const url = await uploadProductImage(image);
                uploadedImageUrls.push(url);
            }

            // Combinar imágenes existentes con nuevas
            const allImages = [...existingImages, ...uploadedImageUrls];

            // Variantes (JSONB limpio)
            // DEBUG: Verificar combinaciones antes de guardar
            const variantsToSave = variantCombinations.length > 0 ? variantCombinations.map(v => ({
                id: v.id,
                sku: v.sku || null,
                name: v.name,
                price: parseFloat(v.price),
                offer_price: v.offer_price ? parseFloat(v.offer_price) : null,
                stock: parseInt(v.stock),
                image_url: v.image_url || null,
                color: v.colors || null,
                size: v.sizes || null,
                material: v.materials || null,
                style: v.styles || null
            })) : null;

            console.log('Guardando producto:', {
                ...formData,
                variants: variantsToSave
            });

            // Preparar datos limpios
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                offer_price: formData.offer_price ? parseFloat(formData.offer_price) : null,
                cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
                stock: parseInt(formData.stock),
                category_id: formData.category_id || null,
                is_featured: formData.is_featured,
                is_offer: formData.is_offer,
                show_in_carousel: formData.show_in_carousel,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
                images: allImages,

                // Metadatos de catálogo (datos limpios)
                google_product_category: formData.google_product_category || null,
                gender: formData.gender || null,
                age_group: formData.age_group || null,
                condition: formData.condition || 'new',
                brand: formData.brand || null,
                material: formData.material || null,

                variants: variantsToSave,
            };

            let savedProductId = id;

            if (isEditing) {
                // Actualizar producto existente
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', id);

                if (error) throw error;
            } else {
                // Crear nuevo producto
                const { data, error } = await supabase
                    .from('products')
                    .insert([productData])
                    .select()
                    .single();

                if (error) throw error;
                savedProductId = data.id;
            }


            alert(isEditing ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
            navigate('/admin/inventario');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 shadow-2xl border-b-4 border-gold-500">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/admin/inventario')}
                        className="group flex items-center text-gold-300 hover:text-gold-100 transition-all duration-200 mb-4 hover:scale-105">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Volver al inventario
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/50 ring-4 ring-gold-500/20">
                            <Watch className="w-8 h-8 text-primary-900" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-white drop-shadow-lg">
                                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                            </h1>
                            <p className="text-gold-200 text-sm mt-1 font-medium">
                                {isEditing ? 'Actualiza la información del reloj' : 'Agrega un nuevo reloj a tu inventario'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Información básica */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Información Básica</h2>
                                        <p className="text-sm text-gray-500">Detalles principales del producto</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    <Input
                                        label="Nombre del producto"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        required
                                    />
                                    <Textarea
                                        label="Descripción"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Categoría
                                            </label>
                                            <select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            >
                                                <option value="">Sin categoría</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <Input
                                            label="Tags (separados por coma)"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            placeholder="nuevos, destacados, premium"
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Precios y stock */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <DollarSign className="w-5 h-5 text-primary-900" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Precios y Stock</h2>
                                        <p className="text-sm text-gray-500">Gestiona precios e inventario</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Precio regular"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        error={errors.price}
                                        required
                                    />
                                    <Input
                                        label="Precio de oferta (opcional)"
                                        name="offer_price"
                                        type="number"
                                        step="0.01"
                                        value={formData.offer_price}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Costo (opcional)"
                                        name="cost_price"
                                        type="number"
                                        step="0.01"
                                        value={formData.cost_price}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Stock"
                                        name="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        error={errors.stock}
                                        required
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Imágenes */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <ImageIcon className="w-5 h-5 text-primary-900" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Imágenes</h2>
                                        <p className="text-sm text-gray-500">Galería del producto</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    {/* Imágenes existentes */}
                                    {existingImages.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Imágenes actuales:</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {existingImages.map((url, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={url}
                                                            alt={`Imagen ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(index)}
                                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Nuevas imágenes */}
                                    {images.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Imágenes nuevas a subir:</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {images.map((file, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`Nueva ${index + 1}`}
                                                            className="w-full h-32 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeNewImage(index)}
                                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Botón para agregar imágenes */}
                                    <div>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600">Haz clic para subir imágenes</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Variantes */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <Package className="w-5 h-5 text-primary-900" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Variantes del Producto</h2>
                                        <p className="text-sm text-gray-500">Configura opciones como tallas, colores, materiales, etc.</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <VariantEditor
                                    variants={variants}
                                    onChange={setVariants}
                                />

                                {/* Tabla de combinaciones */}
                                {Object.keys(variants).length > 0 && (
                                    <VariantCombinationTable
                                        variantTypes={variants}
                                        combinations={variantCombinations}
                                        onChange={setVariantCombinations}
                                        productBrand={formData.brand}
                                        availableImages={[...existingImages, ...images]}
                                        basePrice={formData.price}
                                        baseOfferPrice={formData.offer_price}
                                        baseStock={formData.stock}
                                    />
                                )}
                            </CardBody>
                        </Card>

                        {/* Metadatos de Catálogo */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <Tag className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Configuración de Canales (Meta/Google)</h2>
                                        <p className="text-sm text-gray-500">Metadatos para Facebook y Google Shopping</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <CatalogMetadataEditor
                                    metadata={{
                                        google_product_category: formData.google_product_category,
                                        gender: formData.gender,
                                        age_group: formData.age_group,
                                        condition: formData.condition,
                                        brand: formData.brand,
                                        material: formData.material
                                    }}
                                    onChange={(metadata) => setFormData({ ...formData, ...metadata })}
                                />
                                {errors.brand && (
                                    <p className="text-sm text-red-500 mt-2">{errors.brand}</p>
                                )}
                                {errors.variants && (
                                    <p className="text-sm text-red-500 mt-2">{errors.variants}</p>
                                )}
                            </CardBody>
                        </Card>

                        {/* Opciones */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <Settings className="w-5 h-5 text-primary-900" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Opciones</h2>
                                        <p className="text-sm text-gray-500">Configuración adicional</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="is_featured"
                                            checked={formData.is_featured}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Producto destacado</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="is_offer"
                                            checked={formData.is_offer}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">En oferta</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="show_in_carousel"
                                            checked={formData.show_in_carousel}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Mostrar en carrusel (Landing)</span>
                                    </label>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Botones */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin/inventario')}
                                className="px-6"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                loading={loading}
                                disabled={loading}
                                className="px-8 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:via-gold-700 hover:to-gold-800 text-primary-900 font-semibold shadow-lg shadow-gold-500/30"
                            >
                                {loading ? 'Guardando...' : isEditing ? '✓ Actualizar Producto' : '+ Crear Producto'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
