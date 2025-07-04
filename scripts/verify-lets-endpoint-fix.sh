#!/bin/bash

# 🔧 LETS Endpoint Fix Verification Script
# Verifica que la corrección del endpoint LETs esté funcionando correctamente

echo "🔍 VERIFICANDO FIX DEL ENDPOINT LETS..."
echo "======================================================"

# Variables
BACKEND_URL="http://localhost:3002"
SUPERAPP_URL="http://localhost:3001"
TEST_USER_ID="00000000-0000-0000-0000-000000000001"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar servicios
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=$3
    
    echo -n "📡 Verificando ${service_name}... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null); then
        if [ "$response" = "$expected_status" ]; then
            echo -e "${GREEN}✅ OK (HTTP $response)${NC}"
            return 0
        else
            echo -e "${RED}❌ ERROR (HTTP $response, esperado $expected_status)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ SIN RESPUESTA${NC}"
        return 1
    fi
}

# Función para verificar archivos
check_file_content() {
    local file_path=$1
    local search_pattern=$2
    local description=$3
    
    echo -n "📄 Verificando ${description}... "
    
    if [ -f "$file_path" ]; then
        if grep -q "$search_pattern" "$file_path"; then
            echo -e "${GREEN}✅ CORRECTO${NC}"
            return 0
        else
            echo -e "${RED}❌ PATRÓN NO ENCONTRADO${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ ARCHIVO NO ENCONTRADO${NC}"
        return 1
    fi
}

echo ""
echo "🎯 1. VERIFICACIÓN DE SERVICIOS"
echo "------------------------------------------------------"

# Verificar Backend
check_service "Backend NestJS" "${BACKEND_URL}/health" "200"
backend_status=$?

# Verificar SuperApp
check_service "SuperApp Frontend" "${SUPERAPP_URL}" "200"
superapp_status=$?

echo ""
echo "🎯 2. VERIFICACIÓN DE CORRECCIÓN DE CÓDIGO"
echo "------------------------------------------------------"

# Verificar que el hook useLetsIntegration tiene la URL correcta
check_file_content \
    "Demo/apps/superapp-unified/src/hooks/useLetsIntegration.ts" \
    "/lets/history/\${userId}" \
    "URL corregida en useLetsIntegration.ts"
hook_fix_status=$?

# Verificar que no quede la URL incorrecta
echo -n "🚫 Verificando ausencia de URL incorrecta... "
if ! grep -q "/lets/transactions/user/" "Demo/apps/superapp-unified/src/hooks/useLetsIntegration.ts"; then
    echo -e "${GREEN}✅ URL INCORRECTA ELIMINADA${NC}"
    url_clean_status=0
else
    echo -e "${RED}❌ URL INCORRECTA AÚN PRESENTE${NC}"
    url_clean_status=1
fi

# Verificar que el backend service tiene la URL correcta
check_file_content \
    "Demo/apps/superapp-unified/src/lib/lets-backend-service.ts" \
    "/lets/history/\${userId}" \
    "URL correcta en lets-backend-service.ts"
service_url_status=$?

echo ""
echo "🎯 3. VERIFICACIÓN DE ENDPOINTS DEL BACKEND"
echo "------------------------------------------------------"

