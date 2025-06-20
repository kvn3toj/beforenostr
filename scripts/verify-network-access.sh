#!/bin/bash

# 🌐 Script de Verificación de Acceso de Red - CoomÜnity
# =====================================================
# Verifica que el ecosistema funcione correctamente tanto en localhost como en red

echo "🔍 CoomÜnity Network Access Verification"
echo "========================================"

# Detectar IP de red
NETWORK_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

if [ -z "$NETWORK_IP" ]; then
  echo "❌ ERROR: No se pudo detectar IP de red"
  exit 1
fi

echo "🌐 Testing network IP: $NETWORK_IP"
echo ""

# Función para probar un endpoint
test_endpoint() {
  local url=$1
  local description=$2
  local expected_status=${3:-200}

  echo -n "🔍 Testing $description ($url): "

  response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>/dev/null)

  if [ "$response" == "$expected_status" ]; then
    echo "✅ OK ($response)"
    return 0
  else
    echo "❌ FAILED ($response)"
    return 1
  fi
}

# Contador de tests
TOTAL_TESTS=0
PASSED_TESTS=0

# 1. LOCALHOST TESTS
echo "🏠 LOCALHOST TESTS:"
echo "=================="

# Backend localhost
test_endpoint "http://localhost:3002/health" "Backend Health Check" 200
TOTAL_TESTS=$((TOTAL_TESTS + 1))
[ $? -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))

test_endpoint "http://localhost:3002/auth/me" "Backend Auth Endpoint" 401
TOTAL_TESTS=$((TOTAL_TESTS + 1))
[ $? -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))

# Frontend localhost
test_endpoint "http://localhost:3001" "SuperApp Frontend" 200
TOTAL_TESTS=$((TOTAL_TESTS + 1))
[ $? -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))

echo ""

# 2. NETWORK TESTS
echo "🌐 NETWORK ACCESS TESTS:"
echo "======================="

# Backend network
test_endpoint "http://$NETWORK_IP:3002/health" "Backend Health Check (Network)" 200
TOTAL_TESTS=$((TOTAL_TESTS + 1))
[ $? -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))

test_endpoint "http://$NETWORK_IP:3002/auth/me" "Backend Auth Endpoint (Network)" 401
TOTAL_TESTS=$((TOTAL_TESTS + 1))
[ $? -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))

# Frontend network
test_endpoint "http://$NETWORK_IP:3001" "SuperApp Frontend (Network)" 200
TOTAL_TESTS=$((TOTAL_TESTS + 1))
[ $? -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))

echo ""

# 3. CORS VERIFICATION
echo "🔐 CORS VERIFICATION:"
echo "===================="

echo -n "🔍 Testing CORS headers from network: "
cors_response=$(curl -s -H "Origin: http://$NETWORK_IP:3001" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -X OPTIONS \
  --connect-timeout 5 \
  -w "%{http_code}" \
  "http://$NETWORK_IP:3002/health" 2>/dev/null)

if [ "$cors_response" == "200" ] || [ "$cors_response" == "204" ]; then
  echo "✅ OK ($cors_response)"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo "❌ FAILED ($cors_response)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""

# 4. RESULTADOS FINALES
echo "📊 RESULTADOS FINALES:"
echo "====================="
echo "✅ Tests pasados: $PASSED_TESTS"
echo "📝 Tests totales: $TOTAL_TESTS"

PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo "📈 Porcentaje de éxito: $PERCENTAGE%"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
  echo ""
  echo "🎉 ¡VERIFICACIÓN EXITOSA!"
  echo "========================"
  echo "✅ El ecosistema funciona correctamente en localhost y red"
  echo ""
  echo "📱 URLs para compartir:"
  echo "   Frontend: http://$NETWORK_IP:3001"
  echo "   Backend:  http://$NETWORK_IP:3002"
  exit 0
else
  echo ""
  echo "⚠️ VERIFICACIÓN PARCIAL"
  echo "======================"
  echo "❌ Algunos tests fallaron. Revisa la configuración."
  echo ""
  echo "🔧 Posibles soluciones:"
  echo "   1. Asegúrate de que ambos servicios estén ejecutándose"
  echo "   2. Verifica que el firewall permita conexiones en puertos 3001 y 3002"
  echo "   3. Ejecuta: ./scripts/start-network-access.sh"
  exit 1
fi
