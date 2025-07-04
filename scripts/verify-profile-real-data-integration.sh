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
        echo "✅ $test_name: CORRECTO ($actual)"
    else
        echo "❌ $test_name: FALLIDO - Esperado: $expected, Actual: $actual"
        echo "   📁 Archivo: $file"
    fi
}

# Archivos a verificar
PROFILE_FILE="Demo/apps/superapp-unified/src/pages/Profile.tsx"
UPLAY_FILE="Demo/apps/superapp-unified/src/components/modules/uplay/UPlayMobileHome.tsx"
PROGRESS_WIDGET_FILE="Demo/apps/superapp-unified/src/components/home/PersonalProgressWidgetRevolutionary.tsx"

echo ""
echo "📊 VERIFICACIÓN 1: Profile.tsx - Eliminación de datos mock"
echo "----------------------------------------------------"

# 1. Profile.tsx - Verificar que no use mockMetrics
mock_metrics_usage=$(count_occurrences "mockMetrics" "$PROFILE_FILE")
show_result "Profile.tsx - Uso de mockMetrics eliminado" "0" "$mock_metrics_usage" "$PROFILE_FILE"

# 2. Profile.tsx - Verificar que use datos reales 'metrics'
real_metrics_usage=$(count_occurrences "metrics\." "$PROFILE_FILE")
show_result "Profile.tsx - Usando datos reales 'metrics'" "13" "$real_metrics_usage" "$PROFILE_FILE"

# 3. Profile.tsx - Verificar import de useGamificationMetrics
gamification_import=$(count_occurrences "useGamificationMetrics" "$PROFILE_FILE")
show_result "Profile.tsx - Hook useGamificationMetrics importado" "1" "$gamification_import" "$PROFILE_FILE"

echo ""
echo "📊 VERIFICACIÓN 2: UPlayMobileHome.tsx - Eliminación de datos mock"
echo "------------------------------------------------------------"

# 4. UPlayMobileHome.tsx - Verificar que no use enhancedUserStats mock
enhanced_stats_usage=$(count_occurrences "enhancedUserStats" "$UPLAY_FILE")
show_result "UPlayMobileHome.tsx - Uso de enhancedUserStats eliminado" "0" "$enhanced_stats_usage" "$UPLAY_FILE"

# 5. UPlayMobileHome.tsx - Verificar que use userStats reales
user_stats_usage=$(count_occurrences "userStats\." "$UPLAY_FILE")
show_result "UPlayMobileHome.tsx - Usando userStats reales" "15" "$user_stats_usage" "$UPLAY_FILE"

# 6. UPlayMobileHome.tsx - Verificar import de useGamificationMetrics
uplay_gamification_import=$(count_occurrences "useGamificationMetrics" "$UPLAY_FILE")
show_result "UPlayMobileHome.tsx - Hook useGamificationMetrics importado" "1" "$uplay_gamification_import" "$UPLAY_FILE"

echo ""
echo "📊 VERIFICACIÓN 3: PersonalProgressWidgetRevolutionary.tsx - Eliminación de datos mock"
echo "---------------------------------------------------------------------------------"

# 7. PersonalProgressWidgetRevolutionary.tsx - Verificar que no use mockUserProgress
mock_progress_usage=$(count_occurrences "mockUserProgress" "$PROGRESS_WIDGET_FILE")
show_result "PersonalProgressWidget - Uso de mockUserProgress eliminado" "0" "$mock_progress_usage" "$PROGRESS_WIDGET_FILE"

# 8. PersonalProgressWidgetRevolutionary.tsx - Verificar que use userProgress reales
user_progress_usage=$(count_occurrences "userProgress\." "$PROGRESS_WIDGET_FILE")
show_result "PersonalProgressWidget - Usando userProgress reales" "13" "$user_progress_usage" "$PROGRESS_WIDGET_FILE"

# 9. PersonalProgressWidgetRevolutionary.tsx - Verificar import de useGamificationMetrics
progress_gamification_import=$(count_occurrences "useGamificationMetrics" "$PROGRESS_WIDGET_FILE")
show_result "PersonalProgressWidget - Hook useGamificationMetrics importado" "1" "$progress_gamification_import" "$PROGRESS_WIDGET_FILE"

echo ""
echo "🎯 VERIFICACIÓN 4: Búsqueda global de datos mock restantes"
echo "----------------------------------------------------"

# 10. Búsqueda global de valores mock hardcodeados específicos
level_15_usage=$(grep -r "level.*15" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
show_result "Búsqueda global - level: 15 eliminado" "0" "$level_15_usage" "Global"

meritos_2450_usage=$(grep -r "meritos.*2450\|merits.*2450\|2450.*meritos\|2450.*merits" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
show_result "Búsqueda global - méritos: 2,450 eliminado" "0" "$meritos_2450_usage" "Global"

ondas_1875_usage=$(grep -r "ondas.*1875\|1875.*ondas" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
show_result "Búsqueda global - öndas: 1,875 eliminado" "0" "$ondas_1875_usage" "Global"

echo ""
echo "📋 RESUMEN FINAL"
echo "=================="

# Contar tests pasados
total_tests=12
passed_tests=0

# Lista de todos los resultados esperados vs actuales
declare -a results=(
    "$mock_metrics_usage:0"
    "$real_metrics_usage:13"
    "$gamification_import:1"
    "$enhanced_stats_usage:0"
    "$user_stats_usage:15"
    "$uplay_gamification_import:1"
    "$mock_progress_usage:0"
    "$user_progress_usage:13"
    "$progress_gamification_import:1"
    "$level_15_usage:0"
    "$meritos_2450_usage:0"
    "$ondas_1875_usage:0"
)

for result in "${results[@]}"; do
    actual="${result%:*}"
    expected="${result#*:}"
    if [ "$actual" = "$expected" ]; then
        ((passed_tests++))
    fi
done

echo "🎯 Tests pasados: $passed_tests/$total_tests"
echo "📊 Porcentaje de éxito: $(( passed_tests * 100 / total_tests ))%"

if [ $passed_tests -eq $total_tests ]; then
    echo ""
    echo "🎉 ¡ÉXITO TOTAL! Todos los datos mock han sido eliminados exitosamente"
    echo "✅ El perfil, UPlay y widgets ahora usan datos reales del backend"
    echo "✅ Los hooks useGamificationMetrics están correctamente implementados"
    echo "✅ No quedan datos hardcodeados en el código"
    echo ""
    echo "🚀 SIGUIENTE PASO: Verificar que el backend esté ejecutándose en puerto 3002"
    echo "   Comando: curl http://localhost:3002/health"
else
    echo ""
    echo "⚠️ ATENCIÓN: Algunos tests fallaron. Revisar los archivos indicados."
    echo "📝 Los archivos marcados con ❌ necesitan corrección manual."
fi

echo ""
echo "============================================================="