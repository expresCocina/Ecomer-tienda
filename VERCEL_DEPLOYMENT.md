# 🚀 Guía de Deployment en Vercel - Paso a Paso

## ✅ Pre-requisitos
- [x] Código subido a GitHub
- [ ] Cuenta en Vercel
- [ ] Variables de entorno de Supabase a mano

---

## 📝 PASO 1: Crear Cuenta en Vercel

1. Ve a **[vercel.com](https://vercel.com)**
2. Haz clic en **"Sign Up"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza a Vercel para acceder a tu cuenta de GitHub
5. ✅ Ya tienes cuenta en Vercel

---

## 🔗 PASO 2: Importar Proyecto

1. En el Dashboard de Vercel, haz clic en **"Add New..."**
2. Selecciona **"Project"**
3. Busca tu repositorio: **`expresCocina/Ecomer-tienda`**
4. Haz clic en **"Import"**

---

## ⚙️ PASO 3: Configurar Proyecto

### 3.1 Framework Preset
- Vercel detectará automáticamente **Vite**
- Si no, selecciona **Vite** del dropdown

### 3.2 Build Settings
```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

✅ **No cambies nada aquí**, Vercel lo detecta automáticamente.

---

## 🔐 PASO 4: Agregar Variables de Entorno (MUY IMPORTANTE)

### 4.1 Abrir tu archivo .env local

Abre el archivo `.env` en tu proyecto local:

```
C:\Users\Cristhian S\.gemini\antigravity\scratch\ecommerce-supabase\.env
```

### 4.2 Copiar valores

Copia los valores de estas variables:

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4.3 Agregar en Vercel

En la sección **"Environment Variables"** de Vercel:

**Variable 1:**
```
Key: VITE_SUPABASE_URL
Value: [pega tu URL de Supabase]
Environment: Production, Preview, Development (selecciona las 3)
```

**Variable 2:**
```
Key: VITE_SUPABASE_ANON_KEY
Value: [pega tu Anon Key de Supabase]
Environment: Production, Preview, Development (selecciona las 3)
```

Haz clic en **"Add"** después de cada variable.

---

## 🚀 PASO 5: Desplegar

1. Revisa que todo esté correcto:
   - ✅ Framework: Vite
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `dist`
   - ✅ 2 Environment Variables agregadas

2. Haz clic en **"Deploy"**

3. Espera 2-4 minutos mientras Vercel:
   - 📦 Instala dependencias
   - 🔨 Compila tu aplicación
   - 🚀 Despliega a producción

---

## ✅ PASO 6: Verificar Deployment

### 6.1 Obtener URL

Después del deployment, verás algo como:

```
🎉 Congratulations!
Your project has been deployed to:
https://ecomer-tienda.vercel.app
```

### 6.2 Probar el sitio

Haz clic en la URL y verifica:

- ✅ La página de inicio carga correctamente
- ✅ Los productos se muestran (conexión a Supabase funciona)
- ✅ El carrusel funciona
- ✅ Puedes navegar a `/privacidad`
- ✅ Puedes navegar a `/terminos`

---

## 🔗 PASO 7: URLs para Facebook App

Ahora que tu sitio está en producción, copia estas URLs:

**Política de Privacidad:**
```
https://ecomer-tienda.vercel.app/privacidad
```

**Términos y Condiciones:**
```
https://ecomer-tienda.vercel.app/terminos
```

### 7.1 Agregar a Facebook Developer

1. Ve a [developers.facebook.com/apps](https://developers.facebook.com/apps)
2. Selecciona tu app **"Amc catalog sync"** (ID: 1213049494804189)
3. Ve a **Settings → Basic**
4. Busca los campos:
   - **Privacy Policy URL:** Pega `https://ecomer-tienda.vercel.app/privacidad`
   - **Terms of Service URL:** Pega `https://ecomer-tienda.vercel.app/terminos`
5. Haz clic en **"Save Changes"**

---

## 🎯 PASO 8: Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio (ej: `www.amcmarket.com`):

1. En Vercel Dashboard → **Settings** → **Domains**
2. Haz clic en **"Add"**
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar DNS

---

## 🔄 PASO 9: Actualizaciones Futuras

Cada vez que hagas `git push` a GitHub:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

**Vercel automáticamente:**
1. Detecta el cambio en GitHub
2. Compila y despliega la nueva versión
3. Tu sitio se actualiza en 2-3 minutos

---

## 🛠️ Troubleshooting

### Error: "Build failed"

**Causa:** Las variables de entorno no están configuradas

**Solución:**
1. Ve a Settings → Environment Variables
2. Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén presentes
3. Redeploy: Deployments → ⋯ → Redeploy

### Error: "Cannot connect to Supabase"

**Causa:** Variables incorrectas o Supabase RLS bloqueando

**Solución:**
1. Verifica que las URLs de variables terminen en `.supabase.co`
2. Revisa políticas RLS en Supabase

### Página en blanco

**Causa:** Error de rutas

**Solución:**
1. Verifica que `vercel.json` esté en la raíz del proyecto
2. Redeploy

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real

1. Vercel Dashboard → Tu proyecto
2. **Deployments** → Click en el último deployment
3. **Function Logs** (si usas Edge Functions)

### Analytics

Vercel Dashboard → **Analytics**

Aquí verás:
- Visitas
- Bounce rate
- Top pages

---

## ✅ Checklist Final

Después del deployment:

- [ ] Sitio carga en URL de Vercel
- [ ] Productos se muestran correctamente
- [ ] Imágenes cargan
- [ ] `/privacidad` accesible
- [ ] `/terminos` accesible
- [ ] URLs agregadas a Facebook Developer
- [ ] Carrito funciona
- [ ] Admin panel `/admin/login` accesible

---

## 🎉 ¡Listo!

Tu e-commerce está en producción:

**URL Pública:** `https://ecomer-tienda.vercel.app`

**Próximos pasos:**
1. Agregar URLs a Facebook App
2. Probar Facebook Catalog Sync
3. Configurar dominio personalizado (opcional)

---

## 📞 Soporte

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

**¡Tu tienda está online! 🚀**
