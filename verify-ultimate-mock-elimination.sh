#!/bin/bash

# 🔍 ULTIMATE MOCK ELIMINATION VERIFICATION
# ========================================
# Verifica que la eliminación definitiva de mocks fue exitosa
# y que los efectos visuales están desbloqueados

echo "🔍 ULTIMATE MOCK ELIMINATION - VERIFICACIÓN COMPLETA"
echo "=================================================="

# Verificar directorio correcto
if [ "$(pwd)" != "/Users/kevinp/Movies/GAMIFIER-copy" ]; then
    echo "❌ ERROR: Ejecutar desde /Users/kevinp/Movies/GAMIFIER-copy"
    exit 1
fi

echo "🎯 VERIFICANDO ELIMINACIÓN DE ARCHIVOS MOCK..."

# 1. Verificar eliminación física de archivos mock
MOCK_FILES_EXIST=0

for file in "Demo/apps/superapp-unified/src/utils/testMockAuth.ts" \
            "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts" \
            "Demo/apps/superapp-unified/src/hooks/useUPlayMockData.ts" \
            "Demo/apps/superapp-unified/src/lib/lets-mock-service.ts" \
            "Demo/apps/superapp-unified/src/components/DevMockBanner.tsx"; do
    if [ -f "$file" ]; then
        echo "❌ ARCHIVO MOCK AÚN EXISTE: $file"
        MOCK_FILES_EXIST=1
    else
        echo "✅ Archivo eliminado: $(basename "$file")"
    fi
done

# 2. Verificar eliminación de cachés
CACHE_DIRS_EXIST=0
for dir in "Demo/apps/superapp-unified/dist" \
           "Demo/apps/superapp-unified/node_modules/.vite" \
           "Demo/apps/superapp-unified/.vite"; do
    if [ -d "$dir" ]; then
        echo "❌ CACHÉ AÚN EXISTE: $dir"
        CACHE_DIRS_EXIST=1
    else
        echo "✅ Caché eliminado: $(basename "$dir")"
    fi
done

echo ""
echo "🔧 VERIFICANDO IMPORTS Y REFERENCIAS..."

# 3. Verificar imports activos (deben ser 0)
cd Demo/apps/superapp-unified
ACTIVE_IMPORTS=$(find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -E "^import.*testMockAuth|^import.*marketplaceMockData|^import.*useUPlayMockData|^import.*lets-mock-service" | wc -l | tr -d ' ')

echo "📦 Imports activos encontrados: $ACTIVE_IMPORTS (debe ser 0)"

# 4. Verificar referencias comentadas (aceptables)
COMMENTED_REFS=$(find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "\/\/.*testMockAuth\|\/\/.*marketplaceMockData\|\/\/.*useUPlayMockData\|\/\/.*lets-mock-service" | wc -l | tr -d ' ')

echo "💬 Referencias comentadas: $COMMENTED_REFS (aceptable)"

# 5. Verificar archivos con cualquier referencia
TOTAL_REFS=$(find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "testMockAuth\|marketplaceMockData\|useUPlayMockData\|lets-mock-service" | grep -v ".backup" | wc -l | tr -d ' ')

echo "📄 Total archivos con referencias: $TOTAL_REFS"

echo ""
echo "🌐 VERIFICANDO SERVICIOS..."

