#!/bin/bash
# Script para forzar migraciones en producción - Marketplace Fix
set -e

echo "🔧 [CoomÜnity-Marketplace-Fix] Iniciando script de migración forzada..."

# Verificar estado de migraciones
echo "📊 [CoomÜnity-Marketplace-Fix] Verificando estado de migraciones..."
npx prisma migrate status --schema=./prisma/schema.prisma

# Generar el cliente Prisma
echo "⚙️ [CoomÜnity-Marketplace-Fix] Generando cliente Prisma..."
npx prisma generate --schema=./prisma/schema.prisma

# Aplicar migraciones con reintentos
echo "🔄 [CoomÜnity-Marketplace-Fix] Aplicando migraciones..."
for i in {1..5}; do
  if npx prisma migrate deploy --schema=./prisma/schema.prisma; then
    echo "✅ [CoomÜnity-Marketplace-Fix] Migraciones aplicadas exitosamente."
    break
  else
    echo "⚠️ [CoomÜnity-Marketplace-Fix] Intento $i fallido. Reintentando en 10 segundos..."
    sleep 10
  fi
  if [ $i -eq 5 ]; then
    echo "❌ [CoomÜnity-Marketplace-Fix] La migración falló después de 5 intentos."
    exit 1
  fi
done

# Verificar estado final
echo "🔍 [CoomÜnity-Marketplace-Fix] Verificando estado final de migraciones..."
npx prisma migrate status --schema=./prisma/schema.prisma

echo "🎉 [CoomÜnity-Marketplace-Fix] Script de migración forzada completado exitosamente."
