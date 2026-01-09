# 🚀 Guía de Deployment: GitHub + Vercel

Despliegue completo del e-commerce AMC Market a producción.

---

## 📋 PASO 1: Preparar el Proyecto

### 1.1 Verificar archivos críticos

✅ `.gitignore` - Protege archivos sensibles  
✅ `vercel.json` - Configuración de Vercel  
✅ `.env` con credenciales de Supabase (NO se sube)  

### 1.2 Actualizar package.json

Verifica que tengas estos scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 📦 PASO 2: Subir a GitHub

### 2.1 Inicializar Git (si no lo has hecho)

```bash
cd C:\Users\Cristhian S\.gemini\antigravity\scratch\ecommerce-supabase

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: AMC Market E-commerce"
```

### 2.2 Crear repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `amc-market-ecommerce` (o el que prefieras)
3. **NO** marques "Initialize this repository with a README"
4. Haz clic en **Create repository**

### 2.3 Conectar y subir

GitHub te dará estos comandos, ejecútalos:

```bash
git remote add origin https://github.com/TU_USUARIO/amc-market-ecommerce.git
git branch -M main
git push -u origin main
```

**Ejemplo con tu usuario:**
```bash
git remote add origin https://github.com/cristhianaviles/amc-market-ecommerce.git
git branch -M main
git push -u origin main
```

---

## 🌐 PASO 3: Desplegar en Vercel

### 3.1 Crear cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **Sign Up**
3. Inicia sesión con **GitHub** (recomendado)

### 3.2 Importar proyecto

1. En Vercel Dashboard, haz clic en **Add New Project**
2. Busca tu repositorio `amc-market-ecommerce`
3. Haz clic en **Import**

### 3.3 Configurar proyecto

**Framework Preset:** Vite  
**Root Directory:** ./  
**Build Command:** `npm run build`  
**Output Directory:** `dist`

### 3.4 Configurar Variables de Entorno

En la sección **Environment Variables**, agrega:

| Key | Value | Source |
|-----|-------|--------|
| `VITE_SUPABASE_URL` | Tu URL de Supabase | `.env` local |
| `VITE_SUPABASE_ANON_KEY` | Tu Anon Key | `.env` local |

**Para obtener estos valores:**
1. Abre tu `.env` local
2. Copia `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Pégalos en Vercel

### 3.5 Desplegar

1. Haz clic en **Deploy**
2. Espera 2-3 minutos
3. ¡Listo! Tu sitio está en línea 🎉

---

## 🔗 PASO 4: Obtener URLs para Facebook

Después del deployment, Vercel te dará una URL como:

```
https://amc-market-ecommerce.vercel.app
```

**URLs para Facebook App:**

📄 **Política de Privacidad:**
```
https://amc-market-ecommerce.vercel.app/privacidad
```

📄 **Términos y Condiciones:**
```
https://amc-market-ecommerce.vercel.app/terminos
```

**Copia estas URLs y pégalas en Facebook Developer:**
1. Ve a tu app en [developers.facebook.com](https://developers.facebook.com)
2. Settings → Basic
3. Pega las URLs en los campos correspondientes
4. Guarda cambios

---

## ⚙️ PASO 5: Configurar Dominio Personalizado (Opcional)

### 5.1 Agregar dominio

1. En Vercel Dashboard → Settings → Domains
2. Haz clic en **Add Domain**
3. Ingresa tu dominio: `tutienda.com`

### 5.2 Configurar DNS

En tu proveedor de dominio (GoDaddy, Namecheap, etc.):

**Tipo A:**
```
Host: @
Value: 76.76.21.21
```

**Tipo CNAME:**
```
Host: www
Value: cname.vercel-dns.com
```

Espera propagación (5-60 min).

---

## 🔄 PASO 6: Actualizaciones Futuras

### Hacer cambios en el código

```bash
# 1. Hacer cambios en tu código local
# 2. Commit
git add .
git commit -m "Descripción de cambios"

# 3. Push a GitHub
git push

# 4. Vercel despliega automáticamente 🚀
```

**Vercel detecta automáticamente los cambios y redesplega.**

---

## 🛠️ Comandos Útiles

### Ver estado de Git
```bash
git status
```

### Ver commits
```bash
git log --oneline
```

### Deshacer último commit (NO pushed)
```bash
git reset HEAD~1
```

### Ver branches
```bash
git branch -a
```

---

## ⚠️ Problemas Comunes

### Error: "Build failed"

**Solución:**
1. Verifica que `npm run build` funcione localmente
2. Revisa logs en Vercel Dashboard
3. Asegúrate de que las variables de entorno estén configuradas

### Error: "Page not found" en rutas

**Solución:**
`vercel.json` ya incluye rewrites para React Router. Si persiste:
1. Verifica que el archivo exista
2. Redeploy con: Vercel Dashboard → Deployments → ⋯ → Redeploy

### Variables de entorno no funcionan

**Solución:**
1. Ve a Settings → Environment Variables
2. Verifica que tengan el prefijo `VITE_`
3. Redeploy después de agregar variables

---

## 📊 Monitoreo

### Ver logs en tiempo real

Vercel Dashboard → tu proyecto → Functions → View Logs

### Analytics

Vercel Dashboard → Analytics (incluido en plan gratuito)

---

## 🎯 Checklist Final

Después del deployment:

- [ ] Sitio carga correctamente en URL de Vercel
- [ ] Variables de entorno funcionan (conexión a Supabase)
- [ ] Rutas `/privacidad` y `/terminos` accesibles
- [ ] URLs agregadas a Facebook Developer
- [ ] Imágenes y assets cargan correctamente
- [ ] Carrito de compras funciona
- [ ] Admin panel accesible (con login)

---

## 🚀 Tu sitio estará en:

**URL temporal de Vercel:**
```
https://[tu-proyecto].vercel.app
```

**Con dominio propio:**
```
https://tutienda.com
```

---

**¡Felicitaciones! Tu e-commerce está en producción 🎉**

Si necesitas ayuda adicional, consulta:
- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
