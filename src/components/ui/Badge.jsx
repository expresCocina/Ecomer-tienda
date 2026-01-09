import { cn } from '../../lib/utils';

/**
 * Componente Badge para etiquetas
 */
export const Badge = ({
    children,
    variant = 'default',
    className = '',
    ...props
}) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        offer: 'bg-red-500 text-white',
        new: 'bg-blue-500 text-white',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
