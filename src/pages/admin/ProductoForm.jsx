import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Package, DollarSign, Image as ImageIcon, Settings, Watch } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { VariantEditor } from '../../components/admin/VariantEditor';
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
    });
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [variants, setVariants] = useState({});
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
            });
            setExistingImages(product.images || []);
            setVariants(product.variants || {});
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
        if (!formData.name) newErrors.name = 'Nombre es requerido';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Precio debe ser mayor a 0';
        if (!formData.stock || formData.stock < 0) newErrors.stock = 'Stock debe ser mayor o igual a 0';
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

            // Preparar datos
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
                variants: variants, // Agregar variantes
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
            {/* Header con gradiente dorado */}
            <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 shadow-lg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate('/admin/inventario')}
                        className="flex items-center text-gold-300 hover:text-gold-100 mb-4 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Volver al inventario
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-gold-500 via-gold-600 to-gold-700 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/30">
                            <Watch className="w-7 h-7 text-primary-900" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-white">
                                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                            </h1>
                            <p className="text-gold-300 text-sm mt-1">
                                {isEditing ? 'Actualiza la información del reloj' : 'Agrega un nuevo reloj a tu inventario'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-white" />
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
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="w-5 h-5 text-white" />
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
                                <h2 className="text-lg font-semibold">Variantes del Producto</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Configura opciones como tallas, colores, materiales, etc.
                                </p>
                            </CardHeader>
                            <CardBody>
                                <VariantEditor
                                    variants={variants}
                                    onChange={setVariants}
                                />
                            </CardBody>
                        </Card>

                        {/* Opciones */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-white" />
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
