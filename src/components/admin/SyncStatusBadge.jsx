import { CheckCircle, AlertCircle, XCircle, Tag } from 'lucide-react';

/**
 * SyncStatusBadge - Badge de estado de sincronización para variantes
 * @param {object} variant - Objeto de variante con price, stock, image_url
 * @param {string} productBrand - Marca del producto
 */
export const SyncStatusBadge = ({ variant, productBrand }) => {
    const getStatus = () => {
        // Validar campos obligatorios
        const hasPrice = variant.price && variant.price > 0;
        const hasStock = variant.stock !== undefined && variant.stock >= 0;
        const hasImage = variant.image_url && variant.image_url.trim() !== '';
        const hasBrand = productBrand && productBrand.trim() !== '';

        // Error: campos obligatorios inválidos
        if (!hasPrice || !hasStock) {
            return {
                type: 'error',
                label: 'Error',
                icon: XCircle,
                color: 'red',
                tooltip: `Faltan campos obligatorios: ${!hasPrice ? 'Precio' : ''} ${!hasStock ? 'Stock' : ''}`.trim()
            };
        }

        // Sin marca
        if (!hasBrand) {
            return {
                type: 'no-brand',
                label: 'Sin marca',
                icon: Tag,
                color: 'orange',
                tooltip: 'Se requiere marca del producto para Facebook'
            };
        }

        // Incompleto: falta imagen
        if (!hasImage) {
            return {
                type: 'incomplete',
                label: 'Sin imagen',
                icon: AlertCircle,
                color: 'yellow',
                tooltip: 'Se recomienda agregar una imagen'
            };
        }

        // Listo
        return {
            type: 'ready',
            label: 'Listo',
            icon: CheckCircle,
            color: 'green',
            tooltip: 'Listo para sincronizar con Facebook'
        };
    };

    const status = getStatus();
    const Icon = status.icon;

    const colorClasses = {
        green: 'bg-green-100 text-green-700 border-green-200',
        yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        red: 'bg-red-100 text-red-700 border-red-200',
        orange: 'bg-orange-100 text-orange-700 border-orange-200'
    };

    return (
        <div className="relative group">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses[status.color]}`}>
                <Icon className="w-3.5 h-3.5" />
                {status.label}
            </span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {status.tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
};
