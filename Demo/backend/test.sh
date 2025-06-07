#!/bin/bash

# CoomÜnity Backend - Script de Testing
# Este script ejecuta tests básicos de todos los endpoints

set -e

echo "🧪 Testing CoomÜnity Backend API Server..."
echo "=========================================="

# Variables
BASE_URL="http://localhost:3000"
TIMEOUT=5

# Función para hacer requests con timeout
api_test() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-}
    local description=$4
    
    echo -n "Testing $description... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -m $TIMEOUT \
            -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint" 2>/dev/null || echo "000")
    else
        response=$(curl -s -w "%{http_code}" -m $TIMEOUT "$BASE_URL$endpoint" 2>/dev/null || echo "000")
    fi
    
    http_code=${response: -3}
    
    if [ "$http_code" = "200" ]; then
        echo "✅ OK ($http_code)"
        return 0
    else
        echo "❌ FAIL ($http_code)"
        return 1
    fi
}

# Verificar que el servidor esté corriendo
echo "Verificando que el servidor esté corriendo en $BASE_URL..."
if ! curl -s "$BASE_URL/health" > /dev/null 2>&1; then
    echo ""
    echo "❌ Error: El servidor no está corriendo en $BASE_URL"
    echo ""
    echo "Para iniciar el servidor:"
    echo "  npm start       - Modo producción"
    echo "  npm run dev     - Modo desarrollo"
    echo ""
    exit 1
fi

echo "✅ Servidor detectado en $BASE_URL"
echo ""

# Contador de tests
total_tests=0
passed_tests=0

# Core Endpoints
echo "📋 Core Endpoints:"
api_test "/health" "GET" "" "Health Check" && ((passed_tests++)) || true
((total_tests++))

api_test "/api" "GET" "" "API Documentation" && ((passed_tests++)) || true
((total_tests++))

echo ""

# Pilgrim Endpoints
echo "🧙 Pilgrim Endpoints:"
api_test "/api/pilgrim-data" "GET" "" "Pilgrim Data" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/pilgrim/profile" "GET" "" "Pilgrim Profile" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/pilgrim/journey" "GET" "" "Pilgrim Journey" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/pilgrim/quests" "GET" "" "Pilgrim Quests" && ((passed_tests++)) || true
((total_tests++))

echo ""

# Merchant Endpoints
echo "🏪 Merchant Endpoints:"
api_test "/api/merchant-data" "GET" "" "Merchant Data" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/merchant/profile" "GET" "" "Merchant Profile" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/merchant/products" "GET" "" "Merchant Products" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/merchant/matches" "GET" "" "Merchant Matches" && ((passed_tests++)) || true
((total_tests++))

echo ""

# Red Pill Endpoints
echo "💊 Red Pill Endpoints:"
api_test "/api/red-pill-data" "GET" "" "Red Pill Data" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/red-pill/questions" "GET" "" "Red Pill Questions" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/red-pill/questions?category=critical-thinking" "GET" "" "Red Pill Questions (Filtered)" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/red-pill/results?sessionId=test123" "GET" "" "Red Pill Results" && ((passed_tests++)) || true
((total_tests++))

echo ""

# User Endpoints
echo "👤 User Endpoints:"
api_test "/api/user-profile/test123" "GET" "" "User Profile" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/user/preferences/test123" "GET" "" "User Preferences" && ((passed_tests++)) || true
((total_tests++))

echo ""

# Data Endpoints
echo "📊 Data Endpoints:"
api_test "/api/data/recommendations" "GET" "" "Recommendations Data" && ((passed_tests++)) || true
((total_tests++))

api_test "/api/shared-data/mock-recommendations.json" "GET" "" "Shared Data File" && ((passed_tests++)) || true
((total_tests++))

echo ""

# Form Endpoints (POST)
echo "📝 Form Endpoints:"
form_data='{"formType":"test","data":{"name":"Test User","email":"test@example.com"},"timestamp":"2024-03-15T10:00:00Z"}'
api_test "/api/submit-form" "POST" "$form_data" "Form Submission" && ((passed_tests++)) || true
((total_tests++))

echo ""

# Resultados finales
echo "==============================================="
echo "📊 Resultados del Testing:"
echo "==============================================="
echo "Tests ejecutados: $total_tests"
echo "Tests exitosos:   $passed_tests"
echo "Tests fallidos:   $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    echo ""
    echo "🎉 ¡Todos los tests pasaron!"
    echo "✅ El backend está funcionando correctamente"
    echo ""
    echo "URLs para usar en el frontend:"
    echo "  Backend Base:   $BASE_URL"
    echo "  Pilgrim API:    $BASE_URL/api/pilgrim/"
    echo "  Merchant API:   $BASE_URL/api/merchant/"
    echo "  Red Pill API:   $BASE_URL/api/red-pill/"
    echo ""
    exit 0
else
    echo ""
    echo "⚠️  Algunos tests fallaron"
    echo "❌ Revisa los logs del servidor para más detalles"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Verifica que el servidor esté corriendo"
    echo "  2. Revisa los logs en la consola del servidor"
    echo "  3. Verifica que los archivos de datos existan"
    echo "  4. Consulta backend/README.md para más ayuda"
    echo ""
    exit 1
fi 