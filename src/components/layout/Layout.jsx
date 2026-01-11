import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useLocationTracking } from '../../hooks/useLocationTracking';

/**
 * Layout principal que envuelve todas las páginas
 */
export const Layout = ({ children }) => {
    // Track user location automatically
    useLocationTracking();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Espaciado para el navbar fijo */}
            <main className="flex-1 pt-16">
                {children}
            </main>

            <Footer />
        </div>
    );
};
