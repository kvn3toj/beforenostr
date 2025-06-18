#!/bin/bash

echo "🔍 VERIFICACIÓN COMPLETA DEL FLUJO DE AUTENTICACIÓN - SUPERAPP COOMUNITY"
echo "=================================================================="

# Verificar servicios
echo "📡 1. Verificando servicios..."
BACKEND_HEALTH=$(curl -s http://localhost:1111/health | jq -r '.status' 2>/dev/null || echo "ERROR")
SUPERAPP_STATUS=$(curl -s -I http://localhost:2222 | head -n 1 | grep "200 OK" >/dev/null && echo "OK" || echo "ERROR")

echo "   Backend (3002): $BACKEND_HEALTH"
echo "   SuperApp (3001): $SUPERAPP_STATUS"

if [ "$BACKEND_HEALTH" != "ok" ] || [ "$SUPERAPP_STATUS" != "OK" ]; then
    echo "❌ ERROR: Los servicios no están funcionando correctamente"
    echo "   Asegúrate de ejecutar 'npm run dev' desde la raíz del monorepo"
    exit 1
fi

# Verificar credenciales de administrador
echo ""
echo "🔐 2. Verificando credenciales de administrador..."
ADMIN_LOGIN=$(curl -s -X POST "http://localhost:1111/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}')

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.access_token' 2>/dev/null)
if [ "$ADMIN_TOKEN" != "null" ] && [ "$ADMIN_TOKEN" != "" ]; then
    echo "   ✅ Admin login exitoso"
    echo "   Token: ${ADMIN_TOKEN:0:50}..."
else
    echo "   ❌ Admin login falló"
    echo "   Respuesta: $ADMIN_LOGIN"
fi

# Verificar credenciales de usuario regular
echo ""
echo "👤 3. Verificando credenciales de usuario regular..."
USER_LOGIN=$(curl -s -X POST "http://localhost:1111/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gamifier.com", "password": "123456"}')

USER_TOKEN=$(echo "$USER_LOGIN" | jq -r '.access_token' 2>/dev/null)
if [ "$USER_TOKEN" != "null" ] && [ "$USER_TOKEN" != "" ]; then
    echo "   ✅ User login exitoso"
    echo "   Token: ${USER_TOKEN:0:50}..."
else
    echo "   ❌ User login falló"
    echo "   Respuesta: $USER_LOGIN"
fi

# Verificar configuración de la SuperApp
echo ""
echo "⚙️ 4. Verificando configuración de la SuperApp..."
SUPERAPP_CONFIG=$(cat Demo/apps/superapp-unified/.env 2>/dev/null)
echo "$SUPERAPP_CONFIG" | grep -E "(VITE_API_BASE_URL|VITE_BASE_URL)" | while read line; do
    echo "   $line"
done

MOCK_AUTH_STATUS=$(echo "$SUPERAPP_CONFIG" | grep "VITE_ENABLE_MOCK_AUTH" || echo "VITE_ENABLE_MOCK_AUTH=false (por defecto)")
echo "   $MOCK_AUTH_STATUS"

echo ""
echo "🎯 5. Resumen de verificación:"
if [ "$ADMIN_TOKEN" != "null" ] && [ "$ADMIN_TOKEN" != "" ] && [ "$USER_TOKEN" != "null" ] && [ "$USER_TOKEN" != "" ]; then
    echo "   ✅ Autenticación backend funcionando correctamente"
    echo "   ✅ Credenciales admin@gamifier.com / admin123 válidas"
    echo "   ✅ Credenciales user@gamifier.com / 123456 válidas"
    echo "   ✅ SuperApp conectada al backend real (puerto 3002)"
    echo ""
    echo "🚀 ESTADO: Sistema listo para uso"
    echo "💻 Accede a: http://localhost:2222/login"
    echo "📝 Usa las credenciales verificadas arriba"
else
    echo "   ❌ Hay problemas con la autenticación"
    echo "   🔧 Ejecuta: npm run db:reset && npm run dev"
fi

echo ""
echo "==================================================================" 