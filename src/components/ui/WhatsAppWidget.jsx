import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { GTMEvents } from '../../lib/gtm';

/**
 * Widget flotante de WhatsApp - Optimizado para móvil
 */
export const WhatsAppWidget = () => {
    const { settings, loadSettings } = useSettingsStore();
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        loadSettings();

        // Mostrar widget después de 1 segundo
        const timer = setTimeout(() => {
            setIsVisible(true);
            // Mostrar tooltip después de 2 segundos
            setTimeout(() => setShowTooltip(true), 2000);
            // Ocultar tooltip después de 8 segundos
            setTimeout(() => setShowTooltip(false), 8000);
        }, 1000);

        return () => clearTimeout(timer);
    }, [loadSettings]);

    const handleWhatsAppClick = () => {
        if (!settings?.contact_phone) return;

        // Enviar evento a GTM
        GTMEvents.clickWhatsApp();

        // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
        const cleanPhone = settings.contact_phone.replace(/\D/g, '');

        // Mensaje predefinido
        const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus relojes.');

        // Abrir WhatsApp
        window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    };

    if (!settings?.contact_phone) return null;

    return (
        <>
            {/* Widget flotante - Optimizado para móvil - Posición ajustada */}
            <div
                className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    }`}
            >
                {/* Tooltip - Responsive */}
                {showTooltip && (
                    <div className="absolute bottom-16 sm:bottom-20 right-0 mb-2 animate-fade-in">
                        <div className="relative bg-white rounded-lg shadow-2xl p-3 sm:p-4 max-w-[280px] sm:max-w-xs border-2 border-gold-500/20">
                            {/* Flecha */}
                            <div className="absolute -bottom-2 right-4 sm:right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-gold-500/20 transform rotate-45"></div>

                            {/* Contenido */}
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-900" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1">
                                        ¡Hola! 👋
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                                        ¿Necesitas ayuda? Escríbenos por WhatsApp
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowTooltip(false)}
                                    className="text-gray-400 hover:text-gray-600 active:text-gray-700 transition-colors touch-target p-1"
                                    aria-label="Cerrar mensaje"
                                >
                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botón principal - Tamaño táctil optimizado */}
                <button
                    onClick={handleWhatsAppClick}
                    className="group relative w-14 h-14 sm:w-16 sm:h-16 touch-target-lg bg-gradient-to-br from-gold-500 to-gold-600 rounded-full shadow-2xl shadow-gold-500/30 hover:shadow-gold-500/50 active:shadow-gold-500/60 transition-all duration-300 hover:scale-110 active:scale-105 flex items-center justify-center animate-pulse-slow tap-highlight-none"
                    aria-label="Contactar por WhatsApp"
                >
                    {/* Onda de pulso */}
                    <span className="absolute inset-0 rounded-full bg-gold-400 animate-ping opacity-20"></span>

                    {/* Icono de WhatsApp - Tamaño adaptativo */}
                    <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-primary-900 relative z-10 group-hover:scale-110 transition-transform"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>

                    {/* Badge "En línea" - Más visible en móvil */}
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            </div>

            {/* Estilos de animación personalizados */}
            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </>
    );
};
