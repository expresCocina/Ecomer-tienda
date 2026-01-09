import { useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Shield, Lock, Eye, Database } from 'lucide-react';

/**
 * Página de Política de Privacidad
 */
export const Privacy = () => {
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
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Política de Privacidad
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Última actualización: {currentDate}
                            </p>
                        </div>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <div className="flex items-start">
                            <Lock className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-green-900">
                                En AMC Market / Renting AMC, respetamos y protegemos tu privacidad. Esta política explica
                                cómo recopilamos, usamos y protegemos tu información personal.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información que Recopilamos</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Información Personal</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Cuando realizas una compra o te registras en nuestro sitio, podemos recopilar:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Nombre completo</li>
                            <li>Dirección de email</li>
                            <li>Número de teléfono</li>
                            <li>Dirección de envío</li>
                            <li>Información de pago (procesada de forma segura)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Información Técnica</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Automáticamente recopilamos cierta información cuando visitas nuestro sitio:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Dirección IP</li>
                            <li>Tipo de navegador y dispositivo</li>
                            <li>Páginas visitadas</li>
                            <li>Tiempo de permanencia en el sitio</li>
                            <li>Fuente de referencia</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cómo Usamos tu Información</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Utilizamos la información recopilada para:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Database className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Procesar Pedidos</h4>
                                        <p className="text-sm text-gray-600">
                                            Gestionar tus compras y envíos
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Eye className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Mejorar Servicios</h4>
                                        <p className="text-sm text-gray-600">
                                            Personalizar tu experiencia
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Lock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Contactarte</h4>
                                        <p className="text-sm text-gray-600">
                                            Enviarte actualizaciones de pedidos
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Seguridad</h4>
                                        <p className="text-sm text-gray-600">
                                            Prevenir fraudes y abusos
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartir Información</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>No vendemos ni alquilamos tu información personal.</strong> Podemos compartir
                            tu información solo en las siguientes circunstancias:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Con empresas de mensajería para procesar envíos</li>
                            <li>Con procesadores de pago para transacciones seguras</li>
                            <li>Cuando sea requerido por ley</li>
                            <li>Para proteger nuestros derechos legales</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies y Tecnologías Similares</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Utilizamos cookies y tecnologías similares para:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Mantener tu sesión activa</li>
                            <li>Recordar tus preferencias</li>
                            <li>Analizar el tráfico del sitio</li>
                            <li>Mejorar la experiencia del usuario</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Puedes configurar tu navegador para rechazar cookies, pero algunas funciones del sitio
                            podrían no funcionar correctamente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seguridad de Datos</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Encriptación SSL/TLS para datos en tránsito</li>
                            <li>Almacenamiento seguro de datos</li>
                            <li>Acceso restringido a información personal</li>
                            <li>Monitoreo regular de seguridad</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Sin embargo, ningún método de transmisión por Internet es 100% seguro. No podemos
                            garantizar la seguridad absoluta de tu información.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Tus Derechos</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            De acuerdo con la Ley 1581 de 2012 de Colombia, tienes derecho a:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                            <p className="text-gray-700">✓ <strong>Acceder</strong> a tus datos personales</p>
                            <p className="text-gray-700">✓ <strong>Rectificar</strong> información incorrecta</p>
                            <p className="text-gray-700">✓ <strong>Actualizar</strong> tus datos</p>
                            <p className="text-gray-700">✓ <strong>Solicitar</strong> la eliminación de información</p>
                            <p className="text-gray-700">✓ <strong>Revocar</strong> el consentimiento</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retención de Datos</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Conservamos tu información personal solo durante el tiempo necesario para cumplir con
                            los fines descritos en esta política, a menos que la ley requiera un período de
                            retención más largo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Menores de Edad</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos
                            intencionalmente información personal de menores.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cambios a esta Política</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos
                            sobre cambios significativos publicando la nueva política en esta página.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contacto</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Si tienes preguntas sobre esta política de privacidad o quieres ejercer tus derechos:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p className="text-gray-700"><strong>Empresa:</strong> Renting AMC</p>
                            <p className="text-gray-700"><strong>Nombre comercial:</strong> AMC Market</p>
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
