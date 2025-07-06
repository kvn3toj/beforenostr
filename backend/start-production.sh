#!/bin/bash
# =================================================================
# CoomÜnity Backend - Script de Inicio Robusto para Producción
# Manejo de errores P1017 y conexiones PostgreSQL
# =================================================================

set -e

echo "🚀 Iniciando secuencia de arranque del backend CoomÜnity..."

# 1. Aplicar migraciones de la base de datos
echo "📊 Aplicando migraciones de base de datos..."
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma

# 2. Generar cliente de Prisma (por si acaso)
echo "🔧 Generando cliente de Prisma..."
npx prisma generate --schema=./backend/prisma/schema.prisma

# 3. Iniciar la aplicación principal
echo "🌟 Iniciando aplicación CoomÜnity Backend..."
node ./backend/dist/main.js
