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
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100'
                : 'bg-white/80 backdrop-blur-md'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-3 group transition-transform hover:scale-105 duration-300"
                        onClick={closeMobileMenu}
                    >
                        {settings?.logo_url ? (
                            <img
                                src={settings.logo_url}
                                alt={settings.business_name}
                                className="h-12 md:h-14 w-auto max-w-[220px] object-contain transition-all group-hover:brightness-110"
                            />
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all duration-300">
                                    <ShoppingCart className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                    {settings?.business_name || 'MARKETPLACE'}
                                </span>
                            </>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="relative px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 group"
                            >
                                <span className="relative z-10">{link.name}</span>
                                <span className="absolute inset-0 bg-primary-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-6 lg:mx-10" ref={searchRef}>
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyPress={handleSearchKeyPress}
                                onFocus={() => searchQuery && setShowSearchResults(true)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-white text-sm transition-all duration-300 placeholder:text-gray-400"
                            />

                            {/* Dropdown de resultados */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 backdrop-blur-sm">
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/producto/${product.id}`}
                                            onClick={() => {
                                                setSearchQuery('');
                                                setShowSearchResults(false);
                                            }}
                                            className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 border-b border-gray-50 last:border-0 group"
                                        >
                                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden ring-2 ring-gray-100 group-hover:ring-primary-200 transition-all">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ShoppingCart className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-700 transition-colors">{product.name}</p>
                                                <p className="text-base text-primary-600 font-bold mt-0.5">
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
                                        className="block p-4 text-center text-sm text-primary-600 hover:bg-primary-50 font-semibold rounded-b-2xl transition-all"
                                    >
                                        Ver todos los resultados →
                                    </Link>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* User Icon */}
                        {user ? (
                            <Link
                                to={isAdmin ? '/admin/dashboard' : '/cuenta'}
                                className="hidden sm:flex items-center justify-center w-10 h-10 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 group"
                            >
                                <User className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                            </Link>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="hidden sm:flex items-center justify-center w-10 h-10 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 group"
                            >
                                <User className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <button
                            onClick={openCart}
                            className="relative flex items-center justify-center w-10 h-10 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 group"
                        >
                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden pb-4 pt-1">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-white transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-lg animate-fade-in">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <Link
                                to={isAdmin ? '/admin/dashboard' : '/cuenta'}
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
                            >
                                Mi Cuenta
                            </Link>
                        ) : (
                            <Link
                                to="/admin/login"
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all font-medium"
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
