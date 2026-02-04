import { useEffect, useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Package, CreditCard, Truck, RefreshCw } from 'lucide-react';

/**
 * Página de Preguntas Frecuentes
 */
export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqCategories = [
        {
            title: 'Pedidos y Compras',
            icon: Package,
            color: 'blue',
            faqs: [
                {
                    question: '¿Cómo puedo realizar un pedido?',
                    answer: 'Es muy fácil: navega por nuestro catálogo, añade productos al carrito, completa el formulario de checkout con tus datos, y confirmaremos tu pedido vía WhatsApp.'
                },
                {
                    question: '¿Puedo modificar o cancelar mi pedido?',
                    answer: 'Sí, puedes modificar o cancelar tu pedido contactándonos por WhatsApp antes de que sea despachado. Una vez despachado, no podremos hacer cambios.'
                },
                {
                    question: '¿Recibiré confirmación de mi pedido?',
                    answer: 'Sí, recibirás una confirmación por email (si lo proporcionaste) y te contactaremos vía WhatsApp para confirmar todos los detalles de tu pedido.'
                },
            ]
        },
        {
            title: 'Pagos',
            icon: CreditCard,
            color: 'green',
            faqs: [
                {
                    question: '¿Qué métodos de pago aceptan?',
                    answer: 'Aceptamos pago contra entrega (efectivo), transferencia bancaria, y otros métodos que acordaremos contigo vía WhatsApp.'
                },
                {
                    question: '¿Es seguro comprar en AMC Market?',
                    answer: 'Absolutamente. Utilizamos protocolos de seguridad estándar de la industria y no almacenamos información sensible de pago. Los pagos se coordinan de forma segura.'
                },
                {
                    question: '¿Necesito crear una cuenta para comprar?',
                    answer: 'No es necesario crear una cuenta. Puedes comprar como invitado proporcionando tu información de contacto y entrega.'
                },
            ]
        },
        {
            title: 'Envíos',
            icon: Truck,
            color: 'purple',
            faqs: [
                {
                    question: '¿Hacen envíos a toda Colombia?',
                    answer: 'Sí, realizamos envíos a todo el territorio colombiano. El costo y tiempo de entrega varían según la ubicación.'
                },
                {
                    question: '¿Cuánto demora el envío?',
                    answer: 'Para ciudades principales: 2-5 días hábiles. Para otras ciudades: 5-10 días hábiles. Los tiempos son estimados y pueden variar.'
                },
                {
                    question: '¿Cómo puedo rastrear mi pedido?',
                    answer: 'Una vez despachado tu pedido, te enviaremos el número de guía vía WhatsApp o email para que puedas rastrear tu paquete.'
                },
                {
                    question: '¿Cuánto cuesta el envío?',
                    answer: 'El costo de envío se calcula automáticamente al finalizar la compra según tu ubicación y el peso del paquete.'
                },
            ]
        },
        {
            title: 'Devoluciones y Cambios',
            icon: RefreshCw,
            color: 'orange',
            faqs: [
                {
                    question: '¿Puedo devolver un producto?',
                    answer: 'Sí, aceptamos devoluciones dentro de los 5 días hábiles posteriores a la recepción, siempre que el producto esté en su empaque original y sin usar.'
                },
                {
                    question: '¿Qué hago si recibo un producto defectuoso?',
                    answer: 'Contáctanos inmediatamente vía WhatsApp con fotos del producto. Te haremos un cambio o reembolso completo sin costo adicional.'
                },
                {
                    question: '¿Quién paga el envío de devolución?',
                    answer: 'Si el producto está defectuoso o es incorrecto, nosotros cubrimos el costo. Si es por arrepentimiento de compra, el costo corre por tu cuenta.'
                },
                {
                    question: '¿Cuánto demora el reembolso?',
                    answer: 'Una vez recibido y verificado el producto devuelto (1-3 días hábiles), procesaremos el reembolso que llegará en 5-10 días hábiles.'
                },
            ]
        },
    ];

    const generalFAQs = [
        {
            question: '¿Ofrecen garantía en los productos?',
            answer: 'Sí, todos nuestros productos cuentan con garantía del fabricante. La duración varía según el producto. Consulta los detalles específicos en la página de cada producto.'
        },
        {
            question: '¿Puedo recoger mi pedido en tienda física?',
            answer: 'Actualmente solo operamos en línea. Todos los pedidos se envían a la dirección que nos proporciones.'
        },
        {
            question: '¿Tienen servicio al cliente?',
            answer: 'Sí, nuestro equipo está disponible de lunes a viernes de 9:00 AM a 6:00 PM vía WhatsApp y email para ayudarte con cualquier duda.'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-20 sm:pt-24 md:pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10 text-primary-900" />
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-gold-400 mb-4">
                        Preguntas Frecuentes
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Encuentra respuestas rápidas a las preguntas más comunes sobre AMC Market
                    </p>
                </div>

                {/* FAQs por Categoría */}
                {faqCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                                <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                        </div>

                        <div className="space-y-4">
                            {category.faqs.map((faq, faqIndex) => {
                                const globalIndex = `${categoryIndex}-${faqIndex}`;
                                const isOpen = openIndex === globalIndex;

                                return (
                                    <div
                                        key={faqIndex}
                                        className="bg-primary-800/50 rounded-xl shadow-md border-2 border-gold-500/20 overflow-hidden transition-all duration-200 hover:shadow-lg"
                                    >
                                        <button
                                            onClick={() => toggleFAQ(globalIndex)}
                                            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-primary-700/50 border border-gold-500/20 transition-colors"
                                        >
                                            <span className="font-semibold text-gray-900 pr-4">
                                                {faq.question}
                                            </span>
                                            {isOpen ? (
                                                <ChevronUp className="w-5 h-5 text-gold-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>
                                        {isOpen && (
                                            <div className="px-6 pb-5 pt-2 border-t border-gray-100">
                                                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Preguntas Generales */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Generales</h2>
                    <div className="space-y-4">
                        {generalFAQs.map((faq, index) => {
                            const globalIndex = `general-${index}`;
                            const isOpen = openIndex === globalIndex;

                            return (
                                <div
                                    key={index}
                                    className="bg-primary-800/50 rounded-xl shadow-md border-2 border-gold-500/20 overflow-hidden transition-all duration-200 hover:shadow-lg"
                                >
                                    <button
                                        onClick={() => toggleFAQ(globalIndex)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-primary-700/50 border border-gold-500/20 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 pr-4">
                                            {faq.question}
                                        </span>
                                        {isOpen ? (
                                            <ChevronUp className="w-5 h-5 text-gold-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    {isOpen && (
                                        <div className="px-6 pb-5 pt-2 border-t border-gray-100">
                                            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Final */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 text-center text-primary-900">
                    <h3 className="text-2xl font-bold mb-3">
                        ¿No encontraste lo que buscabas?
                    </h3>
                    <p className="text-primary-100 mb-6">
                        Nuestro equipo está listo para ayudarte con cualquier duda
                    </p>
                    <a
                        href="/contacto"
                        className="inline-block bg-white text-gold-400 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                    >
                        Contáctanos Ahora
                    </a>
                </div>
            </div>
        </div>
    );
};
