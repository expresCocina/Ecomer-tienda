import { cn } from '../../lib/utils';

/**
 * Componente Badge para etiquetas - Tema oscuro/dorado
 */
export const Badge = ({
    children,
    variant = 'default',
    className = '',
    ...props
}) => {
    const variants = {
        default: 'bg-primary-800/50 text-gray-300 border border-gold-500/20',
        primary: 'bg-primary-700/50 text-gold-400 border border-gold-500/30',
        success: 'bg-green-900/50 text-green-400 border border-green-500/30',
        warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30',
        danger: 'bg-red-900/50 text-red-400 border border-red-500/30',
        offer: 'bg-red-600 text-white border border-red-500',
        new: 'bg-blue-600 text-white border border-blue-500',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
