#!/bin/bash
# Salir inmediatamente si un comando falla
set -e

echo "✅ [CoomÜnity-Deploy] Iniciando script de producción..."

# 1. Aplicar migraciones de la base de datos con reintentos
echo "▶️ [CoomÜnity-Deploy] Aplicando migraciones de la base de datos..."
for i in {1..3}; do
  if npx prisma migrate deploy --schema=./backend/prisma/schema.prisma; then
    echo "✔️ [CoomÜnity-Deploy] Migraciones aplicadas exitosamente."
    break
  else
    echo "⚠️ [CoomÜnity-Deploy] Intento de migración $i fallido. Reintentando en 5 segundos..."
    sleep 5
  fi
  if [ $i -eq 3 ]; then
    echo "❌ [CoomÜnity-Deploy] La migración falló después de 3 intentos."
    exit 1
  fi
done

# 2. Ejecutar el sembrado (seed) de la base de datos
echo "🌱 [CoomÜnity-Deploy] Ejecutando el ritual de seed para asegurar la existencia de datos primordiales..."
npx prisma db seed --schema=./backend/prisma/schema.prisma
echo "✔️ [CoomÜnity-Deploy] Ritual de seed completado."

# 3. Iniciar la aplicación principal
echo "🚀 [CoomÜnity-Deploy] Iniciando la aplicación NestJS..."
node ./backend/dist/main.js
