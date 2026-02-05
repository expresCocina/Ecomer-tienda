import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Watch } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

/**
 * Footer del sitio - Optimizado para móvil
 */
export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { settings, loadSettings } = useSettingsStore();

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    return (
        <footer className="bg-gradient-to-b from-primary-900 to-primary-950 text-gray-300 border-t-2 border-gold-500/20">
            <div className="container-mobile py-8 sm:py-10 md:py-12">
                <div className="grid grid-mobile-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
                        <p className="text-mobile-sm mb-4 text-gray-400 leading-relaxed">
                            Elegancia atemporal y precisión suiza. Especialistas en relojes de lujo para el hombre moderno.
                        </p>

                        {/* Iconos de Redes Sociales - Diseño Original */}
                        <div className="flex space-x-3 sm:space-x-4">
                            {/* Facebook - Azul característico */}
                            {settings?.facebook_url && (
                                <a
                                    href={settings.facebook_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-[#1877F2] hover:bg-[#0d65d9] rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 touch-target"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
                                </a>
                            )}

                            {/* Instagram - Gradiente característico */}
                            <a
                                href="https://www.instagram.com/cyjrelojeria?igsh=cGUxZHZnejR6eDYw&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] hover:from-[#7232a8] hover:via-[#d12a61] hover:to-[#f56b2a] rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 touch-target"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </a>

                            {/* WhatsApp - Verde característico */}
                            {settings?.whatsapp_number && (
                                <a
                                    href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-[#25D366] hover:bg-[#1fb855] rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 touch-target"
                                    aria-label="WhatsApp"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Columna 2: Enlaces Rápidos */}
                    <div>
                        <h3 className="font-display text-gold-400 font-bold text-mobile-base mb-3 sm:mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2 sm:space-y-2.5 text-mobile-sm">
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
