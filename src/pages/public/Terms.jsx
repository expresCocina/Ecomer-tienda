import { useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Shield, FileText, AlertCircle } from 'lucide-react';

/**
 * Página de Términos y Condiciones
 */
export const Terms = () => {
    const { settings, loadSettings } = useSettingsStore();

    useEffect(() => {
        loadSettings();
        window.scrollTo(0, 0);
    }, [loadSettings]);

    const currentDate = new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 md:pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Términos y Condiciones
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Última actualización: {currentDate}
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-blue-900">
                                Al utilizar nuestros servicios, aceptas estos términos y condiciones en su totalidad.
                                Te recomendamos leerlos detenidamente.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información General</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            AMC Market es una plataforma de comercio electrónico operada por <strong>Renting AMC</strong>,
                            con domicilio en Colombia. Estos términos y condiciones regulan el uso de nuestro sitio web
                            y la compra de productos a través de nuestra plataforma.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Al acceder y utilizar este sitio web, aceptas cumplir con estos términos y condiciones,
                            junto con todas las leyes y regulaciones aplicables en Colombia.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uso del Sitio Web</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            El uso de este sitio web está sujeto a las siguientes condiciones:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Debes ser mayor de 18 años para realizar compras</li>
                            <li>Proporcionarás información veraz y actualizada</li>
                            <li>No utilizarás el sitio para fines ilegales o no autorizados</li>
                            <li>Respetarás los derechos de propiedad intelectual</li>
                            <li>No intentarás acceder a áreas restringidas del sistema</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Productos y Precios</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>Disponibilidad:</strong> Todos los productos están sujetos a disponibilidad.
                            Nos reservamos el derecho de limitar las cantidades de compra y de descontinuar productos
                            en cualquier momento.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>Precios:</strong> Los precios mostrados están en pesos colombianos (COP) e incluyen
                            IVA cuando aplique. Los costos de envío se calcularán al momento del checkout y varían
                            según la ubicación.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Errores:</strong> Nos reservamos el derecho de corregir cualquier error en
                            precios o descripciones de productos, incluso después de haber sido confirmado el pedido.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Proceso de Compra</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Al realizar un pedido:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                            <li>Recibirás una confirmación por email (si proporcionaste uno)</li>
                            <li>Verificaremos la disponibilidad de los productos</li>
                            <li>Te contactaremos vía WhatsApp para confirmar detalles y pago</li>
                            <li>Una vez confirmado el pago, procesaremos tu envío</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Métodos de Pago</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Actualmente aceptamos las siguientes formas de pago:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Pago contra entrega (efectivo)</li>
                            <li>Transferencia bancaria</li>
                            <li>Otros métodos acordados vía WhatsApp</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Envíos y Entregas</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Los tiempos de entrega varían según la ubicación del cliente. Te proporcionaremos
                            un tiempo estimado al confirmar tu pedido. No nos hacemos responsables por retrasos
                            causados por empresas de mensajería o eventos fuera de nuestro control.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Devoluciones y Reembolsos</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Consulta nuestra <a href="/politica-envios" className="text-primary-600 hover:text-primary-700 font-medium">Política de Envíos y Devoluciones</a> para
                            información detallada sobre cómo devolver productos y solicitar reembolsos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propiedad Intelectual</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Todo el contenido de este sitio web, incluyendo textos, gráficos, logos, imágenes y software,
                            es propiedad de Renting AMC o sus proveedores de contenido y está protegido por las leyes
                            de propiedad intelectual de Colombia.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitación de Responsabilidad</h2>
                        <p className="text-gray-700 leading-relaxed">
                            AMC Market no será responsable por daños indirectos, incidentales o consecuentes que
                            resulten del uso o la imposibilidad de usar nuestros productos o servicios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modificaciones</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
                            Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Ley Aplicable</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa
                            será resuelta en los tribunales competentes de Colombia.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contacto</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Si tienes preguntas sobre estos términos y condiciones, contáctanos:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {settings?.contact_email && (
                                <p className="text-gray-700">
                                    <strong>Email:</strong>{' '}
                                    <a href={`mailto:${settings.contact_email}`} className="text-primary-600 hover:text-primary-700">
                                        {settings.contact_email}
                                    </a>
                                </p>
                            )}
                            {settings?.contact_phone && (
                                <p className="text-gray-700">
                                    <strong>Teléfono:</strong>{' '}
                                    <a href={`tel:${settings.contact_phone}`} className="text-primary-600 hover:text-primary-700">
                                        {settings.contact_phone}
                                    </a>
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
