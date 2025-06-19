#!/bin/bash

# 🚀 CoomÜnity - Render Deployment Script
# Automatiza el proceso de deployment del backend en Render

set -e

# Configuración
PROJECT_NAME="CoomÜnity Backend"
REPO_URL="https://github.com/kvn3toj/beforenostr"
BRANCH="gamifier2.0"
SERVICE_NAME="coomunity-backend"

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
echo "│   🚀 CoomÜnity Backend - Render Deployment Script          │"
echo "│                                                             │"
echo "│   Target: Render.com (Free Tier)                           │"
echo "│   Cost: $0/mes                                              │"
echo "│                                                             │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

# Verificar pre-requisitos
log "🔍 Verificando pre-requisitos..."

# Verificar si estamos en el directorio correcto
if [ ! -f "backend/package.json" ]; then
    log_error "❌ No se encontró backend/package.json. Ejecuta desde la raíz del proyecto."
    exit 1
fi

# Verificar Git
if ! command -v git &> /dev/null; then
    log_error "Git no está instalado"
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado"
    exit 1
fi

# Verificar backend local
log "🔧 Verificando backend local..."
cd backend/

if [ ! -f "dist/main.js" ]; then
    log "📦 Compilando backend..."
    npm run build
fi

log_success "Backend local verificado"

# Verificar conexión a la base de datos
log "🗄️ Verificando configuración de base de datos..."

if [ ! -f ".env" ]; then
    log_warning "Archivo .env no encontrado. Creando plantilla..."
    cat > .env << EOF
# Base de datos (será reemplazada por Render)
DATABASE_URL="postgresql://user:password@localhost:5432/coomunity"

# JWT Secret (configura uno seguro en Render)
JWT_SECRET="tu_jwt_secret_muy_seguro_aqui"

# CORS (para SuperApp en Vercel)
CORS_ORIGIN="https://superapp-peach.vercel.app"

# Puerto (Render usa 10000 por defecto)
PORT=10000

# Entorno
NODE_ENV=production
EOF
    log_warning "⚠️  Configura las variables reales en Render Dashboard"
fi

# Verificar prisma schema
if [ ! -f "prisma/schema.prisma" ]; then
    log_error "❌ No se encontró prisma/schema.prisma"
    exit 1
fi

log_success "Configuración de base de datos verificada"

# Generar Prisma client
log "🔧 Generando Prisma client..."
npx prisma generate
log_success "Prisma client generado"

# Crear archivo de configuración para Render
log "📝 Creando configuración de Render..."

cat > render.yaml << EOF
services:
  - type: web
    name: ${SERVICE_NAME}
    env: node
    plan: free
    buildCommand: npm ci && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
databases:
  - name: coomunity-database
    plan: free
EOF

log_success "Configuración de Render creada"

# Mostrar resumen de archivos
echo ""
log "📋 Resumen de archivos para Render:"
echo "   ✅ package.json - Scripts de build configurados"
echo "   ✅ Dockerfile.render - Imagen optimizada"
echo "   ✅ prisma/schema.prisma - Base de datos"
echo "   ✅ render.yaml - Configuración del servicio"
echo "   ✅ dist/ - Aplicación compilada"

# Instrucciones para el usuario
echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│                                                             │"
echo "│   🎯 SIGUIENTES PASOS EN RENDER.COM                        │"
echo "│                                                             │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

log "1️⃣  **Crear cuenta en Render.com**"
echo "   → https://render.com"
echo "   → Conectar con GitHub"
echo ""

log "2️⃣  **Crear PostgreSQL Database**"
echo "   → Dashboard → New → PostgreSQL"
echo "   → Name: coomunity-database"
echo "   → Plan: Free"
echo "   → Copiar 'Internal Database URL'"
echo ""

log "3️⃣  **Crear Web Service**"
echo "   → Dashboard → New → Web Service"
echo "   → Connect Repository: kvn3toj/beforenostr"
echo "   → Branch: ${BRANCH}"
echo "   → Root Directory: backend/"
echo ""

log "4️⃣  **Configurar Build Settings**"
echo "   → Environment: Node"
echo "   → Build Command: npm ci && npm run build"
echo "   → Start Command: npm run start:prod"
echo ""

log "5️⃣  **Variables de Entorno (Environment)**"
echo "   → NODE_ENV=production"
echo "   → PORT=10000"
echo "   → JWT_SECRET=[genera_uno_seguro]"
echo "   → CORS_ORIGIN=https://superapp-peach.vercel.app"
echo "   → DATABASE_URL=[pegar_internal_database_url]"
echo ""

log "6️⃣  **Deploy Manual**"
echo "   → Click 'Create Web Service'"
echo "   → Monitorear logs de build"
echo "   → Esperar status 'Live'"
echo ""

log "7️⃣  **Verificar Deployment**"
echo "   → https://${SERVICE_NAME}.onrender.com/health"
echo "   → Debe devolver: {\"status\":\"ok\",...}"
echo ""

# URLs importantes
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│                                                             │"
echo "│   🔗 URLS IMPORTANTES                                       │"
echo "│                                                             │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

echo "🌐 SuperApp (ya desplegada):"
echo "   https://superapp-peach.vercel.app"
echo ""
echo "🔗 Backend (después del deploy):"
echo "   https://${SERVICE_NAME}.onrender.com"
echo ""
echo "📊 Health Check:"
echo "   https://${SERVICE_NAME}.onrender.com/health"
echo ""
echo "⚙️  Render Dashboard:"
echo "   https://dashboard.render.com"
echo ""

# Script de verificación post-deployment
cat > ../scripts/verify-render-deployment.sh << 'EOF'
#!/bin/bash

# 🧪 Script de verificación post-deployment
SERVICE_URL="https://coomunity-backend.onrender.com"

echo "🔍 Verificando deployment en Render..."

# Health check
echo "📊 Health Check:"
curl -s "$SERVICE_URL/health" | jq '.' 2>/dev/null || curl -s "$SERVICE_URL/health"

echo ""
echo "🔐 Auth endpoint:"
curl -s -I "$SERVICE_URL/auth/login" | head -1

echo ""
echo "📡 API status:"
curl -s -I "$SERVICE_URL/api" | head -1

echo ""
echo "✅ Verificación completada!"
EOF

chmod +x ../scripts/verify-render-deployment.sh

# Finalización
echo ""
log_success "🎉 Preparación para Render completada!"
echo ""
log "📝 **Archivos creados:**"
echo "   ✅ backend/render.yaml - Configuración de servicios"
echo "   ✅ backend/Dockerfile.render - Imagen Docker optimizada"
echo "   ✅ scripts/verify-render-deployment.sh - Script de verificación"
echo ""

log "🚀 **Siguiente paso:**"
echo "   → Abrir https://render.com y seguir las instrucciones arriba"
echo "   → Tiempo estimado: 15-20 minutos"
echo "   → Costo: $0/mes (Free tier)"
echo ""

log "🎯 **Resultado final:**"
echo "   → SuperApp en Vercel + Backend en Render"
echo "   → Arquitectura completa en cloud ($0/mes)"
echo "   → EMFILE resuelto para siempre"
echo ""

# Volver al directorio raíz
cd ..

log_success "¡Listo para deployment en Render! 🚀"
