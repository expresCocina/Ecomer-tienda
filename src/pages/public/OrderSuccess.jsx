import { Link } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';

/**
 * Página de confirmación de pedido exitoso
 */
export const OrderSuccess = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                {/* Icono de éxito */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                {/* Título */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    ¡Pedido Confirmado!
                </h1>

                {/* Mensaje */}
                <p className="text-lg text-gray-600 mb-8">
                    Gracias por tu compra. Hemos recibido tu pedido correctamente y nos pondremos en contacto contigo pronto para confirmar los detalles de envío.
                </p>

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                            <h3 className="font-semibold text-blue-900 mb-1">
                                Próximos pasos:
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Revisaremos tu pedido</li>
                                <li>• Te contactaremos por WhatsApp para confirmar</li>
                                <li>• Coordinaremos la entrega</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/" className="flex-1">
                        <Button variant="outline" className="w-full">
                            <Home className="w-4 h-4 mr-2" />
                            Ir al Inicio
                        </Button>
                    </Link>
                    <Link to="/tienda" className="flex-1">
                        <Button className="w-full">
                            Seguir Comprando
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
