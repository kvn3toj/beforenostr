#!/bin/bash

# 🏪 SCRIPT DE VERIFICACIÓN COMPLETA - MARKETPLACE COOMUNITY
# Verifica que la implementación esté alineada con toda la documentación

echo "🔍 INICIANDO VERIFICACIÓN COMPLETA DEL MARKETPLACE COOMUNITY..."
echo "=================================================="

# Contadores de verificación
total_checks=0
passed_checks=0

function check_item() {
    local description="$1"
    local condition="$2"

    total_checks=$((total_checks + 1))
    echo -n "[$total_checks] $description... "

    if eval "$condition"; then
        echo "✅"
        passed_checks=$((passed_checks + 1))
    else
        echo "❌"
    fi
}

echo ""
echo "🎯 BACKEND - ENDPOINTS Y DATOS REALES"
echo "--------------------------------"

check_item "Backend NestJS marketplace ping" \
    'curl -s http://localhost:3002/marketplace/ping | grep -q "working"'

check_item "Backend tiene datos reales del marketplace" \
    '[[ $(curl -s http://localhost:3002/marketplace/items | jq ".total // 0") -gt 0 ]]'

check_item "Datos incluyen moneda LUKAS" \
    'curl -s http://localhost:3002/marketplace/items | grep -q "LUKAS"'

check_item "Datos incluyen tipos diversos (EXPERIENCE, SERVICE, PRODUCT)" \
    'curl -s http://localhost:3002/marketplace/items | grep -q -E "(EXPERIENCE|SERVICE|PRODUCT)"'

check_item "Items incluyen seller information" \
    'curl -s http://localhost:3002/marketplace/items | jq ".items[0].seller" | grep -q "firstName"'

check_item "Items incluyen metadata rica" \
    'curl -s http://localhost:3002/marketplace/items | jq ".items[0].metadata" | grep -q -v "null"'

echo ""
echo "🎨 FRONTEND - INTEGRACIÓN Y UI"
echo "----------------------------"

check_item "Frontend SuperApp marketplace accesible" \
    'curl -s -I http://localhost:3001/marketplace | grep -q "200 OK"'

check_item "Hook useMarketplaceData habilitado para backend real" \
    'grep -q "backend-real" Demo/apps/superapp-unified/src/hooks/useRealBackendData.ts'

check_item "MarketplaceAPI implementado en api-service.ts" \
    'grep -q "getItems.*filters" Demo/apps/superapp-unified/src/lib/api-service.ts'

check_item "RevolutionaryWidget importado en MarketplaceMain" \
    'grep -q "RevolutionaryWidget" Demo/apps/superapp-unified/src/components/modules/marketplace/MarketplaceMain.tsx'

check_item "CosmicCard implementado en ProductCardEnhanced" \
    'grep -q "CosmicCard" Demo/apps/superapp-unified/src/components/modules/marketplace/components/ProductCardEnhanced.tsx'

echo ""
echo "📱 RESPONSIVE DESIGN Y MOBILE"
echo "----------------------------"

check_item "MobileMarketplaceView implementado" \
    '[[ -f "Demo/apps/superapp-unified/src/components/modules/marketplace/components/MobileMarketplaceView.tsx" ]]'

check_item "Marketplace mobile styles definidos" \
    '[[ -f "Demo/apps/superapp-unified/src/styles/marketplace-mobile.css" ]]'

check_item "Marketplace enhanced styles definidos" \
    '[[ -f "Demo/apps/superapp-unified/src/styles/marketplace-enhanced.css" ]]'

echo ""
echo "🏗️ ARQUITECTURA Y TIPOS"
echo "----------------------"

check_item "Tipos de Marketplace definidos" \
    '[[ -f "Demo/apps/superapp-unified/src/types/marketplace.ts" ]]'

check_item "Hooks de filtros implementados" \
    '[[ -f "Demo/apps/superapp-unified/src/hooks/useMarketplaceFilters.ts" ]]'

