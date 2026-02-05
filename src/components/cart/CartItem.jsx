import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';
import { Button } from '../ui/Button';

/**
 * Item individual del carrito - Tema oscuro/dorado
 */
export const CartItem = ({ item }) => {
    const { incrementQuantity, decrementQuantity, removeItem } = useCartStore();

    return (
        <div className="flex gap-3 sm:gap-4 py-3 sm:py-4 border-b-2 border-gold-500/20">
            {/* Imagen */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg border border-gold-500/20"
                    />
                ) : (
                    <div className="w-full h-full bg-primary-800/50 border border-gold-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                )}
            </div>

            {/* Información */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-gold-400 truncate leading-tight">
                    {item.name}
                </h3>

                {/* Mostrar variantes si existen */}
                {item.variants && Object.keys(item.variants).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                        {Object.entries(item.variants).map(([type, value]) => (
                            <span
                                key={type}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-500/10 text-gold-400 border border-gold-500/20"
                            >
                                {value}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-sm sm:text-base text-gold-500 font-bold mt-1.5 sm:mt-2">
                    {formatPrice(item.price)}
                </p>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2 mt-2 sm:mt-3">
                    <button
                        onClick={() => decrementQuantity(item.id)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-gold-500/10 active:bg-gold-500/20 transition-all touch-target tap-highlight-none"
                        aria-label="Disminuir cantidad"
                    >
                        <Minus className="w-4 h-4 text-gold-400 hover:text-gold-300" />
                    </button>
                    <span className="w-8 text-center text-sm sm:text-base font-semibold text-gold-400">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => incrementQuantity(item.id)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-gold-500/10 active:bg-gold-500/20 transition-all touch-target tap-highlight-none"
                        aria-label="Aumentar cantidad"
                    >
                        <Plus className="w-4 h-4 text-gold-400 hover:text-gold-300" />
                    </button>
                </div>
            </div>

            {/* Botón eliminar */}
            <button
                onClick={() => removeItem(item.id)}
                className="p-2 sm:p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 active:bg-red-500/20 rounded-lg transition-all self-start touch-target tap-highlight-none"
                aria-label="Eliminar producto"
            >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
        </div>
    );
};
