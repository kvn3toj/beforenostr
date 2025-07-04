#!/bin/bash
# 🌟 GRAN PURIFICACIÓN CÓSMICA - Script de Transmutación v2.0
echo "🌟 Iniciando Gran Purificación Cósmica del Backend..."

# Crear backups de seguridad
echo "📋 Creando backups de seguridad..."
find backend/src -name "*.ts" -exec cp {} {}.backup \;

# FASE 1: Correcciones principales con sed
echo "🔄 Aplicando correcciones automatizadas..."

# Reemplazos globales seguros
find backend/src -name "*.ts" -not -path "*/generated/*" -exec sed -i.tmp 's/\.balanceUnits/\.balance/g' {} \;
find backend/src -name "*.ts" -not -path "*/generated/*" -exec sed -i.tmp 's/balanceUnits:/balance:/g' {} \;
find backend/src -name "*.ts" -not -path "*/generated/*" -exec sed -i.tmp '/balanceToins/d' {} \;
find backend/src -name "*.ts" -not -path "*/generated/*" -exec sed -i.tmp '/tokenType.*CIRCULATING_UNIT/d' {} \;
find backend/src -name "*.ts" -not -path "*/generated/*" -exec sed -i.tmp '/tokenType.*PROMOTIONAL_UNIT/d' {} \;
find backend/src -name "*.ts" -not -path "*/generated/*" -exec sed -i.tmp '/tokenType.*MERIT/d' {} \;
find backend/src -name "*.ts" -not -path "*/generated/*" -exec sed -i.tmp '/status.*COMPLETED/d' {} \;

# Limpiar archivos temporales
find backend/src -name "*.tmp" -delete

echo "✅ Correcciones automatizadas completadas!"
