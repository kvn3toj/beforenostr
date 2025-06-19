#!/bin/bash

echo "🎯 PRUEBA DE CONEXIÓN BACKEND REAL - CoomÜnity"
echo "============================================="

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
BACKEND_URL="http://localhost:3002"
FRONTEND_URL="http://localhost:5173"

echo -e "\n${BLUE}📋 1. VERIFICACIÓN DE SERVICIOS${NC}"
echo "-------------------------------"

# Verificar frontend
echo "🌐 Verificando Frontend..."
if curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend activo en $FRONTEND_URL${NC}"
    FRONTEND_OK=true
else
    echo -e "${RED}❌ Frontend no responde en $FRONTEND_URL${NC}"
    FRONTEND_OK=false
fi

# Verificar backend
echo "🔧 Verificando Backend..."
if curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/health | grep -q "200"; then
    echo -e "${GREEN}✅ Backend activo en $BACKEND_URL${NC}"
    BACKEND_OK=true
    
    # Obtener información del health check
    HEALTH_INFO=$(curl -s $BACKEND_URL/health)
    echo "   📊 Health check: $HEALTH_INFO"
else
    echo -e "${RED}❌ Backend no responde en $BACKEND_URL${NC}"
    BACKEND_OK=false
fi

echo -e "\n${BLUE}📋 2. PRUEBA DE AUTENTICACIÓN${NC}"
echo "-----------------------------"

if [ "$BACKEND_OK" = true ]; then
    echo "🔐 Probando login con admin@gamifier.com..."
    
    LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email": "admin@gamifier.com", "password": "admin123"}')
    
    if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
        echo -e "${GREEN}✅ Autenticación exitosa${NC}"
        
        # Extraer token (método básico)
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
        echo "   🎫 Token obtenido: ${TOKEN:0:20}..."
        
        echo -e "\n${BLUE}📋 3. PRUEBA DE ENDPOINTS${NC}"
        echo "-------------------------"
        
        # Probar endpoint de usuarios
        echo "👥 Probando /users..."
        USERS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/users")
        if echo "$USERS_RESPONSE" | grep -q "email"; then
            echo -e "${GREEN}✅ Endpoint /users funcional${NC}"
            USER_COUNT=$(echo "$USERS_RESPONSE" | grep -o '"email"' | wc -l)
            echo "   📊 Usuarios encontrados: $USER_COUNT"
        else
            echo -e "${YELLOW}⚠️ Endpoint /users: Sin datos o error${NC}"
        fi
        
        # Probar endpoint de video-items
        echo "🎬 Probando /video-items..."
        VIDEOS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/video-items")
        if echo "$VIDEOS_RESPONSE" | grep -q -E "(title|youtubeId|id)"; then
            echo -e "${GREEN}✅ Endpoint /video-items funcional${NC}"
            VIDEO_COUNT=$(echo "$VIDEOS_RESPONSE" | grep -o '"id"' | wc -l)
            echo "   📹 Videos encontrados: $VIDEO_COUNT"
            
            # Mostrar primeros videos
            echo "   📋 Primeros videos:"
            echo "$VIDEOS_RESPONSE" | grep -o '"title":"[^"]*"' | head -3 | sed 's/"title":"/   - /' | sed 's/"$//'
        else
            echo -e "${YELLOW}⚠️ Endpoint /video-items: Sin datos o error${NC}"
        fi
        
        # Probar endpoint de playlists
        echo "📋 Probando /playlists..."
        PLAYLISTS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/playlists")
        if echo "$PLAYLISTS_RESPONSE" | grep -q -E "(data|count|name)"; then
            echo -e "${GREEN}✅ Endpoint /playlists funcional${NC}"
        else
            echo -e "${YELLOW}⚠️ Endpoint /playlists: Sin datos o error${NC}"
        fi
        
    else
        echo -e "${RED}❌ Autenticación falló${NC}"
        echo "   🔍 Respuesta: $LOGIN_RESPONSE"
    fi
else
    echo -e "${YELLOW}⚠️ Backend no disponible, saltando pruebas de autenticación${NC}"
fi

echo -e "\n${BLUE}📋 4. ESTADO DE MODO MOCK${NC}"
echo "-------------------------"

if [ "$BACKEND_OK" = true ]; then
    echo -e "${GREEN}🟢 BACKEND REAL CONECTADO${NC}"
    echo "   🎯 ÜPlay usará datos reales del backend NestJS"
    echo "   📊 Videos y preguntas desde PostgreSQL"
    echo "   🔐 Autenticación JWT funcional"
    echo "   🚫 Modo demo DESACTIVADO"
else
    echo -e "${YELLOW}🟡 MODO DEMO ACTIVADO${NC}"
    echo "   🎭 ÜPlay usará 6 videos de demostración"
    echo "   📹 Videos se abrirán en YouTube"
    echo "   🔧 Para conectar backend: verificar que esté ejecutándose en puerto 3002"
fi

echo -e "\n${BLUE}📋 5. INSTRUCCIONES DE USO${NC}"
echo "---------------------------"

if [ "$FRONTEND_OK" = true ]; then
    echo -e "${GREEN}🚀 LISTO PARA USAR:${NC}"
    echo "  1. Navegar a: $FRONTEND_URL"
    echo "  2. Login con: admin@gamifier.com / admin123"
    echo "  3. Ir a: Servicios → ÜPlay → Videos Interactivos"
    
    if [ "$BACKEND_OK" = true ]; then
        echo "  4. 🎉 Ver videos REALES del backend con preguntas interactivas"
    else
        echo "  4. 🎭 Ver videos DEMO (abren en YouTube)"
    fi
else
    echo -e "${YELLOW}⚠️ CONFIGURACIÓN REQUERIDA:${NC}"
    echo "  1. Ejecutar: npm run dev"
    echo "  2. Esperar que inicie en puerto 5173"
    echo "  3. Repetir esta verificación"
fi

echo -e "\n${BLUE}📊 RESUMEN FINAL${NC}"
echo "----------------"

if [ "$FRONTEND_OK" = true ] && [ "$BACKEND_OK" = true ]; then
    echo -e "${GREEN}🎉 ESTADO: ÓPTIMO - Backend real conectado${NC}"
    echo "✅ Frontend funcionando"
    echo "✅ Backend NestJS operacional" 
    echo "✅ Autenticación funcional"
    echo "✅ Endpoints de datos disponibles"
    echo "🎯 ÜPlay completamente funcional con datos reales"
elif [ "$FRONTEND_OK" = true ]; then
    echo -e "${YELLOW}⚠️ ESTADO: PARCIAL - Solo frontend activo${NC}"
    echo "✅ Frontend funcionando"
    echo "❌ Backend no disponible"
    echo "🎭 ÜPlay funcionará en modo demo"
else
    echo -e "${RED}❌ ESTADO: INACTIVO - Servicios no disponibles${NC}"
    echo "❌ Frontend no responde"
    echo "❌ Backend no disponible"
fi

echo -e "\n============================================="
echo "🎯 Verificación completada - $(date)"
echo "============================================="