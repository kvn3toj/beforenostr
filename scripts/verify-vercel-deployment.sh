#!/bin/bash

# 🔍 CoomÜnity SuperApp - Vercel Deployment Verification
# ======================================================
# Verifica el estado del deployment y funcionalidad

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  INFO:${NC} $1"; }
log_success() { echo -e "${GREEN}✅ SUCCESS:${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠️  WARNING:${NC} $1"; }
log_error() { echo -e "${RED}❌ ERROR:${NC} $1"; }

echo "🔍 VERIFICACIÓN DEPLOYMENT VERCEL - COOMUNITY SUPERAPP"
echo "====================================================="
echo ""

FRONTEND_URL="https://superapp-peach.vercel.app"
BACKEND_URL="http://localhost:3002"

# Verificar deployment Vercel
log_info "🌐 Verificando deployment en Vercel..."
VERCEL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/" || echo "000")

case $VERCEL_STATUS in
    200)
        log_success "✅ SuperApp desplegada exitosamente (HTTP 200)"
        ;;
    404)
        log_warning "⚠️ Deployment en progreso o redireccionamiento (HTTP 404)"
        log_info "💡 Esto es normal durante el primer deployment"
        ;;
    000)
        log_error "❌ No se puede conectar a Vercel"
        ;;
    *)
        log_warning "⚠️ Status HTTP: $VERCEL_STATUS"
        ;;
esac

# Intentar diferentes rutas
log_info "🔍 Probando rutas específicas..."

ROUTES=("home" "login" "register" "marketplace" "uplay")
for route in "${ROUTES[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/$route" || echo "000")
    if [[ "$status" == "200" ]]; then
        log_success "✅ /$route responde correctamente"
    else
        log_warning "⚠️ /$route status: $status"
    fi
done

# Verificar backend local
log_info "🗄️ Verificando backend local..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" || echo "000")

if [[ "$BACKEND_STATUS" == "200" ]]; then
    log_success "✅ Backend local funcionando"

    # Verificar endpoints críticos
    log_info "🔍 Verificando endpoints críticos..."

    ENDPOINTS=("health" "auth/me" "video-items" "marketplace/items")
    for endpoint in "${ENDPOINTS[@]}"; do
        status=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/$endpoint" || echo "000")
        case $status in
            200|401) # 401 es esperado para endpoints protegidos
                log_success "✅ /$endpoint disponible"
                ;;
            *)
                log_warning "⚠️ /$endpoint status: $status"
                ;;
        esac
    done
else
    log_error "❌ Backend local no disponible"
    log_info "💡 Iniciar con: npm run dev:backend"
fi

# Verificar configuración Vercel
log_info "📋 Verificando archivos de configuración..."

if [[ -f "Demo/apps/superapp-unified/vercel.json" ]]; then
    log_success "✅ vercel.json presente"
else
    log_error "❌ vercel.json faltante"
fi

if [[ -f "Demo/apps/superapp-unified/.env.production" ]]; then
    log_success "✅ .env.production presente"
else
    log_warning "⚠️ .env.production faltante"
fi

# Información de troubleshooting
echo ""
echo "🛠️ TROUBLESHOOTING GUIDE"
echo "========================"
echo ""

if [[ "$VERCEL_STATUS" != "200" ]]; then
    echo "🔧 Si el deployment falla:"
    echo "   1. Verificar logs en Vercel Dashboard"
    echo "   2. Verificar variables de entorno en Vercel"
    echo "   3. Ejecutar build local: cd Demo/apps/superapp-unified && npm run build:prod"
    echo "   4. Verificar que todas las dependencias estén instaladas"
    echo ""
fi

if [[ "$BACKEND_STATUS" != "200" ]]; then
    echo "🔧 Para iniciar backend:"
    echo "   1. Desde la raíz: npm run dev:backend"
    echo "   2. O desde backend/: npm run dev"
    echo "   3. Verificar PostgreSQL y Redis ejecutándose"
    echo ""
fi

echo "📱 URLs IMPORTANTES:"
echo "   🌐 SuperApp: $FRONTEND_URL"
echo "   🗄️ Backend: $BACKEND_URL"
echo "   📊 Health Check: $BACKEND_URL/health"
echo "   📖 API Docs: $BACKEND_URL/api"
echo ""

echo "🔍 COMANDOS ÚTILES:"
echo "   📱 Abrir SuperApp: open $FRONTEND_URL"
echo "   📊 Ver logs Vercel: vercel logs (requiere Vercel CLI)"
echo "   🔄 Redeploy: git push origin gamifier2.0"
echo "   🛠️ Debug local: cd Demo/apps/superapp-unified && npm run dev"
echo ""

# Status final
if [[ "$VERCEL_STATUS" == "200" ]] && [[ "$BACKEND_STATUS" == "200" ]]; then
    log_success "🎉 ¡Sistema completamente operacional!"
elif [[ "$VERCEL_STATUS" == "200" ]]; then
    log_warning "⚠️ SuperApp desplegada, pero backend no disponible"
    log_info "💡 Funcionalidad limitada sin backend"
elif [[ "$BACKEND_STATUS" == "200" ]]; then
    log_warning "⚠️ Backend funcionando, esperando deployment Vercel"
else
    log_error "❌ Ambos servicios requieren atención"
fi

echo ""
log_info "🏁 Verificación completada"
