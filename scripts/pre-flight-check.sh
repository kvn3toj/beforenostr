#!/bin/bash

# 🔍 PRE-FLIGHT CHECK CRÍTICO - PROYECTO COOMUNITY
# ===============================================================================
# Script automatizado basado en aprendizajes costosos y experiencias reales
# Actualizado: JUNIO 2025 - Incluye verificación PostgreSQL obligatoria
# ===============================================================================

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de logging
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

log_section() {
    echo -e "\n${BLUE}🔍 $1${NC}"
    echo "----------------------------------------"
}

echo "🔍 INICIANDO PRE-FLIGHT CHECK CRÍTICO..."
echo "Proyecto: CoomÜnity Global"
echo "Fecha: $(date)"
echo "Usuario: $(whoami)"
echo ""

# 1. VERIFICAR UBICACIÓN CORRECTA
log_section "1. VERIFICACIÓN DE UBICACIÓN"
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"

if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
  log_error "Ubicación incorrecta"
  log_info "Actual: $CURRENT_DIR"
  log_info "Esperada: $EXPECTED_DIR"
  log_info "Ejecuta: cd '$EXPECTED_DIR'"
  exit 1
fi
log_success "Ubicación correcta verificada"

# 2. VERIFICAR POSTGRESQL (CRÍTICO - NUEVO)
log_section "2. VERIFICACIÓN POSTGRESQL (CRÍTICO)"
log_info "Verificando estado de PostgreSQL..."

# Verificar si PostgreSQL está instalado
if ! command -v brew &> /dev/null; then
    log_error "Homebrew no está instalado. PostgreSQL requiere Homebrew."
    exit 1
fi

# Verificar servicios PostgreSQL disponibles
POSTGRES_SERVICES=$(brew services list | grep postgresql || true)
if [ -z "$POSTGRES_SERVICES" ]; then
    log_error "PostgreSQL no está instalado via Homebrew"
    log_info "Instala PostgreSQL: brew install postgresql@15"
    exit 1
fi

# Verificar estado de PostgreSQL 15 (preferido)
POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}' || echo "none")
if [ "$POSTGRES_STATUS" != "started" ]; then
  log_warning "PostgreSQL@15 no está ejecutándose"
  log_info "Iniciando PostgreSQL@15..."
  brew services start postgresql@15
  sleep 3
  
  # Verificar nuevamente
  POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}' || echo "none")
  if [ "$POSTGRES_STATUS" != "started" ]; then
    log_error "No se pudo iniciar PostgreSQL@15"
    exit 1
  fi
fi

# Verificar conectividad PostgreSQL en puerto 5432
log_info "Verificando conectividad en puerto 5432..."
POSTGRES_RUNNING=$(lsof -i :5432 | grep LISTEN | wc -l || echo "0")
if [ "$POSTGRES_RUNNING" -eq 0 ]; then
  log_warning "PostgreSQL no está escuchando en puerto 5432"
  log_info "Reiniciando PostgreSQL..."
  brew services restart postgresql@15
  sleep 5
  
  # Verificar nuevamente
  POSTGRES_RUNNING=$(lsof -i :5432 | grep LISTEN | wc -l || echo "0")
  if [ "$POSTGRES_RUNNING" -eq 0 ]; then
    log_error "PostgreSQL no responde en puerto 5432 después del reinicio"
    exit 1
  fi
fi

log_success "PostgreSQL ejecutándose correctamente en puerto 5432"

# 3. LIMPIAR PROCESOS MÚLTIPLES
log_section "3. LIMPIEZA DE PROCESOS MÚLTIPLES"
log_info "Detectando procesos conflictivos..."

# Mostrar procesos actuales
RUNNING_PROCESSES=$(ps aux | grep -E "(vite|npm run dev|turbo)" | grep -v grep || true)
if [ ! -z "$RUNNING_PROCESSES" ]; then
    log_warning "Procesos de desarrollo detectados:"
    echo "$RUNNING_PROCESSES"
    log_info "Limpiando procesos conflictivos..."
fi

# Limpiar procesos
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "turbo" 2>/dev/null || true
sleep 2

# Verificar limpieza
REMAINING_PROCESSES=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l || echo "0")
if [ "$REMAINING_PROCESSES" -gt 0 ]; then
  log_warning "Algunos procesos aún están ejecutándose:"
  ps aux | grep -E "(vite|npm run dev)" | grep -v grep || true
else
  log_success "Procesos limpiados correctamente"
fi

# 4. LIMPIAR PUERTOS OCUPADOS
log_section "4. LIBERACIÓN DE PUERTOS"
log_info "Liberando puertos ocupados..."

