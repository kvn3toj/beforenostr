#!/bin/bash

echo "🔍 VERIFICACIÓN DE PROBLEMAS POR RESTAURACIÓN DE MOCKS"
echo "================================================="
echo ""

# Verificar archivos mock que fueron eliminados en Phase 2 pero han sido restaurados
echo "📂 ARCHIVOS MOCK RESTAURADOS (NO DEBERÍAN EXISTIR):"
echo ""

# 1. testMockAuth.ts
if [ -f "Demo/apps/superapp-unified/src/utils/testMockAuth.ts" ]; then
    echo "❌ testMockAuth.ts RESTAURADO (debería estar eliminado)"
    echo "   Tamaño: $(wc -l < Demo/apps/superapp-unified/src/utils/testMockAuth.ts) líneas"
else
    echo "✅ testMockAuth.ts correctamente eliminado"
fi

# 2. marketplaceMockData.ts  
if [ -f "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts" ]; then
    echo "❌ marketplaceMockData.ts RESTAURADO (debería estar eliminado)"
    echo "   Tamaño: $(wc -l < Demo/apps/superapp-unified/src/data/marketplaceMockData.ts) líneas"
else
    echo "✅ marketplaceMockData.ts correctamente eliminado"
fi

# 3. useUPlayMockData.ts
if [ -f "Demo/apps/superapp-unified/src/hooks/useUPlayMockData.ts" ]; then
    echo "❌ useUPlayMockData.ts RESTAURADO (debería estar eliminado)"
    echo "   Tamaño: $(wc -l < Demo/apps/superapp-unified/src/hooks/useUPlayMockData.ts) líneas"
else
    echo "✅ useUPlayMockData.ts correctamente eliminado"
fi

# 4. lets-mock-service.ts
if [ -f "Demo/apps/superapp-unified/src/lib/lets-mock-service.ts" ]; then
    echo "❌ lets-mock-service.ts RESTAURADO (debería estar eliminado)"
    echo "   Tamaño: $(wc -l < Demo/apps/superapp-unified/src/lib/lets-mock-service.ts) líneas"
else
    echo "✅ lets-mock-service.ts correctamente eliminado"
fi

echo ""
echo "🔎 VERIFICACIÓN DE IMPORTS PROBLEMÁTICOS:"
echo ""

# Buscar imports a archivos mock eliminados
echo "🔍 Buscando imports a testMockAuth..."
grep -r "testMockAuth" Demo/apps/superapp-unified/src/ --include="*.ts" --include="*.tsx" | head -5

echo ""
echo "🔍 Buscando imports a marketplaceMockData..."
grep -r "marketplaceMockData" Demo/apps/superapp-unified/src/ --include="*.ts" --include="*.tsx" | head -5

echo ""
echo "🔍 Buscando imports a useUPlayMockData..."
grep -r "useUPlayMockData" Demo/apps/superapp-unified/src/ --include="*.ts" --include="*.tsx" | head -5

echo ""
echo "🔍 Buscando imports a lets-mock-service..."
grep -r "lets-mock-service" Demo/apps/superapp-unified/src/ --include="*.ts" --include="*.tsx" | head -5

echo ""
echo "⚙️ VERIFICACIÓN DE CONFIGURACIÓN:"
echo ""

# Verificar .env
echo "📋 Configuración de Mock Auth en .env:"
if grep -q "VITE_ENABLE_MOCK_AUTH" Demo/apps/superapp-unified/.env; then
    echo "❌ VITE_ENABLE_MOCK_AUTH encontrado en .env (debería estar eliminado)"
    grep "VITE_ENABLE_MOCK_AUTH" Demo/apps/superapp-unified/.env
else
    echo "✅ VITE_ENABLE_MOCK_AUTH correctamente eliminado de .env"
fi

echo ""
echo "🎯 ARCHIVOS DE BACKUP DETECTADOS:"
echo ""
find Demo/apps/superapp-unified/src -name "*.BACKUP*" -type f | while read file; do
    echo "📦 Backup: $file"
done

find _temp_mock_backups_* -type f 2>/dev/null | while read file; do
    echo "📦 Backup temp: $file"  
done

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN:"
echo ""

MOCK_COUNT=$(find Demo/apps/superapp-unified/src -name "*mock*" -type f | wc -l)
MOCK_UPPER_COUNT=$(find Demo/apps/superapp-unified/src -name "*Mock*" -type f | wc -l)
BACKUP_COUNT=$(find Demo/apps/superapp-unified/src -name "*.BACKUP*" -type f | wc -l)

echo "🔢 Archivos mock (lowercase): $MOCK_COUNT"
echo "🔢 Archivos Mock (uppercase): $MOCK_UPPER_COUNT" 
echo "🔢 Archivos backup: $BACKUP_COUNT"

if [ $MOCK_UPPER_COUNT -gt 0 ] || [ $BACKUP_COUNT -gt 0 ]; then
    echo ""
    echo "🚨 PROBLEMA DETECTADO: Archivos mock han sido restaurados"
    echo "   Esto puede estar causando problemas con los efectos visuales"
    echo "   implementados y comprometiendo la integración con backend real."
    echo ""
    echo "💡 RECOMENDACIÓN: Eliminar archivos mock restaurados y"
    echo "   confirmar que la SuperApp use solo backend NestJS real."
else
    echo ""
    echo "✅ NO HAY PROBLEMAS DETECTADOS"
fi

echo ""
echo "🏁 VERIFICACIÓN COMPLETADA" 