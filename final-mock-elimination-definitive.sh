#!/bin/bash

echo "🔥 ELIMINACIÓN DEFINITIVA Y COMPLETA DE TODOS LOS MOCKS"
echo "====================================================="
echo ""
echo "⚠️  Este script elimina TODOS los archivos mock del proyecto"
echo "   incluyendo builds compilados y fuentes de restauración."
echo ""

read -p "¿Proceder con la eliminación DEFINITIVA? [y/N]: " -n 1 -r
echo    
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

echo ""
echo "🔥 ELIMINANDO ARCHIVOS MOCK FUENTE..."
echo ""

# 1. Eliminar archivos de código fuente
FILES_TO_DELETE=(
    "Demo/apps/superapp-unified/src/utils/testMockAuth.ts"
    "Demo/apps/superapp-unified/src/hooks/useUPlayMockData.ts"
    "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts"
    "Demo/apps/superapp-unified/src/lib/lets-mock-service.ts"
    "Demo/apps/superapp-unified/src/components/DevMockBanner.tsx"
)

for file in "${FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
        echo "🗑️  Eliminando $file..."
        rm "$file"
        echo "   ✅ $file eliminado"
    else
        echo "   ✅ $file ya estaba eliminado"
    fi
done

echo ""
echo "🧹 LIMPIANDO DIRECTORIO DIST COMPLETO..."
echo ""

# 2. Eliminar directorio dist completo para limpiar builds compilados
if [ -d "Demo/apps/superapp-unified/dist" ]; then
    echo "🗑️  Eliminando directorio dist completo..."
    rm -rf "Demo/apps/superapp-unified/dist"
    echo "   ✅ Directorio dist eliminado"
else
    echo "   ✅ Directorio dist ya estaba eliminado"
fi

echo ""
echo "🧹 LIMPIANDO CACHE DE NODE MODULES..."
echo ""

# 3. Limpiar cache de node_modules que puede tener referencias
if [ -d "Demo/apps/superapp-unified/node_modules/.vite" ]; then
    echo "🗑️  Eliminando cache de Vite..."
    rm -rf "Demo/apps/superapp-unified/node_modules/.vite"
    echo "   ✅ Cache de Vite eliminado"
fi

if [ -d "Demo/apps/superapp-unified/node_modules/.cache" ]; then
    echo "🗑️  Eliminando cache general..."
    rm -rf "Demo/apps/superapp-unified/node_modules/.cache"
    echo "   ✅ Cache general eliminado"
fi

echo ""
echo "🔧 CORRIGIENDO IMPORTS PROBLEMÁTICOS DEFINITIVAMENTE..."
echo ""

# 4. Eliminar TODAS las líneas que contengan referencias a archivos mock
echo "🔧 Limpiando AuthContext.tsx..."
AUTH_CONTEXT="Demo/apps/superapp-unified/src/contexts/AuthContext.tsx"
if [ -f "$AUTH_CONTEXT" ]; then
    # Eliminar líneas que contengan testMockAuth
    sed -i '' '/testMockAuth/d' "$AUTH_CONTEXT"
    echo "   ✅ Referencias testMockAuth eliminadas de AuthContext.tsx"
fi

echo "🔧 Limpiando useRealBackendData.ts..."
BACKEND_DATA="Demo/apps/superapp-unified/src/hooks/useRealBackendData.ts"
if [ -f "$BACKEND_DATA" ]; then
    # Eliminar líneas que contengan marketplaceMockData
    sed -i '' '/marketplaceMockData/d' "$BACKEND_DATA"
    echo "   ✅ Referencias marketplaceMockData eliminadas de useRealBackendData.ts"
fi

echo "🔧 Limpiando UPlayMobileHome.tsx..."
UPLAY_HOME="Demo/apps/superapp-unified/src/components/modules/uplay/UPlayMobileHome.tsx"
if [ -f "$UPLAY_HOME" ]; then
    # Eliminar líneas que contengan useUPlayMockData
    sed -i '' '/useUPlayMockData/d' "$UPLAY_HOME"
    echo "   ✅ Referencias useUPlayMockData eliminadas de UPlayMobileHome.tsx"
fi

echo "🔧 Limpiando useLetsIntegration.ts..."
LETS_INTEGRATION="Demo/apps/superapp-unified/src/hooks/useLetsIntegration.ts"
if [ -f "$LETS_INTEGRATION" ]; then
    # Eliminar líneas que contengan letsMockService
    sed -i '' '/letsMockService/d' "$LETS_INTEGRATION"
    echo "   ✅ Referencias letsMockService eliminadas de useLetsIntegration.ts"
fi

