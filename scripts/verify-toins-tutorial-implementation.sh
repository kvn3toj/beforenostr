#!/bin/bash

# 🪙 SCRIPT DE VERIFICACIÓN - TUTORIAL DISCOVERY TOINS
# Verifica que el tutorial completo de TOINS esté implementado y funcional

echo "🪙 INICIANDO VERIFICACIÓN DEL TUTORIAL DISCOVERY TOINS..."
echo "====================================================="

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
echo "🎯 VERIFICACIÓN DEL TUTORIAL TOINS"
echo "--------------------------------"

# Backend - TOINS en base de datos
check_item "Backend NestJS operacional" \
    'curl -s http://localhost:3002/health | grep -q "ok"'

check_item "Campo balanceToins en modelo Wallet" \
    'grep -q "balanceToins" prisma/schema.prisma'

check_item "Campo priceToins en MarketplaceItems" \
    'grep -q "priceToins" prisma/schema.prisma'

# Frontend - Tutorial Implementation
check_item "Tutorial wallet-discovery expandido" \
    'grep -q "Discovery Wallet & TOINS" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "8 pasos del tutorial TOINS implementados" \
    'test $(grep -c "id.*toins\|id.*lukas\|id.*wallet\|id.*dual\|id.*earning\|id.*using\|id.*ayni\|id.*mastery" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx) -ge 8'

check_item "Contenido educativo sobre TOINS" \
    'grep -q "Tokens de Intercambio Nutritivo Sostenible" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "Explicación del sistema dual Lükas/TOINS" \
    'grep -q "Sistema Dual: Lükas + TOINS" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "Tips sobre cómo ganar TOINS" \
    'grep -q "Cómo Ganar TOINS" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "Información sobre uso de TOINS" \
    'grep -q "Usando TOINS Sabiamente" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "Integración con principio Ayni" \
    'grep -q "TOINS y el Principio Ayni" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "Sistema de recompensas por completar tutorial" \
    'grep -q "completionRewards" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "Tips educativos en cada paso" \
    'grep -c "tips:" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx | grep -q "[5-9]"'

check_item "Botones de acción interactivos" \
    'grep -q "actionButton" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

# SuperApp functionality
check_item "SuperApp frontend operacional" \
    'curl -s -I http://localhost:3001 | head -1 | grep -q "200 OK"'

check_item "Tutorial accesible desde SuperApp" \
    'grep -q "wallet-discovery" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

# Content Quality
check_item "Duración estimada 12-15 minutos" \
    'grep -q "12-15 minutos" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "Dificultad intermedia apropiada" \
    'grep -q "difficulty.*intermediate" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "Categoría wallet asignada" \
    'grep -q "category.*wallet" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

check_item "Recompensas significativas (35 Öndas, 8 Mëritos)" \
    'grep -q "ondas: 35" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

# Advanced Features
check_item "Tipos de contenido variados (info, tip, success, interactive)" \
    'grep -c "type.*info\|type.*tip\|type.*success\|type.*interactive" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx | grep -q "[4-9]"'

check_item "Componentes específicos referenciados" \
    'grep -q "component.*WalletMain" Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx'

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================="
echo "Total de verificaciones: $total_checks"
echo "Verificaciones exitosas: $passed_checks"
echo "Verificaciones fallidas: $((total_checks - passed_checks))"

# Calcular porcentaje
percentage=$((passed_checks * 100 / total_checks))
echo "Tasa de éxito: $percentage%"

echo ""
if [ $percentage -ge 90 ]; then
    echo "🎉 EXCELENTE: Tutorial de TOINS implementado exitosamente"
    echo "🪙 El tutorial está listo para educar a los usuarios sobre el sistema dual de monedas"
elif [ $percentage -ge 80 ]; then
    echo "✅ BUENO: Tutorial de TOINS mayormente implementado"
    echo "⚠️ Revisar verificaciones fallidas para optimización"
elif [ $percentage -ge 70 ]; then
    echo "⚠️ ACEPTABLE: Tutorial de TOINS básicamente implementado"
    echo "🔧 Se requieren mejoras para calidad óptima"
else
    echo "❌ INSUFICIENTE: Tutorial de TOINS requiere trabajo adicional"
    echo "🚧 Revisar implementación antes de lanzamiento"
fi

echo ""
echo "🎯 PRÓXIMOS PASOS RECOMENDADOS:"
echo "1. Probar el tutorial manualmente navegando a /wallet"
echo "2. Verificar que todos los tips sean educativos y precisos"
echo "3. Confirmar que los botones de acción funcionen correctamente"
echo "4. Validar integración con sistema de recompensas del backend"
echo "5. Realizar pruebas E2E del tutorial completo"

echo ""
echo "📝 COMANDOS ÚTILES:"
echo "# Iniciar tutorial de TOINS:"
echo "# En DevTools console: useDiscoveryTutorial().startTutorial('wallet-discovery')"
echo ""
echo "# Verificar balance de TOINS en backend:"
echo "curl -s http://localhost:3002/auth/me -H \"Authorization: Bearer \$JWT_TOKEN\" | jq '.wallet.balanceToins'"
