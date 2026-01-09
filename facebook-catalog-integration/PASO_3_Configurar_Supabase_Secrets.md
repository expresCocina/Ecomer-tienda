# 🔐 PASO 3: Configurar Supabase Secrets

Los secrets (variables secretas) permiten almacenar credenciales de forma segura en Supabase sin exponerlas en el código.

---

## 📋 Guía Paso a Paso

### 1. **Abrir Supabase Dashboard**

- Ve a: https://supabase.com/dashboard
- Selecciona tu proyecto

### 2. **Ir a Edge Functions Settings**

**Opción A: Desde el menú**
- Click en **"Edge Functions"** (menú lateral izquierdo)
- Click en **"Manage Secrets"** o el ícono de configuración ⚙️

**Opción B: Directo a Settings**
- Click en **"Project Settings"** (icono de engranaje abajo en el menú)
- Click en **"Edge Functions"** en la sección de settings

### 3. **Agregar los 3 Secrets**

Vas a agregar 3 variables secretas:

---

#### **Secret 1: FACEBOOK_ACCESS_TOKEN**

```
Name: FACEBOOK_ACCESS_TOKEN
Value: [Pega tu Access Token aquí]
```

**Ejemplo:**
```
FACEBOOK_ACCESS_TOKEN
EAABwzLixnjYBO7r9cP8wZBl4MgZBexample...
```

- Click **"Add Secret"** o **"Save"**

---

#### **Secret 2: FACEBOOK_CATALOG_ID**

```
Name: FACEBOOK_CATALOG_ID
Value: [Pega tu Catalog ID aquí]
```

**Ejemplo:**
```
FACEBOOK_CATALOG_ID
1234567890123456
```

- Click **"Add Secret"** o **"Save"**

---

#### **Secret 3: SITE_URL**

```
Name: SITE_URL
Value: https://ecomer-tienda.vercel.app
```

**Nota:** Esta es la URL de tu sitio en Vercel (sin `/` al final)

- Click **"Add Secret"** o **"Save"**

---

## ✅ Verificación

Después de agregar los 3 secrets, deberías ver algo como:

```
FACEBOOK_ACCESS_TOKEN    ••••••••••••••••
FACEBOOK_CATALOG_ID      ••••••••••••••••
SITE_URL                 https://ecomer-tienda.vercel.app
```

Los valores están ocultos por seguridad (se muestran como puntos).

---

## 🚨 Importante

- **NO compartas** estos secrets con nadie
- Los secrets están encriptados en Supabase
- Solo las Edge Functions pueden accederlos
- Si cambias el Access Token, actualiza el secret

---

## 🎯 Próximo Paso

Una vez configurados los 3 secrets, avísame para continuar con el **PASO 4: Desplegar Edge Function** 🚀

---

## 📝 Notas

### ¿Dónde encontrar cada valor?

**FACEBOOK_ACCESS_TOKEN:**
- Lo copiaste del Graph API Explorer
- Empieza con `EAA...`
- ~200 caracteres

**FACEBOOK_CATALOG_ID:**
- Lo copiaste de Commerce Manager
- Solo números
- ~16 dígitos

**SITE_URL:**
- Tu URL de Vercel
- `https://ecomer-tienda.vercel.app`