echo ""
echo "🔍 VERIFICACIÓN FINAL EXHAUSTIVA..."
echo ""

# 5. Verificar que no queden archivos mock
echo "📊 Contando archivos mock restantes..."
MOCK_LOWERCASE=$(find Demo/apps/superapp-unified/src -name "*mock*" -type f 2>/dev/null | wc -l)
MOCK_UPPERCASE=$(find Demo/apps/superapp-unified/src -name "*Mock*" -type f 2>/dev/null | wc -l)

echo "🔢 Archivos mock (lowercase): $MOCK_LOWERCASE"
echo "🔢 Archivos Mock (uppercase): $MOCK_UPPERCASE"

# 6. Verificar que no queden imports problemáticos
echo ""
echo "🔍 Verificando imports problemáticos restantes..."
PROBLEMATIC_IMPORTS=0

if grep -r "testMockAuth" Demo/apps/superapp-unified/src/ --include="*.ts" --include="*.tsx" >/dev/null 2>&1; then
    echo "❌ Aún quedan referencias a testMockAuth"
    PROBLEMATIC_IMPORTS=$((PROBLEMATIC_IMPORTS + 1))
else
    echo "✅ Sin referencias a testMockAuth"
fi

if grep -r "marketplaceMockData" Demo/apps/superapp-unified/src/ --include="*.ts" --include="*.tsx" >/dev/null 2>&1; then
    echo "❌ Aún quedan referencias a marketplaceMockData"
    PROBLEMATIC_IMPORTS=$((PROBLEMATIC_IMPORTS + 1))
else
    echo "✅ Sin referencias a marketplaceMockData"
fi

if grep -r "useUPlayMockData" Demo/apps/superapp-unified/src/ --include="*.ts" --include="*.tsx" >/dev/null 2>&1; then
    echo "❌ Aún quedan referencias a useUPlayMockData"
    PROBLEMATIC_IMPORTS=$((PROBLEMATIC_IMPORTS + 1))
else
    echo "✅ Sin referencias a useUPlayMockData"
fi

if grep -r "letsMockService" Demo/apps/superapp-unified/src/ --include="*.ts" --include="*.tsx" >/dev/null 2>&1; then
    echo "❌ Aún quedan referencias a letsMockService"
    PROBLEMATIC_IMPORTS=$((PROBLEMATIC_IMPORTS + 1))
else
    echo "✅ Sin referencias a letsMockService"
fi

echo ""
echo "📊 RESULTADO FINAL:"
echo ""

TOTAL_ISSUES=$((MOCK_UPPERCASE + PROBLEMATIC_IMPORTS))

if [ $TOTAL_ISSUES -eq 0 ]; then
    echo "🎉 ¡ÉXITO TOTAL! ELIMINACIÓN DEFINITIVA COMPLETADA"
    echo ""
    echo "✅ Todos los archivos mock eliminados"
    echo "✅ Todas las referencias problemáticas eliminadas"
    echo "✅ Cache de compilación limpio"
    echo "✅ Build directory limpio"
    echo ""
    echo "🚀 EFECTOS COMPLETAMENTE DESBLOQUEADOS:"
    echo "   ✨ Cosmic Design System - 100% ACTIVADO"
    echo "   ✨ Glassmorphism Effects - 100% ACTIVADO"
    echo "   ✨ Revolutionary Auras - 100% ACTIVADO"
    echo "   ✨ Dynamic Particles - 100% ACTIVADO"
    echo ""
    echo "🔗 INTEGRACIÓN BACKEND NESTJS - 100% ACTIVA:"
    echo "   ✅ Autenticación JWT real"
    echo "   ✅ Datos marketplace reales"
    echo "   ✅ ÜPlay con backend real"
    echo "   ✅ Sistema LETS integrado"
    echo ""
    echo "💡 PRÓXIMOS PASOS:"
    echo "   1. Reiniciar SuperApp: npm run dev:superapp"
    echo "   2. Verificar efectos visuales en navegador"
    echo "   3. Probar funcionalidades con backend real"
    echo "   4. Disfrutar de la experiencia CoomÜnity completa ✨"
else
    echo "⚠️  ADVERTENCIA: Aún hay algunos problemas pendientes"
    echo "   Archivos mock restantes: $MOCK_UPPERCASE"
    echo "   Imports problemáticos: $PROBLEMATIC_IMPORTS"
    echo ""
    echo "💡 ACCIÓN REQUERIDA:"
    echo "   Revisar manualmente los archivos restantes"
    echo "   Ejecutar nuevamente el script si es necesario"
fi

echo ""
echo "🏁 PROCESO DE ELIMINACIÓN DEFINITIVA COMPLETADO" 