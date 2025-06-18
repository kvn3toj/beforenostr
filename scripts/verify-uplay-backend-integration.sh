#!/bin/bash

# ============================================================================
# 🎬 VERIFICACIÓN ESPECÍFICA: REFACTORIZACIÓN UPLAY MODULE - COOMUNITY SUPERAPP
# ============================================================================
# Script para verificar la eliminación de datos mock y activación del Design System Cosmic
# en el módulo UPlay, siguiendo el patrón exitoso de UStats
# Basado en: https://github.com/s0md3v/hardcodes y técnicas de detección de hardcoding

echo "🎬 VERIFICANDO REFACTORIZACIÓN DEL MÓDULO UPLAY..."
echo "=================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Directorios y archivos críticos
UPLAY_DIR="Demo/apps/superapp-unified/src/components/modules/uplay"
HOOKS_DIR="Demo/apps/superapp-unified/src/hooks/uplay"
ENHANCED_VIDEO_PLAYER="$UPLAY_DIR/components/EnhancedInteractiveVideoPlayer.tsx"
UPLAY_MAIN="$UPLAY_DIR/UPlayMain.tsx"

# Contadores de verificación
CHECKS_PASSED=0
CHECKS_TOTAL=0
CRITICAL_ISSUES=0
RECOMMENDATIONS=()

# Función para verificar un aspecto específico
verify_check() {
    local check_name="$1"
    local check_command="$2"
    local success_message="$3"
    local failure_message="$4"
    local is_critical="$5"
    
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    
    echo ""
    echo -e "${CYAN}🔍 VERIFICANDO: $check_name${NC}"
    echo "----------------------------------------"
    
    if eval "$check_command"; then
        echo -e "${GREEN}✅ $success_message${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            echo -e "${RED}🚨 CRÍTICO: $failure_message${NC}"
            CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
        else
            echo -e "${YELLOW}⚠️ $failure_message${NC}"
        fi
        return 1
    fi
}

# Función para agregar recomendación
add_recommendation() {
    local rec="$1"
    RECOMMENDATIONS+=("$rec")
}

echo -e "${GREEN}🚀 INICIANDO VERIFICACIÓN ESPECÍFICA UPLAY...${NC}"
echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# ============================================================================
# 🚨 VERIFICACIONES CRÍTICAS - Eliminación de Datos Mock
# ============================================================================

echo -e "${RED}🚨 VERIFICACIONES CRÍTICAS - ELIMINACIÓN DE DATOS MOCK${NC}"
echo "================================================================"

# 1. Verificar eliminación de getMockQuestions
verify_check "Eliminación de getMockQuestions" \
    "! grep -q 'getMockQuestions' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "Función getMockQuestions eliminada correctamente" \
    "getMockQuestions aún presente - DEBE SER ELIMINADA" \
    "true"

if grep -q 'getMockQuestions' "$ENHANCED_VIDEO_PLAYER" 2>/dev/null; then
    echo "   📄 Líneas encontradas:"
    grep -n 'getMockQuestions' "$ENHANCED_VIDEO_PLAYER" | head -3
    add_recommendation "Eliminar completamente la función getMockQuestions y sus 250+ líneas de datos hardcodeados"
fi

# 2. Verificar eliminación de datos mock hardcodeados
verify_check "Eliminación de preguntas hardcodeadas" \
    "! grep -q 'Cuál es el principio fundamental del Ayni' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "Preguntas hardcodeadas eliminadas" \
    "Preguntas hardcodeadas aún presentes" \
    "true"

# 3. Verificar eliminación de setQuestionsData con mock
verify_check "Eliminación de setQuestionsData(getMockQuestions)" \
    "! grep -q 'setQuestionsData(getMockQuestions' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "Uso directo de datos mock eliminado" \
    "setQuestionsData aún usa datos mock directamente" \
    "true"

# 4. Verificar que backend integration no esté comentado
verify_check "Backend integration habilitado" \
    "! grep -q '// const backendQuestions' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "Backend integration habilitado correctamente" \
    "Backend integration aún comentado" \
    "true"

if grep -q '// const backendQuestions' "$ENHANCED_VIDEO_PLAYER" 2>/dev/null; then
    add_recommendation "Descomentar y habilitar la integración con backend de preguntas"
fi

