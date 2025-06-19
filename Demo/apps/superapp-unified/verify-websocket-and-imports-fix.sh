#!/bin/bash

# 🔧 Verification Script - WebSocket & Grid Errors Fix
# Verifica que todas las correcciones se aplicaron exitosamente

echo "🔧 WebSocket & Grid Errors Fix Verification"
echo "============================================"

SUCCESS_COUNT=0
TOTAL_TESTS=7

# Test 1: Verificar que RevolutionaryWidget está importado
echo ""
echo "📋 TEST 1: RevolutionaryWidget Import Fix"
echo "-----------------------------------------"
if grep -q "import { RevolutionaryWidget }" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayEnhancedDashboard.tsx; then
    echo "✅ RevolutionaryWidget import está presente"
    ((SUCCESS_COUNT++))
else
    echo "❌ RevolutionaryWidget import faltante"
fi

# Test 2: Verificar que las props son correctas
echo ""
echo "📋 TEST 2: RevolutionaryWidget Props Fix"
echo "---------------------------------------"
if grep -q 'cosmicIntensity="low"' Demo/apps/superapp-unified/src/components/modules/uplay/UPlayEnhancedDashboard.tsx; then
    echo "✅ cosmicIntensity prop correcta"
    ((SUCCESS_COUNT++))
else
    echo "❌ cosmicIntensity prop incorrecta"
fi

# Test 3: Verificar que no hay cálculos problemáticos de Grid
echo ""
echo "📋 TEST 3: Grid Calculation Fix"
echo "-------------------------------"
if ! grep -q "12/7" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayEnhancedDashboard.tsx; then
    echo "✅ No hay cálculos problemáticos 12/7 en Grid"
    ((SUCCESS_COUNT++))
else
    echo "❌ Aún existen cálculos problemáticos 12/7"
fi

# Test 4: Verificar que el HTML structure error está corregido
echo ""
echo "📋 TEST 4: HTML Structure Fix (Box → span)"
echo "-----------------------------------------"
# Verificar que no hay Box en secondary prop de ListItemText
if ! grep -A5 -B5 "secondary={" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayEnhancedDashboard.tsx | grep -q "<Box"; then
    echo "✅ No hay Box elements en secondary props"
    ((SUCCESS_COUNT++))
else
    echo "❌ Aún hay Box elements en secondary props"
fi

# Test 5: Verificar que se usa span en lugar de Box
echo ""
echo "📋 TEST 5: Span Elements Usage"
echo "-----------------------------"
if grep -q "<span style=" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayEnhancedDashboard.tsx; then
    echo "✅ Span elements utilizados correctamente"
    ((SUCCESS_COUNT++))
else
    echo "❌ Span elements no encontrados"
fi

# Test 6: Verificar configuración WebSocket correcta
echo ""
echo "📋 TEST 6: WebSocket Configuration"
echo "---------------------------------"
if grep -q 'url.*localhost:3002' Demo/apps/superapp-unified/src/lib/websocket-service.ts; then
    echo "✅ WebSocket configurado para puerto 3002 (backend)"
    ((SUCCESS_COUNT++))
else
    echo "❌ WebSocket mal configurado"
fi

# Test 7: Verificar servicios disponibles
echo ""
echo "📋 TEST 7: Services Availability"
echo "-------------------------------"
# Verificar SuperApp
SUPERAPP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null)
if [ "$SUPERAPP_STATUS" = "200" ]; then
    echo "✅ SuperApp accessible (puerto 3001)"
    ((SUCCESS_COUNT++))
else
    echo "❌ SuperApp no accessible (HTTP $SUPERAPP_STATUS)"
fi

# Verificar Backend (opcional para WebSocket)
echo ""
echo "🌐 BONUS: Backend Availability Check"
echo "-----------------------------------"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health 2>/dev/null)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend NestJS available (puerto 3002) - WebSocket ready"
else
    echo "ℹ️  Backend NestJS not available (HTTP $BACKEND_STATUS) - WebSocket no disponible"
fi

# Resumen final
echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================="
echo "✅ Tests exitosos: $SUCCESS_COUNT/$TOTAL_TESTS"
echo "📊 Porcentaje de éxito: $(( SUCCESS_COUNT * 100 / TOTAL_TESTS ))%"

if [ $SUCCESS_COUNT -eq $TOTAL_TESTS ]; then
    echo ""
    echo "🎉 ¡TODAS LAS CORRECCIONES APLICADAS EXITOSAMENTE!"
    echo "🔧 Problemas resueltos:"
    echo "   ✅ RevolutionaryWidget import y props"
    echo "   ✅ Grid calculations (NaN width)"
    echo "   ✅ HTML structure (div in p)"
    echo "   ✅ WebSocket configuration"
    echo "   ✅ SuperApp accesible"
    echo ""
    echo "🌐 Para probar WebSocket:"
    echo "   1. Asegúrate de que el backend esté ejecutándose: npm run dev:backend"
    echo "   2. Visita: http://localhost:3001/websocket-test"
    echo "   3. Inicia sesión y prueba la conexión WebSocket"
    exit 0
else
    echo ""
    echo "⚠️  Algunas verificaciones fallaron ($((TOTAL_TESTS - SUCCESS_COUNT))/$TOTAL_TESTS)"
    echo "📋 Revisa los errores marcados arriba"
    exit 1
fi 