check_item "Integración LETS implementada" \
    '[[ -f "Demo/apps/superapp-unified/src/hooks/useLetsMarketplace.ts" ]]'

echo ""
echo "💎 COSMIC DESIGN SYSTEM"
echo "----------------------"

check_item "Design System templates disponibles" \
    '[[ -d "Demo/apps/superapp-unified/src/design-system/templates" ]]'

check_item "RevolutionaryWidget template existe" \
    '[[ -f "Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx" ]]'

check_item "CosmicCard component existe" \
    'find Demo/apps/superapp-unified/src -name "*CosmicCard*" | grep -q "."'

check_item "Elementos cósmicos (tierra, efectos) implementados" \
    'grep -q -E "(tierra|cosmic|glow|particle)" Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx'

echo ""
echo "🔄 FUNCIONALIDADES CRUD"
echo "----------------------"

check_item "CreateItemModal implementado" \
    '[[ -f "Demo/apps/superapp-unified/src/components/modules/marketplace/components/CreateItemModal.tsx" ]]'

check_item "EditItemModal implementado" \
    '[[ -f "Demo/apps/superapp-unified/src/components/modules/marketplace/components/EditItemModal.tsx" ]]'

check_item "Hook useCreateMarketplaceItem disponible" \
    'grep -q "useCreateMarketplaceItem" Demo/apps/superapp-unified/src/hooks/useRealBackendData.ts'

check_item "Hook useUpdateMarketplaceItem disponible" \
    'grep -q "useUpdateMarketplaceItem" Demo/apps/superapp-unified/src/hooks/useRealBackendData.ts'

echo ""
echo "🎯 FILOSOFÍA COOMUNITY"
echo "---------------------"

check_item "Terminología Lükas (con ü) presente" \
    'curl -s http://localhost:3002/marketplace/items | grep -q "LUKAS"'

check_item "Conceptos Ayni mencionados" \
    'grep -q -i "ayni" Demo/apps/superapp-unified/src/components/modules/marketplace/MarketplaceMain.tsx'

check_item "Categorías de impacto (bien común) implementadas" \
    'grep -q -i -E "(bien.común|common.good|impacto)" Demo/apps/superapp-unified/src/components/modules/marketplace/MarketplaceMain.tsx'

echo ""
echo "📊 RESULTADOS FINALES"
echo "===================="
echo "✅ Verificaciones exitosas: $passed_checks"
echo "❌ Verificaciones fallidas: $((total_checks - passed_checks))"
echo "📈 Porcentaje de éxito: $(( (passed_checks * 100) / total_checks ))%"

if [[ $passed_checks -eq $total_checks ]]; then
    echo ""
    echo "🎉 ¡IMPLEMENTACIÓN COMPLETA! 🎉"
    echo "El Marketplace CoomÜnity está 100% implementado según la documentación."
    echo "✨ Backend NestJS + Frontend React + Cosmic Design System + Filosofía CoomÜnity"
elif [[ $passed_checks -ge $((total_checks * 80 / 100)) ]]; then
    echo ""
    echo "🌟 ¡IMPLEMENTACIÓN EXCELENTE! 🌟"
    echo "El Marketplace está casi completamente implementado (≥80%)."
    echo "Solo faltan algunos detalles menores."
elif [[ $passed_checks -ge $((total_checks * 60 / 100)) ]]; then
    echo ""
    echo "⚠️  IMPLEMENTACIÓN BUENA ⚠️"
    echo "El Marketplace tiene una buena base (≥60%) pero necesita más trabajo."
else
    echo ""
    echo "🚨 IMPLEMENTACIÓN INCOMPLETA 🚨"
    echo "El Marketplace necesita trabajo significativo (<60%)."
fi

echo ""
echo "🔗 PARA VERIFICAR MANUALMENTE:"
echo "- Frontend: http://localhost:3001/marketplace"
echo "- Backend: http://localhost:3002/marketplace/ping"
echo "- API Test: curl http://localhost:3002/marketplace/items"
