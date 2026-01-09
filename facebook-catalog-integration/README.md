# 🔄 Integración Automática con Facebook Catalog

Sistema de sincronización automática entre el catálogo de productos de Supabase y Facebook Catalog API.

## 📋 Descripción

Esta integración sincroniza automáticamente tu catálogo de productos con Facebook cuando:
- ✅ Creas un nuevo producto
- ✅ Actualizas precio o stock
- ✅ Cambias ofertas o disponibilidad

**Todo es automático**, no requiere intervención manual.

---

## 🚀 Guía de Implementación Paso a Paso

### **PASO 1: Preparar Base de Datos**

Ejecuta el script `01_add_facebook_fields.sql` en Supabase SQL Editor:

```bash
# Copia y pega el contenido en Supabase Dashboard → SQL Editor → New Query
```

Este script agrega:
- `facebook_product_id` - ID del producto en Facebook
- `synced_to_facebook` - Estado de sincronización
- `last_facebook_sync` - Última fecha de sync

---

### **PASO 2: Obtener Credenciales de Facebook**

#### 2.1 Access Token

1. Ve a [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Selecciona tu aplicación
3. Agrega permisos:
   - `catalog_management`
   - `business_management`
4. Haz clic en "Generate Access Token"
5. **IMPORTANTE:** Convierte el token a uno de larga duración:

```bash
https://graph.facebook.com/v18.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id=TU_APP_ID&
  client_secret=TU_APP_SECRET&
  fb_exchange_token=TU_TOKEN_CORTO
```

#### 2.2 Catalog ID

1. Ve a [Meta Business Suite](https://business.facebook.com/commerce/catalogs/)
2. Selecciona tu catálogo
3. El ID está en la URL: `catalogs/[ESTE_ES_TU_ID]/`

---

### **PASO 3: Configurar Supabase Secrets**

#### Opción A: Dashboard Web

1. Ve a tu proyecto en Supabase
2. **Settings** → **Edge Functions** → **Secrets**
3. Agrega:

| Secret Name | Valor |
|------------|-------|
| `FACEBOOK_ACCESS_TOKEN` | Token obtenido en paso 2.1 |
| `FACEBOOK_CATALOG_ID` | ID obtenido en paso 2.2 |
| `SITE_URL` | URL de tu sitio (ej: `https://tutienda.com`) |

#### Opción B: Supabase CLI

```bash
supabase secrets set FACEBOOK_ACCESS_TOKEN="tu_token_aqui"
supabase secrets set FACEBOOK_CATALOG_ID="tu_catalog_id"
supabase secrets set SITE_URL="https://tutienda.com"
```

Verificar:
```bash
supabase secrets list
```

---

### **PASO 4: Desplegar Edge Function**

#### 4.1 Instalar Supabase CLI

```bash
npm install -g supabase
```

#### 4.2 Iniciar sesión

```bash
supabase login
```

#### 4.3 Link al proyecto

```bash
supabase link --project-ref TU_PROJECT_REF
```

#### 4.4 Crear la función

```bash
# Crear directorio
supabase functions new sync-facebook-catalog

# Copiar el código
# Copia el contenido de 02_edge_function_sync_facebook_catalog.ts
# a supabase/functions/sync-facebook-catalog/index.ts
```

#### 4.5 Desplegar

```bash
supabase functions deploy sync-facebook-catalog
```

---

### **PASO 5: Crear Trigger Automático**

Ejecuta el script `03_create_trigger.sql` en Supabase SQL Editor.

**IMPORTANTE:** Antes de ejecutar, actualiza estas líneas:

```sql
-- Reemplaza con tu URL de Supabase
current_setting('app.settings.supabase_url') 

-- Por:
'https://tu-proyecto.supabase.co'
```

Alternativamente, configura settings:

```sql
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://tu-proyecto.supabase.co';
ALTER DATABASE postgres SET app.settings.supabase_service_key = 'tu_service_role_key';
```

---

### **PASO 6: Probar la Integración**

#### Prueba Manual

Desde el panel administrativo:

1. **Crear producto nuevo**
   - ✅ Debe aparecer en Facebook Catalog automáticamente
   - ✅ `synced_to_facebook` = `true`
   - ✅ `facebook_product_id` debe tener un valor

2. **Actualizar precio**
   - ✅ El precio se actualiza en Facebook
   - ✅ `last_facebook_sync` se actualiza

3. **Cambiar stock a 0**
   - ✅ `availability` cambia a "out of stock" en Facebook

#### Ver Logs

```bash
supabase functions logs sync-facebook-catalog
```

O en Dashboard: **Edge Functions** → **sync-facebook-catalog** → **Logs**

---

## 🔍 Verificación en Facebook

1. Ve a [Meta Business Suite](https://business.facebook.com/commerce/catalogs/)
2. Selecciona tu catálogo
3. Busca el producto por nombre o ID
4. Verifica que todos los campos estén correctos

---

## 🛠️ Solución de Problemas

### Error: "Invalid OAuth access token"

**Causa:** Token expirado o inválido

**Solución:**
1. Genera un nuevo token de larga duración
2. Actualiza el secret en Supabase:
```bash
supabase secrets set FACEBOOK_ACCESS_TOKEN="nuevo_token"
```
3. Redeploy la función:
```bash
supabase functions deploy sync-facebook-catalog
```

### Error: "Catalog not found"

**Causa:** Catalog ID incorrecto

**Solución:**
1. Verifica el ID en Meta Business Suite
2. Actualiza:
```bash
supabase secrets set FACEBOOK_CATALOG_ID="id_correcto"
```

### Productos no se sincronizan

**Verificar:**
1. ¿El trigger está activo?
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_product_change_sync_facebook';
```

2. ¿Los secrets están configurados?
```bash
supabase secrets list
```

3. ¿La función está desplegada?
```bash
supabase functions list
```

4. Ver logs detallados:
```bash
supabase functions logs sync-facebook-catalog --tail
```

---

## 📊 Arquitectura del Sistema

```
Panel Admin (Frontend)
       ↓
   Supabase DB
   (tabla products)
       ↓ (Trigger automático)
Edge Function (Deno)
       ↓
Facebook Catalog API
       ↓
Facebook Catalog
```

---

## 🔐 Seguridad

✅ **Access Token** nunca se expone en el frontend  
✅ **Catalog ID** almacenado en Supabase Secrets  
✅ Edge Function ejecutada solo desde Supabase  
✅ Trigger usa `SECURITY DEFINER` para control de acceso  

---

## 📝 Campos Sincronizados

| Campo BD | Campo Facebook | Lógica |
|----------|----------------|--------|
| `id` | `id` | ID único |
| `name` | `title` | Nombre del producto |
| `description` | `description` | Descripción |
| `price` | `price` | Precio normal |
| `offer_price` | `sale_price` | Si `is_offer=true` |
| `stock` | `availability` | `>0` = in stock, `=0` = out of stock |
| `images[0]` | `image_link` | Primera imagen |
| - | `condition` | Siempre "new" |
| - | `brand` | "AMC Market" |
| - | `link` | URL del producto |

---

## 🔄 Mantenimiento

### Actualizar Edge Function

```bash
# Editar código
# supabase/functions/sync-facebook-catalog/index.ts

# Redesplegar
supabase functions deploy sync-facebook-catalog
```

### Renovar Access Token

Los tokens de Facebook expiran. Renueva cada 60 días:

1. Genera nuevo token en Graph API Explorer
2. Actualiza secret:
```bash
supabase secrets set FACEBOOK_ACCESS_TOKEN="nuevo_token"
```

---

## 📚 Referencias

- [Facebook Catalog API Docs](https://developers.facebook.com/docs/marketing-api/catalog)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Meta Business Suite](https://business.facebook.com/)

---

## ✅ Checklist de Implementación

- [ ] Ejecutar `01_add_facebook_fields.sql`
- [ ] Obtener Facebook Access Token
- [ ] Obtener Facebook Catalog ID
- [ ] Configurar Supabase Secrets
- [ ] Desplegar Edge Function
- [ ] Ejecutar `03_create_trigger.sql`
- [ ] Probar creando un producto
- [ ] Verificar en Facebook Catalog
- [ ] Probar actualización de precio
- [ ] Probar cambio de stock

---

## 🎯 Resultado Esperado

Después de la implementación:

✅ **Productos nuevos** se publican automáticamente en Facebook  
✅ **Cambios de precio** se reflejan inmediatamente  
✅ **Stock agotado** actualiza availability  
✅ **Ofertas** se muestran con sale_price  
✅ **Todo es automático** sin intervención manual  

---

**¿Problemas?** Revisa los logs de la Edge Function para detalles específicos.
