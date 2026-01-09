import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';
import { Button } from '../ui/Button';

/**
 * Item individual del carrito
 */
export const CartItem = ({ item }) => {
    const { incrementQuantity, decrementQuantity, removeItem } = useCartStore();

    return (
        <div className="flex gap-4 py-4 border-b border-gray-200">
            {/* Imagen */}
            <div className="w-20 h-20 flex-shrink-0">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                )}
            </div>

            {/* Información */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                </h3>
                <p className="text-sm text-primary-600 font-semibold mt-1">
                    {formatPrice(item.price)}
                </p>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => decrementQuantity(item.id)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                        <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => incrementQuantity(item.id)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                        <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Botón eliminar */}
            <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
};
