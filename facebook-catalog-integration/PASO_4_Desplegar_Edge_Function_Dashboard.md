# 🚀 PASO 4: Desplegar Edge Function (Método Dashboard)

Ya que Supabase CLI puede tener problemas en Windows, vamos a desplegar desde el Dashboard web.

---

## 📋 Pasos

### 1. **Ir a Edge Functions en Supabase**

- Ve a: https://supabase.com/dashboard
- Selecciona tu proyecto
- Click en **"Edge Functions"** (menú lateral)

### 2. **Crear Nueva Función**

- Click en **"Create a new function"**
- **Name:** `sync-facebook-catalog`
- Click **"Create function"**

### 3. **Copiar el Código**

Abre el archivo `02_edge_function_sync_facebook_catalog.ts` en tu proyecto local:

```
C:\Users\Cristhian S\.gemini\antigravity\scratch\ecommerce-supabase\
facebook-catalog-integration\02_edge_function_sync_facebook_catalog.ts
```

**COPIA TODO EL CONTENIDO** (Ctrl + A → Ctrl + C)

### 4. **Pegar en Supabase Dashboard**

- En la función que acabas de crear, verás un editor de código
- **Borra todo** el código placeholder que aparece
- **Pega** el código que copiaste
- Click **"Deploy"** o **"Save"**

### 5. **Verificar Deployment**

Después de desplegar, deberías ver:
- ✅ **Status:** Active
- ✅ **Last deployed:** Hace unos segundos
- ✅ **URL:** `https://[tu-proyecto].supabase.co/functions/v1/sync-facebook-catalog`

---

## ✅ Verificación

La función está desplegada correctamente si ves:

```
sync-facebook-catalog
Active • Deployed 1 minute ago
```

---

## 🚨 Troubleshooting

### Error: "Missing dependencies"

Si ves errores sobre dependencias, asegúrate de que el código tenga estas líneas al inicio:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
```

### Error: "Secrets not found"

Verifica que los 3 secrets estén configurados:
- `FACEBOOK_ACCESS_TOKEN`
- `FACEBOOK_CATALOG_ID`
- `SITE_URL`

---

## 🎯 Próximo Paso

Una vez desplegada la Edge Function, avísame para continuar con el **PASO 5: Crear Trigger Automático** 🚀

Esto hará que la función se ejecute automáticamente cuando crees o edites productos.
