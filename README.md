# E-commerce Fullstack con Supabase

Aplicación de comercio electrónico moderna construida con React, Vite, Tailwind CSS y Supabase.

## 🚀 Características

### Frontend Público
- ✅ Landing page con productos destacados y ofertas
- ✅ Catálogo de productos con filtros por categoría
- ✅ Carrito de compras con persistencia
- ✅ Búsqueda de productos en tiempo real
- ⏳ Detalle de producto con galería
- ⏳ Checkout y finalización de pedidos

### Panel Administrativo
- ⏳ Dashboard con métricas y gráficos
- ⏳ Gestión completa de productos (CRUD)
- ⏳ Gestión de pedidos
- ⏳ Finanzas y reportes
- ⏳ Gestión de categorías
- ⏳ Configuración del negocio

## 📦 Tecnologías

- React 18
- Vite 7
- Tailwind CSS 3
- Supabase (BaaS)
- Zustand (Estado global)
- Zod (Validaciones)
- React Router Dom
- Lucide React (Iconos)
- Recharts (Gráficos)

## 🛠️ Instalación

1. Clona el repositorio y navega al directorio:
```bash
cd ecommerce-supabase
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu-proyecto-url.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

4. Ejecuta el esquema SQL:
- Ve al SQL Editor en tu panel de Supabase
- Copia y pega el contenido de `schema.sql` (ver en artifacts)
- Ejecuta el script

5. Crea el bucket de Storage:
- Ve a Storage en Supabase
- Crea un bucket llamado `products`
- Márcalo como público

6. Inicia el servidor de desarrollo:
```bash
npm run dev
```

7. Abre tu navegador en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/      # Componentes React
│   ├── ui/         # Componentes base (Button, Input, etc.)
│   ├── layout/     # Navbar, Footer, Layout
│   ├── shop/       # ProductCard, Filters
│   ├── cart/       # CartSidebar, CartItem
│   ├── checkout/   # Checkout flow
│   └── admin/      # Componentes admin
├── pages/          # Páginas
│   ├── public/     # Landing, Catalog, ProductDetail
│   └── admin/      # Dashboard, Inventory, Orders, etc.
├── lib/            # Utilidades
│   ├── supabase.js # Cliente de Supabase
│   ├── utils.js    # Funciones auxiliares
│   └── validators.js # Schemas de Zod
├── store/          # Estado global (Zustand)
│   ├── cartStore.js
│   ├── authStore.js
│   └── uiStore.js
└── hooks/          # Custom hooks
```

## 🔐 Primer Usuario Admin

El primer usuario que se registre tendrá rol `user` por defecto. Para promoverlo a admin:

1. Regístrate en la aplicación
2. Ve a la tabla `profiles` en Supabase
3. Actualiza el campo `role` de tu usuario a `'admin'`:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'tu-email@ejemplo.com';
```

## 🎨 Sistema de Diseño

La aplicación utiliza un sistema de diseño inspirado en Shadcn/UI:
- Paleta de colores personalizable
- Tipografía Inter de Google Fonts
- Componentes reutilizables
- Animaciones suaves
- 100% Responsive (Mobile First)

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🚧 Estado del Proyecto

Este proyecto está en desarrollo activo. Las siguientes características están pendientes:

- [ ] Página de detalle de producto
- [ ] Flujo completo de checkout
- [ ] Panel administrativo completo
- [ ] Sistema de autenticación
- [ ] Subida de imágenes
- [ ] Dashboard con gráficos
- [ ] Gestión de pedidos

## 📄 Licencia

Este proyecto es solo para uso personal.

## 🤝 Contribuir

Este es un proyecto personal, pero las sugerencias son bienvenidas.

---

Desarrollado con ❤️ usando React + Supabase