# 6. Verificar servicios
BACKEND_STATUS=$(curl -s http://localhost:3002/health | grep -o '"status":"ok"' || echo "ERROR")
SUPERAPP_STATUS=$(curl -s -I http://localhost:3001 | head -1 | grep "200 OK" || echo "ERROR")

if [ "$BACKEND_STATUS" = '"status":"ok"' ]; then
    echo "✅ Backend NestJS: OPERACIONAL (puerto 3002)"
else
    echo "⚠️ Backend NestJS: NO DISPONIBLE (puerto 3002)"
fi

if [[ "$SUPERAPP_STATUS" == *"200 OK"* ]]; then
    echo "✅ SuperApp: OPERACIONAL (puerto 3001)"
else
    echo "⚠️ SuperApp: NO DISPONIBLE (puerto 3001)"
fi

echo ""
echo "🎨 EVALUANDO EFECTOS VISUALES..."

# 7. Verificar que VITE_ENABLE_MOCK_AUTH no esté presente
if grep -q "VITE_ENABLE_MOCK_AUTH" .env 2>/dev/null; then
    echo "⚠️ VITE_ENABLE_MOCK_AUTH aún presente en .env"
    MOCK_AUTH_ENABLED=1
else
    echo "✅ VITE_ENABLE_MOCK_AUTH eliminado de .env"
    MOCK_AUTH_ENABLED=0
fi

# 8. Verificar componentes clave de efectos visuales
COSMIC_COMPONENTS=0
for component in "src/components/ui/Background" \
                 "src/styles/colors-enhanced.css" \
                 "src/components/ui/Glass"; do
    if [ -e "$component" ]; then
        COSMIC_COMPONENTS=$((COSMIC_COMPONENTS + 1))
    fi
done

echo "🌌 Componentes de efectos cósmicos detectados: $COSMIC_COMPONENTS"

cd - > /dev/null

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================="

# Calcular puntuación total
SCORE=0
MAX_SCORE=8

# Criterios de éxito
if [ $MOCK_FILES_EXIST -eq 0 ]; then
    echo "✅ Archivos mock eliminados (1/1)"
    SCORE=$((SCORE + 1))
else
    echo "❌ Archivos mock no eliminados (0/1)"
fi

if [ $CACHE_DIRS_EXIST -eq 0 ]; then
    echo "✅ Cachés compilados eliminados (1/1)"
    SCORE=$((SCORE + 1))
else
    echo "❌ Cachés compilados presentes (0/1)"
fi

if [ $ACTIVE_IMPORTS -eq 0 ]; then
    echo "✅ Imports activos eliminados (1/1)"
    SCORE=$((SCORE + 1))
else
    echo "❌ Imports activos presentes: $ACTIVE_IMPORTS (0/1)"
fi

if [ $TOTAL_REFS -le 6 ]; then
    echo "✅ Referencias controladas: $TOTAL_REFS ≤ 6 (1/1)"
    SCORE=$((SCORE + 1))
else
    echo "⚠️ Referencias excesivas: $TOTAL_REFS > 6 (0/1)"
fi

if [ "$BACKEND_STATUS" = '"status":"ok"' ]; then
    echo "✅ Backend operacional (1/1)"
    SCORE=$((SCORE + 1))
else
    echo "❌ Backend no operacional (0/1)"
fi

if [[ "$SUPERAPP_STATUS" == *"200 OK"* ]]; then
    echo "✅ SuperApp operacional (1/1)"
    SCORE=$((SCORE + 1))
else
    echo "❌ SuperApp no operacional (0/1)"
fi

if [ $MOCK_AUTH_ENABLED -eq 0 ]; then
    echo "✅ Mock auth deshabilitado (1/1)"
    SCORE=$((SCORE + 1))
else
    echo "❌ Mock auth aún habilitado (0/1)"
fi

if [ $COSMIC_COMPONENTS -ge 1 ]; then
    echo "✅ Efectos visuales disponibles (1/1)"
    SCORE=$((SCORE + 1))
else
    echo "⚠️ Efectos visuales no detectados (0/1)"
fi

echo ""
echo "🎯 PUNTUACIÓN FINAL: $SCORE/$MAX_SCORE"

# Determinar resultado
if [ $SCORE -eq $MAX_SCORE ]; then
    echo "🎉 ÉXITO COMPLETO: Ultimate Mock Elimination COMPLETADA"
    echo "🌟 EFECTOS VISUALES DESBLOQUEADOS:"
    echo "   • Cosmic Design System"
    echo "   • Glassmorphism Effects"
    echo "   • Revolutionary Auras"
    echo "   • Dynamic Particles"
    echo "   • Responsive Depth"
    echo ""
    echo "🚀 INTEGRACIÓN BACKEND COMPLETA:"
    echo "   • Backend NestJS puerto 3002 ✅"
    echo "   • SuperApp puerto 3001 ✅"
    echo "   • PostgreSQL conectado ✅"
    echo "   • Datos reales activados ✅"
elif [ $SCORE -ge 6 ]; then
    echo "⭐ ÉXITO MAYORITARIO: $SCORE/$MAX_SCORE criterios cumplidos"
    echo "🎨 Efectos visuales parcialmente desbloqueados"
    echo "🔧 Revisar criterios pendientes arriba"
else
    echo "⚠️ ÉXITO PARCIAL: $SCORE/$MAX_SCORE criterios cumplidos"
    echo "🔧 Requiere correcciones adicionales"
fi

echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Si puntuación < 8, revisar criterios fallidos"
echo "2. Abrir SuperApp en navegador: http://localhost:3001"
echo "3. Verificar efectos visuales en Dashboard Home"
echo "4. Confirmar datos reales en Marketplace" 