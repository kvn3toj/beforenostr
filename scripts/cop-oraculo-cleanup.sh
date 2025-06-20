#!/bin/bash

# 🔮 CoP ORÁCULO - Script de Limpieza
# Script para detener servicios y limpiar procesos de la CoP Oráculo
# Autor: ǓAN (Agente IA Full-Stack de CoomÜnity)
# Fecha: 20 de Junio, 2025

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
    echo -e "${CYAN}[CoP CLEANUP]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo -e "${PURPLE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                  🧹 CoP ORÁCULO CLEANUP 🧹                   ║
║                                                              ║
║               Limpiando Servicios y Procesos                ║
║                                                              ║
║                    by ǓAN - Agente IA                       ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

log "🛑 Deteniendo servicios de la CoP Oráculo..."

# Detener servicios usando npm script si existe
if command -v npm &> /dev/null && [ -f "package.json" ]; then
    log "📦 Ejecutando npm run stop:all..."
    npm run stop:all > /dev/null 2>&1 || true
fi

# Detener procesos usando PIDs guardados
if [ -f ".cop-oraculo-backend.pid" ]; then
    BACKEND_PID=$(cat .cop-oraculo-backend.pid)
    if kill -0 "$BACKEND_PID" 2>/dev/null; then
        log "🔧 Deteniendo Backend NestJS (PID: $BACKEND_PID)..."
        kill "$BACKEND_PID" 2>/dev/null || true
        sleep 2
        # Force kill si aún está ejecutándose
        kill -9 "$BACKEND_PID" 2>/dev/null || true
    fi
    rm -f .cop-oraculo-backend.pid
    success "✅ Backend NestJS detenido"
fi

if [ -f ".cop-oraculo-superapp.pid" ]; then
    SUPERAPP_PID=$(cat .cop-oraculo-superapp.pid)
    if kill -0 "$SUPERAPP_PID" 2>/dev/null; then
        log "🎨 Deteniendo SuperApp Frontend (PID: $SUPERAPP_PID)..."
        kill "$SUPERAPP_PID" 2>/dev/null || true
        sleep 2
        # Force kill si aún está ejecutándose
        kill -9 "$SUPERAPP_PID" 2>/dev/null || true
    fi
    rm -f .cop-oraculo-superapp.pid
    success "✅ SuperApp Frontend detenida"
fi

# Buscar y detener procesos por nombre
log "🔍 Buscando procesos relacionados..."

# Detener procesos tsx del backend
TSX_PROCESSES=$(ps aux | grep "tsx.*backend" | grep -v grep | awk '{print $2}' || true)
if [ -n "$TSX_PROCESSES" ]; then
    log "🔧 Deteniendo procesos TSX del backend..."
    echo "$TSX_PROCESSES" | xargs kill 2>/dev/null || true
    sleep 1
    echo "$TSX_PROCESSES" | xargs kill -9 2>/dev/null || true
    success "✅ Procesos TSX del backend detenidos"
fi

# Detener procesos de Vite/npm dev
VITE_PROCESSES=$(ps aux | grep -E "(vite|npm.*dev)" | grep -v grep | awk '{print $2}' || true)
if [ -n "$VITE_PROCESSES" ]; then
    log "⚡ Deteniendo procesos Vite/npm dev..."
    echo "$VITE_PROCESSES" | xargs kill 2>/dev/null || true
    sleep 1
    echo "$VITE_PROCESSES" | xargs kill -9 2>/dev/null || true
    success "✅ Procesos Vite/npm dev detenidos"
fi

# Detener procesos turbo
TURBO_PROCESSES=$(ps aux | grep "turbo" | grep -v grep | awk '{print $2}' || true)
if [ -n "$TURBO_PROCESSES" ]; then
    log "🚀 Deteniendo procesos Turbo..."
    echo "$TURBO_PROCESSES" | xargs kill 2>/dev/null || true
    sleep 1
    echo "$TURBO_PROCESSES" | xargs kill -9 2>/dev/null || true
    success "✅ Procesos Turbo detenidos"
fi

# Limpiar puertos específicos
log "🌐 Liberando puertos..."
PORTS=(3000 3001 3002 3003 4000 5173 8000)

for port in "${PORTS[@]}"; do
    if command -v fuser &> /dev/null; then
        fuser -k ${port}/tcp 2>/dev/null || true
    else
        # Alternativa usando lsof
        PROC_ON_PORT=$(lsof -ti:$port 2>/dev/null || true)
        if [ -n "$PROC_ON_PORT" ]; then
            kill -9 $PROC_ON_PORT 2>/dev/null || true
        fi
    fi
done

success "✅ Puertos liberados: ${PORTS[*]}"

# Limpiar archivos temporales
log "🗑️ Limpiando archivos temporales..."

# Limpiar logs si existen
if [ -d "logs" ]; then
    rm -f logs/backend.log logs/superapp.log logs/cop-oraculo-*.log
    success "✅ Logs limpiados"
fi

# Limpiar cache de turbo si existe
if [ -d ".turbo" ]; then
    rm -rf .turbo
    success "✅ Cache de Turbo limpiado"
fi

# Limpiar archivos de PIDs
rm -f .cop-oraculo-*.pid

# Verificación final
log "🔍 Verificación final..."

# Verificar que los puertos están libres
PORTS_CHECK=(3001 3002)
ALL_CLEAR=true

for port in "${PORTS_CHECK[@]}"; do
    if command -v nc &> /dev/null; then
        if nc -z localhost $port 2>/dev/null; then
            warning "⚠️ Puerto $port aún ocupado"
            ALL_CLEAR=false
        fi
    else
        if curl -s localhost:$port > /dev/null 2>&1; then
            warning "⚠️ Puerto $port aún ocupado"
            ALL_CLEAR=false
        fi
    fi
done

if [ "$ALL_CLEAR" = true ]; then
    success "✅ Todos los puertos están libres"
else
    warning "⚠️ Algunos puertos pueden seguir ocupados. Reinicia si es necesario."
fi

# Verificar que no hay procesos relevantes ejecutándose
REMAINING_PROCESSES=$(ps aux | grep -E "(tsx.*backend|vite|npm.*dev|turbo)" | grep -v grep | wc -l)
if [ "$REMAINING_PROCESSES" -eq 0 ]; then
    success "✅ No hay procesos relacionados ejecutándose"
else
    warning "⚠️ Aún hay $REMAINING_PROCESSES proceso(s) relacionado(s) ejecutándose"
    ps aux | grep -E "(tsx.*backend|vite|npm.*dev|turbo)" | grep -v grep || true
fi

echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   🎉 LIMPIEZA COMPLETADA 🎉                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}🔧 Para reiniciar los servicios:${NC}"
echo -e "  ${CYAN}├─${NC} Setup completo: ${YELLOW}./scripts/cop-oraculo-setup.sh${NC}"
echo -e "  ${CYAN}├─${NC} Solo backend: ${YELLOW}./scripts/cop-oraculo-start.sh${NC}"
echo -e "  ${CYAN}└─${NC} Desarrollo manual: ${YELLOW}npm run dev${NC}"

echo -e "\n${GREEN}🌟 ¡Sistema limpio y listo para un nuevo inicio! 🌟${NC}\n"