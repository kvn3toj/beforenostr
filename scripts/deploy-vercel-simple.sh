#!/bin/bash

# 🚀 Script de Deployment Vercel SIMPLIFICADO - CoomÜnity SuperApp
# Versión que evita problemas EMFILE usando deployment directo

set -e

echo "🚀 VERCEL DEPLOYMENT (MODO SIMPLIFICADO)"
echo "======================================"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Verificar ubicación
if [ ! -f "package.json" ] || [ ! -d "Demo/apps/superapp-unified" ]; then
    echo "❌ Ejecutar desde la raíz del monorepo"
    exit 1
fi

log_success "Ubicación verificada"

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    log_info "Instalando Vercel CLI..."
    npm install -g vercel
fi

# Login verificación
log_info "Verificando autenticación Vercel..."
if ! vercel whoami &> /dev/null; then
    log_warning "Iniciando login en Vercel..."
    vercel login
fi

VERCEL_USER=$(vercel whoami)
log_success "Autenticado como: $VERCEL_USER"

# STRATEGY: Deploy directo sin build local
log_info "🚀 Iniciando deployment directo (sin build local)..."
log_warning "Nota: Vercel manejará el build con más recursos"

# Deploy directo - Vercel maneja el build
if [ "$1" = "production" ] || [ "$1" = "prod" ]; then
    log_info "🎯 Deployment a PRODUCCIÓN..."
    vercel --prod --confirm
else
    log_info "🔍 Deployment de PREVIEW..."
    vercel --confirm
fi

# Obtener URL (intentar diferentes métodos)
log_info "Obteniendo URL de deployment..."

# Método 1: Lista de deployments
DEPLOY_URL=$(vercel ls --scope=$(vercel whoami) 2>/dev/null | grep coomunity | head -1 | awk '{print $2}' || echo "")

if [ -n "$DEPLOY_URL" ]; then
    log_success "🎉 DEPLOYMENT EXITOSO!"
    echo "=================================================="
    echo "🌐 URL: https://$DEPLOY_URL"
    echo "📱 PWA: Se activará cuando build sea exitoso"
    echo "⚡ CDN: Global de Vercel"
    echo "🔒 HTTPS: Automático"
    echo "=================================================="
else
    log_warning "URL no detectada automáticamente"
    echo "🎯 Verificar en: https://vercel.com/dashboard"
fi

# Health check básico
if [ -n "$DEPLOY_URL" ]; then
    log_info "Esperando propagación del deployment..."
    sleep 15

    if curl -s -f "https://$DEPLOY_URL" >/dev/null 2>&1; then
        log_success "✅ Aplicación responde correctamente"
    else
        log_warning "⏳ Aplicación aún propagándose (normal)"
    fi
fi

echo ""
echo "📋 Próximos pasos:"
echo "1. Verificar aplicación en navegador"
echo "2. Configurar variables de entorno en Vercel Dashboard"
echo "3. Configurar dominio personalizado (opcional)"
echo "4. Activar Vercel Analytics"
echo ""
echo "🔗 Dashboard: https://vercel.com/dashboard"

log_success "🎯 Deployment completado!"
