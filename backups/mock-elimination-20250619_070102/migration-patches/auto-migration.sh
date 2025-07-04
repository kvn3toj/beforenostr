#!/bin/bash

# 🚀 SCRIPT DE MIGRACIÓN AUTOMÁTICA DE MOCK A BACKEND REAL
# Aplica cambios específicos para eliminar fallback logic

echo "🚀 Iniciando migración automática..."

SUPERAPP_DIR="Demo/apps/superapp-unified"

# 1. MIGRAR useRealBackendData.ts
echo "🔧 Migrando useRealBackendData.ts..."
if [[ -f "$SUPERAPP_DIR/src/hooks/useRealBackendData.ts" ]]; then
    # Eliminar Safe Mode checks
    sed -i.bak 's/isBuilderIoMode.*//g' "$SUPERAPP_DIR/src/hooks/useRealBackendData.ts"
    sed -i.bak 's/Builder\.io.*//g' "$SUPERAPP_DIR/src/hooks/useRealBackendData.ts"
    
    echo "  ✅ Safe Mode eliminado"
else
    echo "  ❌ useRealBackendData.ts no encontrado"
fi

# 2. MIGRAR analytics.service.ts
echo "🔧 Migrando analytics.service.ts..."
if [[ -f "$SUPERAPP_DIR/src/services/analytics.service.ts" ]]; then
    # Reemplazar endpoints mock por reales
    sed -i.bak 's|/analytics/mock|/analytics/video-progress|g' "$SUPERAPP_DIR/src/services/analytics.service.ts"
    
    echo "  ✅ Endpoints analytics actualizados"
else
    echo "  ❌ analytics.service.ts no encontrado"
fi

# 3. ELIMINAR IMPORTS MOCK
echo "🧹 Eliminando imports mock..."
find "$SUPERAPP_DIR/src" -name "*.ts" -o -name "*.tsx" | xargs sed -i.bak '/import.*mock/d'

echo "✅ Migración automática completada"
echo "📋 Archivos .bak creados como backup"
