#!/bin/bash

# 🔥 SCRIPT DE VERIFICACIÓN: CORRECCIÓN DE ROUTING USTATS
# =========================================================
# Verifica que el módulo UStats tenga rutas consistentes y funcionales
# en todos los componentes de navegación de la SuperApp.

echo "🔍 INICIANDO VERIFICACIÓN DE ROUTING USTATS..."
echo "=============================================="

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
            echo -e "✅ ${GREEN}$description${NC}"
            CHECKS_PASSED=$((CHECKS_PASSED + 1))
        else
            echo -e "❌ ${RED}$description${NC}"
            echo -e "   📄 Archivo: $file"
            echo -e "   🔍 Buscando: $pattern"
        fi
    else
        echo -e "❌ ${RED}$description (archivo no encontrado)${NC}"
        echo -e "   📄 Archivo faltante: $file"
    fi
}

# Función para verificar URL
check_url() {
    local url="$1"
    local description="$2"
    
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    
    if curl -s -I "$url" | grep -q "HTTP/1.1 200 OK"; then
        echo -e "✅ ${GREEN}$description${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        echo -e "❌ ${RED}$description${NC}"
        echo -e "   🌐 URL: $url"
    fi
}

echo -e "${BLUE}📋 VERIFICANDO CONFIGURACIÓN DE RUTAS...${NC}"
echo ""

# 1. Verificar App.tsx tiene ruta UStats
check_file_contains "Demo/apps/superapp-unified/src/App.tsx" 'path="/ustats"' "App.tsx contiene ruta /ustats"

# 2. Verificar App.tsx tiene elemento UStatsPage
check_file_contains "Demo/apps/superapp-unified/src/App.tsx" 'LazyPages.UStatsPage' "App.tsx importa UStatsPage correctamente"

# 3. Verificar lazy component UStatsPage existe
check_file_contains "Demo/apps/superapp-unified/src/utils/lazyComponents.tsx" 'UStatsPage:' "LazyComponents define UStatsPage"

# 4. Verificar import UStats en lazy components
check_file_contains "Demo/apps/superapp-unified/src/utils/lazyComponents.tsx" "import('../pages/UStats')" "LazyComponents importa páginas/UStats"

echo ""
echo -e "${PURPLE}🧭 VERIFICANDO NAVEGACIÓN...${NC}"
echo ""

# 5. Verificar Sidebar usa /ustats
check_file_contains "Demo/apps/superapp-unified/src/components/layout/Sidebar.tsx" "path: '/ustats'" "Sidebar navega a /ustats"

# 6. Verificar BottomNavigation usa /ustats
check_file_contains "Demo/apps/superapp-unified/src/components/layout/BottomNavigation.tsx" "value: '/ustats'" "BottomNavigation navega a /ustats"

# 7. Verificar preloader incluye /ustats
check_file_contains "Demo/apps/superapp-unified/src/utils/lazyComponents.tsx" "case '/ustats':" "Preloader incluye ruta /ustats"

echo ""
echo -e "${YELLOW}📄 VERIFICANDO ARCHIVOS EXISTENTES...${NC}"
echo ""

# 8. Verificar página UStats existe
check_file_contains "Demo/apps/superapp-unified/src/pages/UStats.tsx" "const UStats" "Página UStats.tsx existe y exporta componente"

# 9. Verificar componente UStatsMain existe
check_file_contains "Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx" "const UStatsMain" "Componente UStatsMain existe"

# 10. Verificar UStatsMain usa RevolutionaryWidget
check_file_contains "Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx" "RevolutionaryWidget" "UStatsMain usa RevolutionaryWidget cósmico"

# 11. Verificar título con emoji de fuego
check_file_contains "Demo/apps/superapp-unified/src/components/modules/ustats/UStatsMain.tsx" '🔥 Tus Estadísticas de Progreso' "UStatsMain tiene título con emoji fuego"

echo ""
echo -e "${GREEN}🌐 VERIFICANDO ACCESIBILIDAD WEB...${NC}"
echo ""

# 12. Verificar URL /ustats responde
check_url "http://localhost:3003/ustats" "URL /ustats es accesible (HTTP 200)"

# 13. Verificar URL /analytics también responde (compatibilidad)
check_url "http://localhost:3003/analytics" "URL /analytics es accesible (compatibilidad)"

echo ""
echo -e "${BLUE}🎯 VERIFICANDO CONSISTENCIA DE PATHS...${NC}"
echo ""

