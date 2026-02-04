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
                className="p-2 rounded-lg border-2 border-gold-500/30 bg-primary-800/50 text-gold-400 hover:bg-primary-800 hover:border-gold-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <Minus className="w-4 h-4" />
            </button>

            <input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                min={min}
                max={max}
                className="w-16 text-center px-3 py-2 border-2 border-gold-500/30 bg-primary-800/50 text-gold-400 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
            />

            <button
                onClick={handleIncrement}
                disabled={quantity >= max}
                className="p-2 rounded-lg border-2 border-gold-500/30 bg-primary-800/50 text-gold-400 hover:bg-primary-800 hover:border-gold-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
};
