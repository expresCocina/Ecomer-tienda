import { Truck, CreditCard, Shield, Award, Tag, TrendingUp } from 'lucide-react';

/**
 * Banner informativo con carrusel infinito animado
 */
export const InfoBanner = () => {
    const features = [
        {
            icon: Truck,
            title: 'Envío Rápido',
            description: 'A todo Colombia',
            bgColor: 'bg-blue-500',
        },
        {
            icon: CreditCard,
            title: 'Pago Seguro',
            description: 'Múltiples métodos',
            bgColor: 'bg-green-500',
        },
        {
            icon: Shield,
            title: 'Compra Protegida',
            description: 'Garantía incluida',
            bgColor: 'bg-purple-500',
        },
        {
            icon: Award,
            title: 'Calidad Premium',
            description: 'Productos verificados',
            bgColor: 'bg-orange-500',
        },
        {
            icon: Tag,
            title: 'Mejores Precios',
            description: 'Precios competitivos',
            bgColor: 'bg-red-500',
        },
        {
            icon: TrendingUp,
            title: 'Calidad Garantizada',
            description: 'Alta calidad',
            bgColor: 'bg-indigo-500',
        }
    ];

    return (
        <div className="bg-white border-y border-gray-200 py-6 overflow-hidden">
            <div className="relative">
                {/* Carrusel animado infinito */}
                <div className="flex animate-scroll-left">
                    {/* Primera copia */}
                    {features.map((feature, index) => (
                        <div
                            key={`first-${index}`}
                            className="flex items-center gap-4 px-8 flex-shrink-0"
                        >
                            <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-bold text-base whitespace-nowrap">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm whitespace-nowrap">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    {/* Segunda copia para loop infinito */}
                    {features.map((feature, index) => (
                        <div
                            key={`second-${index}`}
                            className="flex items-center gap-4 px-8 flex-shrink-0"
                        >
                            <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-bold text-base whitespace-nowrap">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm whitespace-nowrap">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
