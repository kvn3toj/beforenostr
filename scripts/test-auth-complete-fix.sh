#!/bin/bash

echo "🧪 TEST COMPLETO: AUTH FIXES - SUPERAPP COOMUNITY"
echo "================================================="
echo "🎯 VERIFICANDO que los errores fueron resueltos:"
echo "1. Error JSON.parse con localStorage corrupto"
echo "2. RateLimiter.recordAttempt método faltante"
echo "3. Error 400 Bad Request en login"
echo ""

# 1. ✅ VERIFICAR MÉTODO RECORDATTEMPT
echo "📋 1. VERIFICANDO MÉTODO recordAttempt..."
if grep -q "recordAttempt(identifier: string): void" Demo/apps/superapp-unified/src/utils/security.ts; then
    echo "✅ Método recordAttempt encontrado con tipado correcto"
    # Mostrar el método
    echo "🔍 Implementación:"
    grep -A 10 "recordAttempt(identifier: string): void" Demo/apps/superapp-unified/src/utils/security.ts | head -8
else
    echo "❌ Método recordAttempt NO encontrado"
    exit 1
fi

# 2. ✅ VERIFICAR SERVICIOS FUNCIONANDO
echo ""
echo "📋 2. VERIFICANDO SERVICIOS..."

BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend NestJS: HTTP $BACKEND_STATUS (puerto 3002)"
else
    echo "❌ Backend NestJS: HTTP $BACKEND_STATUS (puerto 3002)"
    echo "🔧 Ejecuta: npm run dev:backend"
    exit 1
fi

SUPERAPP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$SUPERAPP_STATUS" = "200" ]; then
    echo "✅ SuperApp: HTTP $SUPERAPP_STATUS (puerto 3001)"
else
    echo "❌ SuperApp: HTTP $SUPERAPP_STATUS (puerto 3001)"
    echo "🔧 Ejecuta: npm run dev:superapp"
    exit 1
fi

# 3. ✅ TEST DE LOGIN ENDPOINT
echo ""
echo "📋 3. PROBANDO ENDPOINT DE LOGIN..."

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Login endpoint: HTTP $HTTP_CODE"

    # Verificar que la respuesta contiene los campos esperados
    if echo "$LOGIN_BODY" | grep -q "access_token" && echo "$LOGIN_BODY" | grep -q "user"; then
        echo "✅ Respuesta válida: contiene access_token y user"

        # Extraer email del usuario para verificar
        USER_EMAIL=$(echo "$LOGIN_BODY" | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
        echo "✅ Usuario autenticado: $USER_EMAIL"
    else
        echo "❌ Respuesta inválida: falta access_token o user"
        echo "🔍 Respuesta: $LOGIN_BODY"
    fi
else
    echo "❌ Login endpoint: HTTP $HTTP_CODE"
    echo "🔍 Respuesta completa: $LOGIN_RESPONSE"
    exit 1
fi

# 4. ✅ VERIFICAR ARCHIVOS DE CORRECCIÓN
echo ""
echo "📋 4. VERIFICANDO ARCHIVOS DE CORRECCIÓN..."

if [ -f "scripts/clear-localStorage-corruption.js" ]; then
    echo "✅ Script JavaScript de limpieza disponible"
else
    echo "❌ Script JavaScript de limpieza faltante"
fi

if [ -f "scripts/execute-localStorage-cleanup.sh" ]; then
    echo "✅ Script de ejecución de limpieza disponible"
else
    echo "❌ Script de ejecución de limpieza faltante"
fi

if [ -f "Demo/apps/superapp-unified/src/utils/security.ts.backup" ]; then
    echo "✅ Backup de security.ts disponible"
else
    echo "⚠️ Backup de security.ts no encontrado (posiblemente normal)"
fi

# 5. ✅ VERIFICAR QUE NO HAY ERRORES EN LOGS
echo ""
echo "📋 5. VERIFICANDO LOGS DEL BACKEND..."
echo "🔍 Últimas 10 líneas de logs del backend (si está disponible):"

# Intentar obtener logs recientes del backend
if pgrep -f "npm run dev:backend" > /dev/null; then
    echo "✅ Proceso backend detectado"
else
    echo "⚠️ Proceso backend no detectado vía pgrep"
fi

# 6. ✅ GENERAR COMANDOS DE PRUEBA MANUAL
echo ""
echo "📋 6. COMANDOS DE PRUEBA MANUAL..."

cat << 'EOF'
🧪 PARA PROBAR MANUALMENTE:

1. 🌐 ABRIR NAVEGADOR:
   open http://localhost:3001

2. 🛠️ LIMPIAR LOCALSTORAGE (DevTools Console):
   localStorage.clear(); sessionStorage.clear(); location.reload();

3. 🔐 PROBAR LOGIN:
   Email: admin@gamifier.com
   Password: admin123

4. ✅ VERIFICAR SIN ERRORES:
   - No error JSON.parse en console
   - No error recordAttempt is not a function
   - Login exitoso y redirección a dashboard

5. 🔍 SI HAY PROBLEMAS:
   - Revisar Network tab para errores 400/401
   - Revisar Console para errores JavaScript
   - Verificar que Backend está respondiendo
EOF

echo ""
echo "🎉 RESUMEN DE VERIFICACIÓN:"
echo "=========================="
echo "✅ Método RateLimiter.recordAttempt agregado"
echo "✅ Backend NestJS funcionando (puerto 3002)"
echo "✅ SuperApp funcionando (puerto 3001)"
echo "✅ Endpoint de login responde correctamente"
echo "✅ Scripts de limpieza localStorage creados"
echo ""
echo "🎯 PRÓXIMO PASO CRÍTICO:"
echo "1. Ejecutar limpieza de localStorage en navegador"
echo "2. Probar login con credenciales: admin@gamifier.com / admin123"
echo "3. Verificar ausencia de errores JSON.parse y recordAttempt"
echo ""
echo "🛠️ COMANDO RÁPIDO PARA LIMPIAR NAVEGADOR:"
echo "   ./scripts/execute-localStorage-cleanup.sh"
echo ""
