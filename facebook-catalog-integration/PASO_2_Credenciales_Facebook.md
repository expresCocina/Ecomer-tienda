# 🔑 PASO 2: Obtener Credenciales de Facebook

Para sincronizar productos automáticamente con Facebook Catalog, necesitas 2 credenciales:

1. **Access Token** (larga duración)
2. **Catalog ID**

---

## 📋 A. Obtener Access Token

### Opción 1: Graph API Explorer (Recomendado)

1. **Ve a Graph API Explorer:**
   - https://developers.facebook.com/tools/explorer/

2. **Selecciona tu aplicación:**
   - Dropdown "Meta App" → Selecciona "Amc catalog sync" (ID: 1213049494804189)

3. **Generar Access Token:**
   - Click en "Generate Access Token"
   - Acepta los permisos solicitados

4. **Agregar Permisos Necesarios:**
   - Click en "Permissions" (al lado del token)
   - Busca y agrega:
     - `catalog_management`
     - `business_management`
   - Click "Generate Access Token" nuevamente

5. **Convertir a Token de Larga Duración:**
   
   **Método A: Usar Access Token Tool**
   - Ve a: https://developers.facebook.com/tools/accesstoken/
   - Busca tu token en la lista
   - Click "Extend Access Token"
   - Copia el nuevo token (válido por 60 días)

   **Método B: API Request Manual**
   ```
   https://graph.facebook.com/v18.0/oauth/access_token?
     grant_type=fb_exchange_token&
     client_id=TU_APP_ID&
     client_secret=TU_APP_SECRET&
     fb_exchange_token=TU_TOKEN_CORTO
   ```

6. **Guardar Token:**
   - Copia el Access Token de larga duración
   - Guárdalo en un lugar seguro (lo necesitarás en el PASO 3)

---

## 📦 B. Obtener Catalog ID

### 1. Ir a Meta Commerce Manager

**Opción A: Desde tu App**
- Ve a tu app en [developers.facebook.com](https://developers.facebook.com/apps/1213049494804189)
- Click en "Products" → "Catalog" (si está instalado)
- Debería mostrarte tu catálogo

**Opción B: Directamente en Commerce**
- Ve a: https://business.facebook.com/commerce/catalogs/
- Verás la lista de tus catálogos

### 2. Obtener el ID

**En la URL:**
```
https://business.facebook.com/commerce/catalogs/[ESTE_ES_TU_CATALOG_ID]/
```

**Ejemplo:**
```
https://business.facebook.com/commerce/catalogs/1234567890123456/
                                                  ^^^^^^^^^^^^^^^
                                                  Tu Catalog ID
```

### 3. Si NO tienes un catálogo:

**Crear uno nuevo:**

1. Ve a [Commerce Manager](https://business.facebook.com/commerce)
2. Click "Create Catalog"
3. Selecciona "E-commerce"
4. Nombre: "AMC Market Catalog"
5. Click "Create"
6. Copia el ID del catálogo recién creado

---

## ✅ Verificación

Antes de continuar, asegúrate de tener:

- [ ] **Access Token** (largo, empieza con `EAA...`)
- [ ] **Catalog ID** (número de ~16 dígitos)

**Ejemplo de Access Token:**
```
EAABwzLixnjYBO...ZBxKdYZD (muy largo, ~200 caracteres)
```

**Ejemplo de Catalog ID:**
```
1234567890123456
```

---

## 🚨 Importante

- **NO compartas tu Access Token** con nadie
- El token expira cada 60 días (tendrás que renovarlo)
- El Catalog ID no expira

---

## 📝 Próximo Paso

Una vez que tengas ambas credenciales, avísame y continuamos con el **PASO 3: Configurar Supabase Secrets** 🚀
