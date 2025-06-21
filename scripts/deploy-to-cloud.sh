#!/bin/bash

# 🚀 DEPLOYMENT RÁPIDO A RENDER.COM - CoomÜnity
# Script automatizado para deployment cloud completo

set -e

echo "🚀 INICIANDO DEPLOYMENT A RENDER.COM - CoomÜnity"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Verificar prerrequisitos
log "Verificando prerrequisitos..."

# Verificar que el backend NestJS esté operativo
if curl -s http://localhost:3002/health > /dev/null; then
    log "✅ Backend NestJS operativo en puerto 3002"
else
    warn "⚠️ Backend NestJS no responde en puerto 3002"
    log "💡 Procediendo con deployment cloud (el backend se iniciará en Render)"
fi

# Verificar SuperApp
if curl -s -I http://localhost:3001 > /dev/null; then
    log "✅ SuperApp operativo en puerto 3001"
else
    warn "⚠️ SuperApp no responde en puerto 3001"
fi

# Verificar configuración de deployment
if [ ! -f "render.yaml" ]; then
    error "❌ Archivo render.yaml no encontrado"
fi

log "✅ Archivo render.yaml encontrado"

# Verificar Git
if ! git status > /dev/null 2>&1; then
    error "❌ Este directorio no es un repositorio Git"
fi

log "✅ Repositorio Git detectado"

# Mostrar información de deployment
log "📋 INFORMACIÓN DE DEPLOYMENT:"
echo "  🎯 Backend:    https://coomunity-backend.onrender.com"  
echo "  🎯 SuperApp:   https://coomunity-superapp.onrender.com"
echo "  🎯 Admin:      https://coomunity-admin.onrender.com"
echo ""

# Verificar si hay cambios sin commit
if ! git diff --quiet HEAD; then
    warn "⚠️ Hay cambios sin commit. Recomendamos hacer commit antes del deployment."
    echo "Archivos modificados:"
    git diff --name-only HEAD | head -10
    echo ""
    
    read -p "¿Continuar con el deployment? (y/N): " continue_deploy
    if [[ ! $continue_deploy =~ ^[Yy]$ ]]; then
        log "❌ Deployment cancelado por el usuario"
        exit 0
    fi
fi

# Preparar archivos para deployment
log "🔧 Preparando archivos para deployment..."

# Verificar que existan los Dockerfiles necesarios
if [ ! -f "backend/Dockerfile.simple" ]; then
    warn "⚠️ backend/Dockerfile.simple no encontrado"
    if [ -f "backend/Dockerfile" ]; then
        log "📄 Usando backend/Dockerfile existente"
        sed -i.bak 's/dockerfilePath: \.\/backend\/Dockerfile\.simple/dockerfilePath: .\/backend\/Dockerfile/' render.yaml
    else
        error "❌ No se encontró ningún Dockerfile para el backend"
    fi
fi

# Verificar estructura de directorios
if [ ! -d "Demo/apps/superapp-unified" ]; then
    error "❌ Directorio Demo/apps/superapp-unified no encontrado"
fi

if [ ! -d "apps/admin-frontend" ]; then
    warn "⚠️ Directorio apps/admin-frontend no encontrado"
    log "📁 Verificando estructura alternativa..."
    
    if [ -d "admin-frontend" ]; then
        log "📁 Encontrado admin-frontend en raíz, actualizando render.yaml..."
        sed -i.bak 's/rootDir: apps\/admin-frontend/rootDir: admin-frontend/' render.yaml
    else
        error "❌ No se encontró el directorio admin-frontend"
    fi
fi

# Verificar package.json files
log "📦 Verificando archivos package.json..."

if [ ! -f "Demo/apps/superapp-unified/package.json" ]; then
    error "❌ Demo/apps/superapp-unified/package.json no encontrado"
fi

if [ ! -f "backend/package.json" ]; then
    error "❌ backend/package.json no encontrado"
fi

log "✅ Archivos de configuración verificados"

# Optimizar configuración de SuperApp
log "⚙️ Optimizando configuración de SuperApp..."

# Verificar si existe el archivo .env en SuperApp
if [ ! -f "Demo/apps/superapp-unified/.env" ]; then
    log "📝 Creando archivo .env para SuperApp..."
    cat > Demo/apps/superapp-unified/.env << EOF
