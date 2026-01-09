import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Selector de cantidad para productos
 */
export const QuantitySelector = ({
    quantity = 1,
    onQuantityChange,
    min = 1,
    max = 99,
    className = '',
}) => {
    const handleIncrement = () => {
        if (quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || min;
        const clampedValue = Math.min(Math.max(value, min), max);
        onQuantityChange(clampedValue);
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <button
                onClick={handleDecrement}
                disabled={quantity <= min}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Minus className="w-4 h-4" />
            </button>

            <input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                min={min}
                max={max}
                className="w-16 text-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <button
                onClick={handleIncrement}
                disabled={quantity >= max}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
};
