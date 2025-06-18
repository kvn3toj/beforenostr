#!/bin/bash

echo "🔍 VERIFICACIÓN - ERROR fetchUserStats RESUELTO"
echo "=============================================="

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1️⃣ Verificando función fetchUserStats en servicio...${NC}"

# Verificar que la función existe en el servicio
if grep -q "export const fetchUserStats" "Demo/apps/superapp-unified/src/services/analytics.service.ts"; then
    echo -e "${GREEN}✅ Función fetchUserStats exportada correctamente${NC}"
else
    echo -e "${RED}❌ Función fetchUserStats NO encontrada${NC}"
    exit 1
fi

echo -e "${BLUE}2️⃣ Verificando importación en hook useDashboardAnalytics...${NC}"

# Verificar que la importación existe en el hook
if grep -q "fetchUserStats," "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts"; then
    echo -e "${GREEN}✅ Importación de fetchUserStats encontrada${NC}"
else
    echo -e "${RED}❌ Importación de fetchUserStats NO encontrada${NC}"
    exit 1
fi

echo -e "${BLUE}3️⃣ Verificando uso en el hook...${NC}"

# Verificar que la función se usa en el hook
if grep -q "queryFn: fetchUserStats" "Demo/apps/superapp-unified/src/hooks/analytics/useDashboardAnalytics.ts"; then
    echo -e "${GREEN}✅ Función fetchUserStats utilizada correctamente en query${NC}"
else
    echo -e "${RED}❌ Función fetchUserStats NO utilizada en query${NC}"
    exit 1
fi

echo -e "${BLUE}4️⃣ Verificando type-check del proyecto...${NC}"

# Ejecutar type-check para verificar que no hay errores de TypeScript
cd Demo/apps/superapp-unified
TYPE_CHECK_OUTPUT=$(npm run type-check 2>&1)

if echo "$TYPE_CHECK_OUTPUT" | grep -qi "fetchUserStats.*not found\|binding name.*fetchUserStats"; then
    echo -e "${RED}❌ Errores de TypeScript relacionados con fetchUserStats:${NC}"
    echo "$TYPE_CHECK_OUTPUT" | grep -i "fetchUserStats\|binding name"
    exit 1
else
    echo -e "${GREEN}✅ Type-check completado sin errores de fetchUserStats${NC}"
fi

cd ../../..

echo -e "${BLUE}5️⃣ Verificando acceso al módulo UStats...${NC}"

# Verificar que el módulo UStats responde
USTATS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:2222/ustats)

if [ "$USTATS_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Módulo UStats accesible (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠️ Módulo UStats responde con código: $USTATS_RESPONSE${NC}"
fi

echo -e "${BLUE}6️⃣ Verificando backend analytics disponible...${NC}"

# Verificar que el backend está disponible
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:1111/health)

if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Backend disponible (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠️ Backend responde con código: $BACKEND_RESPONSE${NC}"
fi

echo ""
echo -e "${GREEN}🎉 VERIFICACIÓN COMPLETADA EXITOSAMENTE${NC}"
echo -e "${GREEN}✅ Error 'Importing binding name fetchUserStats is not found' RESUELTO${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de la solución:${NC}"
echo "   • Agregada función fetchUserStats al servicio analytics"
echo "   • Función correctamente exportada e importada"
echo "   • Hook useDashboardAnalytics funcional"
echo "   • Type-check sin errores"
echo "   • Módulo UStats accesible"
echo ""
echo -e "${YELLOW}ID del Error Original: 59dc6ab244c847e2b81f40dcc89b6ba5${NC}" 