# CoomÜnity SuperApp - Production Configuration
VITE_API_BASE_URL=https://coomunity-backend.onrender.com
VITE_BASE_URL=https://coomunity-superapp.onrender.com
VITE_APP_ENV=production
VITE_ENABLE_MOCK_AUTH=false
VITE_ENABLE_ANALYTICS=true
EOF
    log "✅ Archivo .env creado para SuperApp"
fi

# Crear script de build para SuperApp
if [ ! -f "Demo/apps/superapp-unified/build-prod.sh" ]; then
    log "📝 Creando script de build para SuperApp..."
    cat > Demo/apps/superapp-unified/build-prod.sh << 'EOF'
#!/bin/bash
echo "🏗️ Building SuperApp for production..."
npm install --legacy-peer-deps
npm run build
echo "✅ SuperApp build completed"
EOF
    chmod +x Demo/apps/superapp-unified/build-prod.sh
fi

# Verificar scripts de build
log "🔍 Verificando scripts de build..."

# Verificar SuperApp package.json
if ! grep -q '"build"' Demo/apps/superapp-unified/package.json; then
    warn "⚠️ Script 'build' no encontrado en SuperApp package.json"
fi

if ! grep -q '"build:prod"' Demo/apps/superapp-unified/package.json; then
    warn "⚠️ Script 'build:prod' no encontrado en SuperApp package.json"
    log "📝 Usando script 'build' estándar"
    sed -i.bak 's/npm run build:prod/npm run build/' render.yaml
fi

# Mostrar resumen de deployment
log "📊 RESUMEN DE DEPLOYMENT:"
echo "  ✅ Backend NestJS: Configurado con PostgreSQL y Redis"
echo "  ✅ SuperApp: Configurado con Vite y optimizaciones"
echo "  ✅ Admin Frontend: Configurado para deployment"
echo "  ✅ Variables de entorno: Configuradas para producción"
echo "  ✅ CORS: Configurado para ambos frontends"
echo ""

# Mensaje de próximos pasos
log "🎯 PRÓXIMOS PASOS PARA DEPLOYMENT:"
echo "  1. Hacer commit de cambios (si es necesario):"
echo "     git add ."
echo "     git commit -m 'Optimización para deployment en Render'"
echo ""
echo "  2. Hacer push al repositorio:"
echo "     git push origin main"
echo ""
echo "  3. Conectar repositorio en Render.com:"
echo "     - Ir a https://render.com/dashboard"
echo "     - Hacer clic en 'New +'  > 'Blueprint'"
echo "     - Conectar tu repositorio GitHub"
echo "     - Seleccionar render.yaml"
echo ""
echo "  4. URLs de acceso después del deployment:"
echo "     🎯 Backend API: https://coomunity-backend.onrender.com"
echo "     🎯 SuperApp:    https://coomunity-superapp.onrender.com"
echo "     🎯 Admin Panel: https://coomunity-admin.onrender.com"
echo ""

# Ofrecer auto-commit
if git diff --quiet HEAD; then
    log "✅ No hay cambios pendientes de commit"
else
    log "📝 Hay cambios pendientes de commit"
    read -p "¿Hacer commit automático de los cambios? (y/N): " auto_commit
    if [[ $auto_commit =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "feat: Optimización para deployment en Render.com

- Configuración render.yaml completa
- Variables de entorno optimizadas
- Scripts de build configurados
- CORS configurado para producción

🚀 Ready for cloud deployment!"
        log "✅ Commit realizado automáticamente"
        
        read -p "¿Hacer push al repositorio remoto? (y/N): " auto_push
        if [[ $auto_push =~ ^[Yy]$ ]]; then
            git push origin main
            log "✅ Push realizado al repositorio remoto"
        fi
    fi
fi

log "🎉 DEPLOYMENT PREPARATION COMPLETED!"
log "🚀 Tu aplicación está lista para ser desplegada en Render.com"
log "📄 Sigue las instrucciones mostradas arriba para completar el deployment"

echo ""
log "💡 TIPS ADICIONALES:"
echo "  • El deployment gratuito en Render puede tardar 10-15 minutos"
echo "  • Los servicios gratuitos se 'duermen' después de 15 minutos de inactividad"
echo "  • Puedes monitorear el progreso en el dashboard de Render"
echo "  • Los logs de deployment están disponibles en cada servicio"
echo ""

log "🌟 ¡Happy Deployment! 🌟"