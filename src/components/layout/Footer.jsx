import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShoppingCart } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

/**
 * Footer del sitio
 */
export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { settings, loadSettings } = useSettingsStore();

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Columna 1: Sobre Nosotros */}
                    <div>
                        {/* Logo moderno con texto y gradiente */}
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col -space-y-1">
                                <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    AMC
                                </span>
                                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                                    Market
                                </span>
                            </div>
                        </div>
                        <p className="text-sm mb-4">
                            {settings?.business_description || 'Tu tienda de confianza para encontrar los mejores productos al mejor precio.'}
                        </p>
                        <div className="flex space-x-4">
                            {settings?.facebook_url && (
                                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.twitter_url && (
                                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Columna 2: Enlaces Rápidos */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-primary-400 transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/tienda" className="hover:text-primary-400 transition-colors">
                                    Tienda
                                </Link>
                            </li>
                            <li>
                                <Link to="/ofertas" className="hover:text-primary-400 transition-colors">
                                    Ofertas
                                </Link>
                            </li>
                            <li>
                                <Link to="/contacto" className="hover:text-primary-400 transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Información */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Información</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/terminos-condiciones" className="hover:text-primary-400 transition-colors">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-privacidad" className="hover:text-primary-400 transition-colors">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-envios" className="hover:text-primary-400 transition-colors">
                                    Envíos y Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/preguntas-frecuentes" className="hover:text-primary-400 transition-colors">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
                        <ul className="space-y-3 text-sm">
                            {settings?.contact_address && (
                                <li className="flex items-start space-x-2">
                                    <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                                    <span>{settings.contact_address}</span>
                                </li>
                            )}
                            {settings?.contact_phone && (
                                <li className="flex items-center space-x-2">
                                    <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                    <span>{settings.contact_phone}</span>
                                </li>
                            )}
                            {settings?.contact_email && (
                                <li className="flex items-center space-x-2">
                                    <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                    <span>{settings.contact_email}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="text-center space-y-3">
                        <p className="text-sm text-gray-400">
                            &copy; {currentYear} <span className="font-semibold text-gray-300">AMC MARKET</span>. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-gray-500">
                            Creado por{' '}
                            <a
                                href="https://www.amcagencyweb.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all"
                            >
                                Renting AMC Agency
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
