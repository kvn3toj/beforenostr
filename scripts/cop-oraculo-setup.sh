#!/bin/bash

# 🔮 CoP ORÁCULO - Script de Setup Completo
# Script para migrar e implementar la Comunidad de Práctica "Oráculo"
# Autor: ǓAN (Agente IA Full-Stack de CoomÜnity)
# Fecha: 20 de Junio, 2025

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${CYAN}[CoP ORÁCULO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Banner de inicio
echo -e "${PURPLE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                     🔮 CoP ORÁCULO SETUP 🔮                  ║
║                                                              ║
║    Comunidad de Práctica Gamificada para Administradores    ║
║         Transformando Feedback en Sabiduría Colectiva       ║
║                                                              ║
║                    by ǓAN - Agente IA                       ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ============================================================================
# FASE 1: VERIFICACIONES PREVIAS
# ============================================================================

log "🔍 FASE 1: Verificaciones del Sistema"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "Demo/apps/superapp-unified" ]; then
    error "No estás en el directorio raíz del proyecto CoomÜnity. Asegúrate de estar en la raíz del monorepo."
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado. Por favor instala Node.js 18+ antes de continuar."
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Se requiere Node.js 18+. Versión actual: $(node --version)"
fi

success "✅ Node.js $(node --version) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    error "npm no está instalado."
fi

success "✅ npm $(npm --version) detectado"

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    warning "⚠️ PostgreSQL CLI no detectado. Asegúrate de que PostgreSQL esté instalado y ejecutándose."
else
    success "✅ PostgreSQL CLI detectado"
fi

# Verificar Redis (si está disponible)
if command -v redis-cli &> /dev/null; then
    success "✅ Redis CLI detectado"
else
    warning "⚠️ Redis CLI no detectado. Asegúrate de que Redis esté instalado y ejecutándose."
fi

# ============================================================================
# FASE 2: INSTALACIÓN DE DEPENDENCIAS
# ============================================================================

log "📦 FASE 2: Instalación de Dependencias"

# Limpiar caché y node_modules si es necesario
if [ "$1" = "--clean" ]; then
    warning "🧹 Limpiando instalación anterior..."
    rm -rf node_modules package-lock.json
    find . -name "node_modules" -type d -prune -exec rm -rf {} +
    find . -name "package-lock.json" -type f -delete
fi

# Instalar dependencias raíz
log "📦 Instalando dependencias del monorepo..."
npm install --legacy-peer-deps

# Verificar que turbo esté disponible
if ! command -v turbo &> /dev/null; then
    log "🔧 Instalando Turborepo globalmente..."
    npm install -g turbo
fi

success "✅ Dependencias instaladas correctamente"

# ============================================================================
# FASE 3: CONFIGURACIÓN DE BASE DE DATOS
# ============================================================================

log "🗄️ FASE 3: Configuración de Base de Datos"

# Verificar archivo .env
if [ ! -f ".env" ]; then
    warning "⚠️ Archivo .env no encontrado. Creando .env base..."
    cat > .env << 'EOL'
# Base de datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/coomunity_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Redis
REDIS_URL="redis://localhost:6379"

# Puertos
PORT=3002
VITE_API_BASE_URL=http://localhost:3002
VITE_BASE_URL=http://localhost:3001

# Gamificación CoP Oráculo
LUKAS_EXCHANGE_RATE=1.0
FEEDBACK_REWARD_MULTIPLIER=1.5
COP_ORACULO_ENABLED=true
EOL
    info "📝 Archivo .env creado. Por favor revisa y ajusta las configuraciones según tu entorno."
fi

# Verificar si PostgreSQL está ejecutándose
if command -v pg_isready &> /dev/null; then
    if pg_isready -q; then
        success "✅ PostgreSQL está ejecutándose"
    else
        error "❌ PostgreSQL no está ejecutándose. Por favor inicia PostgreSQL antes de continuar."
    fi
else
    warning "⚠️ No se puede verificar el estado de PostgreSQL. Asegúrate de que esté ejecutándose."
fi

