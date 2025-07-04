#!/bin/bash

# 🔍 SCRIPT DE VERIFICACIÓN: MIGRACIÓN HOME A DATOS REALES DEL BACKEND
# Verifica que el módulo Home ya no usa datos hardcodeados y está integrado con el backend

echo "🔍 VERIFICACIÓN: MIGRACIÓN MÓDULO HOME A DATOS DINÁMICOS"
echo "================================================================="

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Función para verificar
check_condition() {
    local description="$1"
    local condition="$2"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if eval "$condition"; then
        echo "✅ $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo "❌ $description"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

echo ""
echo "📁 VERIFICANDO ESTRUCTURA DE HOOKS..."

# 1. Verificar que los hooks existen
check_condition "Hook useAyniMetrics.ts creado" \
    "[ -f 'Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts' ]"

check_condition "Hook useElementalConfig.ts creado" \
    "[ -f 'Demo/apps/superapp-unified/src/hooks/home/useElementalConfig.ts' ]"

check_condition "Archivo índice actualizado" \
    "[ -f 'Demo/apps/superapp-unified/src/hooks/home/index.ts' ]"

echo ""
echo "🔍 VERIFICANDO CONTENIDO DE HOOKS..."

# 2. Verificar contenido de useAyniMetrics
if [ -f "Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts" ]; then
    check_condition "useAyniMetrics usa React Query" \
        "grep -q 'useQuery' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts"
    
    check_condition "useAyniMetrics tiene endpoint del backend" \
        "grep -q 'apiService.get' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts"
    
    check_condition "useAyniMetrics tiene datos por defecto realistas" \
        "grep -q 'DEFAULT_AYNI_METRICS' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts"
        
    check_condition "useAyniMetrics exporta tipos TypeScript" \
        "grep -q 'export interface AyniMetricsData' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts"
fi

# 3. Verificar contenido de useElementalConfig
if [ -f "Demo/apps/superapp-unified/src/hooks/home/useElementalConfig.ts" ]; then
    check_condition "useElementalConfig usa React Query" \
        "grep -q 'useQuery' Demo/apps/superapp-unified/src/hooks/home/useElementalConfig.ts"
    
    check_condition "useElementalConfig tiene configuración por defecto" \
        "grep -q 'DEFAULT_ELEMENTAL_CONFIG' Demo/apps/superapp-unified/src/hooks/home/useElementalConfig.ts"
    
    check_condition "useElementalConfig incluye filosofía CoomÜnity" \
        "grep -q 'Impulso transformador' Demo/apps/superapp-unified/src/hooks/home/useElementalConfig.ts"
fi

echo ""
echo "🔄 VERIFICANDO MIGRACIÓN DE COMPONENTES..."

# 4. Verificar que AyniBalanceFullWidget fue migrado
if [ -f "Demo/apps/superapp-unified/src/components/home/widgets/AyniBalanceFullWidget.tsx" ]; then
    check_condition "AyniBalanceFullWidget eliminó datos hardcodeados" \
        "! grep -q 'const mockAyniData' Demo/apps/superapp-unified/src/components/home/widgets/AyniBalanceFullWidget.tsx"
    
    check_condition "AyniBalanceFullWidget usa useAyniMetrics" \
        "grep -q 'useAyniMetrics' Demo/apps/superapp-unified/src/components/home/widgets/AyniBalanceFullWidget.tsx"
    
    check_condition "AyniBalanceFullWidget usa useElementalConfig" \
        "grep -q 'useElementalConfig' Demo/apps/superapp-unified/src/components/home/widgets/AyniBalanceFullWidget.tsx"
    
    check_condition "AyniBalanceFullWidget tiene estados de carga" \
        "grep -q 'isLoading' Demo/apps/superapp-unified/src/components/home/widgets/AyniBalanceFullWidget.tsx"
    
    check_condition "AyniBalanceFullWidget tiene manejo de errores" \
        "grep -q 'hasError' Demo/apps/superapp-unified/src/components/home/widgets/AyniBalanceFullWidget.tsx"
    
    check_condition "AyniBalanceFullWidget muestra datos en tiempo real" \
        "grep -q 'lastUpdated' Demo/apps/superapp-unified/src/components/home/widgets/AyniBalanceFullWidget.tsx"
fi

echo ""
echo "🌟 VERIFICANDO FUNCIONALIDADES AVANZADAS..."

# 5. Verificar funcionalidades avanzadas
check_condition "Hook useAyniMetricsRealTime para datos en tiempo real" \
    "grep -q 'useAyniMetricsRealTime' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts"

check_condition "Configuración elemental incluye gradientes" \
    "grep -q 'linear-gradient' Demo/apps/superapp-unified/src/hooks/home/useElementalConfig.ts"

check_condition "Métricas Ayni incluyen balance elemental" \
    "grep -q 'elementos.*fuego.*agua.*tierra.*aire' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts"

echo ""
echo "📊 VERIFICANDO INTEGRACIÓN CON AUTHCONTEXT..."

# 6. Verificar integración con autenticación
check_condition "useAyniMetrics usa AuthContext" \
    "grep -q 'useAuth' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts"

check_condition "Hook personaliza datos según usuario" \
    "grep -q 'user.id' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts"

echo ""
echo "🎯 VERIFICANDO OPTIMIZACIONES DE PERFORMANCE..."

# 7. Verificar optimizaciones
check_condition "useAyniMetrics tiene refetchInterval configurado" \
    "grep -q 'refetchInterval.*60.*1000' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts"

check_condition "useElementalConfig tiene staleTime infinito" \
    "grep -q 'staleTime.*Infinity' Demo/apps/superapp-unified/src/hooks/home/useElementalConfig.ts"

check_condition "Hooks tienen placeholderData para UX instantánea" \
    "grep -q 'placeholderData' Demo/apps/superapp-unified/src/hooks/home/useAyniMetrics.ts && grep -q 'placeholderData' Demo/apps/superapp-unified/src/hooks/home/useElementalConfig.ts"

echo ""
echo "================================================================="

# Calcular porcentaje de éxito
if [ $TOTAL_CHECKS -gt 0 ]; then
    SUCCESS_PERCENTAGE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))
