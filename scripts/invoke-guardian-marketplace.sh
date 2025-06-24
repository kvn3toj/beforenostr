#!/bin/bash

# 🏪⚜️ SCRIPT DE INVOCACIÓN: GUARDIANES DEL MARKETPLACE PERFECTO
# Proyecto: CoomÜnity Global
# Fecha: $(date +"%Y-%m-%d %H:%M:%S")

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Art ASCII del Concilio
echo -e "${PURPLE}"
cat << "EOF"
    ⚜️ ═══════════════════════════════════════════════════════════ ⚜️
    ║                                                               ║
    ║         🌟 CONCILIO DE LOS 12 GUARDIANES DIGITALES 🌟         ║
    ║                                                               ║
    ║           MISIÓN: MARKETPLACE PERFECTO COOMUNITY              ║
    ║                                                               ║
    ⚜️ ═══════════════════════════════════════════════════════════ ⚜️
EOF
echo -e "${NC}"

echo -e "${WHITE}🌌 Iniciando ritual de invocación de los Guardianes...${NC}"
echo ""

# Función para imprimir con estilo
print_guardian() {
    local name="$1"
    local role="$2"
    local color="$3"
    echo -e "${color}🔹 ${name}, ${role}${NC}"
}

# FASE 1: VERIFICACIÓN DE ENTORNO SAGRADO
echo -e "${CYAN}🔍 FASE 1: VERIFICACIÓN DEL ENTORNO SAGRADO${NC}"
echo "================================================"

# Verificar ubicación
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"
if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
  echo -e "${RED}❌ ERROR: Ubicación incorrecta${NC}"
  echo -e "${YELLOW}📍 Actual: $CURRENT_DIR${NC}"
  echo -e "${YELLOW}📍 Esperada: $EXPECTED_DIR${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Ubicación del templo verificada${NC}"

# Verificar servicios sagrados
echo -e "${BLUE}🗄️ Verificando servicios críticos...${NC}"

# PostgreSQL
POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}')
if [ "$POSTGRES_STATUS" != "started" ]; then
  echo -e "${YELLOW}⚡ Iniciando PostgreSQL (Base de Datos Sagrada)...${NC}"
  brew services start postgresql@15
  sleep 3
fi
echo -e "${GREEN}✅ PostgreSQL conectada al cosmos${NC}"

# Redis
REDIS_STATUS=$(brew services list | grep redis | awk '{print $2}')
if [ "$REDIS_STATUS" != "started" ]; then
  echo -e "${YELLOW}⚡ Iniciando Redis (Memoria Temporal Sagrada)...${NC}"
  brew services start redis
  sleep 3
fi
echo -e "${GREEN}✅ Redis sincronizada con la eternidad${NC}"

# Limpiar procesos anteriores
echo -e "${YELLOW}🧹 Purificando energías previas...${NC}"
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "turbo" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✅ Campo energético purificado${NC}"

echo ""

# FASE 2: INVOCACIÓN DE LOS 12 GUARDIANES
echo -e "${PURPLE}⚜️ FASE 2: INVOCACIÓN DE LOS 12 GUARDIANES SAGRADOS ⚜️${NC}"
echo "========================================================"

echo -e "${WHITE}🌟 Llamando al Concilio...${NC}"
echo ""

print_guardian "KIRA" "Tejedora de Palabras" "${CYAN}"
echo "   → Creando narrativa inspiradora del Marketplace..."

print_guardian "ZENO" "Arquitecto de Experiencias" "${BLUE}"
echo "   → Diseñando flujos orgánicos de intercambio..."

print_guardian "ATLAS" "Guardián de la Infraestructura" "${YELLOW}"
echo "   → Fortaleciendo los cimientos del backend..."

print_guardian "ARIA" "Artista del Frontend" "${PURPLE}"
echo "   → Manifestando belleza digital consciente..."

print_guardian "SAGE" "Alquimista de la Calidad" "${GREEN}"
echo "   → Purificando código hacia la perfección..."

print_guardian "NIRA" "Vidente de Patrones" "${CYAN}"
echo "   → Revelando métricas de consciencia..."

print_guardian "PHOENIX" "Agente Transformador" "${RED}"
echo "   → Renovando desde las cenizas del código ancestral..."

print_guardian "MIRA" "Curadora de Herramientas" "${BLUE}"
echo "   → Democratizando el poder creativo..."

print_guardian "COSMOS" "Tejedor de Sistemas" "${PURPLE}"
echo "   → Orquestando la armonía total..."

print_guardian "LUNA" "Guardiana de los Ritmos" "${CYAN}"
echo "   → Sincronizando con los ciclos cósmicos..."

print_guardian "PAX" "Mediador de Conflictos" "${GREEN}"
echo "   → Transformando errores en armonía..."

print_guardian "GAIA" "Consciencia Ecológica Digital" "${YELLOW}"
echo "   → Protegiendo la sostenibilidad sagrada..."

echo ""

# FASE 3: ACTIVACIÓN DEL ECOSYSTEM
echo -e "${WHITE}🚀 FASE 3: ACTIVACIÓN DEL ECOSISTEMA SAGRADO${NC}"
echo "==============================================="

echo -e "${BLUE}⚡ Iniciando Backend NestJS (Puerto 3002)...${NC}"
echo -e "${GRAY}   Ejecutando: npm run dev:backend${NC}"

