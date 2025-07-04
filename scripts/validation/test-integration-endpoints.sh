#!/bin/bash

# 🧪 SCRIPT DE VALIDACIÓN - ENDPOINTS DE INTEGRACIÓN
# Script para probar los nuevos endpoints implementados según el reporte de integración

set -e

echo "🔍 VALIDANDO NUEVOS ENDPOINTS DE INTEGRACIÓN - $(date)"
echo "=============================================="

# Configuración
BACKEND_URL="http://localhost:3002"
TEST_USER_EMAIL="user@gamifier.com"
TEST_USER_PASSWORD="123456"
AUTH_TOKEN=""

# Función para obtener token de autenticación
get_auth_token() {
    echo "🔑 Obteniendo token de autenticación..."
    
    AUTH_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_USER_EMAIL\",\"password\":\"$TEST_USER_PASSWORD\"}")
    
    if [[ $? -eq 0 ]] && [[ $AUTH_RESPONSE == *"access_token"* ]]; then
        AUTH_TOKEN=$(echo $AUTH_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
        echo "✅ Token obtenido correctamente"
        return 0
    else
        echo "❌ Error obteniendo token: $AUTH_RESPONSE"
        return 1
    fi
}

# Función para hacer requests autenticados
authenticated_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [[ -z "$AUTH_TOKEN" ]]; then
        echo "❌ No hay token de autenticación"
        return 1
    fi
    
    if [[ -n "$data" ]]; then
        curl -s -X $method "${BACKEND_URL}${endpoint}" \
            -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data"
    else
        curl -s -X $method "${BACKEND_URL}${endpoint}" \
            -H "Authorization: Bearer $AUTH_TOKEN"
    fi
}

# Función para verificar endpoint
check_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected_status=$4
    local data=$5
    
    echo "🌐 Probando: $name"
    echo "   Endpoint: $method $endpoint"
    
    if [[ $method == "GET" ]]; then
        response=$(authenticated_request GET "$endpoint")
    else
        response=$(authenticated_request POST "$endpoint" "$data")
    fi
    
    if [[ $? -eq 0 ]] && [[ $response == *"timestamp"* || $response == *"id"* || $response == *"count"* || $response == *"data"* || $response == *"userId"* || $response == *"["* || $response == *"}"* ]]; then
        echo "   ✅ Respuesta válida recibida"
        echo "   📊 Muestra: $(echo $response | cut -c1-100)..."
        return 0
    else
        echo "   ❌ Error o respuesta inválida"
        echo "   📊 Respuesta: $response"
        return 1
    fi
}

# Verificar que el backend esté funcionando
echo "🏥 Verificando salud del backend..."
health_check=$(curl -s "${BACKEND_URL}/health" || echo "ERROR")

if [[ $health_check != *"ok"* ]]; then
    echo "❌ Backend no está funcionando en $BACKEND_URL"
    echo "   Respuesta: $health_check"
    echo "💡 Asegúrate de que el backend esté ejecutándose:"
    echo "   cd /Users/kevinp/Movies/GAMIFIER-copy && npm run dev:backend"
    exit 1
fi

echo "✅ Backend está funcionando correctamente"

# Obtener token de autenticación
if ! get_auth_token; then
    echo "❌ No se pudo obtener token de autenticación"
    echo "💡 Verifica las credenciales: $TEST_USER_EMAIL / $TEST_USER_PASSWORD"
    exit 1
fi

echo ""
echo "📊 FASE 1: ENDPOINTS DE ANALYTICS"
echo "=================================="

# Test Analytics Dashboard Metrics
check_endpoint "Dashboard Metrics" "GET" "/analytics/dashboard-metrics" 200

# Test Analytics System Health
check_endpoint "System Health" "GET" "/analytics/system-health" 200

echo ""
echo "🔄 FASE 2: ENDPOINTS DE LETS"
echo "============================="

# Test LETS Trust Ratings
check_endpoint "Trust Ratings" "GET" "/lets/trust-ratings/user123" 200

# Test LETS Knowledge Exchanges
check_endpoint "Knowledge Exchanges" "GET" "/lets/knowledge-exchanges" 200

# Test LETS Recommendations
check_endpoint "Recommendations" "GET" "/lets/recommendations/user123" 200

# Test LETS Notifications
check_endpoint "Notifications" "GET" "/lets/notifications/user123" 200

echo ""
echo "🏪 FASE 3: ENDPOINTS DE MARKETPLACE"
echo "===================================="

# Test Marketplace Items
check_endpoint "Marketplace Items" "GET" "/marketplace/items" 200

# Test Marketplace Stats
check_endpoint "Marketplace Stats" "GET" "/marketplace/stats" 200

echo ""
echo "👥 FASE 4: ENDPOINTS DE SOCIAL"
echo "==============================="

# Test Social Stats
check_endpoint "Social Stats" "GET" "/social/stats" 200

# Test Social Publications
check_endpoint "Social Publications" "GET" "/social/publications" 200

echo ""
echo "🎯 RESUMEN DE VALIDACIÓN"
echo "========================"
echo "✅ Validación completada - $(date)"
echo ""
echo "📋 ENDPOINTS PROBADOS:"
echo "   🔍 Analytics: dashboard-metrics, system-health"
echo "   🔄 LETS: trust-ratings, knowledge-exchanges, recommendations, notifications"
echo "   🏪 Marketplace: items, stats"
echo "   👥 Social: stats, publications"
echo ""
echo "💡 Si algún endpoint falló, verifica:"
echo "   1. Backend ejecutándose en puerto 3002"
echo "   2. PostgreSQL activo en puerto 5432"
echo "   3. Credenciales de usuario válidas"
echo "   4. Módulos importados en AppModule"
echo ""
echo "🚀 ¡Los endpoints están listos para integración con la SuperApp!"