#!/bin/bash

# 🔥 SCRIPT DE VERIFICACIÓN: TRANSFORMACIÓN MÓDULO USTATS CON DESIGN SYSTEM CÓSMICO
# ================================================================================
# Verifica que el módulo UStats ha sido transformado exitosamente con CosmicCard,
# RevolutionaryWidget y el tema "fuego" para crear una experiencia energizante.

echo "🔥 INICIANDO VERIFICACIÓN DE TRANSFORMACIÓN USTATS CÓSMICO..."
echo "================================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Contadores
CHECKS_PASSED=0
CHECKS_TOTAL=0

# Función para verificar archivos
check_file_contains() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    
    if [ -f "$file" ]; then
        if grep -q "$pattern" "$file"; then
            echo -e "  ✅ ${GREEN}PASSED${NC} - $description"
            CHECKS_PASSED=$((CHECKS_PASSED + 1))
        else
            echo -e "  ❌ ${RED}FAILED${NC} - $description"
            echo -e "     ${YELLOW}Pattern not found:${NC} $pattern"
        fi
    else
        echo -e "  ❌ ${RED}FAILED${NC} - File not found: $file"
    fi
}

# Función para verificar múltiples patrones
check_multiple_patterns() {
    local file="$1"
    local description="$2"
    shift 2
    
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    local all_found=true
    
    if [ -f "$file" ]; then
        for pattern in "$@"; do
            if ! grep -q "$pattern" "$file"; then
                all_found=false
                break
            fi
        done
        
        if [ "$all_found" = true ]; then
            echo -e "  ✅ ${GREEN}PASSED${NC} - $description"
            CHECKS_PASSED=$((CHECKS_PASSED + 1))
        else
            echo -e "  ❌ ${RED}FAILED${NC} - $description"
            echo -e "     ${YELLOW}Some patterns not found in file${NC}"
        fi
    else
        echo -e "  ❌ ${RED}FAILED${NC} - File not found: $file"
    fi
}

echo ""
echo "🔍 1. VERIFICANDO TRANSFORMACIÓN DE USTATS MAIN"
echo "================================================"

USTATS_MAIN_FILE="Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx"

check_file_contains "$USTATS_MAIN_FILE" "import.*RevolutionaryWidget.*from.*design-system" \
    "Import de RevolutionaryWidget en UStatsMain"

check_file_contains "$USTATS_MAIN_FILE" "<RevolutionaryWidget" \
    "Uso de RevolutionaryWidget wrapper"

check_file_contains "$USTATS_MAIN_FILE" 'element="fuego"' \
    "Configuración de elemento fuego"

check_file_contains "$USTATS_MAIN_FILE" "particleTheme.*embers" \
    "Configuración de tema de partículas embers"

check_file_contains "$USTATS_MAIN_FILE" "enableGlow.*true" \
    "Activación de efectos glow"

echo ""
echo "🎴 2. VERIFICANDO TRANSFORMACIÓN DE TARJETAS"
echo "============================================="

MINIMAL_CARD_FILE="Demo/apps/superapp-unified/src/components/modules/ustats/components/MinimalMetricCard.tsx"

check_file_contains "$MINIMAL_CARD_FILE" "import.*CosmicCard.*from.*design-system" \
    "Import de CosmicCard en MinimalMetricCard"

check_file_contains "$MINIMAL_CARD_FILE" "<CosmicCard" \
    "Uso de CosmicCard en MinimalMetricCard"

check_multiple_patterns "$MINIMAL_CARD_FILE" "Configuración completa CosmicCard MinimalMetricCard" \
    'element="fuego"' \
    'enableGlow={true}' \
    'enableAnimations={true}'

GAMING_CARD_FILE="Demo/apps/superapp-unified/src/components/modules/ustats/components/GamingStatsCard.tsx"

check_file_contains "$GAMING_CARD_FILE" "import.*CosmicCard.*from.*design-system" \
    "Import de CosmicCard en GamingStatsCard"

check_file_contains "$GAMING_CARD_FILE" "<CosmicCard" \
    "Uso de CosmicCard en GamingStatsCard"

check_multiple_patterns "$GAMING_CARD_FILE" "Configuración completa CosmicCard GamingStatsCard" \
    'element="fuego"' \
    'enableGlow={true}' \
    'enableAnimations={true}' \
    'enableParticles={true}'

echo ""
echo "🌟 3. VERIFICANDO CONFIGURACIONES CÓSMICAS"
echo "=========================================="

check_file_contains "$USTATS_MAIN_FILE" "🔥.*Estadísticas.*Progreso" \
    "Título cósmico con emoji de fuego"

check_file_contains "$USTATS_MAIN_FILE" "cosmicEffects.*{" \
    "Configuración de efectos cósmicos"

check_file_contains "$USTATS_MAIN_FILE" "glowIntensity.*1\.2" \
    "Intensidad de glow configurada"

check_file_contains "$USTATS_MAIN_FILE" "interactionMode.*hover" \
    "Modo de interacción hover configurado"

echo ""
echo "🎨 4. VERIFICANDO TEMA FUEGO"
echo "============================"

check_file_contains "$MINIMAL_CARD_FILE" 'variant="primary"' \
    "Variante primary en MinimalMetricCard"

check_file_contains "$GAMING_CARD_FILE" 'variant="elevated"' \
    "Variante elevated en GamingStatsCard"

check_file_contains "$GAMING_CARD_FILE" 'cosmicIntensity="intense"' \
    "Intensidad cósmica intensa en GamingStatsCard"

echo ""
echo "🔧 5. VERIFICANDO INTEGRACIÓN CON DESIGN SYSTEM"
echo "==============================================="