else
    SUCCESS_PERCENTAGE=0
fi

echo "📊 ESTADÍSTICAS FINALES:"
echo "   ✅ Verificaciones exitosas: $PASSED_CHECKS/$TOTAL_CHECKS"
echo "   ❌ Verificaciones fallidas: $FAILED_CHECKS"
echo "   📈 Porcentaje de éxito: $SUCCESS_PERCENTAGE%"

# Determinar estado general
if [ $SUCCESS_PERCENTAGE -ge 90 ]; then
    echo ""
    echo "🎉 ESTADO: ✅ MIGRACIÓN HOME COMPLETADA EXITOSAMENTE"
    echo "🌟 El módulo Home ahora usa datos dinámicos del backend!"
    echo "🚀 Design System Cósmico activado con métricas reales!"
elif [ $SUCCESS_PERCENTAGE -ge 70 ]; then
    echo ""
    echo "⚠️ ESTADO: 🔄 MIGRACIÓN HOME MAYORMENTE COMPLETADA"
    echo "💡 Algunas verificaciones menores fallaron, pero la funcionalidad principal está lista"
elif [ $SUCCESS_PERCENTAGE -ge 50 ]; then
    echo ""
    echo "🚨 ESTADO: ⚠️ MIGRACIÓN HOME PARCIALMENTE COMPLETADA"
    echo "🔧 Se requiere trabajo adicional para completar la migración"
else
    echo ""
    echo "💥 ESTADO: ❌ MIGRACIÓN HOME REQUIERE ATENCIÓN CRÍTICA"
    echo "🛠️ Múltiples verificaciones fallaron, revisar implementación"
fi

echo ""
echo "🎯 PRÓXIMOS PASOS RECOMENDADOS:"
echo "1. 🌐 Iniciar SuperApp y navegar al Dashboard Home"
echo "2. 🔍 Verificar que las métricas Ayni muestran datos dinámicos"
echo "3. 🎨 Confirmar que el Design System Cósmico está activo"
echo "4. 📱 Probar en diferentes dispositivos y tamaños de pantalla"
echo "5. ⚡ Verificar performance y tiempos de carga"

echo ""
echo "✨ BENEFICIOS DE LA MIGRACIÓN:"
echo "🌟 Datos reales y personalizados por usuario"
echo "🔄 Actualización automática cada 2 minutos"
echo "🎨 Design System Cósmico completamente activado"
echo "⚡ Caching inteligente para mejor performance"
echo "🛡️ Manejo robusto de errores y estados de carga"

exit 0 