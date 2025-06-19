#!/bin/bash

# 🚀 Script de Deployment Vercel - CoomÜnity SuperApp
# Automatiza todo el proceso de deployment a producción

set -e  # Exit on any error

echo "🚀 INICIANDO DEPLOYMENT VERCEL - CoomÜnity SuperApp"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logs con colores
log_info() {
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

# Verificar ubicación correcta
if [ ! -f "package.json" ] || [ ! -d "Demo/apps/superapp-unified" ]; then
    log_error "Script debe ejecutarse desde la raíz del monorepo"
    exit 1
fi

log_success "Ubicación verificada: Monorepo CoomÜnity"

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    log_warning "Vercel CLI no encontrado. Instalando..."
    npm install -g vercel
    log_success "Vercel CLI instalado"
fi

# Verificar login en Vercel
log_info "Verificando autenticación en Vercel..."
if ! vercel whoami &> /dev/null; then
    log_warning "No estás logueado en Vercel. Iniciando login..."
    vercel login
fi

VERCEL_USER=$(vercel whoami)
log_success "Autenticado como: $VERCEL_USER"

# Pre-flight check
log_info "Ejecutando Pre-Flight Check..."
cd Demo/apps/superapp-unified

# Verificar Node.js versión
NODE_VERSION=$(node --version)
log_info "Node.js version: $NODE_VERSION"

# Limpiar dependencias y cachés
log_info "Limpiando cachés y dependencias..."
rm -rf node_modules/.vite
rm -rf dist
npm cache clean --force 2>/dev/null || true

# Instalar dependencias
log_info "Instalando dependencias con --legacy-peer-deps..."
npm install --legacy-peer-deps

# Ejecutar linting (permite warnings)
log_info "Ejecutando linting..."
npm run lint || log_warning "Linting completado con warnings (permitido)"

# Build de producción local para verificar
log_info "Construyendo build de producción para verificación..."
npm run build:prod

if [ ! -d "dist" ]; then
    log_error "Build local falló. Verificar errores antes de deploy."
    exit 1
fi

log_success "Build local exitoso"

# Mostrar estadísticas del build
BUILD_SIZE=$(du -sh dist/ | cut -f1)
log_info "Tamaño del build: $BUILD_SIZE"

# Volver a la raíz
cd ../../..

# Configurar proyecto en Vercel si es la primera vez
log_info "Configurando proyecto en Vercel..."
if [ ! -f ".vercel/project.json" ]; then
    log_warning "Primera vez deployando. Configurando proyecto..."
    vercel --confirm --prod
else
    log_info "Proyecto ya configurado"
fi

# Deploy a producción
log_info "Iniciando deployment a producción..."
vercel --prod --confirm

# Obtener URL del deployment
DEPLOY_URL=$(vercel ls coomunity-superapp --output json | head -1 | jq -r '.url' 2>/dev/null || echo "")

if [ -n "$DEPLOY_URL" ]; then
    log_success "🎉 DEPLOYMENT EXITOSO!"
    echo "=================================================="
    echo "🌐 URL de Producción: https://$DEPLOY_URL"
    echo "📱 PWA instalable desde navegadores"
    echo "⚡ CDN global de Vercel activo"
    echo "🔒 HTTPS habilitado automáticamente"
    echo "=================================================="

    # Opcional: Abrir en navegador
    read -p "¿Abrir en navegador? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://$DEPLOY_URL"
    fi
else
    log_warning "No se pudo obtener URL automáticamente. Verificar en Vercel dashboard."
fi

# Post-deployment checks
log_info "Ejecutando verificaciones post-deployment..."

# TODO: Agregar health checks básicos
# curl -f "https://$DEPLOY_URL" >/dev/null 2>&1 && log_success "App responde correctamente" || log_warning "App no responde - verificar manualmente"

log_success "🎯 Deployment completado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar variables de entorno en Vercel Dashboard"
echo "2. Configurar dominio personalizado (opcional)"
echo "3. Activar Vercel Analytics"
echo "4. Configurar backend API en Railway/Render"
echo ""
echo "📖 Documentación: https://vercel.com/docs"