COSMIC_CARD_FILE="Demo/apps/superapp-unified/src/design-system/components/cosmic/CosmicCard.tsx"
REVOLUTIONARY_WIDGET_FILE="Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx"

if [ -f "$COSMIC_CARD_FILE" ]; then
    echo -e "  ✅ ${GREEN}FOUND${NC} - CosmicCard component disponible"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "  ❌ ${RED}MISSING${NC} - CosmicCard component no encontrado"
fi
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))

if [ -f "$REVOLUTIONARY_WIDGET_FILE" ]; then
    echo -e "  ✅ ${GREEN}FOUND${NC} - RevolutionaryWidget template disponible"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "  ❌ ${RED}MISSING${NC} - RevolutionaryWidget template no encontrado"
fi
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))

echo ""
echo "🌐 6. VERIFICANDO ACCESIBILIDAD DE PÁGINA"
echo "========================================="

# Verificar que la SuperApp esté ejecutándose
if curl -s -I http://localhost:2222/ustats | grep -q "200 OK"; then
    echo -e "  ✅ ${GREEN}ACCESSIBLE${NC} - Página UStats respondiendo en puerto 3001"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "  ⚠️  ${YELLOW}WARNING${NC} - Página UStats no accesible (SuperApp puede no estar ejecutándose)"
fi
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================="

PASS_RATE=$((CHECKS_PASSED * 100 / CHECKS_TOTAL))

if [ $PASS_RATE -ge 90 ]; then
    STATUS_COLOR=$GREEN
    STATUS_ICON="🎉"
    STATUS_TEXT="EXCELENTE"
elif [ $PASS_RATE -ge 75 ]; then
    STATUS_COLOR=$YELLOW
    STATUS_ICON="⚠️"
    STATUS_TEXT="BUENO"
else
    STATUS_COLOR=$RED
    STATUS_ICON="❌"
    STATUS_TEXT="NECESITA TRABAJO"
fi

echo -e "${STATUS_ICON} Estado: ${STATUS_COLOR}${STATUS_TEXT}${NC}"
echo -e "📈 Verificaciones pasadas: ${GREEN}${CHECKS_PASSED}${NC}/${CHECKS_TOTAL}"
echo -e "🎯 Tasa de éxito: ${STATUS_COLOR}${PASS_RATE}%${NC}"

echo ""
echo "🔥 ANÁLISIS ESPECÍFICO TEMA FUEGO"
echo "================================="

if [ $PASS_RATE -ge 90 ]; then
    echo -e "✨ ${GREEN}TRANSFORMACIÓN EXITOSA${NC}"
    echo "   • RevolutionaryWidget envolviendo contenido principal ✅"
    echo "   • CosmicCard reemplazando Cards de MUI ✅"
    echo "   • Elemento 'fuego' aplicado correctamente ✅"
    echo "   • Efectos cósmicos configurados ✅"
    echo "   • Tema energizante y motivador implementado ✅"
    echo ""
    echo -e "🚀 ${PURPLE}RECOMENDACIONES FUTURAS:${NC}"
    echo "   • Agregar más efectos de partículas específicos del fuego"
    echo "   • Implementar animaciones de gradientes dinámicos"
    echo "   • Añadir sonidos sutiles de chispeado en interacciones"
elif [ $PASS_RATE -ge 75 ]; then
    echo -e "⚠️  ${YELLOW}TRANSFORMACIÓN PARCIAL${NC}"
    echo "   • La mayoría de componentes están transformados"
    echo "   • Algunos patrones pueden necesitar ajustes"
    echo "   • Verificar configuraciones de efectos cósmicos"
else
    echo -e "❌ ${RED}TRANSFORMACIÓN INCOMPLETA${NC}"
    echo "   • Varios componentes requieren transformación"
    echo "   • Revisar imports del design system"
    echo "   • Verificar configuraciones de elementos y efectos"
fi

echo ""
echo "🎯 CRITERIOS DE ACEPTACIÓN"
echo "========================="
echo -e "✅ RevolutionaryWidget envuelve contenido principal: $( [ $PASS_RATE -ge 75 ] && echo -e "${GREEN}CUMPLIDO${NC}" || echo -e "${RED}PENDIENTE${NC}" )"
echo -e "✅ CosmicCard reemplaza Cards tradicionales: $( [ $PASS_RATE -ge 75 ] && echo -e "${GREEN}CUMPLIDO${NC}" || echo -e "${RED}PENDIENTE${NC}" )"
echo -e "✅ Tema fuego aplicado coherentemente: $( [ $PASS_RATE -ge 75 ] && echo -e "${GREEN}CUMPLIDO${NC}" || echo -e "${RED}PENDIENTE${NC}" )"
echo -e "✅ Experiencia visual unificada: $( [ $PASS_RATE -ge 90 ] && echo -e "${GREEN}CUMPLIDO${NC}" || echo -e "${YELLOW}MEJORABLE${NC}" )"

echo ""
echo "🏁 VERIFICACIÓN COMPLETADA"
echo "=========================="

if [ $PASS_RATE -ge 90 ]; then
    echo -e "🎉 ${GREEN}¡TRANSFORMACIÓN USTATS EXITOSA!${NC}"
    echo "   El módulo UStats ahora brilla con la energía del fuego cósmico"
    exit 0
elif [ $PASS_RATE -ge 75 ]; then
    echo -e "⚠️  ${YELLOW}Transformación mayormente exitosa${NC}"
    echo "   Revisar elementos faltantes para completar la experiencia"
    exit 1
else
    echo -e "❌ ${RED}Transformación requiere trabajo adicional${NC}"
    echo "   Revisar configuraciones y completar implementación"
    exit 2
fi 