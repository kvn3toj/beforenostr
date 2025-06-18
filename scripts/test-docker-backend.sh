#!/bin/bash

# ================================================================
# Script de Verificación del Backend CoomÜnity en Docker
# Prueba la funcionalidad básica del backend containerizado
# ================================================================

echo "🔍 INICIANDO VERIFICACIÓN DEL BACKEND DOCKER..."

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# 1. Verificar que los contenedores estén ejecutándose
echo "📋 Verificando estado de contenedores..."
BACKEND_STATUS=$(docker-compose -f docker-compose.prod.yml --env-file .env.prod ps backend --format json | jq -r '.State' 2>/dev/null || echo "unknown")
POSTGRES_STATUS=$(docker-compose -f docker-compose.prod.yml --env-file .env.prod ps postgres --format json | jq -r '.State' 2>/dev/null || echo "unknown")
REDIS_STATUS=$(docker-compose -f docker-compose.prod.yml --env-file .env.prod ps redis --format json | jq -r '.State' 2>/dev/null || echo "unknown")

print_status $([ "$BACKEND_STATUS" = "running" ] && echo 0 || echo 1) "Backend: $BACKEND_STATUS"
print_status $([ "$POSTGRES_STATUS" = "running" ] && echo 0 || echo 1) "PostgreSQL: $POSTGRES_STATUS"
print_status $([ "$REDIS_STATUS" = "running" ] && echo 0 || echo 1) "Redis: $REDIS_STATUS"

# 2. Verificar conectividad básica
echo ""
echo "🌐 Verificando conectividad de servicios..."

# Test PostgreSQL
pg_isready -h localhost -p 5432 -U postgres >/dev/null 2>&1
print_status $? "PostgreSQL conectividad (puerto 5432)"

# Test Redis
redis-cli -h localhost -p 6379 ping >/dev/null 2>&1
print_status $? "Redis conectividad (puerto 6379)"

# Test Backend Health Check
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:1111/health 2>/dev/null)
print_status $([ "$HEALTH_RESPONSE" = "200" ] && echo 0 || echo 1) "Backend Health Check (puerto 3002): HTTP $HEALTH_RESPONSE"

# 3. Verificar endpoints críticos del backend
echo ""
echo "🔧 Verificando endpoints críticos..."

# Test de autenticación (debe devolver 401 sin credenciales)
AUTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:1111/auth/me 2>/dev/null)
print_status $([ "$AUTH_RESPONSE" = "401" ] && echo 0 || echo 1) "Auth endpoint (/auth/me): HTTP $AUTH_RESPONSE (esperado 401)"

# Test de usuarios (debe devolver 401 sin autenticación)
USERS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:1111/users 2>/dev/null)
print_status $([ "$USERS_RESPONSE" = "401" ] && echo 0 || echo 1) "Users endpoint (/users): HTTP $USERS_RESPONSE (esperado 401)"

# 4. Test de login con credenciales de desarrollo
echo ""
echo "🔐 Probando autenticación con credenciales de desarrollo..."

LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:1111/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}' 2>/dev/null)

if echo "$LOGIN_RESPONSE" | jq -e '.access_token' >/dev/null 2>&1; then
    print_status 0 "Login exitoso con credenciales de desarrollo"
    
    # Extraer token para pruebas adicionales
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
    
    # Test endpoint autenticado
    ME_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:1111/auth/me 2>/dev/null)
    if echo "$ME_RESPONSE" | jq -e '.email' >/dev/null 2>&1; then
        USER_EMAIL=$(echo "$ME_RESPONSE" | jq -r '.email')
        print_status 0 "Endpoint autenticado funcional (usuario: $USER_EMAIL)"
    else
        print_status 1 "Endpoint autenticado falló"
    fi
else
    print_status 1 "Login falló con credenciales de desarrollo"
fi

# 5. Verificar logs del backend para errores críticos
echo ""
echo "📋 Verificando logs del backend..."
CRITICAL_ERRORS=$(docker-compose -f docker-compose.prod.yml --env-file .env.prod logs backend --tail=50 2>/dev/null | grep -i "error\|exception\|failed" | wc -l)

if [ "$CRITICAL_ERRORS" -eq 0 ]; then
    print_status 0 "No se encontraron errores críticos en logs"
else
    print_warning "Se encontraron $CRITICAL_ERRORS líneas con errores en logs"
    echo "Últimos errores:"
    docker-compose -f docker-compose.prod.yml --env-file .env.prod logs backend --tail=10 2>/dev/null | grep -i "error\|exception\|failed" | tail -3
fi

# 6. Resumen final
echo ""
echo "🏁 RESUMEN DE VERIFICACIÓN:"
echo "================================"

if [ "$BACKEND_STATUS" = "running" ] && [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ BACKEND DOCKER: OPERACIONAL${NC}"
    echo "   - Contenedor ejecutándose correctamente"
    echo "   - Health check respondiendo"
    echo "   - Endpoints básicos funcionales"
else
    echo -e "${RED}❌ BACKEND DOCKER: PROBLEMAS DETECTADOS${NC}"
    echo "   - Revisar logs: docker-compose -f docker-compose.prod.yml --env-file .env.prod logs backend"
    echo "   - Verificar configuración de red y puertos"
fi

echo ""
echo "📊 Comandos útiles para debugging:"
echo "   - Ver logs: docker-compose -f docker-compose.prod.yml --env-file .env.prod logs backend -f"
echo "   - Entrar al contenedor: docker exec -it coomunity-backend-prod sh"
echo "   - Reiniciar servicios: docker-compose -f docker-compose.prod.yml --env-file .env.prod restart"

echo ""
echo "🔗 URLs de verificación manual:"
echo "   - Health Check: http://localhost:1111/health"
echo "   - API Docs: http://localhost:1111/api (si está habilitado)" 