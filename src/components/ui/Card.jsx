import { cn } from '../../lib/utils';

/**
 * Componente Card reutilizable
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
                'bg-white rounded-xl shadow-sm border border-gray-200',
                hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-1',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * Card Header
 */
export const CardHeader = ({ children, className = '', ...props }) => {
    return (
        <div className={cn('px-6 py-4 border-b border-gray-200', className)} {...props}>
            {children}
        </div>
    );
};

/**
 * Card Body
 */
export const CardBody = ({ children, className = '', ...props }) => {
    return (
        <div className={cn('px-6 py-4', className)} {...props}>
            {children}
        </div>
    );
};

/**
 * Card Footer
 */
export const CardFooter = ({ children, className = '', ...props }) => {
    return (
        <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl', className)} {...props}>
            {children}
        </div>
    );
};
