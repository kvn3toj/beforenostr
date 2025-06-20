#!/bin/bash

# 🚀 CoomÜnity SuperApp - Vercel Deployment Script
# =================================================
# Autor: CoomÜnity Team
# Fecha: Junio 2025
# Propósito: Deployment inteligente con verificaciones automáticas

set -e

echo "🚀 INICIANDO DEPLOYMENT VERCEL - COOMUNITY SUPERAPP"
echo "=================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función de logging
log_info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ SUCCESS:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING:${NC} $1"
}

log_error() {
    echo -e "${RED}❌ ERROR:${NC} $1"
}

# Verificar ubicación correcta
if [[ ! -f "Demo/apps/superapp-unified/package.json" ]]; then
    log_error "Debe ejecutarse desde la raíz del monorepo"
    log_info "Ubicación actual: $(pwd)"
    log_info "Ubicación esperada: .../GAMIFIER-copy/"
    exit 1
fi

log_success "✅ Ubicación correcta verificada"

# Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "gamifier2.0" ]]; then
    log_warning "Rama actual: $CURRENT_BRANCH"
    log_info "Cambiando a rama gamifier2.0..."
    git checkout gamifier2.0
fi

log_success "✅ Rama gamifier2.0 verificada"

# Verificar backend local
log_info "🔍 Verificando backend local..."
if curl -f -s http://localhost:3002/health > /dev/null; then
    log_success "✅ Backend local funcionando (puerto 3002)"
    BACKEND_STATUS="LOCAL"
else
    log_warning "⚠️ Backend local no disponible"
    BACKEND_STATUS="NONE"
fi

# Verificar Railway backend
log_info "🔍 Verificando backend Railway..."
if curl -f -s https://backend-production-80bb.up.railway.app/health > /dev/null; then
    log_success "✅ Backend Railway funcionando"
    BACKEND_STATUS="RAILWAY"
else
    log_warning "⚠️ Backend Railway no disponible"
fi

# Configurar backend según disponibilidad
if [[ "$BACKEND_STATUS" == "RAILWAY" ]]; then
    log_info "🌐 Configurando para Railway backend..."
    sed -i '' 's|http://localhost:3002|https://backend-production-80bb.up.railway.app|g' Demo/apps/superapp-unified/vercel.json
    BACKEND_URL="https://backend-production-80bb.up.railway.app"
elif [[ "$BACKEND_STATUS" == "LOCAL" ]]; then
    log_warning "🏠 Usando backend local (limitaciones en producción)"
    BACKEND_URL="http://localhost:3002"
else
    log_error "❌ Ningún backend disponible"
    log_info "💡 Opciones:"
    log_info "  1. Iniciar backend local: npm run dev:backend"
    log_info "  2. Verificar deployment Railway"
    log_info "  3. Continuar con deployment (app funcionará sin backend)"

    echo ""
    read -p "¿Continuar con deployment sin backend? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelado por el usuario"
        exit 1
    fi
    BACKEND_URL="ninguno"
fi

# Pre-flight checks
log_info "🔍 Ejecutando pre-flight checks..."

# Verificar dependencias críticas
cd Demo/apps/superapp-unified
if [[ ! -f "node_modules/@mui/material/package.json" ]]; then
    log_warning "⚠️ Dependencias no instaladas, instalando..."
    npm install --legacy-peer-deps
fi

# Test build local
log_info "🔨 Probando build local..."
if npm run build:prod > /dev/null 2>&1; then
    log_success "✅ Build local exitoso"
else
    log_error "❌ Build local falló"
    log_info "💡 Ejecutar: npm run build:prod para ver errores"
    exit 1
fi

# Limpiar build anterior
rm -rf dist/
log_info "🧹 Build anterior limpiado"

# Regresar a raíz
cd ../../..

# Commit cambios si hay alguno
if [[ -n $(git status --porcelain) ]]; then
    log_info "📝 Commitando cambios de configuración..."
    git add Demo/apps/superapp-unified/vercel.json
    git commit -m "deploy: configure vercel for backend $BACKEND_STATUS mode" || true
fi

# Push cambios
log_info "🚀 Subiendo cambios a GitHub..."
git push origin gamifier2.0

# Información final
echo ""
echo "🎯 DEPLOYMENT INFORMATION"
echo "========================"
echo "📱 Frontend URL: https://superapp-peach.vercel.app"
echo "🗄️ Backend URL: $BACKEND_URL"
echo "🌐 Backend Status: $BACKEND_STATUS"
echo "📋 Build Command: npm run vercel-build"
echo "📂 Output Directory: dist"
echo "🔧 Install Command: npm install --legacy-peer-deps"
echo ""

if [[ "$BACKEND_STATUS" == "LOCAL" ]]; then
    echo "⚠️  IMPORTANTE: Backend local no será accesible desde Vercel"
    echo "   Para funcionalidad completa, configurar Railway backend"
fi

echo ""
echo "🔍 PRÓXIMOS PASOS:"
echo "1. Verificar deployment en dashboard Vercel"
echo "2. Probar funcionalidad en https://superapp-peach.vercel.app"
echo "3. Verificar logs de deployment si hay errores"
echo "4. Configurar variables de entorno en Vercel dashboard"
echo ""

log_success "🎉 ¡Deployment script completado!"
echo ""
echo "📊 Para monitorear el deployment:"
echo "   - Dashboard Vercel: https://vercel.com/dashboard"
echo "   - Logs en tiempo real disponibles en dashboard"
echo ""
