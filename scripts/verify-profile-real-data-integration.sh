#!/bin/bash

# 🔍 Script de Verificación: Integración de Datos Reales en el Perfil
# Este script verifica que se hayan eliminado todos los datos mock hardcodeados

echo "🔍 VERIFICACIÓN: Integración de Datos Reales en el Perfil"
echo "============================================================="

# Función para contar ocurrencias
count_occurrences() {
    local pattern="$1"
    local file="$2"
    if [ -f "$file" ]; then
        grep -c "$pattern" "$file" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

# Función para mostrar resultados
show_result() {
    local test_name="$1"
    local expected="$2"
    local actual="$3"
    local file="$4"
    
    if [ "$actual" = "$expected" ]; then
        echo "✅ $test_name: CORRECTO ($actual en $file)"
    else
        echo "❌ $test_name: INCORRECTO (encontrado $actual, esperado $expected en $file)"
        return 1
    fi
}

failed_tests=0

echo "📋 Verificando eliminación de datos mock hardcodeados..."
echo ""

# 1. Verificar Profile.tsx - NO debe usar mockMetrics
PROFILE_FILE="Demo/apps/superapp-unified/src/pages/Profile.tsx"
mockMetrics_usage=$(count_occurrences "mockMetrics\." "$PROFILE_FILE")
show_result "Profile.tsx - Uso de mockMetrics eliminado" "0" "$mockMetrics_usage" "$PROFILE_FILE" || ((failed_tests++))

mockMetrics_definition=$(count_occurrences "const mockMetrics:" "$PROFILE_FILE") 
show_result "Profile.tsx - Definición de mockMetrics puede permanecer" "1" "$mockMetrics_definition" "$PROFILE_FILE" || echo "ℹ️  La definición puede permanecer para referencia"

# Verificar que está usando 'metrics' (datos reales)
metrics_usage=$(count_occurrences "metrics\." "$PROFILE_FILE")
if [ "$metrics_usage" -gt "5" ]; then
    echo "✅ Profile.tsx - Usando datos reales 'metrics': $metrics_usage usos"
else
    echo "❌ Profile.tsx - Pocos usos de 'metrics' reales: $metrics_usage"
    ((failed_tests++))
fi

# Verificar importación del hook de gamificación
gamification_hook_import=$(count_occurrences "useGamificationMetrics" "$PROFILE_FILE")
show_result "Profile.tsx - Hook useGamificationMetrics importado" "2" "$gamification_hook_import" "$PROFILE_FILE" || ((failed_tests++))

echo ""
echo "📋 Verificando otros archivos críticos..."
echo ""

# 2. Verificar UPlayMobileHome.tsx
UPLAY_FILE="Demo/apps/superapp-unified/src/components/modules/uplay/UPlayMobileHome.tsx"
enhancedUserStats_usage=$(count_occurrences "enhancedUserStats\." "$UPLAY_FILE")
if [ "$enhancedUserStats_usage" -gt "0" ]; then
    echo "⚠️  UPlayMobileHome.tsx - Aún usa enhancedUserStats mock: $enhancedUserStats_usage usos"
    echo "   📝 PENDIENTE: Integrar con hook useGamificationMetrics"
    ((failed_tests++))
else
    echo "✅ UPlayMobileHome.tsx - No usa enhancedUserStats mock"
fi

# 3. Verificar PersonalProgressWidgetRevolutionary.tsx
WIDGET_FILE="Demo/apps/superapp-unified/src/components/home/PersonalProgressWidgetRevolutionary.tsx"
mockUserProgress_usage=$(count_occurrences "mockUserProgress\." "$WIDGET_FILE")
if [ "$mockUserProgress_usage" -gt "0" ]; then
    echo "⚠️  PersonalProgressWidgetRevolutionary.tsx - Aún usa mockUserProgress: $mockUserProgress_usage usos"
    echo "   📝 PENDIENTE: Integrar con hook useGamificationMetrics"
    ((failed_tests++))
else
    echo "✅ PersonalProgressWidgetRevolutionary.tsx - No usa mockUserProgress mock"
fi

echo ""
echo "🌐 Verificando conectividad del backend..."
echo ""

# 4. Verificar que el backend esté funcionando
BACKEND_URL="http://localhost:3002"
if curl -s "$BACKEND_URL/health" > /dev/null; then
    echo "✅ Backend NestJS - Respondiendo en $BACKEND_URL"
    
    # Verificar endpoints de gamificación
    if curl -s "$BACKEND_URL/api/game/stats" > /dev/null; then
        echo "✅ Backend - Endpoint de estadísticas de juego disponible"
    else
        echo "⚠️  Backend - Endpoint /api/game/stats no disponible"
        echo "   📝 Verificar que el endpoint esté implementado en el backend"
    fi
else
    echo "❌ Backend NestJS - No responde en $BACKEND_URL"
    echo "   📝 Asegúrate de iniciar el backend: npm run dev:backend"
    ((failed_tests++))
fi

echo ""
echo "📱 Verificando SuperApp..."
echo ""

# 5. Verificar que la SuperApp esté funcionando
SUPERAPP_URL="http://localhost:3001"
if curl -s -I "$SUPERAPP_URL" | head -n 1 | grep -q "200"; then
    echo "✅ SuperApp - Respondiendo en $SUPERAPP_URL"
else
    echo "❌ SuperApp - No responde en $SUPERAPP_URL"
    echo "   📝 Asegúrate de iniciar la SuperApp: npm run dev:superapp"
    ((failed_tests++))
fi

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================="

total_tests=6
passed_tests=$((total_tests - failed_tests))

echo "✅ Tests pasados: $passed_tests/$total_tests"
echo "❌ Tests fallados: $failed_tests/$total_tests"

if [ $failed_tests -eq 0 ]; then
    echo ""
    echo "🎉 ¡PERFECTO! Integración de datos reales completada exitosamente"
    echo ""
    echo "📋 PRÓXIMOS PASOS RECOMENDADOS:"
    echo "1. Navegar a http://localhost:3001/profile"
    echo "2. Verificar que los valores mostrados sean 0 o datos reales del backend"
    echo "3. Si ves los valores anteriores (level: 15, meritos: 2450), hacer hard refresh (Ctrl+F5)"
    echo "4. Comprobar que los datos cambien cuando se actualicen en el backend"
    exit 0
else
    echo ""
    echo "⚠️  PENDIENTE: Algunos archivos aún usan datos mock"
    echo ""
    echo "📋 ACCIONES NECESARIAS:"
    
    if [ "$enhancedUserStats_usage" -gt "0" ]; then
        echo "• Corregir UPlayMobileHome.tsx para usar datos reales"
    fi
    
    if [ "$mockUserProgress_usage" -gt "0" ]; then
        echo "• Corregir PersonalProgressWidgetRevolutionary.tsx para usar datos reales"
    fi
    
    if ! curl -s "$BACKEND_URL/health" > /dev/null; then
        echo "• Iniciar el backend NestJS: npm run dev:backend"
    fi
    
    if ! curl -s -I "$SUPERAPP_URL" | head -n 1 | grep -q "200"; then
        echo "• Iniciar la SuperApp: npm run dev:superapp"
    fi
    
    echo ""
    echo "🔧 Una vez corregido, ejecutar nuevamente: bash scripts/verify-profile-real-data-integration.sh"
    exit 1
fi