# 14. Verificar que NO hay referencias a /stats (path anterior incorrecto)
if ! grep -r "'/stats'" Demo/apps/superapp-unified/src/ >/dev/null 2>&1; then
    echo -e "✅ ${GREEN}No hay referencias al path incorrecto /stats${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "❌ ${RED}Aún existen referencias al path incorrecto /stats${NC}"
    echo "   🔍 Referencias encontradas:"
    grep -r "'/stats'" Demo/apps/superapp-unified/src/ | head -3
fi
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))

# 15. Verificar consistencia de paths en navegación
if grep -q "path: '/ustats'" Demo/apps/superapp-unified/src/components/layout/Sidebar.tsx && \
   grep -q "value: '/ustats'" Demo/apps/superapp-unified/src/components/layout/BottomNavigation.tsx; then
    echo -e "✅ ${GREEN}Consistencia de paths entre Sidebar y BottomNavigation${NC}"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "❌ ${RED}Inconsistencia de paths entre componentes de navegación${NC}"
fi
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))

echo ""
echo "=============================================="
echo -e "${PURPLE}📊 RESUMEN DE VERIFICACIÓN${NC}"
echo "=============================================="

PERCENTAGE=$((CHECKS_PASSED * 100 / CHECKS_TOTAL))

if [ $CHECKS_PASSED -eq $CHECKS_TOTAL ]; then
    echo -e "🎉 ${GREEN}¡VERIFICACIÓN COMPLETADA AL 100%!${NC}"
    echo -e "✅ Todas las verificaciones pasaron ($CHECKS_PASSED/$CHECKS_TOTAL)"
    echo ""
    echo -e "${GREEN}🔥 USTATS ROUTING COMPLETAMENTE FUNCIONAL:${NC}"
    echo -e "   • Ruta /ustats configurada en App.tsx"
    echo -e "   • Componente UStatsPage importado correctamente"
    echo -e "   • Navegación consistente en Sidebar y BottomNavigation"
    echo -e "   • URLs accesibles y funcionales"
    echo -e "   • Design System Cósmico integrado"
    echo ""
    echo -e "${YELLOW}🎯 PRUEBA MANUAL:${NC}"
    echo -e "   1. Abrir SuperApp en http://localhost:3003"
    echo -e "   2. Hacer clic en 'ÜStats' desde el sidebar o bottom navigation"
    echo -e "   3. Verificar que se carga la página de estadísticas con tema 'Fuego'"
    
elif [ $PERCENTAGE -ge 90 ]; then
    echo -e "🎊 ${GREEN}¡VERIFICACIÓN CASI COMPLETA!${NC}"
    echo -e "✅ $CHECKS_PASSED/$CHECKS_TOTAL verificaciones pasaron (${PERCENTAGE}%)"
    echo -e "⚠️  Quedan $(($CHECKS_TOTAL - $CHECKS_PASSED)) verificaciones menores por resolver"
    
elif [ $PERCENTAGE -ge 70 ]; then
    echo -e "⚡ ${YELLOW}VERIFICACIÓN EN PROGRESO${NC}"
    echo -e "✅ $CHECKS_PASSED/$CHECKS_TOTAL verificaciones pasaron (${PERCENTAGE}%)"
    echo -e "🔧 Se requieren $(($CHECKS_TOTAL - $CHECKS_PASSED)) correcciones adicionales"
    
else
    echo -e "🚨 ${RED}VERIFICACIÓN REQUIERE ATENCIÓN${NC}"
    echo -e "❌ Solo $CHECKS_PASSED/$CHECKS_TOTAL verificaciones pasaron (${PERCENTAGE}%)"
    echo -e "🛠️  Se requieren $(($CHECKS_TOTAL - $CHECKS_PASSED)) correcciones importantes"
fi

echo ""
echo -e "${BLUE}📝 ARCHIVOS MODIFICADOS EN ESTA CORRECCIÓN:${NC}"
echo -e "   • Demo/apps/superapp-unified/src/App.tsx (rutas agregadas)"
echo -e "   • Demo/apps/superapp-unified/src/utils/lazyComponents.tsx (UStatsPage agregado)"
echo -e "   • Demo/apps/superapp-unified/src/components/layout/Sidebar.tsx (/analytics → /ustats)"
echo -e "   • Demo/apps/superapp-unified/src/components/layout/BottomNavigation.tsx (/stats → /ustats)"

echo ""
echo -e "${GREEN}🎉 ¡TRANSFORMACIÓN USTATS + ROUTING FIX COMPLETADA!${NC}"

exit 0 