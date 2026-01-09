import { useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Truck, Package, RefreshCw, Clock } from 'lucide-react';

/**
 * Página de Política de Envíos y Devoluciones
 */
export const Shipping = () => {
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
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Truck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Envíos y Devoluciones
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Última actualización: {currentDate}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    {/* Envíos */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Truck className="w-7 h-7 text-primary-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Política de Envíos</h2>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Cobertura</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Realizamos envíos a todo el territorio colombiano. El costo de envío varía según la
                            ubicación y el peso del pedido.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Tiempos de Entrega</h3>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Ciudades Principales</h4>
                                        <p className="text-sm text-gray-600">
                                            2-5 días hábiles
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Otras Ciudades</h4>
                                        <p className="text-sm text-gray-600">
                                            5-10 días hábiles
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
                            <p className="text-sm text-yellow-900">
                                <strong>Nota:</strong> Los tiempos de entrega son estimados y pueden variar debido a
                                circunstancias fuera de nuestro control (clima, festivos, etc.)
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Costos de Envío</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            El costo de envío se calcula al momento del checkout según:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                            <li>Destino de entrega</li>
                            <li>Peso y dimensiones del paquete</li>
                            <li>Método de envío elegido</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Seguimiento de Pedido</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Una vez despachado tu pedido, te enviaremos la información de seguimiento vía
                            WhatsApp o email (si lo proporcionaste) para que puedas rastrear tu paquete.
                        </p>
                    </section>

                    {/* Devoluciones */}
                    <section className="pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <RefreshCw className="w-7 h-7 text-primary-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Política de Devoluciones</h2>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Condiciones Generales</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Aceptamos devoluciones dentro de los <strong>5 días hábiles</strong> posteriores
                            a la recepción del producto, siempre que se cumplan las siguientes condiciones:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-3 mb-6">
                            <p className="text-gray-700">✓ El producto debe estar en su empaque original</p>
                            <p className="text-gray-700">✓ No debe haber sido usado ni mostrar señales de desgaste</p>
                            <p className="text-gray-700">✓ Debe incluir todos los accesorios y manuales</p>
                            <p className="text-gray-700">✓ Conservar etiquetas y empaques originales</p>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Motivos de Devolución</h3>
                        <div className="space-y-4 mb-6">
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">Producto Defectuoso o Dañado</h4>
                                <p className="text-sm text-gray-600">
                                    Si recibes un producto defectuoso o dañado, te haremos un reembolso completo
                                    o cambio sin costos adicionales.
                                </p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">Producto Incorrecto</h4>
                                <p className="text-sm text-gray-600">
                                    Si recibiste un producto diferente al que ordenaste, lo cambiaremos sin
                                    costo alguno.
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">Arrepentimiento de Compra</h4>
                                <p className="text-sm text-gray-600">
                                    Según la Ley 1480 de 2011 (Estatuto del Consumidor), tienes 5 días hábiles
                                    para retractarte de la compra. Los costos de devolución corren por tu cuenta.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Proceso de Devolución</h3>
                        <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4 mb-6">
                            <li>Contáctanos vía WhatsApp o email indicando el motivo de la devolución</li>
                            <li>Envía fotos del producto si aplica (defecto, daño, producto incorrecto)</li>
                            <li>Te proporcionaremos las instrucciones de devolución</li>
                            <li>Empaca el producto de forma segura</li>
                            <li>Envía el paquete según las instrucciones</li>
                            <li>Una vez recibido y verificado, procesaremos tu reembolso o cambio</li>
                        </ol>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Reembolsos</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Los reembolsos se procesarán de la siguiente manera:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                            <li>Verificaremos el estado del producto devuelto (1-3 días hábiles)</li>
                            <li>Aprobaremos el reembolso si cumple las condiciones</li>
                            <li>El dinero se devolverá por el mismo medio de pago (5-10 días hábiles)</li>
                            <li>Te notificaremos cuando el reembolso haya sido procesado</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Cambios</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Si prefieres un cambio en lugar de un reembolso, coordinaremos el envío del
                            producto de reemplazo una vez recibido el producto devuelto.
                        </p>
                    </section>

                    {/* Productos No Retornables */}
                    <section className="pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <Package className="w-7 h-7 text-primary-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Productos No Retornables</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Por razones de higiene y seguridad, los siguientes productos no pueden ser devueltos:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Productos personalizados o hechos a medida</li>
                            <li>Productos en oferta o liquidación (salvo defecto de fábrica)</li>
                            <li>Productos con empaque de seguridad abierto</li>
                        </ul>
                    </section>

                    {/* Contacto */}
                    <section className="pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas Ayuda?</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Si tienes dudas sobre envíos o devoluciones, contáctanos:
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
                                    <strong>WhatsApp:</strong>{' '}
                                    <a href={`https://wa.me/${settings.contact_phone.replace(/\D/g, '')}`} className="text-primary-600 hover:text-primary-700">
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
