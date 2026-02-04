import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente SEO para meta tags dinámicos (sin react-helmet-async)
 * Actualiza directamente el DOM
 */
export const SEO = ({
    title = 'C&J Relojería - Relojes Premium de Lujo en Colombia',
    description = 'Descubre nuestra exclusiva colección de relojes de lujo y premium. Envíos a toda Colombia. Calidad garantizada, precios competitivos y atención personalizada.',
    keywords = 'relojes, relojes de lujo, relojes premium, relojes hombre, relojes mujer, relojería Colombia, relojes elegantes, relojes clásicos, relojes deportivos',
    image = '/logo.svg',
    type = 'website'
}) => {
    const location = useLocation();
    const siteUrl = 'https://ecomer-tienda.vercel.app';
    const currentUrl = `${siteUrl}${location.pathname}`;

    useEffect(() => {
        // Actualizar título
        document.title = title;

        // Función helper para actualizar o crear meta tags
        const updateMetaTag = (property, content, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let element = document.querySelector(`meta[${attribute}="${property}"]`);

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, property);
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Meta tags básicos
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);

        // Open Graph
        updateMetaTag('og:type', type, true);
        updateMetaTag('og:url', currentUrl, true);
        updateMetaTag('og:title', title, true);
        updateMetaTag('og:description', description, true);
        updateMetaTag('og:image', `${siteUrl}${image}`, true);
        updateMetaTag('og:site_name', 'C&J Relojería', true);

        // Twitter
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', title);
        updateMetaTag('twitter:description', description);
        updateMetaTag('twitter:image', `${siteUrl}${image}`);

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', currentUrl);

    }, [title, description, keywords, image, type, currentUrl, siteUrl]);

    return null;
};
