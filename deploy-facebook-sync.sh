#!/bin/bash
# Script para desplegar la función sync-facebook-catalog a Supabase

echo "🚀 Desplegando sync-facebook-catalog a producción..."

# Asegúrate de tener Supabase CLI instalado
# npm install -g supabase

# Desplegar la función
supabase functions deploy sync-facebook-catalog --project-ref YOUR_PROJECT_REF

echo "✅ Despliegue completado"
