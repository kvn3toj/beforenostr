#!/bin/bash

# 🌌 VERIFICADOR DE ACTIVACIÓN DE ESTILOS CÓSMICOS AVANZADOS
# ============================================================
# 
# Script para verificar que todos los módulos usan las variantes
# "elevated" e "intense" del Design System

echo "🔍 VERIFICANDO ACTIVACIÓN DE ESTILOS CÓSMICOS AVANZADOS..."
echo "=============================================================="

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0

check_and_report() {
    local file=$1
    local pattern=$2
    local description=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "✅ ${GREEN}[PASS]${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "❌ ${RED}[FAIL]${NC} $description"
        echo -e "   ${YELLOW}Archivo:${NC} $file"
        echo -e "   ${YELLOW}Patrón buscado:${NC} $pattern"
    fi
}

echo -e "\n${BLUE}🌊 VERIFICANDO MÓDULO SOCIAL...${NC}"
echo "--------------------------------------------"

# Social - RevolutionaryWidget variant="elevated"
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'variant="elevated"' \
    "Social usa variant='elevated'"

# Social - cosmicIntensity="intense"
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'cosmicIntensity="intense"' \
    "Social usa cosmicIntensity='intense'"

# Social - enableOrbitalEffects
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx" \
    'enableOrbitalEffects: true' \
    "Social tiene efectos orbitales activados"

# PostCard - cosmicIntensity="medium"
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    'cosmicIntensity="medium"' \
    "PostCard usa cosmicIntensity='medium'"

# PostCard - enableGlow=true
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/social/components/PostCard.tsx" \
    'enableGlow={true}' \
    "PostCard tiene glow activado"

echo -e "\n${BLUE}🎬 VERIFICANDO MÓDULO ÜPLAY...${NC}"
echo "--------------------------------------------"

# UPlay - variant="elevated"
check_and_report \
    "Demo/apps/superapp-unified/src/pages/UPlay.tsx" \
    'variant="elevated"' \
    "ÜPlay usa variant='elevated'"

# UPlay - cosmicIntensity="intense"  
check_and_report \
    "Demo/apps/superapp-unified/src/pages/UPlay.tsx" \
    'cosmicIntensity="intense"' \
    "ÜPlay usa cosmicIntensity='intense'"

# UPlay - enableOrbitalEffects
check_and_report \
    "Demo/apps/superapp-unified/src/pages/UPlay.tsx" \
    'enableOrbitalEffects: true' \
    "ÜPlay tiene efectos orbitales activados"

echo -e "\n${BLUE}🏪 VERIFICANDO MÓDULO MARKETPLACE...${NC}"
echo "--------------------------------------------"

# Marketplace - variant="elevated"
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/marketplace/MarketplaceMain.tsx" \
    'variant="elevated"' \
    "Marketplace usa variant='elevated'"

# Marketplace - cosmicIntensity="intense"
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/marketplace/MarketplaceMain.tsx" \
    'cosmicIntensity="intense"' \
    "Marketplace usa cosmicIntensity='intense'"

# Marketplace - enableOrbitalEffects
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/marketplace/MarketplaceMain.tsx" \
    'enableOrbitalEffects: true' \
    "Marketplace tiene efectos orbitales activados"

# ProductCard - cosmicIntensity mejorado
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx" \
    'cosmicIntensity={featured ? "intense" : trending ? "medium" : "medium"}' \
    "ProductCard usa intensidades mejoradas"

# ProductCard - enableGlow=true
check_and_report \
    "Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx" \
    'enableGlow={true}' \
    "ProductCard tiene glow activado por defecto"

echo -e "\n${PURPLE}🎨 VERIFICANDO PATTERNS.TS (ESTILOS ELEVATED)...${NC}"
echo "--------------------------------------------"

# Verificar que los estilos elevated están potentes
check_and_report \
    "Demo/apps/superapp-unified/src/design-system/patterns.ts" \
    'backdropFilter.*blur.*30px.*saturate.*180%' \
    "Estilos elevated tienen blur intenso (30px + saturate)"

check_and_report \
    "Demo/apps/superapp-unified/src/design-system/patterns.ts" \
    'boxShadow.*32px.*120px' \
    "Estilos elevated tienen sombras profundas (120px)"

check_and_report \
    "Demo/apps/superapp-unified/src/design-system/patterns.ts" \
    'background.*radial-gradient.*circle.*20%.*30%' \
    "Estilos elevated tienen gradientes radiales cósmicos"

echo -e "\n${BLUE}🌐 VERIFICANDO SERVICIOS ACTIVOS...${NC}"
echo "--------------------------------------------"

# Verificar que la SuperApp esté ejecutándose
if curl -s http://localhost:2222 >/dev/null 2>&1; then
    echo -e "✅ ${GREEN}[PASS]${NC} SuperApp ejecutándose en puerto 3001"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "❌ ${RED}[FAIL]${NC} SuperApp no está ejecutándose en puerto 3001"
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Verificar que el backend esté ejecutándose
if timeout 3 curl -s http://localhost:1111/health >/dev/null 2>&1; then
    echo -e "✅ ${GREEN}[PASS]${NC} Backend ejecutándose en puerto 3002"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "⚠️ ${YELLOW}[WARN]${NC} Backend no está ejecutándose en puerto 3002 (opcional)"
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

echo -e "\n${PURPLE}📊 RESUMEN DE VERIFICACIÓN${NC}"
echo "=============================================================="
echo -e "Total de verificaciones: ${BLUE}$TOTAL_CHECKS${NC}"
echo -e "Verificaciones exitosas: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Verificaciones fallidas: ${RED}$((TOTAL_CHECKS - PASSED_CHECKS))${NC}"

# Calcular porcentaje de éxito
SUCCESS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
echo -e "Tasa de éxito: ${BLUE}$SUCCESS_RATE%${NC}"

if [ $SUCCESS_RATE -ge 85 ]; then
    echo -e "\n🎉 ${GREEN}¡ACTIVACIÓN EXITOSA!${NC}"
    echo -e "Los estilos cósmicos avanzados están ${GREEN}CORRECTAMENTE ACTIVADOS${NC}"
    echo -e "La transformación visual debe ser ${BLUE}inmediata y obvia${NC}"
elif [ $SUCCESS_RATE -ge 70 ]; then
    echo -e "\n⚠️ ${YELLOW}ACTIVACIÓN PARCIAL${NC}"
    echo -e "Algunos estilos están activados, pero ${YELLOW}requiere atención${NC}"
else
    echo -e "\n❌ ${RED}ACTIVACIÓN INCOMPLETA${NC}"
    echo -e "Los estilos cósmicos ${RED}NO ESTÁN SUFICIENTEMENTE ACTIVADOS${NC}"
fi

echo -e "\n${BLUE}🌌 PRÓXIMOS PASOS RECOMENDADOS:${NC}"
echo "=============================================================="
echo "1. Abrir SuperApp en ventana de incógnito: http://localhost:2222"
echo "2. Navegar a /social, /uplay y /marketplace"
echo "3. Verificar que se vean fondos cósmicos oscuros y efectos glassmorphism"
echo "4. Confirmar que las tarjetas tienen efectos de brillo y partículas"
echo "5. Observar que los colores elementales son evidentes"

echo -e "\n${PURPLE}¡La transformación visual debe ser dramática e inmediata!${NC}" 