# ============================================================================
# 🔧 VERIFICACIONES DE IMPLEMENTACIÓN - Hooks Dinámicos
# ============================================================================

echo ""
echo -e "${BLUE}🔧 VERIFICACIONES DE IMPLEMENTACIÓN - HOOKS DINÁMICOS${NC}"
echo "==========================================================="

# 5. Verificar creación de useVideoQuestions hook
verify_check "Creación de useVideoQuestions hook" \
    "[ -f '$HOOKS_DIR/useVideoQuestions.ts' ]" \
    "Hook useVideoQuestions creado" \
    "Hook useVideoQuestions no encontrado" \
    "false"

if [ ! -f "$HOOKS_DIR/useVideoQuestions.ts" ]; then
    add_recommendation "Crear src/hooks/uplay/useVideoQuestions.ts siguiendo patrón de UStats"
fi

# 6. Verificar uso del hook en EnhancedInteractiveVideoPlayer
verify_check "Uso de useVideoQuestions en componente" \
    "grep -q 'useVideoQuestions' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "useVideoQuestions implementado en componente" \
    "useVideoQuestions no utilizado en componente" \
    "false"

# 7. Verificar importación de React Query
verify_check "Importación de React Query" \
    "grep -q 'useQuery' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "React Query integrado" \
    "React Query no detectado" \
    "false"

# 8. Verificar estructura del directorio hooks
verify_check "Directorio hooks/uplay existe" \
    "[ -d '$HOOKS_DIR' ]" \
    "Directorio hooks/uplay estructurado correctamente" \
    "Directorio hooks/uplay no existe" \
    "false"

if [ ! -d "$HOOKS_DIR" ]; then
    add_recommendation "Crear directorio src/hooks/uplay/ para hooks específicos del módulo"
fi

# ============================================================================
# 🎨 VERIFICACIONES DESIGN SYSTEM COSMIC
# ============================================================================

echo ""
echo -e "${PURPLE}🎨 VERIFICACIONES DESIGN SYSTEM COSMIC${NC}"
echo "=============================================="

# 9. Verificar uso de CosmicCard
verify_check "Integración de CosmicCard" \
    "grep -q 'CosmicCard' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "CosmicCard integrado en UPlay" \
    "CosmicCard no implementado" \
    "false"

# 10. Verificar uso de RevolutionaryWidget
verify_check "Integración de RevolutionaryWidget" \
    "grep -q 'RevolutionaryWidget' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "RevolutionaryWidget integrado" \
    "RevolutionaryWidget no implementado" \
    "false"

# 11. Verificar importación del Design System
verify_check "Importación Design System Cosmic" \
    "grep -q '@/components/design-system/cosmic' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null || grep -q 'design-system' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "Design System Cosmic importado" \
    "Design System Cosmic no importado" \
    "false"

# 12. Verificar estados de carga cósmicos
verify_check "Estados de carga cósmicos" \
    "grep -q 'questionsLoading' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "Estados de carga implementados" \
    "Estados de carga no detectados" \
    "false"

# ============================================================================
# 🌐 VERIFICACIONES DE BACKEND INTEGRATION
# ============================================================================

echo ""
echo -e "${CYAN}🌐 VERIFICACIONES DE BACKEND INTEGRATION${NC}"
echo "=============================================="

# 13. Verificar endpoint de preguntas
verify_check "Endpoint de preguntas configurado" \
    "grep -q '/videos/.*questions' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null || [ -f '$HOOKS_DIR/useVideoQuestions.ts' ] && grep -q '/videos' '$HOOKS_DIR/useVideoQuestions.ts' 2>/dev/null" \
    "Endpoint de preguntas configurado" \
    "Endpoint de preguntas no configurado" \
    "false"

# 14. Verificar apiService integration
verify_check "ApiService integration" \
    "grep -q 'apiService' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null || [ -f '$HOOKS_DIR/useVideoQuestions.ts' ] && grep -q 'apiService' '$HOOKS_DIR/useVideoQuestions.ts' 2>/dev/null" \
    "ApiService integrado correctamente" \
    "ApiService no detectado" \
    "false"

# 15. Verificar configuración de environment
verify_check "Environment configuration" \
    "! grep -q 'VITE_FORCE_YOUTUBE_VIDEOS=true' Demo/apps/superapp-unified/.env 2>/dev/null" \
    "Environment configurado correctamente" \
    "VITE_FORCE_YOUTUBE_VIDEOS=true aún activo (fuerza mocks)" \
    "false"

