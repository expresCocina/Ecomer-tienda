# ✅ SOLUCIÓN DEFINITIVA - Facebook Catalog Sync

Esta es la guía paso a paso FINAL para hacer funcionar la sincronización.

---

## 🎯 Plan de Acción

1. ✅ Actualizar Edge Function en Supabase
2. ✅ Verificar Secrets
3. ✅ Probar sincronización
4. ✅ Verificar resultados

---

## PASO 1: Actualizar Edge Function

### Opción A: Copiar desde archivo local

El archivo `02_edge_function_sync_facebook_catalog.ts` ya tiene el código correcto.

1. **Abre el archivo** en VS Code
2. **Copia TODO** el contenido (Ctrl + A → Ctrl + C)
3. **Ve a Supabase Dashboard**
4. **Edge Functions** → **sync-facebook-catalog** → **Code**
5. **Borra todo** y **pega** el código
6. **Deploy**

### Opción B: Si Supabase no carga el editor

Usa **Supabase CLI**:

```bash
# Desde el directorio del proyecto
supabase functions deploy sync-facebook-catalog --project-ref zxcqdmlnyrugzolwqdf
```

---

## PASO 2: Verificar Secrets en Supabase

Ve a **Edge Functions** → **Secrets** y verifica que existen:

| Secret Name | Ejemplo de Valor | ¿Correcto? |
|-------------|------------------|------------|
| `FACEBOOK_ACCESS_TOKEN` | `EAAB...` (muy largo) | [ ] |
| `FACEBOOK_CATALOG_ID` | `742650725553103` | [ ] |
| `SITE_URL` | `https://ecomer-tienda.vercel.app` | [ ] |

### ⚠️ Si falta alguno o está mal:

1. Click **"Add new secret"** o **"Edit"**
2. Completa los valores correctos
3. **Save**

---

## PASO 3: Probar Sincronización

### 3.1 Desde Vercel (Recomendado)

1. Ve a: `https://ecomer-tienda.vercel.app/admin/login`
2. Inicia sesión
3. **Inventario** → **Nuevo Producto**
4. Llena:
   - Nombre: "Prueba Final Facebook"
   - Precio: 99000
   - Stock: 50
   - Descripción: "Producto de prueba definitivo"
   - **Sube una imagen**
   - Selecciona categoría
5. **Guardar**

### 3.2 Verificar en Consola

1. Presiona **F12** (abrir DevTools)
2. Pestaña **Console**
3. Busca mensaje:
   - ✅ `"Producto sincronizado con Facebook"`
   - ❌ Error (comparte el mensaje)

### 3.3 Verificar Logs de Supabase

1. **Supabase** → **Edge Functions** → **sync-facebook-catalog** → **Logs**
2. **Refresca**
3. Click en el log más reciente
4. ¿Qué dice?
   - ✅ "Product created in Facebook"
   - ❌ Error (comparte el mensaje)

---

## PASO 4: Verificar en Facebook

1. Ve a: https://business.facebook.com/commerce/catalogs/742650725553103
2. Click en **"Products"** o **"Productos"**
3. **Busca** "Prueba Final Facebook"
4. ¿Aparece? [ ] Sí / [ ] No

---

## PASO 5: Verificar en Base de Datos

Ejecuta en **Supabase SQL Editor**:

```sql
SELECT 
    name,
    facebook_product_id,
    synced_to_facebook,
    last_facebook_sync
FROM products
WHERE name LIKE '%Prueba Final%'
ORDER BY created_at DESC
LIMIT 1;
```

**Resultado esperado:**
```
name: "Prueba Final Facebook"
facebook_product_id: "123456789..." (un ID largo)
synced_to_facebook: true
last_facebook_sync: 2026-01-10...
```

---

## 🚨 Troubleshooting

### Error: "Missing secrets"

**Solución:** Verifica que los 3 secrets existan en Supabase Edge Functions → Secrets

### Error: "Invalid OAuth access token"

**Solución:**
1. Ve a: https://developers.facebook.com/apps/1213049494804189/use_cases/customize/
2. Genera nuevo token (60 días)
3. Actualiza `FACEBOOK_ACCESS_TOKEN` en Supabase

### Error: "Product not found"

**Solución:** El producto se guardó pero no se pudo leer. Verifica permisos de Supabase Service Role Key.

### Error: CORS

**Solución:** La Edge Function ya tiene CORS headers. Asegúrate de que el código desplegado incluya:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  ...
```

### No aparece en Facebook pero sí en DB

**Causa:** Facebook tarda unos minutos en indexar.

**Solución:** Espera 5-10 minutos y refresca el catálogo.

---

## ✅ Checklist Final

- [ ] Edge Function desplegada en Supabase
- [ ] 3 Secrets configurados correctamente
- [ ] Código actualizado en Vercel (git push)
- [ ] Producto de prueba creado
- [ ] Logs de Supabase muestran success
- [ ] Producto aparece en Facebook Catalog
- [ ] Campos de DB actualizados (`facebook_product_id`, etc.)

---

## 🎉 ¡Éxito!

Si todos los checkboxes están marcados, **la sincronización está funcionando**.

De ahora en adelante, cada producto que crees o edites se sincronizará automáticamente con Facebook.

---

## 📝 Mantenimiento

### Renovar Token (cada 60 días)

1. Facebook Developers → Graph API Explorer
2. Generar nuevo token con permisos
3. Actualizar en Supabase Secrets

### Monitorear Errores

Revisa regularmente:
- Supabase → Edge Functions → Logs
- Busca errores y corrígelos

---

**Si algo falla, comparte:**
1. El mensaje de error EXACTO (de consola o logs)
2. El resultado del query SQL
3. Screenshot de los Secrets en Supabase
