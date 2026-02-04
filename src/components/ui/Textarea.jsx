import { cn } from '../../lib/utils';

/**
 * Componente Textarea
 */
export const Textarea = ({
    label,
    error,
    helperText,
    className = '',
    rows = 4,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gold-400 mb-1">
                    {label}
                </label>
            )}
            <textarea
                rows={rows}
                className={cn(
                    'w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200 resize-none bg-primary-800/30 text-gray-200 placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500',
                    error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gold-500/20',
                    props.disabled && 'bg-primary-900/50 cursor-not-allowed',
                    className
                )}
                {...props}
            />
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-400">{helperText}</p>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
