#!/bin/bash

echo "🔍 VERIFICACIÓN COMPLETA DE ENDPOINTS BACKEND EXISTENTES"
echo "========================================================"

# Verificar que el backend esté disponible
echo "1. 🏥 Verificando health del backend..."
HEALTH_CHECK=$(curl -s http://localhost:1111/health)
if [[ $? -eq 0 ]]; then
    echo "✅ Backend disponible en puerto 3002"
    echo "   Response: $HEALTH_CHECK"
else
    echo "❌ Backend no disponible. Ejecuta: npm run dev:backend"
    exit 1
fi

echo -e "\n2. 📊 VERIFICANDO ENDPOINTS EXISTENTES..."

# Token de autenticación (necesario para algunos endpoints)
echo "   Obteniendo token de autenticación..."
TOKEN_RESPONSE=$(curl -s -X POST "http://localhost:1111/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}')

if [[ $TOKEN_RESPONSE == *"accessToken"* ]]; then
    TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.accessToken')
    echo "   ✅ Token obtenido exitosamente"
else
    echo "   ❌ Error obteniendo token. Continuando sin autenticación..."
    TOKEN=""
fi

# Headers para requests autenticados
if [[ -n "$TOKEN" ]]; then
    AUTH_HEADER="Authorization: Bearer $TOKEN"
else
    AUTH_HEADER=""
fi

echo -e "\n📈 ANALYTICS ENDPOINTS (los que faltan):"
echo "----------------------------------------"

endpoints_analytics=(
    "/analytics/dashboard-metrics"
    "/analytics/system-health" 
    "/analytics/user-stats"
)

for endpoint in "${endpoints_analytics[@]}"; do
    echo -n "   $endpoint: "
    response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:1111$endpoint")
    if [[ $response -eq 404 ]]; then
        echo "❌ NO EXISTE - NECESITA IMPLEMENTACIÓN"
    elif [[ $response -eq 401 ]]; then
        echo "✅ EXISTE - requiere autenticación"
    elif [[ $response -eq 200 ]]; then
        echo "✅ EXISTE - funcionando"
    else
        echo "⚠️  STATUS: $response"
    fi
done

echo -e "\n💰 LETS ENDPOINTS (verificar conexión):"
echo "----------------------------------------"

endpoints_lets=(
    "/lets/ping"
    "/lets/balance/00000000-0000-0000-0000-000000000001"
    "/lets/history/00000000-0000-0000-0000-000000000001"
)

for endpoint in "${endpoints_lets[@]}"; do
    echo -n "   $endpoint: "
    if [[ -n "$TOKEN" ]]; then
        response=$(curl -s -w "%{http_code}" -o /dev/null -H "$AUTH_HEADER" "http://localhost:1111$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:1111$endpoint")
    fi
    
    if [[ $response -eq 404 ]]; then
        echo "❌ NO EXISTE"
    elif [[ $response -eq 401 ]]; then
        echo "✅ EXISTE - necesita conectar frontend con autenticación"
    elif [[ $response -eq 200 ]]; then
        echo "✅ EXISTE - funcionando"
    else
        echo "⚠️  STATUS: $response"
    fi
done

echo -e "\n📊 MARKETPLACE ENDPOINTS (verificar conexión):"
echo "----------------------------------------------"

endpoints_marketplace=(
    "/marketplace/ping"
    "/marketplace/stats"
    "/marketplace/items"
)

for endpoint in "${endpoints_marketplace[@]}"; do
    echo -n "   $endpoint: "
    if [[ -n "$TOKEN" ]]; then
        response=$(curl -s -w "%{http_code}" -o /dev/null -H "$AUTH_HEADER" "http://localhost:1111$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:1111$endpoint")
    fi
    
    if [[ $response -eq 404 ]]; then
        echo "❌ NO EXISTE"
    elif [[ $response -eq 401 ]]; then
        echo "✅ EXISTE - necesita conectar frontend con autenticación"
    elif [[ $response -eq 200 ]]; then
        echo "✅ EXISTE - funcionando"
    else
        echo "⚠️  STATUS: $response"
    fi
done

echo -e "\n👥 SOCIAL ENDPOINTS (verificar conexión):"
echo "-----------------------------------------"

endpoints_social=(
    "/social/publications"
    "/social/stats"
)

for endpoint in "${endpoints_social[@]}"; do
    echo -n "   $endpoint: "
    response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:1111$endpoint")
    
    if [[ $response -eq 404 ]]; then
        echo "❌ NO EXISTE"
    elif [[ $response -eq 401 ]]; then
        echo "✅ EXISTE - necesita conectar frontend con autenticación"
    elif [[ $response -eq 200 ]]; then
        echo "✅ EXISTE - funcionando"
    else
        echo "⚠️  STATUS: $response"
    fi
done

echo -e "\n📋 RESUMEN DE ACCIONES:"
echo "======================="
echo "🔄 CONECTAR FRONTEND → BACKEND (80% del trabajo):"
echo "   - LETS: Conectar useLetsIntegration.ts con endpoints existentes"
echo "   - MARKETPLACE: Conectar servicios con endpoints existentes"  
echo "   - SOCIAL: Conectar componentes con endpoints existentes"
echo "   - Configurar autenticación JWT en requests"

echo -e "\n🆕 CREAR ENDPOINTS FALTANTES (20% del trabajo):"
echo "   - /analytics/dashboard-metrics"
echo "   - /analytics/system-health"
echo "   - /analytics/user-stats"

echo -e "\n🚀 PRÓXIMO PASO RECOMENDADO:"
echo "   1. Ejecutar: ./scripts/verify-home-backend-integration.sh"
echo "   2. Conectar hooks del frontend con endpoints existentes"
echo "   3. Implementar solo los 3 endpoints analytics faltantes"

echo -e "\n✅ Verificación completada" 