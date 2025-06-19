#!/bin/bash

echo "🔍 VERIFICACIÓN DE BACKEND NESTJS FUNCIONANDO"
echo "============================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para verificar respuesta HTTP
check_endpoint() {
    local url=$1
    local description=$2
    local expected_status=$3
    
    echo -n "🔍 $description... "
    
    local response=$(curl -s -w "%{http_code}" "$url" 2>/dev/null)
    local http_code="${response: -3}"
    local body="${response%???}"
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK (HTTP $http_code)${NC}"
        if [ -n "$body" ] && [ "$body" != "null" ]; then
            echo "   📄 Response: $body"
        fi
        return 0
    else
        echo -e "${RED}❌ ERROR (HTTP $http_code)${NC}"
        if [ -n "$body" ] && [ "$body" != "null" ]; then
            echo "   📄 Response: $body"
        fi
        return 1
    fi
}

echo -e "${BLUE}📋 PASO 1: VERIFICACIÓN DE CONECTIVIDAD${NC}"
echo "========================================="
echo ""

# Verificar puerto 3002
echo "🔍 Verificando puerto 3002..."
if lsof -i :3002 >/dev/null 2>&1; then
    PROCESS_INFO=$(lsof -i :3002 | tail -n 1)
    echo -e "✅ ${GREEN}Puerto 3002 está ocupado:${NC}"
    echo "   $PROCESS_INFO"
    echo ""
else
    echo -e "❌ ${RED}Puerto 3002 está libre${NC}"
    echo -e "💡 ${YELLOW}El backend NO está ejecutándose${NC}"
    echo ""
    echo "Para ejecutar el backend:"
    echo '   cd "/Users/kevinp/Movies/GAMIFIER copy"'
    echo "   npm run dev:backend"
    echo ""
    exit 1
fi

echo -e "${BLUE}📋 PASO 2: HEALTH CHECK${NC}"
echo "========================="
echo ""

# Health check
if check_endpoint "http://localhost:3002/health" "Health Check" "200"; then
    HEALTH_STATUS="OK"
    echo ""
else
    echo -e "❌ ${RED}Backend no responde correctamente${NC}"
    exit 1
fi

echo -e "${BLUE}📋 PASO 3: AUTENTICACIÓN${NC}"
echo "=========================="
echo ""

# Test de login
echo "🔍 Probando autenticación con admin@gamifier.com..."

