import { cn } from '../../lib/utils';

/**
 * Componente Input reutilizable - Tema limpio
 */
export const Input = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'w-full px-4 py-2.5 border rounded-lg shadow-sm transition-all duration-200 bg-white text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500',
                    error
                        ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500'
                        : 'border-gray-300 hover:border-gold-400',
                    props.disabled && 'bg-gray-50 cursor-not-allowed text-gray-500',
                    className
                )}
                {...props}
            />
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
            )}
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
