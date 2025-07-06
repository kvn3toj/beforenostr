#!/bin/bash
# Salir inmediatamente si un comando falla
set -e

echo "✅ [CoomÜnity-Deploy] Iniciando script de producción..."

# 1. Generar el cliente Prisma
echo "⚙️ [CoomÜnity-Deploy] Generando cliente Prisma..."
npx prisma generate --schema=./backend/prisma/schema.prisma

# 2. Aplicar migraciones
echo "🔄 [CoomÜnity-Deploy] Aplicando migraciones..."
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma

# 3. Ejecutar el sembrado (seed) de la base de datos
echo "🌱 [CoomÜnity-Deploy] Ejecutando el ritual de seed unificado (JavaScript compilado)..."
node ./backend/dist/prisma/seed.js
echo "✔️ [CoomÜnity-Deploy] Ritual de seed unificado completado."

# 4. Iniciar la aplicación principal
echo "🚀 [CoomÜnity-Deploy] Iniciando la aplicación NestJS..."
node ./backend/dist/main.js
