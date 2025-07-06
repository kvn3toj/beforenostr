#!/bin/bash
set -e
echo "✅ [CoomÜnity-Deploy] Iniciando script de producción..."
echo "▶️ [CoomÜnity-Deploy] Aplicando migraciones de la base de datos..."
npx prisma migrate deploy --schema=./backend/prisma/schema.prisma
echo "✔️ [CoomÜnity-Deploy] Migraciones aplicadas con éxito."
echo "🚀 [CoomÜnity-Deploy] Iniciando la aplicación NestJS..."
node ./backend/dist/main.js
