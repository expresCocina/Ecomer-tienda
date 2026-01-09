import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * Layout principal que envuelve todas las páginas
 */
export const Layout = ({ children }) => {
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
