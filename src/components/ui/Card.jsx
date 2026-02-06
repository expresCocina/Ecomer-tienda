import { cn } from '../../lib/utils';

/**
 * Componente Card reutilizable - Tema limpio con acentos dorados
 */
export const Card = ({
    children,
    className = '',
    hover = false,
    ...props
}) => {
    return (
        <div
            className={cn(
                'bg-white rounded-xl shadow-lg border border-gray-200/80 overflow-hidden',
                hover && 'transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 hover:-translate-y-0.5 hover:border-gold-500/30',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * Card Header - Tema limpio con acento dorado
 */
export const CardHeader = ({ children, className = '', ...props }) => {
    return (
        <div className={cn('mobile-padding py-5 border-b border-gold-500/20 bg-gradient-to-r from-gray-50/50 to-transparent', className)} {...props}>
            {children}
        </div>
    );
};

/**
 * Card Body - Tema limpio
 */
export const CardBody = ({ children, className = '', ...props }) => {
    return (
        <div className={cn('mobile-padding py-6', className)} {...props}>
            {children}
        </div>
    );
};

/**
 * Card Footer - Tema limpio con acento dorado
 */
export const CardFooter = ({ children, className = '', ...props }) => {
    return (
        <div className={cn('mobile-padding py-5 border-t border-gold-500/20 bg-gradient-to-r from-gray-50/50 to-transparent rounded-b-xl', className)} {...props}>
            {children}
        </div>
    );
};
