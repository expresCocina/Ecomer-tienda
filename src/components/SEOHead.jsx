import { Helmet } from 'react-helmet-async';

/**
 * SEOHead - Componente para meta tags SEO dinámicos
 */
export const SEOHead = ({
    title = 'AMC Market - Tu tienda online de confianza',
    description = 'Descubre los mejores productos en AMC Market. Envíos a toda Colombia, precios competitivos y atención personalizada.',
    keywords = 'tienda online, ecommerce, compras online, Colombia, productos',
    image = 'https://ecomer-tienda.vercel.app/og-image.jpg',
    url = 'https://ecomer-tienda.vercel.app',
    type = 'website',
    structuredData = null
}) => {
    const siteTitle = title.includes('AMC Market') ? title : `${title} - AMC Market`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="AMC Market" />
            <meta property="og:locale" content="es_CO" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

/**
 * Genera structured data para productos
 */
export const generateProductSchema = (product) => {
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images || [],
        "description": product.description,
        "sku": product.id,
        "offers": {
            "@type": "Offer",
            "url": `https://ecomer-tienda.vercel.app/producto/${product.id}`,
            "priceCurrency": "COP",
            "price": product.offer_price || product.price,
            "availability": product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": product.rating ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.review_count || 1
        } : undefined
    };
};

/**
 * Genera structured data para la organización
 */
export const generateOrganizationSchema = () => {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "AMC Market",
        "url": "https://ecomer-tienda.vercel.app",
        "logo": "https://ecomer-tienda.vercel.app/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "Spanish"
        },
        "sameAs": [
            "https://www.facebook.com/amcagencyweb",
            "https://www.instagram.com/amcagencyweb"
        ]
    };
};
