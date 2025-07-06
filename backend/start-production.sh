#!/bin/bash
# Salir inmediatamente si un comando falla
set -e

echo "✅ [CoomÜnity-Deploy] Iniciando script de producción..."

# 1. Ejecutar script de migración forzada
echo "🔧 [CoomÜnity-Deploy] Ejecutando script de migración forzada..."
bash ./force-migrations.sh

# 2. Ejecutar el sembrado (seed) de la base de datos
echo "🌱 [CoomÜnity-Deploy] Ejecutando el ritual de seed unificado (JavaScript compilado)..."
node ./dist/prisma/seed.js
echo "✔️ [CoomÜnity-Deploy] Ritual de seed unificado completado."

# 3. Iniciar la aplicación principal
echo "🚀 [CoomÜnity-Deploy] Iniciando la aplicación NestJS..."
node ./dist/main.js
