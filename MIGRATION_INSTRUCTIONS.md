# Instrucciones para Ejecutar Migración

## Opción 1: Supabase Dashboard (Recomendado)

1. Ir a: https://supabase.com/dashboard/project/zxcgdmlynurugzolwqdf/sql/new
2. Copiar y pegar el contenido del archivo `20260206_add_catalog_metadata.sql`
3. Hacer clic en "Run"
4. Verificar que se ejecutó correctamente

## Opción 2: SQL Editor Local

Si tienes acceso a psql o cualquier cliente PostgreSQL:

```bash
psql -h <host> -U postgres -d postgres -f supabase/migrations/20260206_add_catalog_metadata.sql
```

## Verificación

Después de ejecutar la migración, verifica que las columnas se crearon:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name IN ('google_product_category', 'gender', 'age_group', 'condition', 'brand', 'material')
ORDER BY column_name;
```

Deberías ver 6 filas con las nuevas columnas.

## Contenido de la Migración

El archivo `supabase/migrations/20260206_add_catalog_metadata.sql` contiene:

- Agregar 6 columnas nuevas a `products`
- Crear índices para búsquedas optimizadas
- Agregar comentarios de documentación
- Actualizar productos existentes con valores por defecto
