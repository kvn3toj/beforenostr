#!/bin/bash
# Salir inmediatamente si un comando falla
set -e

# Notificar el inicio del script
echo "✅ [CoomÜnity-Deploy] Iniciando script de producción..."

# 1. Aplicar migraciones de la base de datos
echo "▶️ [CoomÜnity-Deploy] Aplicando migraciones de la base de datos..."
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma
echo "✔️ [CoomÜnity-Deploy] Migraciones aplicadas con éxito."

# 2. Iniciar la aplicación principal
echo "🚀 [CoomÜnity-Deploy] Iniciando la aplicación NestJS..."
node ./backend/dist/main.js