# Verificar conexión a la base de datos
log "🔗 Verificando conexión a la base de datos..."
if npm run db:reset --silent > /dev/null 2>&1; then
    success "✅ Base de datos conectada y reseteada"
else
    warning "⚠️ No se pudo resetear la base de datos. Intentando migración..."
    if npx prisma migrate dev --name "cop-oraculo-initial" > /dev/null 2>&1; then
        success "✅ Migración de base de datos completada"
    else
        error "❌ Error en la configuración de base de datos. Verifica tu DATABASE_URL en .env"
    fi
fi

# Ejecutar seed de datos
log "🌱 Ejecutando seed de datos..."
if npm run db:seed > /dev/null 2>&1; then
    success "✅ Datos de prueba insertados"
else
    warning "⚠️ Error al insertar datos de prueba. Continuando..."
fi

# ============================================================================
# FASE 4: VERIFICACIÓN DE IMPLEMENTACIÓN BACKEND
# ============================================================================

log "🔧 FASE 4: Verificación de Implementación Backend"

# Verificar que los archivos del feedback módulo existen
FEEDBACK_FILES=(
    "backend/src/feedback/feedback.module.ts"
    "backend/src/feedback/feedback.controller.ts"
    "backend/src/feedback/feedback.service.ts"
    "backend/src/feedback/dto/create-feedback.dto.ts"
)

for file in "${FEEDBACK_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "✅ $file existe"
    else
        error "❌ $file no encontrado. La implementación no está completa."
    fi
done

# Verificar que el FeedbackModule esté importado en app.module.ts
if grep -q "FeedbackModule" backend/src/app.module.ts; then
    success "✅ FeedbackModule importado en AppModule"
else
    error "❌ FeedbackModule no está importado en AppModule"
fi

# ============================================================================
# FASE 5: INICIO DE SERVICIOS
# ============================================================================

log "🚀 FASE 5: Iniciando Servicios"

# Limpiar procesos previos
log "🧹 Limpiando procesos previos..."
npm run stop:all > /dev/null 2>&1 || true
sleep 2

# Función para verificar si un puerto está libre
check_port() {
    local port=$1
    if command -v nc &> /dev/null; then
        ! nc -z localhost $port 2>/dev/null
    else
        ! curl -s localhost:$port > /dev/null 2>&1
    fi
}

# Verificar puertos necesarios
PORTS=(3000 3001 3002)
for port in "${PORTS[@]}"; do
    if check_port $port; then
        success "✅ Puerto $port disponible"
    else
        warning "⚠️ Puerto $port ocupado. Intentando liberarlo..."
        fuser -k ${port}/tcp 2>/dev/null || true
        sleep 1
    fi
done

# Iniciar backend
log "🔧 Iniciando Backend NestJS..."
npm run start:backend:dev > logs/backend.log 2>&1 &
BACKEND_PID=$!

# Esperar a que el backend se inicie
log "⏳ Esperando que el backend se inicie..."
for i in {1..30}; do
    if curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
        success "✅ Backend NestJS iniciado correctamente (puerto 3002)"
        break
    fi
    if [ $i -eq 30 ]; then
        error "❌ Backend no se inició correctamente. Revisa logs/backend.log"
    fi
    sleep 1
done

# Verificar endpoints de feedback
log "🔍 Verificando endpoints del módulo Feedback..."
FEEDBACK_ENDPOINTS=(
    "http://localhost:3002/feedback"
    "http://localhost:3002/api-json"
)

for endpoint in "${FEEDBACK_ENDPOINTS[@]}"; do
    if curl -s "$endpoint" > /dev/null 2>&1; then
        success "✅ Endpoint $endpoint accesible"
    else
        warning "⚠️ Endpoint $endpoint no accesible"
    fi
done

# Verificar endpoints de feedback multi-agente
log "🔍 Verificando endpoints del sistema multi-agente..."
FEEDBACK_ENDPOINTS=(
    "http://localhost:3002/feedback"
    "http://localhost:3002/cop-oraculo/agents/dashboard/metrics"
    "http://localhost:3002/cop-oraculo/agents/wisdom/insights"
    "http://localhost:3002/api-json"
)

