import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Watch } from 'lucide-react';
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
        <footer className="bg-gradient-to-b from-primary-900 to-primary-950 text-gray-300 border-t-2 border-gold-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Columna 1: Sobre Nosotros */}
                    <div>
                        {/* Logo C&C con diseño elegante */}
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 via-gold-600 to-gold-700 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/30">
                                <Watch className="w-6 h-6 text-primary-900" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display text-2xl font-black bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent tracking-tight">
                                    C&J
                                </span>
                                <span className="text-xs font-bold text-gold-400 tracking-widest uppercase">
                                    Relojería
                                </span>
                            </div>
                        </div>
                        <p className="text-sm mb-4 text-gray-400">
                            Elegancia atemporal y precisión suiza. Especialistas en relojes de lujo para el hombre moderno.
                        </p>
                        <div className="flex space-x-4">
                            {settings?.facebook_url && (
                                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.twitter_url && (
                                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Columna 2: Enlaces Rápidos */}
                    <div>
                        <h3 className="font-display text-gold-400 font-bold text-lg mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-gold-400 transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/tienda" className="hover:text-gold-400 transition-colors">
                                    Colección
                                </Link>
                            </li>
                            <li>
                                <Link to="/ofertas" className="hover:text-gold-400 transition-colors">
                                    Ofertas Exclusivas
                                </Link>
                            </li>
                            <li>
                                <Link to="/contacto" className="hover:text-gold-400 transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Información */}
                    <div>
                        <h3 className="font-display text-gold-400 font-bold text-lg mb-4">Información</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/terminos-condiciones" className="hover:text-gold-400 transition-colors">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-privacidad" className="hover:text-gold-400 transition-colors">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-envios" className="hover:text-gold-400 transition-colors">
                                    Envíos y Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/preguntas-frecuentes" className="hover:text-gold-400 transition-colors">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div>
                        <h3 className="font-display text-gold-400 font-bold text-lg mb-4">Contacto</h3>
                        <ul className="space-y-3 text-sm">
                            {settings?.contact_address && (
                                <li className="flex items-start space-x-2">
                                    <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                                    <span>{settings.contact_address}</span>
                                </li>
                            )}
                            {settings?.contact_phone && (
                                <li className="flex items-center space-x-2">
                                    <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                                    <span>{settings.contact_phone}</span>
                                </li>
                            )}
                            {settings?.contact_email && (
                                <li className="flex items-center space-x-2">
                                    <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                                    <span>{settings.contact_email}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t border-gold-500/20 mt-8 pt-8">
                    <div className="text-center space-y-3">
                        <p className="text-sm text-gray-400">
                            &copy; {currentYear} <span className="font-display font-semibold text-gold-400">Relojería C&J</span>. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-gray-500">
                            Creado por{' '}
                            <a
                                href="https://www.amcagencyweb.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent hover:from-gold-300 hover:to-gold-500 transition-all"
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