# Puertos a limpiar (excepto 5432 que es PostgreSQL)
PORTS_TO_CLEAN="3000,3001,3002,3003,5173"
lsof -ti:$PORTS_TO_CLEAN | xargs kill -9 2>/dev/null || true

# Verificar puertos críticos
for port in 3001 3002; do
    if lsof -i :$port >/dev/null 2>&1; then
        log_warning "Puerto $port aún ocupado"
    else
        log_success "Puerto $port libre"
    fi
done

# 5. VERIFICAR CONFIGURACIÓN DE PUERTOS
log_section "5. VERIFICACIÓN DE CONFIGURACIÓN"
if [ -f "Demo/apps/superapp-unified/.env" ]; then
  SUPERAPP_PORT=$(grep VITE_BASE_URL Demo/apps/superapp-unified/.env | cut -d':' -f3 | cut -d'/' -f1 2>/dev/null || echo "unknown")
  if [ "$SUPERAPP_PORT" != "3001" ]; then
    log_warning "Puerto SuperApp no es 3001 (actual: $SUPERAPP_PORT)"
  else
    log_success "Configuración de puerto SuperApp correcta (3001)"
  fi
else
  log_warning "Archivo .env de SuperApp no encontrado"
fi

# 6. VERIFICAR TURBOREPO LOCAL
log_section "6. VERIFICACIÓN TURBOREPO"
TURBO_LOCAL=$(npm ls turbo 2>/dev/null | grep turbo@ | cut -d@ -f2 || echo "")
if [ -z "$TURBO_LOCAL" ]; then
  log_warning "Turborepo no está instalado localmente"
  log_info "Recomendado: npm install turbo --save-dev --legacy-peer-deps"
else
  log_success "Turborepo local: v$TURBO_LOCAL"
fi

# 7. VERIFICAR DEPENDENCIAS CRÍTICAS
log_section "7. VERIFICACIÓN DE DEPENDENCIAS CRÍTICAS"
cd Demo/apps/superapp-unified/

CRITICAL_DEPS=("@sentry/react" "web-vitals" "@playwright/test")
for dep in "${CRITICAL_DEPS[@]}"; do
    if npm ls "$dep" >/dev/null 2>&1; then
        log_success "$dep instalado"
    else
        log_warning "FALTA: $dep"
    fi
done

cd ../../../

# 8. VERIFICAR SERVICIOS CON DEPENDENCIA DE BD
log_section "8. VERIFICACIÓN DE SERVICIOS"
log_info "Verificando backend con dependencia PostgreSQL..."

# Test de conectividad backend
if curl -s http://localhost:1111/health >/dev/null 2>&1; then
    BACKEND_RESPONSE=$(curl -s http://localhost:1111/health)
    log_success "Backend (3002) disponible"
    log_info "Respuesta: $BACKEND_RESPONSE"
else
    log_warning "Backend (3002) no disponible - verificar PostgreSQL y reiniciar backend"
fi

# Test de conectividad SuperApp
if curl -s -I http://localhost:2222 >/dev/null 2>&1; then
    log_success "SuperApp (3001) disponible"
else
    log_info "SuperApp (3001) no iniciada (normal si no se ha ejecutado npm run dev:superapp)"
fi

# 9. RESUMEN Y RECOMENDACIONES
log_section "9. RESUMEN Y RECOMENDACIONES"

echo ""
log_success "PRE-FLIGHT CHECK COMPLETADO"
echo ""
log_info "COMANDOS RECOMENDADOS PARA INICIAR DESARROLLO:"
echo ""
echo "  # Iniciar ecosistema completo (recomendado)"
echo "  turbo run dev"
echo ""
echo "  # O servicios individuales:"
echo "  npm run dev:backend    # Backend NestJS (puerto 3002)"
echo "  npm run dev:superapp   # SuperApp (puerto 3001)"
echo ""
echo "  # Verificar servicios:"
echo "  curl http://localhost:1111/health"
echo "  curl http://localhost:2222 -I"
echo ""

# Verificar si hay advertencias pendientes
WARNINGS_COUNT=0
if [ "$POSTGRES_STATUS" != "started" ]; then ((WARNINGS_COUNT++)); fi
if [ -z "$TURBO_LOCAL" ]; then ((WARNINGS_COUNT++)); fi
if [ "$SUPERAPP_PORT" != "3001" ]; then ((WARNINGS_COUNT++)); fi

if [ $WARNINGS_COUNT -gt 0 ]; then
    log_warning "$WARNINGS_COUNT advertencia(s) encontrada(s). Revisar output anterior."
else
    log_success "Sistema listo para desarrollo sin advertencias"
fi

echo ""
log_info "Para más información, consultar: .cursor/rules/workspace-management.mdc"
echo "" 