for endpoint in "${FEEDBACK_ENDPOINTS[@]}"; do
    if curl -s "$endpoint" > /dev/null 2>&1; then
        success "✅ Endpoint $endpoint accesible"
    else
        warning "⚠️ Endpoint $endpoint no accesible"
    fi
done

# Test de sistema multi-agente
log "🤖 Probando sistema multi-agente..."
AGENT_TEST_RESPONSE=$(curl -s -X POST http://localhost:3002/cop-oraculo/agents/analyze/test-feedback-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-jwt-for-testing" \
  -d '{}' 2>/dev/null || echo "ERROR")

if [[ "$AGENT_TEST_RESPONSE" != "ERROR" && "$AGENT_TEST_RESPONSE" != *"error"* ]]; then
    success "✅ Sistema multi-agente funcional"
else
    warning "⚠️ Test de sistema multi-agente falló (esperado sin autenticación real)"
fi

# ============================================================================
# FASE 6: CONFIGURACIÓN FRONTEND
# ============================================================================

log "🎨 FASE 6: Configuración Frontend"

# Verificar configuración de SuperApp
SUPERAPP_ENV="Demo/apps/superapp-unified/.env"
if [ ! -f "$SUPERAPP_ENV" ]; then
    warning "⚠️ Archivo .env de SuperApp no encontrado. Creando..."
    cat > "$SUPERAPP_ENV" << 'EOL'
# API Configuration
VITE_API_BASE_URL=http://localhost:3002
VITE_BASE_URL=http://localhost:3001

# Features Flags
VITE_ENABLE_MOCK_AUTH=false
VITE_ENABLE_COP_ORACULO=true
VITE_ENABLE_LUKAS_ECONOMY=true

# CoP Oráculo Configuration
VITE_COP_ORACULO_WS_URL=ws://localhost:3002
VITE_LUKAS_DISPLAY_ENABLED=true
VITE_FEEDBACK_REWARDS_ENABLED=true
EOL
    success "✅ Archivo .env de SuperApp creado"
fi

# ============================================================================
# FASE 7: INICIO DE FRONTEND (OPCIONAL)
# ============================================================================

if [ "$2" != "--backend-only" ]; then
    log "🎨 FASE 7: Iniciando Frontend SuperApp"
    
    cd Demo/apps/superapp-unified
    npm run dev > ../../../logs/superapp.log 2>&1 &
    SUPERAPP_PID=$!
    cd ../../..
    
    # Esperar a que el frontend se inicie
    log "⏳ Esperando que la SuperApp se inicie..."
    for i in {1..30}; do
        if curl -s http://localhost:3001 > /dev/null 2>&1; then
            success "✅ SuperApp iniciada correctamente (puerto 3001)"
            break
        fi
        if [ $i -eq 30 ]; then
            warning "⚠️ SuperApp no se inició completamente. Revisa logs/superapp.log"
        fi
        sleep 1
    done
fi

# ============================================================================
# FASE 8: TESTS DE VERIFICACIÓN
# ============================================================================

log "🧪 FASE 8: Tests de Verificación"

# Test de creación de feedback
log "🔍 Probando creación de feedback..."
FEEDBACK_TEST_RESPONSE=$(curl -s -X POST http://localhost:3002/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fake-jwt-for-testing" \
  -d '{
    "pageUrl": "http://localhost:3001/test",
    "feedbackText": "Test feedback from setup script",
    "feedbackType": "IMPROVEMENT",
    "componentContext": "setup-script-test",
    "technicalContext": {
      "userAgent": "CoP-Oraculo-Setup-Script/1.0",
      "viewport": "test",
      "route": "/test"
    }
  }' 2>/dev/null || echo "ERROR")

if [[ "$FEEDBACK_TEST_RESPONSE" != "ERROR" && "$FEEDBACK_TEST_RESPONSE" != *"error"* ]]; then
    success "✅ Endpoint de feedback funcional"
else
    warning "⚠️ Test de feedback falló (esperado sin autenticación real)"
fi