if grep -q 'VITE_FORCE_YOUTUBE_VIDEOS=true' Demo/apps/superapp-unified/.env 2>/dev/null; then
    add_recommendation "Cambiar VITE_FORCE_YOUTUBE_VIDEOS=false en .env para desactivar mocks forzados"
fi

# ============================================================================
# 🧪 VERIFICACIONES DE TESTING Y CALIDAD
# ============================================================================

echo ""
echo -e "${YELLOW}🧪 VERIFICACIONES DE TESTING Y CALIDAD${NC}"
echo "==========================================="

# 16. Verificar que no hay console.log de debug
verify_check "Limpieza de console.log debug" \
    "! grep -q 'console.log.*mock' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "Console.log de debug limpiados" \
    "Console.log de debug aún presentes" \
    "false"

# 17. Verificar manejo de errores
verify_check "Manejo de errores implementado" \
    "grep -q 'error' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "Manejo de errores detectado" \
    "Manejo de errores no detectado" \
    "false"

# 18. Verificar fallback strategies
verify_check "Estrategias de fallback" \
    "grep -q 'fallback\|questions.length.*0' '$ENHANCED_VIDEO_PLAYER' 2>/dev/null" \
    "Estrategias de fallback implementadas" \
    "Estrategias de fallback no detectadas" \
    "false"

# ============================================================================
# 📊 ANÁLISIS DE ARCHIVOS ESPECÍFICOS
# ============================================================================

echo ""
echo -e "${BLUE}📊 ANÁLISIS DE ARCHIVOS ESPECÍFICOS${NC}"
echo "===================================="

# Análisis del archivo principal
if [ -f "$ENHANCED_VIDEO_PLAYER" ]; then
    echo "📄 Analizando: EnhancedInteractiveVideoPlayer.tsx"
    
    # Contar líneas de datos mock restantes
    MOCK_LINES=$(grep -c "id.*timestamp.*question" "$ENHANCED_VIDEO_PLAYER" 2>/dev/null || echo 0)
    if [ $MOCK_LINES -gt 0 ]; then
        echo -e "   ${RED}⚠️ $MOCK_LINES líneas de datos mock detectadas${NC}"
        add_recommendation "Eliminar las $MOCK_LINES líneas restantes de datos mock"
    else
        echo -e "   ${GREEN}✅ Sin datos mock detectados${NC}"
    fi
    
    # Verificar tamaño del archivo (debería reducirse significativamente)
    FILE_SIZE=$(wc -l < "$ENHANCED_VIDEO_PLAYER" 2>/dev/null || echo 0)
    echo "   📏 Tamaño actual del archivo: $FILE_SIZE líneas"
    
    if [ $FILE_SIZE -gt 1500 ]; then
        echo -e "   ${YELLOW}⚠️ Archivo aún muy grande, posibles datos mock remanentes${NC}"
    else
        echo -e "   ${GREEN}✅ Tamaño del archivo optimizado${NC}"
    fi
    
    # Verificar imports del Design System
    COSMIC_IMPORTS=$(grep -c "from.*design-system" "$ENHANCED_VIDEO_PLAYER" 2>/dev/null || echo 0)
    echo "   🎨 Imports del Design System Cosmic: $COSMIC_IMPORTS"
else
    echo -e "${RED}❌ Archivo EnhancedInteractiveVideoPlayer.tsx no encontrado${NC}"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
fi

# ============================================================================
# 📈 COMPARACIÓN CON PATRÓN USTATS
# ============================================================================

echo ""
echo -e "${PURPLE}📈 COMPARACIÓN CON PATRÓN USTATS EXITOSO${NC}"
echo "============================================"

USTATS_HOOK="Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts"
USTATS_MAIN="Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx"

if [ -f "$USTATS_HOOK" ] && [ -f "$USTATS_MAIN" ]; then
    echo "🔍 Comparando con patrón UStats exitoso..."
    
    # Verificar que UStats use React Query
    USTATS_QUERY=$(grep -c "useQuery" "$USTATS_HOOK" 2>/dev/null || echo 0)
    echo "   📊 UStats - useQuery hooks: $USTATS_QUERY"
    
    # Verificar que UStats use Design System Cosmic
    USTATS_COSMIC=$(grep -c "CosmicCard\|RevolutionaryWidget" "$USTATS_MAIN" 2>/dev/null || echo 0)
    echo "   🎨 UStats - Design System Cosmic: $USTATS_COSMIC usos"
    
    echo "   💡 Patrón a seguir: Hook con React Query + Componente con Design System Cosmic"
