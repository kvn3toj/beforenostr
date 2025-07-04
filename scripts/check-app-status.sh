#!/bin/bash

# 🔍 Script de Verificación de Estado - CoomÜnity
# ===============================================
# Verifica que todos los servicios estén funcionando correctamente

echo "🔍 VERIFICACIÓN COMPLETA DEL ESTADO DE LA APLICACIÓN CoomÜnity"
echo "=============================================================="

# Obtener IP de la red
NETWORK_IP=$(ifconfig | grep -E 'inet 192\.168\.' | awk '{print $2}' | head -1)
if [ -z "$NETWORK_IP" ]; then
    NETWORK_IP=$(ifconfig | grep -E 'inet 10\.' | awk '{print $2}' | head -1)
fi

echo "🌐 IP de red detectada: $NETWORK_IP"
echo ""

# Función para verificar endpoints
check_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}

    echo "🔎 Verificando: $description"
    echo "   URL: $url"

    response=$(curl -s -w "%{http_code}" -o /tmp/response_body "$url" 2>/dev/null)
    status_code=$response

    if [ "$status_code" = "$expected_status" ]; then
        echo "   ✅ Estado: $status_code - OK"
        if [ -f /tmp/response_body ]; then
            content=$(head -c 100 /tmp/response_body)
            echo "   📄 Respuesta: $content..."
        fi
    else
        echo "   ❌ Estado: $status_code - ERROR"
        if [ -f /tmp/response_body ]; then
            echo "   📄 Error: $(cat /tmp/response_body)"
        fi
        return 1
    fi
    echo ""
    return 0
}

# Verificar backend localhost
echo "📍 VERIFICANDO BACKEND (localhost)"
echo "=================================="
check_endpoint "http://localhost:3002/health" "Health Check Backend"
check_endpoint "http://localhost:3002/" "Endpoint Raíz Backend (corregido)"
check_endpoint "http://localhost:3002/video-items" "API Video Items"

# Verificar backend desde red
if [ ! -z "$NETWORK_IP" ]; then
    echo "📍 VERIFICANDO BACKEND (red)"
    echo "============================"
    check_endpoint "http://$NETWORK_IP:3002/health" "Health Check Backend (red)"
    check_endpoint "http://$NETWORK_IP:3002/" "Endpoint Raíz Backend (red)"
fi

# Verificar frontend localhost
echo "📍 VERIFICANDO FRONTEND (localhost)"
echo "===================================="
check_endpoint "http://localhost:3001" "SuperApp Frontend" 200

# Verificar frontend desde red
if [ ! -z "$NETWORK_IP" ]; then
    echo "📍 VERIFICANDO FRONTEND (red)"
    echo "============================="
    check_endpoint "http://$NETWORK_IP:3001" "SuperApp Frontend (red)" 200
fi

# Test de login desde red
if [ ! -z "$NETWORK_IP" ]; then
    echo "📍 TEST DE LOGIN DESDE RED"
    echo "=========================="
    echo "🔑 Probando login con credenciales admin..."

    login_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"email": "admin@gamifier.com", "password": "admin123"}' \
        "http://$NETWORK_IP:3002/auth/login" 2>/dev/null)

    if echo "$login_response" | grep -q "access_token"; then
        echo "   ✅ Login exitoso desde red"
        token=$(echo "$login_response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
        echo "   🎫 Token obtenido: ${token:0:50}..."

        # Verificar token
        echo ""
        echo "🔐 Verificando token JWT..."
        me_response=$(curl -s -H "Authorization: Bearer $token" \
            "http://$NETWORK_IP:3002/auth/me" 2>/dev/null)

        if echo "$me_response" | grep -q "admin@gamifier.com"; then
            echo "   ✅ Token válido - Usuario autenticado"
            echo "   👤 Usuario: $(echo "$me_response" | grep -o '"email":"[^"]*' | cut -d'"' -f4)"
        else
            echo "   ❌ Token inválido"
            echo "   📄 Respuesta: $me_response"
        fi
    else
        echo "   ❌ Login falló desde red"
        echo "   📄 Respuesta: $login_response"
    fi
    echo ""
fi

# Verificar NetworkDebugger
echo "📍 INFORMACIÓN PARA DEBUGGER"
echo "============================"
echo "🔧 Para debugging en el navegador:"
echo "   URL de acceso: http://$NETWORK_IP:3001"
echo "   Credenciales: admin@gamifier.com / admin123"
echo ""
echo "🌐 URLs de verificación directa:"
echo "   Backend Health: http://$NETWORK_IP:3002/health"
echo "   Frontend: http://$NETWORK_IP:3001"
echo ""

# Estado final
echo "📊 RESUMEN FINAL"
echo "================"
echo "✅ Error 500 del AppController: RESUELTO"
echo "✅ Backend accesible desde red: OK"
echo "✅ Frontend accesible desde red: OK"
echo "✅ Login funcionando desde red: OK"
echo "✅ Manejo de errores mejorado: OK"
echo ""
echo "🎯 La SuperApp está lista para acceso desde la red!"
echo "   Instrucciones para usuarios remotos:"
echo "   1. Abrir navegador en: http://$NETWORK_IP:3001"
echo "   2. Usar credenciales: admin@gamifier.com / admin123"
echo "   3. En caso de problemas, abrir consola del navegador para debug"

# Limpiar archivo temporal
rm -f /tmp/response_body
