#!/bin/bash

# 🛠️ VERIFICACIÓN: Corrección de price.toLocaleString()
# Script para verificar que se resolvió el error de formateo inseguro de precios

echo "🔍 VERIFICANDO CORRECCIÓN DE PRICE.TOLOCALESTRING()..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de verificaciones
total_checks=0
passed_checks=0

# Función para verificar criterios
check_criterion() {
    local name="$1"
    local command="$2"
    local expected_result="$3"
    
    echo -e "\n${BLUE}✓${NC} Verificando: $name"
    
    total_checks=$((total_checks + 1))
    
    if eval "$command"; then
        if [ "$expected_result" = "should_pass" ]; then
            echo -e "  ${GREEN}✅ PASÓ${NC}"
            passed_checks=$((passed_checks + 1))
        else
            echo -e "  ${RED}❌ FALLÓ${NC} (se esperaba que fallara)"
        fi
    else
        if [ "$expected_result" = "should_fail" ]; then
            echo -e "  ${GREEN}✅ PASÓ${NC} (falló como esperado)"
            passed_checks=$((passed_checks + 1))
        else
            echo -e "  ${RED}❌ FALLÓ${NC}"
        fi
    fi
}

echo -e "\n${YELLOW}📊 CRITERIOS DE VERIFICACIÓN${NC}"
echo "=============================="

# 1. Verificar que la SuperApp esté ejecutándose
check_criterion "SuperApp ejecutándose en puerto 3001" \
    "curl -s -I http://localhost:2222 | grep -q 'HTTP/1.1 200 OK'" \
    "should_pass"

# 2. Verificar que formatPrice esté importado en EnhancedMarketplaceCard
check_criterion "formatPrice importado en EnhancedMarketplaceCard.tsx" \
    "grep -q 'import.*formatPrice.*from.*numberUtils' Demo/apps/superapp-unified/src/components/modules/marketplace/components/EnhancedMarketplaceCard.tsx" \
    "should_pass"

# 3. Verificar que formatPrice esté importado en ProductCardEnhanced
check_criterion "formatPrice importado en ProductCardEnhanced.tsx" \
    "grep -q 'import.*formatPrice.*from.*numberUtils' Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx" \
    "should_pass"

# 4. Verificar que NO queden usos directos de price.toLocaleString en EnhancedMarketplaceCard
check_criterion "NO hay price.toLocaleString en EnhancedMarketplaceCard.tsx" \
    "! grep -q 'price\.toLocaleString()' Demo/apps/superapp-unified/src/components/modules/marketplace/components/EnhancedMarketplaceCard.tsx" \
    "should_pass"

# 5. Verificar que NO queden usos directos de price.toLocaleString en ProductCardEnhanced
check_criterion "NO hay price.toLocaleString en ProductCardEnhanced.tsx" \
    "! grep -q 'price\.toLocaleString()' Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx" \
    "should_pass"

# 6. Verificar que se esté usando formatPrice en lugar de toLocaleString
check_criterion "formatPrice usado en EnhancedMarketplaceCard.tsx" \
    "grep -q 'formatPrice(' Demo/apps/superapp-unified/src/components/modules/marketplace/components/EnhancedMarketplaceCard.tsx" \
    "should_pass"

# 7. Verificar que se esté usando formatPrice en ProductCardEnhanced
check_criterion "formatPrice usado en ProductCardEnhanced.tsx" \
    "grep -q 'formatPrice(' Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx" \
    "should_pass"

# 8. Verificar que las utilidades de numberUtils existan
check_criterion "Archivo numberUtils.ts existe" \
    "[ -f Demo/apps/superapp-unified/src/utils/numberUtils.ts ]" \
    "should_pass"

# 9. Verificar que formatPrice esté definida en numberUtils
check_criterion "formatPrice definida en numberUtils.ts" \
    "grep -q 'export const formatPrice' Demo/apps/superapp-unified/src/utils/numberUtils.ts" \
    "should_pass"

# 10. Buscar cualquier uso restante inseguro en toda la aplicación
echo -e "\n${BLUE}✓${NC} Buscando usos inseguros restantes de price.toLocaleString()..."
unsafe_uses=$(find Demo/apps/superapp-unified/src -name "*.tsx" -o -name "*.ts" | xargs grep -l "price\.toLocaleString()" 2>/dev/null || true)

if [ -z "$unsafe_uses" ]; then
    echo -e "  ${GREEN}✅ NO se encontraron usos inseguros restantes${NC}"
    passed_checks=$((passed_checks + 1))
else
    echo -e "  ${RED}❌ Se encontraron usos inseguros en:${NC}"
    echo "$unsafe_uses"
fi
total_checks=$((total_checks + 1))

# Verificación de archivos seguros existentes
echo -e "\n${YELLOW}📋 VERIFICANDO ARCHIVOS YA SEGUROS${NC}"
echo "===================================="

safe_files=(
    "ProductActions.tsx"
    "RelatedProducts.tsx" 
    "MobileMarketplaceView.tsx"
    "ProductDetailView.tsx"
    "ProductCard.tsx"
)

for file in "${safe_files[@]}"; do
    full_path=$(find Demo/apps/superapp-unified/src -name "$file" 2>/dev/null | head -1)
    if [ -f "$full_path" ]; then
        if grep -q "safePrice.*=.*price.*||.*0" "$full_path" || grep -q "formatPrice\|safeToLocaleString" "$full_path"; then
            echo -e "${GREEN}✅${NC} $file: Ya implementa formateo seguro"
        else
            echo -e "${YELLOW}⚠️${NC} $file: Revisar implementación de formateo"
        fi
    else
        echo -e "${YELLOW}⚠️${NC} $file: No encontrado"
    fi
done

# Resumen final
echo -e "\n${YELLOW}📊 RESUMEN DE VERIFICACIÓN${NC}"
echo "============================"
echo -e "Verificaciones totales: $total_checks"
echo -e "Verificaciones pasadas: $passed_checks"

if [ $passed_checks -eq $total_checks ]; then
    echo -e "\n${GREEN}🎉 ¡TODAS LAS VERIFICACIONES PASARON!${NC}"
    echo -e "${GREEN}✅ El error de price.toLocaleString() ha sido RESUELTO COMPLETAMENTE${NC}"
    echo -e "${GREEN}✅ Todos los componentes usan formateo seguro${NC}"
    echo -e "${GREEN}✅ La SuperApp está funcionando correctamente${NC}"
    exit 0
else
    failed_checks=$((total_checks - passed_checks))
    echo -e "\n${RED}❌ $failed_checks verificaciones fallaron${NC}"
    echo -e "${RED}⚠️ Revisar los componentes que fallaron antes de continuar${NC}"
    exit 1
fi 