else
    echo -e "${YELLOW}⚠️ Patrón UStats no encontrado para comparación${NC}"
fi

# ============================================================================
# 📋 RESUMEN FINAL Y RECOMENDACIONES
# ============================================================================

echo ""
echo "============================================"
echo -e "${CYAN}📋 RESUMEN FINAL DE VERIFICACIÓN${NC}"
echo "============================================"

echo "📊 ESTADÍSTICAS:"
echo -e "   ✅ Verificaciones exitosas: $CHECKS_PASSED/$CHECKS_TOTAL"
echo -e "   🚨 Issues críticos: $CRITICAL_ISSUES"
echo -e "   💡 Recomendaciones generadas: ${#RECOMMENDATIONS[@]}"

COMPLETION_PERCENTAGE=$(( (CHECKS_PASSED * 100) / CHECKS_TOTAL ))
echo -e "   📈 Progreso de refactorización: $COMPLETION_PERCENTAGE%"

echo ""
echo "🎯 ESTADO DE LA REFACTORIZACIÓN:"

if [ $CRITICAL_ISSUES -eq 0 ] && [ $COMPLETION_PERCENTAGE -ge 80 ]; then
    echo -e "${GREEN}🎉 REFACTORIZACIÓN COMPLETADA EXITOSAMENTE${NC}"
    echo "   • Datos mock eliminados"
    echo "   • Backend integration activado"
    echo "   • Design System Cosmic integrado"
    echo "   • Siguiendo patrón UStats exitoso"
elif [ $CRITICAL_ISSUES -eq 0 ] && [ $COMPLETION_PERCENTAGE -ge 60 ]; then
    echo -e "${YELLOW}⚠️ REFACTORIZACIÓN EN PROGRESO AVANZADO${NC}"
    echo "   • Issues críticos resueltos"
    echo "   • Requiere optimizaciones finales"
elif [ $CRITICAL_ISSUES -gt 0 ]; then
    echo -e "${RED}🚨 REFACTORIZACIÓN REQUERIDA - ISSUES CRÍTICOS PENDIENTES${NC}"
    echo "   • $CRITICAL_ISSUES issues críticos deben resolverse"
    echo "   • Datos mock aún presentes"
else
    echo -e "${BLUE}🔄 REFACTORIZACIÓN EN ETAPA INICIAL${NC}"
    echo "   • Progreso: $COMPLETION_PERCENTAGE%"
fi

if [ ${#RECOMMENDATIONS[@]} -gt 0 ]; then
    echo ""
    echo "💡 RECOMENDACIONES PRIORITARIAS:"
    for i in "${!RECOMMENDATIONS[@]}"; do
        echo -e "   $((i+1)). ${RECOMMENDATIONS[$i]}"
    done
fi

echo ""
echo "🔗 PRÓXIMOS PASOS BASADOS EN PATRÓN USTATS:"
echo "   1. Crear useVideoQuestions hook (src/hooks/uplay/)"
echo "   2. Eliminar getMockQuestions completamente"
echo "   3. Integrar CosmicCard y RevolutionaryWidget"
echo "   4. Habilitar backend integration"
echo "   5. Testing con datos dinámicos"

echo ""
echo -e "${GREEN}✅ VERIFICACIÓN ESPECÍFICA UPLAY COMPLETADA${NC}"
echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=============================================="

# Determinar código de salida
if [ $CRITICAL_ISSUES -gt 0 ]; then
    echo -e "${RED}🚨 ACCIÓN REQUERIDA: Issues críticos deben resolverse antes de continuar${NC}"
    exit 2
elif [ $COMPLETION_PERCENTAGE -lt 60 ]; then
    echo -e "${YELLOW}⚠️ PROGRESO: Refactorización en curso, continuar implementación${NC}"
    exit 1
else
    echo -e "${GREEN}🎉 ÉXITO: Refactorización UPlay en buen estado${NC}"
    exit 0
fi 