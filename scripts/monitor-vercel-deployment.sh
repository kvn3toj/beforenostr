#!/bin/bash

# 📊 CoomÜnity SuperApp - Vercel Deployment Monitor
# =================================================
# Monitorea el estado del deployment en tiempo real

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log_info() { echo -e "${BLUE}📊 INFO:${NC} $1"; }
log_success() { echo -e "${GREEN}✅ SUCCESS:${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠️  WARNING:${NC} $1"; }
log_error() { echo -e "${RED}❌ ERROR:${NC} $1"; }
log_monitor() { echo -e "${PURPLE}🔍 MONITOR:${NC} $1"; }

FRONTEND_URL="https://superapp-peach.vercel.app"
BACKEND_URL="http://localhost:3002"

echo "📊 MONITOR CONTINUO VERCEL DEPLOYMENT - COOMUNITY"
echo "================================================="
echo "🌐 Frontend: $FRONTEND_URL"
echo "🗄️ Backend: $BACKEND_URL"
echo "⏱️ Intervalo: 30 segundos"
echo "🛑 Presiona Ctrl+C para detener"
echo ""

# Función para verificar status
check_status() {
    local url=$1
    local name=$2

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")

    case $response in
        200)
            log_success "$name: HTTP $response ✅"
            return 0
            ;;
        404)
            log_warning "$name: HTTP $response (En construcción/No encontrado)"
            return 1
            ;;
        500|502|503)
            log_error "$name: HTTP $response (Error del servidor)"
            return 2
            ;;
        000)
            log_error "$name: Sin conexión"
            return 3
            ;;
        *)
            log_warning "$name: HTTP $response (Estado inesperado)"
            return 1
            ;;
    esac
}

# Función para obtener headers de Vercel
get_vercel_info() {
    headers=$(curl -s -I "$FRONTEND_URL" 2>/dev/null || echo "")

    if echo "$headers" | grep -q "x-vercel-id"; then
        vercel_id=$(echo "$headers" | grep "x-vercel-id" | cut -d' ' -f2 | tr -d '\r')
        deployment_region=$(echo "$vercel_id" | cut -d':' -f1)
        log_info "🌐 Vercel ID: $vercel_id"
        log_info "🗺️ Región: $deployment_region"
    fi

    if echo "$headers" | grep -q "date:"; then
        server_date=$(echo "$headers" | grep "date:" | cut -d' ' -f2- | tr -d '\r')
        log_info "🕐 Fecha servidor: $server_date"
    fi
}

# Contador de verificaciones
check_count=0
consecutive_success=0
deployment_ready=false

while true; do
    check_count=$((check_count + 1))
    current_time=$(date "+%H:%M:%S")

    echo ""
    log_monitor "Verificación #$check_count a las $current_time"
    echo "----------------------------------------------"

    # Verificar frontend Vercel
    if check_status "$FRONTEND_URL" "SuperApp Vercel"; then
        consecutive_success=$((consecutive_success + 1))
        if [ $consecutive_success -eq 1 ] && [ "$deployment_ready" = false ]; then
            echo ""
            echo "🎉🎉🎉 ¡DEPLOYMENT EXITOSO! 🎉🎉🎉"
            echo "================================="
            log_success "SuperApp está FUNCIONANDO en Vercel!"
            log_success "URL: $FRONTEND_URL"
            get_vercel_info
            deployment_ready=true
        fi
    else
        consecutive_success=0
        if [ "$deployment_ready" = true ]; then
            log_error "⚠️ SuperApp dejó de funcionar (anteriormente exitoso)"
            deployment_ready=false
        fi
    fi

    # Verificar backend local
    check_status "$BACKEND_URL/health" "Backend Local" > /dev/null

    # Mostrar información adicional cada 5 verificaciones
    if [ $((check_count % 5)) -eq 0 ]; then
        echo ""
        log_info "📈 Estadísticas de monitoreo:"
        log_info "   - Verificaciones totales: $check_count"
        log_info "   - Éxitos consecutivos: $consecutive_success"
        log_info "   - Estado deployment: $([ "$deployment_ready" = true ] && echo "✅ LISTO" || echo "🔄 EN PROGRESO")"
        get_vercel_info
    fi

    # Si está funcionando, reducir frecuencia
    if [ "$deployment_ready" = true ]; then
        sleep 60  # 1 minuto cuando está funcionando
    else
        sleep 30  # 30 segundos mientras está en progreso
    fi
done
