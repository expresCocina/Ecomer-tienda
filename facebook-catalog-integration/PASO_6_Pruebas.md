# 🧪 PASO 6: Pruebas de Sincronización

Vamos a probar que todo funcione creando un producto y verificando que se sincronice con Facebook.

---

## 🎯 Prueba 1: Crear Producto de Prueba

### 1. **Ir al Admin Panel**
- Abre: `https://ecomer-tienda.vercel.app/admin/login`
- Inicia sesión con tus credenciales
- Ve a **Inventario** → **Nuevo Producto**

### 2. **Crear Producto de Prueba**

Llena estos campos:

**Información Básica:**
- **Nombre:** Producto Test Facebook
- **Descripción:** Este es un producto de prueba para sincronización con Facebook Catalog
- **Precio:** 50000
- **Stock:** 10

**Detalles:**
- **Categoría:** Selecciona una
- **Marca:** Test Brand

**Imagen:**
- Sube cualquier imagen de prueba

**¡IMPORTANTE!** Asegúrate de que:
- ✅ Precio > 0
- ✅ Stock > 0
- ✅ Al menos 1 imagen

### 3. **Guardar Producto**
- Click **"Guardar"** o **"Crear Producto"**

---

## 🔍 Verificar Logs de Edge Function

Inmediatamente después de crear el producto:

1. **Ve a Supabase Dashboard** → **Edge Functions**
2. Click en **`sync-facebook-catalog`**
3. Click en pestaña **"Logs"**

**Deberías ver algo como:**
```
✅ Product synced successfully
Facebook Product ID: 1234567890
```

O si hay error:
```
❌ Error: [descripción del error]
```

---

## 📦 Verificar en Facebook Catalog

### Opción 1: Commerce Manager
1. Ve a: https://business.facebook.com/commerce/catalogs/
2. Abre tu catálogo
3. Ve a **"Items"** o **"Productos"**
4. Busca "Producto Test Facebook"

### Opción 2: Catalog Manager en App
1. Ve a tu app en developers.facebook.com
2. Products → Catalog
3. Verifica que aparezca el producto

---

## ✅ Verificar en Supabase

Revisa que los campos se actualizaron:

```sql
SELECT 
  id,
  name,
  facebook_product_id,
  synced_to_facebook,
  last_facebook_sync
FROM products
WHERE name LIKE '%Test Facebook%';
```

**Deberías ver:**
- `facebook_product_id`: Un ID largo
- `synced_to_facebook`: `true`
- `last_facebook_sync`: Fecha y hora reciente

---

## 🧪 Prueba 2: Actualizar Producto

1. **Edita el producto** que acabas de crear
2. Cambia el **precio** a: 45000
3. Guarda

**Verificar:**
- ✅ Logs muestran "Product updated"
- ✅ El precio se actualizó en Facebook Catalog
- ✅ `last_facebook_sync` se actualizó

---

## 🚨 Troubleshooting

### Error: "Access token expired"
**Solución:** Renueva el Access Token y actualiza el secret en Supabase

### Error: "Product not found in catalog"
**Solución:** Verifica que el `FACEBOOK_CATALOG_ID` sea correcto

### Error: "Invalid image URL"
**Solución:** Asegúrate de que la imagen sea pública y accesible desde internet

### No aparece en logs
**Solución:**
1. Verifica que el trigger esté activo:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_product_change_sync_facebook';
```
2. Revisa que la Edge Function esté desplegada

### Producto sincronizado pero no visible en Facebook
**Causa:** Facebook puede tardar unos minutos en indexar
**Solución:** Espera 5-10 minutos y refresca

---

## 🎉 ¡Éxito!

Si todo funcionó:
- ✅ Producto aparece en Facebook Catalog
- ✅ Los campos de Supabase se actualizaron
- ✅ Los logs muestran sincronización exitosa

**Tu integración está completa y funcionando** 🚀

---

## 📝 Próximos Pasos

### Mantenimiento Continuo:

1. **Renovar Access Token** cada 60 días
2. **Monitorear logs** regularmente
3. **Probar actualizaciones** de stock y precios

### Mejoras Opcionales:

- Agregar sincronización de eliminación de productos
- Batch sync para productos existentes
- Notificaciones por email en caso de error
- Dashboard de status de sincronización

---

**¡Felicitaciones! Tu e-commerce está sincronizado con Facebook Catalog** 🎊
