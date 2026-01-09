import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { getProducts, getCategories } from '../../lib/supabase';
import { ProductCard } from '../../components/shop/ProductCard';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

/**
 * Página del catálogo de productos
 */
export const Catalog = () => {
    const location = useLocation();
    const isOffersPage = location.pathname === '/ofertas';
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    // Actualizar searchQuery cuando cambian los params de la URL
    useEffect(() => {
        const searchParam = searchParams.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, [searchParams]);

    useEffect(() => {
        loadProducts();
    }, [selectedCategory, searchQuery, isOffersPage]);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            const filters = {};

            // Si estamos en la página de ofertas, filtrar solo productos en oferta
            if (isOffersPage) {
                filters.isOffer = true;
            }

            if (selectedCategory) {
                filters.categoryId = selectedCategory;
            }

            if (searchQuery) {
                filters.search = searchQuery;
            }

            const data = await getProducts(filters);
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 md:pt-28 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {isOffersPage ? 'Ofertas Especiales' : 'Catálogo de Productos'}
                    </h1>
                    <p className="text-gray-600">
                        {isOffersPage
                            ? '¡Aprovecha nuestras mejores ofertas con descuentos exclusivos!'
                            : 'Explora nuestra selección de productos'}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filtros - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                                {(selectedCategory || searchQuery) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>

                            {/* Categorías */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Categorías</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${!selectedCategory
                                            ? 'bg-primary-50 text-primary-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        Todas
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Botón de filtros móvil */}
                    <div className="lg:hidden">
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </Button>
                    </div>

                    {/* Productos */}
                    <div className="flex-1">
                        {/* Resultados */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600">
                                {products.length} {products.length === 1 ? 'producto' : 'productos'}
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Spinner size="lg" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg mb-4">
                                    No se encontraron productos
                                </p>
                                <Button onClick={clearFilters}>
                                    Ver todos los productos
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de filtros móvil */}
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Categorías móvil */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Categorías</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setShowFilters(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${!selectedCategory
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Todas
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategory(category.id);
                                            setShowFilters(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                                            ? 'bg-primary-50 text-primary-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={clearFilters}
                                variant="outline"
                                className="flex-1"
                            >
                                Limpiar
                            </Button>
                            <Button
                                onClick={() => setShowFilters(false)}
                                className="flex-1"
                            >
                                Aplicar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