LOGIN_RESPONSE=$(curl -s -w "%{http_code}" -X POST "http://localhost:3002/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}' 2>/dev/null)

LOGIN_HTTP_CODE="${LOGIN_RESPONSE: -3}"
LOGIN_BODY="${LOGIN_RESPONSE%???}"

if [ "$LOGIN_HTTP_CODE" = "201" ] || [ "$LOGIN_HTTP_CODE" = "200" ]; then
    echo -e "✅ ${GREEN}Autenticación exitosa (HTTP $LOGIN_HTTP_CODE)${NC}"
    
    # Extraer token
    TOKEN=$(echo "$LOGIN_BODY" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        echo "🔑 Token JWT obtenido exitosamente"
        AUTH_STATUS="OK"
        echo ""
    else
        echo -e "⚠️ ${YELLOW}Login exitoso pero no se pudo extraer token${NC}"
        AUTH_STATUS="PARTIAL"
        echo ""
    fi
else
    echo -e "❌ ${RED}Error en autenticación (HTTP $LOGIN_HTTP_CODE)${NC}"
    echo "   📄 Response: $LOGIN_BODY"
    AUTH_STATUS="ERROR"
    echo ""
fi

echo -e "${BLUE}📋 PASO 4: ENDPOINTS DE DATOS${NC}"
echo "============================="
echo ""

if [ "$AUTH_STATUS" = "OK" ] && [ -n "$TOKEN" ]; then
    
    # Test video-items endpoint
    echo "🔍 Probando endpoint de videos..."
    VIDEOS_RESPONSE=$(curl -s -w "%{http_code}" \
      -H "Authorization: Bearer $TOKEN" \
      "http://localhost:3002/video-items" 2>/dev/null)
    
    VIDEOS_HTTP_CODE="${VIDEOS_RESPONSE: -3}"
    VIDEOS_BODY="${VIDEOS_RESPONSE%???}"
    
    if [ "$VIDEOS_HTTP_CODE" = "200" ]; then
        VIDEO_COUNT=$(echo "$VIDEOS_BODY" | grep -o '"id"' | wc -l | xargs)
        echo -e "✅ ${GREEN}Videos endpoint OK (HTTP $VIDEOS_HTTP_CODE)${NC}"
        echo "   📊 Videos disponibles: $VIDEO_COUNT"
        
        if [ "$VIDEO_COUNT" -gt 0 ]; then
            VIDEOS_STATUS="OK"
        else
            echo -e "   ⚠️ ${YELLOW}No hay videos en la base de datos${NC}"
            VIDEOS_STATUS="EMPTY"
        fi
    else
        echo -e "❌ ${RED}Error en videos endpoint (HTTP $VIDEOS_HTTP_CODE)${NC}"
        echo "   📄 Response: $VIDEOS_BODY"
        VIDEOS_STATUS="ERROR"
    fi
    
    echo ""
    
    # Test users endpoint
    echo "🔍 Probando endpoint de usuarios..."
    USERS_RESPONSE=$(curl -s -w "%{http_code}" \
      -H "Authorization: Bearer $TOKEN" \
      "http://localhost:3002/users" 2>/dev/null)
    
    USERS_HTTP_CODE="${USERS_RESPONSE: -3}"
    USERS_BODY="${USERS_RESPONSE%???}"
    
    if [ "$USERS_HTTP_CODE" = "200" ]; then
        USER_COUNT=$(echo "$USERS_BODY" | grep -o '"id"' | wc -l | xargs)
        echo -e "✅ ${GREEN}Users endpoint OK (HTTP $USERS_HTTP_CODE)${NC}"
        echo "   👥 Usuarios disponibles: $USER_COUNT"
        USERS_STATUS="OK"
    else
        echo -e "❌ ${RED}Error en users endpoint (HTTP $USERS_HTTP_CODE)${NC}"
        echo "   📄 Response: $USERS_BODY"
        USERS_STATUS="ERROR"
    fi
    
else
    echo -e "⏭️ ${YELLOW}Saltando tests de endpoints (sin token válido)${NC}"
    VIDEOS_STATUS="SKIPPED"
    USERS_STATUS="SKIPPED"
fi

echo ""
echo -e "${BLUE}📋 RESUMEN DE VERIFICACIÓN${NC}"
echo "=========================="
echo ""

# Resumen visual
echo "📊 Estado de Componentes:"
echo ""

if [ "$HEALTH_STATUS" = "OK" ]; then
    echo -e "   🩺 Health Check: ${GREEN}✅ OK${NC}"
else
    echo -e "   🩺 Health Check: ${RED}❌ ERROR${NC}"
fi

if [ "$AUTH_STATUS" = "OK" ]; then
    echo -e "   🔐 Autenticación: ${GREEN}✅ OK${NC}"
elif [ "$AUTH_STATUS" = "PARTIAL" ]; then
    echo -e "   🔐 Autenticación: ${YELLOW}⚠️ PARCIAL${NC}"
else
    echo -e "   🔐 Autenticación: ${RED}❌ ERROR${NC}"
fi

if [ "$VIDEOS_STATUS" = "OK" ]; then
    echo -e "   🎥 Videos Endpoint: ${GREEN}✅ OK${NC}"
elif [ "$VIDEOS_STATUS" = "EMPTY" ]; then
    echo -e "   🎥 Videos Endpoint: ${YELLOW}⚠️ SIN DATOS${NC}"
elif [ "$VIDEOS_STATUS" = "ERROR" ]; then
    echo -e "   🎥 Videos Endpoint: ${RED}❌ ERROR${NC}"
else
    echo -e "   🎥 Videos Endpoint: ${YELLOW}⏭️ SALTADO${NC}"
fi

if [ "$USERS_STATUS" = "OK" ]; then
    echo -e "   👥 Users Endpoint: ${GREEN}✅ OK${NC}"
elif [ "$USERS_STATUS" = "ERROR" ]; then
    echo -e "   👥 Users Endpoint: ${RED}❌ ERROR${NC}"
else
    echo -e "   👥 Users Endpoint: ${YELLOW}⏭️ SALTADO${NC}"
fi

echo ""

# Conclusión final
if [ "$HEALTH_STATUS" = "OK" ] && [ "$AUTH_STATUS" = "OK" ] && [ "$VIDEOS_STATUS" = "OK" ] && [ "$USERS_STATUS" = "OK" ]; then
    echo -e "🎉 ${GREEN}¡BACKEND COMPLETAMENTE FUNCIONAL!${NC}"
    echo ""
    echo -e "✅ ${GREEN}El frontend debería conectarse automáticamente${NC}"
    echo -e "✅ ${GREEN}Videos reales aparecerán en ÜPlay${NC}"
    echo -e "✅ ${GREEN}Autenticación funcionará correctamente${NC}"
    echo -e "✅ ${GREEN}Banner de MODO DEMO desaparecerá${NC}"
    
elif [ "$HEALTH_STATUS" = "OK" ] && [ "$AUTH_STATUS" = "OK" ]; then
    echo -e "⚠️ ${YELLOW}BACKEND FUNCIONANDO CON ADVERTENCIAS${NC}"
    echo ""
    echo -e "✅ ${GREEN}Conexión básica OK${NC}"
    echo -e "✅ ${GREEN}Autenticación OK${NC}"
    
    if [ "$VIDEOS_STATUS" = "EMPTY" ]; then
        echo -e "⚠️ ${YELLOW}Base de datos sin videos - ejecutar seed${NC}"
        echo "   💡 Comando: npm run db:seed"
    fi
    
else
    echo -e "❌ ${RED}BACKEND CON PROBLEMAS CRÍTICOS${NC}"
    echo ""
    echo -e "💡 ${BLUE}Soluciones sugeridas:${NC}"
    
    if [ "$HEALTH_STATUS" != "OK" ]; then
        echo "   1. Verificar que el backend esté ejecutándose"
        echo "   2. Revisar logs de error en la terminal del backend"
    fi
    
    if [ "$AUTH_STATUS" != "OK" ]; then
        echo "   3. Verificar configuración de base de datos"
        echo "   4. Ejecutar migration y seed: npm run db:reset"
    fi
fi

echo ""
echo "========================================"
echo -e "🔍 Verificación completada - $(date)"
echo "========================================"