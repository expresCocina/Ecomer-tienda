import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCartStore, selectTotalItems } from '../../store/cartStore';
import { useAuthStore, selectUser, selectIsAdmin } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getProducts } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';

/**
 * Navbar principal del sitio
 */
export const Navbar = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef(null);

    const { openCart } = useCartStore();
    const totalItems = useCartStore(selectTotalItems);
    const user = useAuthStore(selectUser);
    const isAdmin = useAuthStore(selectIsAdmin);
    const { settings, loadSettings } = useSettingsStore();

    // Cargar configuración al montar
    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    // Detectar scroll para hacer sticky el navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Tienda', path: '/tienda' },
        { name: 'Ofertas', path: '/ofertas' },
        { name: 'Contacto', path: '/contacto' },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleSearch = (e) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/tienda?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            closeMobileMenu();
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    // Búsqueda en tiempo real
    useEffect(() => {
        const searchProducts = async () => {
            if (searchQuery.trim().length > 0) {
                try {
                    const results = await getProducts({ search: searchQuery });
                    setSearchResults(results.slice(0, 5)); // Limitar a 5 resultados
                    setShowSearchResults(true);
                } catch (error) {
                    console.error('Error searching products:', error);
                }
            } else {
                setSearchResults([]);
                setShowSearchResults(false);
            }
        };

        // Debounce: esperar 300ms después de que el usuario deje de escribir
        const timeoutId = setTimeout(searchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
                ? 'bg-white shadow-md'
                : 'bg-white/95 backdrop-blur-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                        {settings?.logo_url ? (
                            <img
                                src={settings.logo_url}
                                alt={settings.business_name}
                                className="h-10 md:h-12 w-auto max-w-[200px] object-contain"
                            />
                        ) : (
                            <>
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">{settings?.business_name || 'Mi Tienda'}</span>
                            </>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4 lg:mx-8" ref={searchRef}>
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyPress={handleSearchKeyPress}
                                onFocus={() => searchQuery && setShowSearchResults(true)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                            />

                            {/* Dropdown de resultados */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/producto/${product.id}`}
                                            onClick={() => {
                                                setSearchQuery('');
                                                setShowSearchResults(false);
                                            }}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ShoppingCart className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                                <p className="text-sm text-primary-600 font-semibold">
                                                    {formatPrice(product.offer_price || product.price)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link
                                        to={`/tienda?search=${encodeURIComponent(searchQuery)}`}
                                        onClick={() => {
                                            setSearchQuery('');
                                            setShowSearchResults(false);
                                        }}
                                        className="block p-3 text-center text-sm text-primary-600 hover:bg-primary-50 font-medium"
                                    >
                                        Ver todos los resultados
                                    </Link>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* User Icon */}
                        {user ? (
                            <Link
                                to={isAdmin ? '/admin/dashboard' : '/cuenta'}
                                className="hidden sm:flex items-center text-gray-700 hover:text-primary-600 transition-colors"
                            >
                                <User className="w-5 h-5 md:w-6 md:h-6" />
                            </Link>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="hidden sm:flex items-center text-gray-700 hover:text-primary-600 transition-colors"
                            >
                                <User className="w-5 h-5 md:w-6 md:h-6" />
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <button
                            onClick={openCart}
                            className="relative p-1.5 sm:p-2 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse text-[10px] sm:text-xs">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-1.5 sm:p-2 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
                    <div className="px-4 py-3 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMobileMenu}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <Link
                                to={isAdmin ? '/admin/dashboard' : '/cuenta'}
                                onClick={closeMobileMenu}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Mi Cuenta
                            </Link>
                        ) : (
                            <Link
                                to="/admin/login"
                                onClick={closeMobileMenu}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