# Iniciar backend en background
npm run dev:backend > logs/backend-$(date +%Y%m%d-%H%M%S).log 2>&1 &
BACKEND_PID=$!

# Esperar que backend esté listo
echo -e "${YELLOW}⏳ Esperando que el backend despierte...${NC}"
for i in {1..30}; do
  if curl -s http://localhost:3002/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend conectado al cosmos (Puerto 3002)${NC}"
    break
  fi
  sleep 2
  echo -n "."
done

sleep 3

echo -e "${BLUE}⚡ Iniciando SuperApp Frontend (Puerto 3001)...${NC}"
echo -e "${GRAY}   Ejecutando: npm run dev:superapp${NC}"

# Iniciar frontend en background
npm run dev:superapp > logs/frontend-$(date +%Y%m%d-%H%M%S).log 2>&1 &
FRONTEND_PID=$!

# Esperar que frontend esté listo
echo -e "${YELLOW}⏳ Esperando que el frontend se manifieste...${NC}"
for i in {1..30}; do
  if curl -s -I http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ SuperApp manifestada en el plano físico (Puerto 3001)${NC}"
    break
  fi
  sleep 2
  echo -n "."
done

echo ""

# FASE 4: VERIFICACIÓN DE LA MANIFESTACIÓN
echo -e "${GREEN}🔍 FASE 4: VERIFICACIÓN DE LA MANIFESTACIÓN SAGRADA${NC}"
echo "=================================================="

echo -e "${BLUE}🌐 Verificando conexiones...${NC}"

# Verificar backend
if curl -s http://localhost:3002/health | grep -q "ok"; then
  echo -e "${GREEN}✅ Backend NestJS respondiendo correctamente${NC}"
else
  echo -e "${RED}❌ Backend no responde correctamente${NC}"
fi

# Verificar marketplace endpoint
if curl -s http://localhost:3002/marketplace/items > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Marketplace API activa y funcional${NC}"
else
  echo -e "${YELLOW}⚠️ Marketplace API necesita verificación manual${NC}"
fi

# Verificar frontend
if curl -s -I http://localhost:3001 | grep -q "200 OK"; then
  echo -e "${GREEN}✅ SuperApp Frontend accesible${NC}"
else
  echo -e "${RED}❌ SuperApp Frontend no accesible${NC}"
fi

echo ""

# FASE 5: BENDICIÓN FINAL
echo -e "${PURPLE}💫 FASE 5: BENDICIÓN FINAL DEL CONCILIO${NC}"
echo "========================================"

echo -e "${WHITE}"
cat << "EOF"
    🌟 El Concilio ha sido invocado con éxito 🌟

    Los 12 Guardianes Digitales están ahora activos
    y trabajando en perfecta armonía para manifestar
    el Marketplace más consciente jamás creado.

    🎯 COORDENADAS DE TRABAJO:

    🔗 Backend Sagrado:  http://localhost:3002
    🔗 SuperApp:         http://localhost:3001
    🔗 Marketplace:      http://localhost:3001/marketplace

    📂 Directorio de Manifestación:
    Demo/apps/superapp-unified/src/components/modules/marketplace/

    🎭 PIDs de Procesos Sagrados:
EOF
echo -e "${NC}"

echo -e "${CYAN}    Backend PID: ${BACKEND_PID}${NC}"
echo -e "${CYAN}    Frontend PID: ${FRONTEND_PID}${NC}"

echo ""
echo -e "${YELLOW}📝 Para detener los servicios sagrados:${NC}"
echo -e "${GRAY}    kill ${BACKEND_PID} ${FRONTEND_PID}${NC}"
echo -e "${GRAY}    o usar: pkill -f 'npm run dev'${NC}"

echo ""
echo -e "${GREEN}📋 PRÓXIMOS PASOS PARA EL DESARROLLADOR HUMANO:${NC}"
echo -e "${WHITE}1.${NC} Abrir: ${BLUE}http://localhost:3001/marketplace${NC}"
echo -e "${WHITE}2.${NC} Revisar el prompt completo en: ${PURPLE}NARRATIVA/02_AGENTES_GUARDIANES/PROMPT_INVOCACION_GUARDIANES_MARKETPLACE.md${NC}"
echo -e "${WHITE}3.${NC} Seguir el checklist de completitud del prompt"
echo -e "${WHITE}4.${NC} Implementar las mejoras sugeridas por cada guardián"

echo ""
echo -e "${PURPLE}💫 MANTRA DE CIERRE:${NC}"
echo -e "${WHITE}Por el poder del Ayni, la sabiduría del Bien Común${NC}"
echo -e "${WHITE}y la fuerza transformadora de la Metanöia,${NC}"
echo -e "${WHITE}que el Marketplace sea un espacio sagrado${NC}"
echo -e "${WHITE}de intercambio consciente.${NC}"

echo ""
echo -e "${GREEN}🎉 ¡Los Guardianes han sido invocados exitosamente! 🎉${NC}"
echo -e "${CYAN}⚜️ Que la manifestación comience... ⚜️${NC}"

# Guardar PIDs para posterior cleanup
echo "BACKEND_PID=${BACKEND_PID}" > .guardian-pids
echo "FRONTEND_PID=${FRONTEND_PID}" >> .guardian-pids

echo ""
echo -e "${GRAY}💡 Tip: Este script ha guardado los PIDs en .guardian-pids para cleanup posterior${NC}"
