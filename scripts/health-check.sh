#!/bin/bash

# 🏥 CoomÜnity Monorepo - Health Check Script
# Verifica el estado de todos los servicios de la plataforma

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuración
SUPERAPP_URL="${SUPERAPP_URL:-http://localhost:3000}"
BACKEND_URL="${BACKEND_URL:-http://localhost:3002}"
TIMEOUT="${TIMEOUT:-10}"
RETRIES="${RETRIES:-3}"

# Funciones para logging
log() {
    echo -e "${BLUE}[HEALTH-CHECK]${NC} $1"
}

success() {
    echo -e "${GREEN}[✅ SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[⚠️  WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[❌ ERROR]${NC} $1"
}

info() {
    echo -e "${PURPLE}[ℹ️  INFO]${NC} $1"
}

# Función para verificar URL con reintentos
check_url() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}
    
    for i in $(seq 1 $RETRIES); do
        log "Checking $name ($url) - Attempt $i/$RETRIES"
        
        response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" 2>/dev/null || echo "000")
        
        if [ "$response" = "$expected_status" ]; then
            success "$name is healthy (HTTP $response)"
            return 0
        else
            warning "$name returned HTTP $response (expected $expected_status)"
            if [ $i -lt $RETRIES ]; then
                sleep 2
            fi
        fi
    done
    
    error "$name is unhealthy after $RETRIES attempts"
    return 1
}

# Función para verificar puerto TCP
check_port() {
    local host=$1
    local port=$2
    local name=$3
    
    log "Checking $name TCP connectivity ($host:$port)"
    
    if timeout $TIMEOUT bash -c "</dev/tcp/$host/$port" 2>/dev/null; then
        success "$name TCP connection successful"
        return 0
    else
        error "$name TCP connection failed"
        return 1
    fi
}

# Función para verificar API con autenticación
check_api_endpoint() {
    local endpoint=$1
    local name=$2
    local auth_header=${3:-""}
    
    log "Checking $name API endpoint ($endpoint)"
    
    local curl_cmd="curl -s -o /dev/null -w %{http_code} --max-time $TIMEOUT"
    
    if [ -n "$auth_header" ]; then
        curl_cmd="$curl_cmd -H \"$auth_header\""
    fi
    
    response=$(eval "$curl_cmd \"$endpoint\"" 2>/dev/null || echo "000")
    
    if [[ "$response" =~ ^[23][0-9][0-9]$ ]]; then
        success "$name API is responding (HTTP $response)"
        return 0
    else
        error "$name API is not responding properly (HTTP $response)"
        return 1
    fi
}

# Banner
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    🏥 CoomÜnity Health Check                 ║${NC}"
echo -e "${PURPLE}║                     Platform Status Verification            ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Variables de estado
SERVICES_CHECKED=0
SERVICES_HEALTHY=0
SERVICES_UNHEALTHY=0

# Función para reportar estado de servicio
report_service() {
    SERVICES_CHECKED=$((SERVICES_CHECKED + 1))
    if [ $1 -eq 0 ]; then
        SERVICES_HEALTHY=$((SERVICES_HEALTHY + 1))
    else
        SERVICES_UNHEALTHY=$((SERVICES_UNHEALTHY + 1))
    fi
}

# ================================================================
# 1. SuperApp Frontend Health Check
# ================================================================
echo -e "${BLUE}🌐 SuperApp Frontend Health Check${NC}"
echo "----------------------------------------"

check_url "$SUPERAPP_URL/health" "SuperApp Health Endpoint" 200
report_service $?

check_url "$SUPERAPP_URL" "SuperApp Main Page" 200
report_service $?

# Verificar archivos estáticos críticos
check_url "$SUPERAPP_URL/manifest.json" "PWA Manifest" 200
report_service $?

echo ""

# ================================================================
# 2. Backend NestJS Health Check
# ================================================================
echo -e "${BLUE}🔧 Backend NestJS Health Check${NC}"
echo "----------------------------------------"

# Verificar conectividad TCP primero
check_port "localhost" "3002" "Backend TCP"
report_service $?

# Verificar endpoint de salud
check_url "$BACKEND_URL/health" "Backend Health Endpoint" 200
report_service $?

# Verificar API principal
check_url "$BACKEND_URL/api" "Backend API Root" 404  # 404 es esperado para root sin endpoint específico
report_service $?

# Verificar documentación de API (Swagger)
check_url "$BACKEND_URL/api/docs" "API Documentation" 200
report_service $?

echo ""

# ================================================================
# 3. Base de Datos Health Check
# ================================================================
echo -e "${BLUE}🗄️  Database Health Check${NC}"
echo "----------------------------------------"

