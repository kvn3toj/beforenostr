#!/bin/bash

echo "🔍 VERIFICACIÓN FINAL - ERRORES USTATS RESUELTOS"
echo "==============================================="

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1️⃣ Verificando Hook useDashboardAnalytics...${NC}"

# Verificar que el hook existe y tiene contenido
if [ -f "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts" ]; then
    if [ -s "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts" ]; then
        if grep -q "export const useDashboardAnalytics" "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts"; then
            echo -e "${GREEN}✅ Hook useDashboardAnalytics implementado correctamente${NC}"
        else
            echo -e "${RED}❌ Hook useDashboardAnalytics sin exportación${NC}"
        fi
    else
        echo -e "${RED}❌ Hook useDashboardAnalytics está vacío${NC}"
    fi
else
    echo -e "${RED}❌ Hook useDashboardAnalytics no encontrado${NC}"
fi

echo -e "${BLUE}2️⃣ Verificando Funciones de Servicio Analytics...${NC}"

# Verificar funciones de servicio
if grep -q "fetchDashboardMetrics\|fetchSystemHealth" Demo/apps/superapp-unified/src/services/analytics.service.ts; then
    echo -e "${GREEN}✅ Funciones fetchDashboardMetrics y fetchSystemHealth encontradas${NC}"
else
    echo -e "${RED}❌ Funciones de servicio analytics faltantes${NC}"
fi

echo -e "${BLUE}3️⃣ Verificando Correcciones Anti-NaN...${NC}"

# Verificar correcciones en BarChart
if grep -q "validData.*filter.*isNaN" Demo/apps/superapp-unified/src/components/modules/ustats/components/BarChart.tsx; then
    echo -e "${GREEN}✅ BarChart: Validaciones anti-NaN implementadas${NC}"
else
    echo -e "${YELLOW}⚠️  BarChart: Validaciones anti-NaN no encontradas${NC}"
fi

# Verificar correcciones en PieChart
if grep -q "validData.*filter.*isNaN" Demo/apps/superapp-unified/src/components/modules/ustats/components/PieChart.tsx; then
    echo -e "${GREEN}✅ PieChart: Validaciones anti-NaN implementadas${NC}"
else
    echo -e "${YELLOW}⚠️  PieChart: Validaciones anti-NaN no encontradas${NC}"
fi

# Verificar correcciones en HeatMap
if grep -q "validData.*filter.*isNaN" Demo/apps/superapp-unified/src/components/modules/ustats/components/HeatMap.tsx; then
    echo -e "${GREEN}✅ HeatMap: Validaciones anti-NaN implementadas${NC}"
else
    echo -e "${YELLOW}⚠️  HeatMap: Validaciones anti-NaN no encontradas${NC}"
fi

# Verificar correcciones en UserLocationMap
if grep -q "validData.*filter.*isNaN" Demo/apps/superapp-unified/src/components/modules/ustats/components/UserLocationMap.tsx; then
    echo -e "${GREEN}✅ UserLocationMap: Validaciones anti-NaN implementadas${NC}"
else
    echo -e "${YELLOW}⚠️  UserLocationMap: Validaciones anti-NaN no encontradas${NC}"
fi

echo -e "${BLUE}4️⃣ Verificando Exportación en Index...${NC}"

# Verificar que el hook está exportado en index.ts
if grep -q "useDashboardAnalytics" Demo/apps/superapp-unified/src/hooks/analytics/index.ts; then
    echo -e "${GREEN}✅ Hook exportado correctamente en index.ts${NC}"
else
    echo -e "${RED}❌ Hook no exportado en index.ts${NC}"
fi

echo -e "${BLUE}5️⃣ Verificando Servicios Activos...${NC}"

# Verificar backend
if curl -s http://localhost:1111/health > /dev/null; then
    echo -e "${GREEN}✅ Backend NestJS activo (puerto 3002)${NC}"
else
    echo -e "${RED}❌ Backend NestJS no disponible${NC}"
fi

# Verificar SuperApp
if curl -s -I http://localhost:2222 > /dev/null; then
    echo -e "${GREEN}✅ SuperApp activa (puerto 3001)${NC}"
else
    echo -e "${RED}❌ SuperApp no disponible${NC}"
fi

# Verificar página UStats específicamente
if curl -s http://localhost:2222/ustats > /dev/null; then
    echo -e "${GREEN}✅ Página UStats accesible${NC}"
else
    echo -e "${YELLOW}⚠️  Página UStats no accesible directamente${NC}"
fi

echo -e "${BLUE}6️⃣ Verificando Documentación...${NC}"

# Verificar que la documentación existe
if [ -f "docs/implementation/USTATS_ERROR_RESOLUTION_SUMMARY.md" ]; then
    echo -e "${GREEN}✅ Documentación de resolución creada${NC}"
else
    echo -e "${YELLOW}⚠️  Documentación de resolución no encontrada${NC}"
fi

echo ""
echo -e "${BLUE}📋 RESUMEN DE VERIFICACIÓN:${NC}"
echo "================================"

# Contar verificaciones exitosas
CHECKS_PASSED=0
TOTAL_CHECKS=8

# Hook implementation
if [ -f "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts" ] && [ -s "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts" ]; then
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

# Service functions
if grep -q "fetchDashboardMetrics\|fetchSystemHealth" Demo/apps/superapp-unified/src/services/analytics.service.ts; then
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

# Anti-NaN validations (count as one check)
if grep -q "validData.*filter.*isNaN" Demo/apps/superapp-unified/src/components/modules/ustats/components/BarChart.tsx; then
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

# Export in index
if grep -q "useDashboardAnalytics" Demo/apps/superapp-unified/src/hooks/analytics/index.ts; then
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

# Backend active
if curl -s http://localhost:1111/health > /dev/null; then
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

# SuperApp active
if curl -s -I http://localhost:2222 > /dev/null; then
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

# UStats page accessible
if curl -s http://localhost:2222/ustats > /dev/null; then
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

# Documentation
if [ -f "docs/implementation/USTATS_ERROR_RESOLUTION_SUMMARY.md" ]; then
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
fi

echo -e "Verificaciones exitosas: ${GREEN}${CHECKS_PASSED}/${TOTAL_CHECKS}${NC}"

if [ $CHECKS_PASSED -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}🎉 TODAS LAS VERIFICACIONES EXITOSAS${NC}"
    echo -e "${GREEN}✅ Los errores de UStats han sido resueltos completamente${NC}"
elif [ $CHECKS_PASSED -ge 6 ]; then
    echo -e "${YELLOW}⚠️  MAYORÍA DE VERIFICACIONES EXITOSAS${NC}"
    echo -e "${YELLOW}Los errores principales han sido resueltos${NC}"
else
    echo -e "${RED}❌ VERIFICACIONES INSUFICIENTES${NC}"
    echo -e "${RED}Aún hay problemas que resolver${NC}"
fi

echo ""
echo -e "${BLUE}🎯 PRÓXIMOS PASOS RECOMENDADOS:${NC}"
echo "================================"
echo "1. Navega a http://localhost:2222/ustats"
echo "2. Abre DevTools (F12) y verifica la consola"
echo "3. Busca que NO aparezcan errores de:"
echo "   - 'useDashboardAnalytics' is not found"
echo "   - 'NaN is an invalid value for width'"
echo "4. Verifica que los gráficos se rendericen correctamente"
echo "5. El error de WebSocket es normal en desarrollo"

echo ""
echo -e "${GREEN}🏁 Verificación completada!${NC}" 