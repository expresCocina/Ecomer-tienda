import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';
import { CartSidebar } from './components/cart/CartSidebar';

// Páginas públicas
import { Landing } from './pages/public/Landing';
import { Catalog } from './pages/public/Catalog';
import { ProductDetail } from './pages/public/ProductDetail';
import { Checkout } from './pages/public/Checkout';
import { OrderSuccess } from './pages/public/OrderSuccess';
import { Contact } from './pages/public/Contact';
import { Terms } from './pages/public/Terms';
import { Privacy } from './pages/public/Privacy';
import { Shipping } from './pages/public/Shipping';
import { FAQ } from './pages/public/FAQ';

// Páginas admin
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Inventario } from './pages/admin/Inventario';
import { ProductoForm } from './pages/admin/ProductoForm';
import { Pedidos } from './pages/admin/Pedidos';
import { Finanzas } from './pages/admin/Finanzas';
import { Categorias } from './pages/admin/Categorias';
import { Configuracion } from './pages/admin/Configuracion';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';

// Placeholder para páginas pendientes
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">Esta página está en desarrollo</p>
    </div>
  </div>
);

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/tienda" element={<Catalog />} />
          <Route path="/ofertas" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<OrderSuccess />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/terminos-condiciones" element={<Terms />} />
          <Route path="/politica-privacidad" element={<Privacy />} />
          <Route path="/politica-envios" element={<Shipping />} />
          <Route path="/preguntas-frecuentes" element={<FAQ />} />

          {/* Rutas admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
          <Route path="/admin/inventario/nuevo" element={<ProtectedRoute><ProductoForm /></ProtectedRoute>} />
          <Route path="/admin/inventario/editar/:id" element={<ProtectedRoute><ProductoForm /></ProtectedRoute>} />
          <Route path="/admin/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
          <Route path="/admin/finanzas" element={<ProtectedRoute><Finanzas /></ProtectedRoute>} />
          <Route path="/admin/categorias" element={<ProtectedRoute><Categorias /></ProtectedRoute>} />
          <Route path="/admin/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<PlaceholderPage title="404 - Página no encontrada" />} />
        </Routes>
      </Layout>

      {/* Carrito (global) */}
      <CartSidebar />
    </Router>
  );
}

export default App;
