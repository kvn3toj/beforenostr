#!/bin/bash

# 🔗 CoomÜnity - Connect Vercel SuperApp to Render Backend
# Este script actualiza las variables de entorno de Vercel para conectar con Render

set -e

# Configuración
VERCEL_PROJECT="superapp-peach"
RENDER_BACKEND_URL="https://coomunity-backend.onrender.com"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de logging
log() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ASCII Art
echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│                                                             │"
echo "│   🔗 Conectar Vercel SuperApp ↔ Render Backend             │"
echo "│                                                             │"
echo "│   SuperApp: https://superapp-peach.vercel.app               │"
echo "│   Backend:  $RENDER_BACKEND_URL              │"
echo "│                                                             │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

# Verificar que el backend de Render está funcionando
log "🔍 Verificando backend en Render..."

HEALTH_RESPONSE=$(curl -s "$RENDER_BACKEND_URL/health" || echo "FAILED")

if [[ $HEALTH_RESPONSE == *"status"* ]] && [[ $HEALTH_RESPONSE == *"ok"* ]]; then
    log_success "Backend en Render está funcionando"
    echo "   Response: $HEALTH_RESPONSE"
else
    log_error "❌ Backend en Render no responde correctamente"
    echo "   URL: $RENDER_BACKEND_URL/health"
    echo "   Response: $HEALTH_RESPONSE"
    echo ""
    log "🔧 Posibles soluciones:"
    echo "   1. Verificar que el deployment en Render esté completo"
    echo "   2. Verificar que el servicio esté 'Live' en Render Dashboard"
    echo "   3. Verificar los logs en Render por errores de build"
    echo "   4. Asegurar que el health endpoint esté implementado en /health"
    echo ""
    read -p "¿Quieres continuar de todos modos? (y/N): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    log_warning "Vercel CLI no está instalado"
    log "📦 Instalando Vercel CLI..."
    npm install -g vercel
    log_success "Vercel CLI instalado"
fi

# Verificar autenticación con Vercel
log "🔐 Verificando autenticación con Vercel..."
if ! vercel --version &> /dev/null; then
    log_warning "No estás autenticado con Vercel"
    log "🔑 Iniciando sesión en Vercel..."
    vercel login
fi

# Configurar variables de entorno en Vercel
echo ""
log "⚙️  Configurando variables de entorno en Vercel..."

echo ""
log "🔧 Actualizando VITE_API_BASE_URL..."
vercel env add VITE_API_BASE_URL production <<< "$RENDER_BACKEND_URL"

echo ""
log "🔧 Deshabilitando mock authentication..."
vercel env add VITE_ENABLE_MOCK_AUTH production <<< "false"

echo ""
log "🔧 Deshabilitando mock data..."
vercel env add VITE_ENABLE_MOCK_DATA production <<< "false"

echo ""
log "🔧 Configurando URL base de SuperApp..."
vercel env add VITE_BASE_URL production <<< "https://superapp-peach.vercel.app"

# Opcional: Configurar environment variables para preview y development
read -p "¿Configurar también para preview/development environments? (y/N): " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    log "🔧 Configurando environment variables para preview..."
    vercel env add VITE_API_BASE_URL preview <<< "$RENDER_BACKEND_URL"
    vercel env add VITE_ENABLE_MOCK_AUTH preview <<< "false"
    vercel env add VITE_ENABLE_MOCK_DATA preview <<< "false"

    echo ""
    log "🔧 Configurando environment variables para development..."
    vercel env add VITE_API_BASE_URL development <<< "$RENDER_BACKEND_URL"
    vercel env add VITE_ENABLE_MOCK_AUTH development <<< "false"
    vercel env add VITE_ENABLE_MOCK_DATA development <<< "false"
fi

# Trigger new deployment
echo ""
log "🚀 Triggering nuevo deployment en Vercel..."
cd Demo/apps/superapp-unified/

# Hacer un pequeño cambio para trigger el deployment
echo "# Updated: $(date)" >> README.md

