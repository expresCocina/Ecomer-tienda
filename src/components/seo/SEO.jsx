import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * Componente SEO para meta tags dinámicos
 */
export const SEO = ({
    title = 'C&J Relojería - Relojes Premium de Lujo en Colombia',
    description = 'Descubre nuestra exclusiva colección de relojes de lujo y premium. Envíos a toda Colombia. Calidad garantizada, precios competitivos y atención personalizada.',
    keywords = 'relojes, relojes de lujo, relojes premium, relojes hombre, relojes mujer, relojería Colombia, relojes elegantes, relojes clásicos, relojes deportivos',
    image = '/logo.svg',
    type = 'website',
    price,
    availability,
    productData
}) => {
    const location = useLocation();
    const siteUrl = 'https://tu-dominio.com'; // Cambiar por tu dominio real
    const currentUrl = `${siteUrl}${location.pathname}`;

    // Structured Data para Organización
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'C&J Relojería',
        description: 'Relojería premium especializada en relojes de lujo y elegantes',
        url: siteUrl,
        logo: `${siteUrl}/logo.svg`,
        image: `${siteUrl}/logo.svg`,
        telephone: '+57-XXX-XXX-XXXX', // Cambiar por tu número real
        email: 'contacto@cjrelojeria.com', // Cambiar por tu email real
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'CO',
            addressLocality: 'Colombia'
        },
        priceRange: '$$-$$$',
        openingHours: 'Mo-Sa 09:00-18:00',
        sameAs: [
            'https://facebook.com/tu-pagina',
            'https://instagram.com/tu-pagina',
            'https://twitter.com/tu-pagina'
        ]
    };

    // Structured Data para Producto (si aplica)
    const productSchema = productData ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productData.name,
        description: productData.description,
        image: productData.image,
        brand: {
            '@type': 'Brand',
            name: productData.brand || 'C&J Relojería'
        },
        offers: {
            '@type': 'Offer',
            price: productData.price,
            priceCurrency: 'COP',
            availability: productData.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url: currentUrl,
            seller: {
                '@type': 'Organization',
                name: 'C&J Relojería'
            }
        },
        aggregateRating: productData.rating ? {
            '@type': 'AggregateRating',
            ratingValue: productData.rating,
            reviewCount: productData.reviewCount || 1
        } : undefined
    } : null;

    return (
        <Helmet>
            {/* Meta Tags Básicos */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${siteUrl}${image}`} />
            <meta property="og:site_name" content="C&J Relojería" />
            <meta property="og:locale" content="es_CO" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${siteUrl}${image}`} />

            {/* Datos adicionales para productos */}
            {price && (
                <>
                    <meta property="product:price:amount" content={price} />
                    <meta property="product:price:currency" content="COP" />
                </>
            )}

            {availability && (
                <meta property="product:availability" content={availability} />
            )}

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>

            {productSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(productSchema)}
                </script>
            )}

            {/* Geo Tags para SEO Local */}
            <meta name="geo.region" content="CO" />
            <meta name="geo.placename" content="Colombia" />

            {/* Robots */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />

            {/* Mobile */}
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="theme-color" content="#1a1a2e" />
        </Helmet>
    );
};
