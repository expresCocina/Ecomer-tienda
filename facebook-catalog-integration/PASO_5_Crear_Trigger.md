# 🔄 PASO 5: Crear Trigger Automático

El trigger hará que la Edge Function se ejecute automáticamente cada vez que crees o edites un producto en tu admin panel.

---

## 📝 Script SQL a Ejecutar

Ve a **Supabase Dashboard** → **SQL Editor** → **New Query** y pega este código:

```sql
-- =====================================================
-- PASO 5: Trigger Automático para Facebook Sync
-- =====================================================

-- Crear función que llama a la Edge Function
CREATE OR REPLACE FUNCTION trigger_facebook_sync()
RETURNS TRIGGER AS $$
BEGIN
  -- Llamar a la Edge Function de forma asíncrona
  PERFORM
    net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/sync-facebook-catalog',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_key')
      ),
      body := jsonb_build_object(
        'type', TG_OP,
        'record', row_to_json(NEW),
        'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger en la tabla products
DROP TRIGGER IF EXISTS on_product_change_sync_facebook ON products;

CREATE TRIGGER on_product_change_sync_facebook
  AFTER INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION trigger_facebook_sync();

-- Comentario
COMMENT ON FUNCTION trigger_facebook_sync() IS 'Trigger que sincroniza productos con Facebook Catalog';
```

---

## ⚙️ Configurar Settings de Supabase

Después de ejecutar el SQL anterior, necesitas configurar 2 settings más. En el mismo **SQL Editor**, ejecuta:

```sql
-- Configurar URL de Supabase
ALTER DATABASE postgres SET "app.settings.supabase_url" TO 'https://zxcqdmlnyrugzolwqdf.supabase.co';

-- Configurar Service Key (obtén este valor de Settings → API)
ALTER DATABASE postgres SET "app.settings.supabase_service_key" TO 'TU_SERVICE_ROLE_KEY_AQUI';
```

### 🔑 Obtener Service Role Key:

1. Ve a **Project Settings** (engranaje abajo en el menú)
2. Click en **API**
3. Busca **"service_role key"** (NO uses la anon key)
4. Click en **"Reveal"** y copia el key
5. Pega en el SQL de arriba donde dice `'TU_SERVICE_ROLE_KEY_AQUI'`

---

## ✅ Verificación

Ejecuta este query para verificar que todo está configurado:

```sql
SELECT current_setting('app.settings.supabase_url');
SELECT current_setting('app.settings.supabase_service_key');
```

Deberías ver tus valores configurados.

---

## 🎯 Pasos Resumidos:

1. **SQL Editor** → New Query
2. Pega el script del trigger
3. **Run** (Ctrl + Enter)
4. Copia el Service Role Key de Settings → API
5. Ejecuta el script de configuración con tu Service Key
6. Verifica los settings

---

## 🚨 Importante

- El **Service Role Key** es MUY SENSIBLE - tiene acceso completo
- Solo se usa internamente en Supabase
- NO lo expongas en el frontend

---

## 🎉 Próximo Paso

Una vez configurado el trigger, avísame para hacer el **PASO 6: Pruebas** 🧪

Crearemos un producto de prueba para ver la sincronización en acción!