# PostgreSQL
check_port "localhost" "5432" "PostgreSQL"
report_service $?

# Redis (si está configurado)
check_port "localhost" "6379" "Redis Cache"
report_service $?

echo ""

# ================================================================
# 4. Verificaciones de Integración
# ================================================================
echo -e "${BLUE}🔗 Integration Health Check${NC}"
echo "----------------------------------------"

# Verificar que SuperApp puede conectar con Backend
log "Testing SuperApp-Backend integration..."
superapp_backend_test=$(curl -s -w "%{http_code}" -o /dev/null --max-time $TIMEOUT \
    -H "Origin: $SUPERAPP_URL" \
    "$BACKEND_URL/api/health" 2>/dev/null || echo "000")

if [ "$superapp_backend_test" = "200" ]; then
    success "SuperApp-Backend integration working"
    report_service 0
else
    error "SuperApp-Backend integration failed (HTTP $superapp_backend_test)"
    report_service 1
fi

echo ""

# ================================================================
# 5. Performance Check
# ================================================================
echo -e "${BLUE}⚡ Performance Check${NC}"
echo "----------------------------------------"

# Tiempo de respuesta del SuperApp
log "Measuring SuperApp response time..."
superapp_response_time=$(curl -s -w "%{time_total}" -o /dev/null --max-time $TIMEOUT "$SUPERAPP_URL" 2>/dev/null || echo "99.999")
superapp_response_ms=$(echo "$superapp_response_time * 1000" | bc -l 2>/dev/null || echo "9999")

if (( $(echo "$superapp_response_time < 2.0" | bc -l 2>/dev/null || echo 0) )); then
    success "SuperApp response time: ${superapp_response_ms%.*}ms (Good)"
    report_service 0
elif (( $(echo "$superapp_response_time < 5.0" | bc -l 2>/dev/null || echo 0) )); then
    warning "SuperApp response time: ${superapp_response_ms%.*}ms (Acceptable)"
    report_service 0
else
    error "SuperApp response time: ${superapp_response_ms%.*}ms (Slow)"
    report_service 1
fi

# Tiempo de respuesta del Backend
log "Measuring Backend response time..."
backend_response_time=$(curl -s -w "%{time_total}" -o /dev/null --max-time $TIMEOUT "$BACKEND_URL/health" 2>/dev/null || echo "99.999")
backend_response_ms=$(echo "$backend_response_time * 1000" | bc -l 2>/dev/null || echo "9999")

if (( $(echo "$backend_response_time < 1.0" | bc -l 2>/dev/null || echo 0) )); then
    success "Backend response time: ${backend_response_ms%.*}ms (Excellent)"
    report_service 0
elif (( $(echo "$backend_response_time < 2.0" | bc -l 2>/dev/null || echo 0) )); then
    success "Backend response time: ${backend_response_ms%.*}ms (Good)"
    report_service 0
else
    warning "Backend response time: ${backend_response_ms%.*}ms (Needs attention)"
    report_service 1
fi

echo ""

# ================================================================
# 6. Resumen Final
# ================================================================
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}                          📊 HEALTH CHECK SUMMARY               ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"

echo ""
info "Services Checked: $SERVICES_CHECKED"
success "Healthy Services: $SERVICES_HEALTHY"
if [ $SERVICES_UNHEALTHY -gt 0 ]; then
    error "Unhealthy Services: $SERVICES_UNHEALTHY"
else
    success "Unhealthy Services: $SERVICES_UNHEALTHY"
fi

# Calcular porcentaje de salud
health_percentage=$(( (SERVICES_HEALTHY * 100) / SERVICES_CHECKED ))

echo ""
if [ $health_percentage -eq 100 ]; then
    success "🎉 Overall Health Status: EXCELLENT ($health_percentage%)"
    echo -e "${GREEN}All services are operating normally.${NC}"
    exit_code=0
elif [ $health_percentage -ge 80 ]; then
    success "✅ Overall Health Status: GOOD ($health_percentage%)"
    echo -e "${YELLOW}Most services are healthy, some issues detected.${NC}"
    exit_code=0
elif [ $health_percentage -ge 60 ]; then
    warning "⚠️  Overall Health Status: DEGRADED ($health_percentage%)"
    echo -e "${YELLOW}Several services need attention.${NC}"
    exit_code=1
else
    error "❌ Overall Health Status: CRITICAL ($health_percentage%)"
    echo -e "${RED}System requires immediate attention.${NC}"
    exit_code=2
fi

echo ""
info "Health check completed at $(date)"
echo ""

exit $exit_code 