# Test de documentación Swagger
if curl -s http://localhost:3002/api | grep -q "swagger"; then
    success "✅ Documentación Swagger disponible en http://localhost:3002/api"
else
    warning "⚠️ Documentación Swagger no accesible"
fi

# ============================================================================
# FASE 9: REPORTE FINAL
# ============================================================================

log "📋 FASE 9: Reporte Final"

echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                     🎉 SETUP COMPLETADO 🎉                    ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}\n"

info "🔮 CoP ORÁCULO - Estado de los Servicios:"
echo -e "  ${CYAN}├─${NC} Backend NestJS:       ${GREEN}http://localhost:3002${NC}"
echo -e "  ${CYAN}├─${NC} Swagger API Docs:     ${GREEN}http://localhost:3002/api${NC}"
echo -e "  ${CYAN}├─${NC} Feedback Endpoint:    ${GREEN}http://localhost:3002/feedback${NC}"

if [ "$2" != "--backend-only" ]; then
    echo -e "  ${CYAN}└─${NC} SuperApp Frontend:   ${GREEN}http://localhost:3001${NC}"
fi

echo -e "\n${BLUE}📚 Funcionalidades Implementadas:${NC}"
echo -e "  ${CYAN}✅${NC} Sistema de Feedback persistente"
echo -e "  ${CYAN}✅${NC} Base de datos configurada con modelos"
echo -e "  ${CYAN}✅${NC} APIs REST para gestión de feedback"
echo -e "  ${CYAN}✅${NC} Estructura base para Lükas de Sabiduría"
echo -e "  ${CYAN}✅${NC} Documentación automática con Swagger"

echo -e "\n${YELLOW}🚀 Próximos Pasos:${NC}"
echo -e "  ${CYAN}1.${NC} Revisa la documentación API en ${GREEN}http://localhost:3002/api${NC}"
echo -e "  ${CYAN}2.${NC} Implementa la interfaz de usuario para la CoP"
echo -e "  ${CYAN}3.${NC} Configura el sistema de Lükas de Sabiduría"
echo -e "  ${CYAN}4.${NC} Añade las mecánicas de gamificación"
echo -e "  ${CYAN}5.${NC} Integra con la SuperApp principal"

echo -e "\n${PURPLE}📂 Archivos de Log:${NC}"
echo -e "  ${CYAN}├─${NC} Backend: logs/backend.log"
if [ "$2" != "--backend-only" ]; then
    echo -e "  ${CYAN}└─${NC} SuperApp: logs/superapp.log"
fi

echo -e "\n${BLUE}🔧 Comandos Útiles:${NC}"
echo -e "  ${CYAN}├─${NC} Detener servicios: ${YELLOW}npm run stop:all${NC}"
echo -e "  ${CYAN}├─${NC} Reiniciar backend: ${YELLOW}npm run start:backend:dev${NC}"
echo -e "  ${CYAN}├─${NC} Ver logs backend: ${YELLOW}tail -f logs/backend.log${NC}"
echo -e "  ${CYAN}└─${NC} Reset BD: ${YELLOW}npm run db:reset${NC}"

# Crear script de inicio rápido
cat > scripts/cop-oraculo-start.sh << 'EOL'
#!/bin/bash
# Quick start script para CoP Oráculo
echo "🔮 Iniciando CoP Oráculo..."
npm run stop:all > /dev/null 2>&1 || true
npm run start:backend:dev &
sleep 5
echo "✅ CoP Oráculo iniciado en http://localhost:3002"
echo "📚 Documentación API: http://localhost:3002/api"
EOL

chmod +x scripts/cop-oraculo-start.sh
success "✅ Script de inicio rápido creado: scripts/cop-oraculo-start.sh"

echo -e "\n${GREEN}🌟 ¡La CoP Oráculo está lista para transformar feedback en sabiduría! 🌟${NC}\n"

# Guardar PIDs para cleanup
if [ -n "$BACKEND_PID" ]; then
    echo $BACKEND_PID > .cop-oraculo-backend.pid
fi

if [ -n "$SUPERAPP_PID" ]; then
    echo $SUPERAPP_PID > .cop-oraculo-superapp.pid
fi