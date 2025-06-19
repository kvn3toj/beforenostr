#!/bin/bash
echo "🔍 VERIFICACIÓN FINAL DE CORRECCIONES AUTH..."

# 1. Verificar método recordAttempt
if grep -q "recordAttempt" Demo/apps/superapp-unified/src/utils/security.ts; then
    echo "✅ 1. Método RateLimiter.recordAttempt disponible"
else
    echo "❌ 1. Método RateLimiter.recordAttempt FALTANTE"
fi

# 2. Verificar servicios
BACKEND_OK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
SUPERAPP_OK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)

if [ "$BACKEND_OK" = "200" ]; then
    echo "✅ 2. Backend NestJS funcionando (puerto 3002)"
else
    echo "❌ 2. Backend NestJS no disponible"
fi

if [ "$SUPERAPP_OK" = "200" ]; then
    echo "✅ 3. SuperApp funcionando (puerto 3001)"
else
    echo "❌ 3. SuperApp no disponible"
fi

# 3. Test de login endpoint
echo "🔍 4. Probando endpoint de login..."
LOGIN_TEST=$(curl -s -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}' \
  -w "%{http_code}")

if [[ "$LOGIN_TEST" == *"200" ]]; then
    echo "✅ 4. Endpoint de login funcionando"
else
    echo "❌ 4. Endpoint de login tiene problemas"
    echo "🔍 Response: $LOGIN_TEST"
fi

echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo "1. Ejecutar: ./scripts/execute-localStorage-cleanup.sh"
echo "2. Limpiar localStorage en navegador"
echo "3. Recargar SuperApp y probar login"
echo "4. Verificar que no hay errores JSON.parse"
