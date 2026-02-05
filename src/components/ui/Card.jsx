import { cn } from '../../lib/utils';

/**
 * Componente Card reutilizable - Tema oscuro/dorado
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
                'bg-primary-800/50 backdrop-blur-sm rounded-xl shadow-md shadow-gold-500/10 border-2 border-gold-500/20',
                hover && 'transition-all duration-200 hover:shadow-lg hover:shadow-gold-500/20 hover:-translate-y-1 hover:border-gold-500/30',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * Card Header - Tema oscuro/dorado
 */
export const CardHeader = ({ children, className = '', ...props }) => {
    return (
        <div className={cn('mobile-padding py-4 sm:py-5 border-b-2 border-gold-500/20', className)} {...props}>
            {children}
        </div>
    );
};

/**
 * Card Body - Tema oscuro/dorado
 */
export const CardBody = ({ children, className = '', ...props }) => {
    return (
        <div className={cn('mobile-padding py-4 sm:py-5', className)} {...props}>
            {children}
        </div>
    );
};

/**
 * Card Footer - Tema oscuro/dorado
 */
export const CardFooter = ({ children, className = '', ...props }) => {
    return (
        <div className={cn('mobile-padding py-4 sm:py-5 border-t-2 border-gold-500/20 bg-primary-900/50 backdrop-blur-sm rounded-b-xl', className)} {...props}>
            {children}
        </div>
    );
};
