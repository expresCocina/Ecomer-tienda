import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { supabase } from '../../lib/supabase';

/**
 * Página de gestión de categorías
 */
export const Categorias = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', description: '' });
        }
        setErrors({});
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '' });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generar slug desde el nombre
        if (name === 'name') {
            const slug = value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Nombre es requerido';
        if (!formData.slug) newErrors.slug = 'Slug es requerido';
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
            setSaving(true);

            if (editingCategory) {
                // Actualizar categoría existente
                const { error } = await supabase
                    .from('categories')
                    .update({
                        name: formData.name,
                        slug: formData.slug,
                        description: formData.description,
                    })
                    .eq('id', editingCategory.id);

                if (error) throw error;
                alert('Categoría actualizada correctamente');
            } else {
                // Crear nueva categoría
                const { error } = await supabase
                    .from('categories')
                    .insert([{
                        name: formData.name,
                        slug: formData.slug,
                        description: formData.description,
                    }]);

                if (error) throw error;
                alert('Categoría creada correctamente');
            }

            handleCloseModal();
            loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            if (error.code === '23505') {
                setErrors({ slug: 'Este slug ya existe' });
            } else {
                alert('Error al guardar la categoría');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        if (!confirm(`¿Estás seguro de eliminar "${category.name}"?\n\nLos productos de esta categoría quedarán sin categoría.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', category.id);

            if (error) throw error;

            alert('Categoría eliminada correctamente');
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error al eliminar la categoría');
        }
    };

    // Contar productos por categoría
    const getProductCount = async (categoryId) => {
        const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', categoryId);
        return count || 0;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FolderTree className="w-8 h-8 text-primary-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
                                <p className="text-sm text-gray-600">{categories.length} categorías</p>
                            </div>
                        </div>
                        <Button onClick={() => handleOpenModal()}>
                            <Plus className="w-5 h-5 mr-2" />
                            Nueva Categoría
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabla de categorías */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            No hay categorías. Crea la primera categoría.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map(category => (
                                        <tr key={category.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{category.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                                {category.slug}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {category.description || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenModal(category)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(category)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de crear/editar */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Ej: Electrónica"
                        required
                        autoFocus
                    />

                    <Input
                        label="Slug (URL amigable)"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        error={errors.slug}
                        placeholder="electronica"
                        required
                        helperText="Se genera automáticamente desde el nombre"
                    />

                    <Textarea
                        label="Descripción (opcional)"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Descripción de la categoría"
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseModal}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            loading={saving}
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : editingCategory ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