if [ $backend_status -eq 0 ]; then
    # Verificar endpoint LETs (esperamos 401 sin autenticación)
    echo -n "🔐 Verificando endpoint /lets/history (sin auth)... "
    if response=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/lets/history/${TEST_USER_ID}" 2>/dev/null); then
        if [ "$response" = "401" ]; then
            echo -e "${GREEN}✅ RESPONDE CORRECTAMENTE (HTTP 401 - auth requerida)${NC}"
            endpoint_status=0
        else
            echo -e "${YELLOW}⚠️ Respuesta inesperada (HTTP $response)${NC}"
            endpoint_status=1
        fi
    else
        echo -e "${RED}❌ SIN RESPUESTA${NC}"
        endpoint_status=1
    fi
    
    # Verificar que el endpoint incorrecto retorna 404
    echo -n "🚫 Verificando endpoint incorrecto retorna 404... "
    if response=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/lets/transactions/user/${TEST_USER_ID}" 2>/dev/null); then
        if [ "$response" = "404" ]; then
            echo -e "${GREEN}✅ ENDPOINT INCORRECTO RETORNA 404${NC}"
            wrong_endpoint_status=0
        else
            echo -e "${YELLOW}⚠️ Respuesta inesperada (HTTP $response)${NC}"
            wrong_endpoint_status=1
        fi
    else
        echo -e "${RED}❌ SIN RESPUESTA${NC}"
        wrong_endpoint_status=1
    fi
else
    echo -e "${RED}❌ BACKEND NO DISPONIBLE - Saltando verificación de endpoints${NC}"
    endpoint_status=1
    wrong_endpoint_status=1
fi

echo ""
echo "🎯 4. VERIFICACIÓN DE MÓDULOS DEL BACKEND"
echo "------------------------------------------------------"

# Verificar que LetsModule está importado en AppModule
check_file_content \
    "src/app.module.ts" \
    "LetsModule" \
    "LetsModule importado en AppModule"
module_import_status=$?

echo ""
echo "🎯 5. RESUMEN DE VERIFICACIÓN"
echo "======================================================"

# Contador de verificaciones exitosas
success_count=0
total_checks=7

# Función para reportar estado
report_status() {
    local description=$1
    local status=$2
    
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✅ $description${NC}"
        ((success_count++))
    else
        echo -e "${RED}❌ $description${NC}"
    fi
}

report_status "Backend NestJS funcionando" $backend_status
report_status "SuperApp Frontend funcionando" $superapp_status
report_status "Hook useLetsIntegration corregido" $hook_fix_status
report_status "URL incorrecta eliminada" $url_clean_status
report_status "Backend service con URL correcta" $service_url_status
report_status "Endpoint /lets/history responde" $endpoint_status
report_status "LetsModule importado en AppModule" $module_import_status

echo ""
echo "📊 RESULTADO FINAL"
echo "======================================================"

if [ $success_count -eq $total_checks ]; then
    echo -e "${GREEN}🎉 TODAS LAS VERIFICACIONES EXITOSAS ($success_count/$total_checks)${NC}"
    echo -e "${GREEN}✅ FIX DEL ENDPOINT LETS COMPLETAMENTE VERIFICADO${NC}"
    exit_code=0
elif [ $success_count -ge 5 ]; then
    echo -e "${YELLOW}⚠️ VERIFICACIÓN PARCIALMENTE EXITOSA ($success_count/$total_checks)${NC}"
    echo -e "${YELLOW}🔧 ALGUNAS VERIFICACIONES FALLARON - REVISAR LOGS${NC}"
    exit_code=1
else
    echo -e "${RED}❌ VERIFICACIÓN FALLIDA ($success_count/$total_checks)${NC}"
    echo -e "${RED}🚨 MÚLTIPLES PROBLEMAS DETECTADOS - REVISAR INMEDIATAMENTE${NC}"
    exit_code=2
fi

echo ""
echo "🔗 ARCHIVOS VERIFICADOS:"
echo "   - Demo/apps/superapp-unified/src/hooks/useLetsIntegration.ts"
echo "   - Demo/apps/superapp-unified/src/lib/lets-backend-service.ts"
echo "   - src/app.module.ts"
echo ""
echo "🌐 ENDPOINTS VERIFICADOS:"
echo "   - ${BACKEND_URL}/health"
echo "   - ${BACKEND_URL}/lets/history/${TEST_USER_ID}"
echo "   - ${SUPERAPP_URL}/"
echo ""
echo "📋 PARA MÁS DETALLES, VER:"
echo "   - docs/implementation/LETS_ENDPOINT_FIX_SUMMARY.md"
echo ""

exit $exit_code 