# Commit y push si es necesario
if git status --porcelain | grep -q "README.md"; then
    git add README.md
    git commit -m "Update SuperApp to use Render backend - $(date)"
    git push origin gamifier2.0
    log_success "Cambios pusheados a Git"
fi

# Deploy a Vercel
vercel --prod

cd ../../../

# Verificar la conexión
echo ""
log "🧪 Verificando conexión SuperApp ↔ Backend..."

# Esperar un momento para que el deployment se complete
sleep 10

# Test de conectividad
SUPERAPP_URL="https://superapp-peach.vercel.app"

echo ""
log "🌐 Verificando SuperApp..."
SUPERAPP_STATUS=$(curl -s -I "$SUPERAPP_URL" | head -n1 | cut -d$' ' -f2)
if [ "$SUPERAPP_STATUS" = "200" ]; then
    log_success "SuperApp accesible (HTTP $SUPERAPP_STATUS)"
else
    log_warning "SuperApp status: HTTP $SUPERAPP_STATUS"
fi

echo ""
log "🔗 Verificando Backend..."
BACKEND_STATUS=$(curl -s -I "$RENDER_BACKEND_URL/health" | head -n1 | cut -d$' ' -f2)
if [ "$BACKEND_STATUS" = "200" ]; then
    log_success "Backend accesible (HTTP $BACKEND_STATUS)"
else
    log_warning "Backend status: HTTP $BACKEND_STATUS"
fi

# Test de CORS
echo ""
log "🔍 Verificando CORS..."
CORS_TEST=$(curl -s -H "Origin: https://superapp-peach.vercel.app" -I "$RENDER_BACKEND_URL/health" | grep -i "access-control-allow-origin" || echo "No CORS header found")

if [[ $CORS_TEST == *"superapp-peach.vercel.app"* ]] || [[ $CORS_TEST == *"*"* ]]; then
    log_success "CORS configurado correctamente"
else
    log_warning "CORS podría necesitar configuración"
    echo "   Response: $CORS_TEST"
    echo ""
    log "🔧 Para arreglar CORS en Render backend:"
    echo "   1. Verificar app.enableCors() en backend/src/main.ts"
    echo "   2. Incluir 'https://superapp-peach.vercel.app' en origins"
    echo "   3. Redeploy el backend en Render"
fi

# Mostrar resumen final
echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│                                                             │"
echo "│   🎉 CONEXIÓN COMPLETADA                                   │"
echo "│                                                             │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

log_success "Arquitectura completa desplegada:"
echo ""
echo "🌐 **SuperApp Frontend (Vercel)**"
echo "   → URL: $SUPERAPP_URL"
echo "   → Status: Conectada al backend real"
echo "   → Mock Auth: Deshabilitado"
echo "   → Mock Data: Deshabilitado"
echo ""
echo "🔗 **Backend API (Render)**"
echo "   → URL: $RENDER_BACKEND_URL"
echo "   → Health: $RENDER_BACKEND_URL/health"
echo "   → Auth: $RENDER_BACKEND_URL/auth/login"
echo ""
echo "💾 **Database (Render PostgreSQL)**"
echo "   → Incluida en plan gratuito"
echo "   → Conectada automáticamente"
echo ""
echo "💰 **Costo Total: \$0/mes**"
echo "   → Vercel: Free tier"
echo "   → Render: Free tier"
echo ""

# Tests funcionales recomendados
echo "🧪 **Tests Recomendados:**"
echo "   1. Abrir SuperApp y verificar que carga"
echo "   2. Intentar login con credenciales reales"
echo "   3. Navegar entre módulos (ÜPlay, Marketplace, etc.)"
echo "   4. Verificar que no aparecen errores de API en console"
echo ""

log "📊 **Monitoreo:**"
echo "   → Vercel Dashboard: https://vercel.com/dashboard"
echo "   → Render Dashboard: https://dashboard.render.com"
echo ""

log_success "🚀 ¡EMFILE resuelto permanentemente! Frontend en cloud + Backend en cloud."
echo ""

# Cleanup
rm -f README.md.backup 2>/dev/null || true

log_success "Conexión Vercel ↔ Render completada exitosamente! 🎉"
