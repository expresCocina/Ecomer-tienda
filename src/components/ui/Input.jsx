import { cn } from '../../lib/utils';

/**
 * Componente Input reutilizable
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300',
                    props.disabled && 'bg-gray-100 cursor-not-allowed',
                    className
                )}
                {...props}
            />
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
