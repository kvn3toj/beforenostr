#!/bin/bash

# 🚀 CoomÜnity Development Manager
# Gestión inteligente de puertos y servicios para el monorepo

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración de puertos según las reglas del workspace
BACKEND_PORT=3002
SUPERAPP_PORT=3001
ADMIN_PORT=3000

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    CoomÜnity Dev Manager                     ║"
echo "║              Gestión Inteligente de Servicios                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Función para verificar dependencias críticas
check_critical_dependencies() {
    echo -e "${YELLOW}🔍 Verificando dependencias críticas...${NC}"

    # PostgreSQL
    POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}' || echo "stopped")
    if [ "$POSTGRES_STATUS" != "started" ]; then
        echo -e "${RED}❌ PostgreSQL no está ejecutándose${NC}"
        echo -e "${YELLOW}🔧 Iniciando PostgreSQL...${NC}"
        brew services start postgresql@15
        sleep 3
    else
        echo -e "${GREEN}✅ PostgreSQL ejecutándose${NC}"
    fi

    # Redis
    REDIS_STATUS=$(brew services list | grep redis | awk '{print $2}' || echo "stopped")
    if [ "$REDIS_STATUS" != "started" ]; then
        echo -e "${RED}❌ Redis no está ejecutándose${NC}"
        echo -e "${YELLOW}🔧 Iniciando Redis...${NC}"
        brew services start redis
        sleep 3
    else
        echo -e "${GREEN}✅ Redis ejecutándose${NC}"
    fi
}

# Función para mostrar estado de puertos
show_port_status() {
    echo -e "\n${BLUE}📊 Estado Actual de Puertos:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Backend (puerto 3002)
    if lsof -i :$BACKEND_PORT > /dev/null 2>&1; then
        BACKEND_PID=$(lsof -ti :$BACKEND_PORT)
        echo -e "${GREEN}✅ Backend NestJS${NC}    - Puerto $BACKEND_PORT - PID: $BACKEND_PID"
        curl -s http://localhost:$BACKEND_PORT/health > /dev/null && echo -e "   ${GREEN}🔗 Health check: OK${NC}" || echo -e "   ${YELLOW}⚠️  Health check: No responde${NC}"
    else
        echo -e "${RED}❌ Backend NestJS${NC}    - Puerto $BACKEND_PORT - No ejecutándose"
    fi

    # SuperApp (puerto 3001)
    if lsof -i :$SUPERAPP_PORT > /dev/null 2>&1; then
        SUPERAPP_PID=$(lsof -ti :$SUPERAPP_PORT)
        echo -e "${GREEN}✅ SuperApp${NC}          - Puerto $SUPERAPP_PORT - PID: $SUPERAPP_PID"
    else
        echo -e "${RED}❌ SuperApp${NC}          - Puerto $SUPERAPP_PORT - No ejecutándose"
    fi

    # Admin (puerto 3000)
    if lsof -i :$ADMIN_PORT > /dev/null 2>&1; then
        ADMIN_PID=$(lsof -ti :$ADMIN_PORT)
        echo -e "${GREEN}✅ Admin Frontend${NC}   - Puerto $ADMIN_PORT - PID: $ADMIN_PID"
    else
        echo -e "${RED}❌ Admin Frontend${NC}   - Puerto $ADMIN_PORT - No ejecutándose"
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Función para limpiar puertos
cleanup_ports() {
    echo -e "\n${YELLOW}🧹 Limpiando puertos ocupados...${NC}"

    # Puertos específicos del proyecto
    for port in $BACKEND_PORT $SUPERAPP_PORT $ADMIN_PORT 5173; do
        if lsof -i :$port > /dev/null 2>&1; then
            echo -e "${YELLOW}🔄 Liberando puerto $port...${NC}"
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
            sleep 1
        fi
    done

    # Limpiar procesos por nombre
    pkill -f "vite" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    pkill -f "turbo" 2>/dev/null || true

    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Función para iniciar servicios
start_services() {
    echo -e "\n${BLUE}🚀 Iniciando servicios...${NC}"

    case $1 in
        "all")
            echo -e "${YELLOW}📦 Iniciando ecosistema completo con Turborepo...${NC}"
            turbo run dev
            ;;
        "backend")
            echo -e "${YELLOW}🔧 Iniciando solo Backend NestJS...${NC}"
            npm run dev:backend
            ;;
        "superapp")
            echo -e "${YELLOW}📱 Iniciando solo SuperApp...${NC}"
            npm run dev:superapp
            ;;
        "frontend")
            echo -e "${YELLOW}🌐 Iniciando frontends (SuperApp + Admin)...${NC}"
            turbo run dev --filter=...superapp* --filter=...admin*
            ;;
        *)
            echo -e "${RED}❌ Opción no válida${NC}"
            echo "Opciones: all, backend, superapp, frontend"
            ;;
    esac
}

# Función para mostrar logs en tiempo real
show_logs() {
    echo -e "\n${BLUE}📋 Logs en tiempo real:${NC}"
    echo "Presiona Ctrl+C para salir"

    case $1 in
        "backend")
            if lsof -i :$BACKEND_PORT > /dev/null 2>&1; then
                echo -e "${GREEN}📝 Siguiendo logs del backend...${NC}"
                tail -f logs/backend/*.log 2>/dev/null || echo "No hay logs disponibles"
            else
                echo -e "${RED}❌ Backend no está ejecutándose${NC}"
            fi
            ;;
        "superapp")
            if lsof -i :$SUPERAPP_PORT > /dev/null 2>&1; then
                echo -e "${GREEN}📝 Siguiendo logs de SuperApp...${NC}"
                # Logs del browser console si están disponibles
                echo "Abre DevTools en http://localhost:$SUPERAPP_PORT para ver logs"
            else
                echo -e "${RED}❌ SuperApp no está ejecutándose${NC}"
            fi
            ;;
        *)
            echo "Especifica: backend o superapp"
            ;;
    esac
}

# Función para testing rápido de endpoints
test_endpoints() {
    echo -e "\n${BLUE}🔍 Testing de endpoints críticos:${NC}"

    # Health check del backend
    echo -e "${YELLOW}🏥 Testing health check...${NC}"
    if curl -s http://localhost:$BACKEND_PORT/health > /dev/null; then
        echo -e "${GREEN}✅ Backend health: OK${NC}"
    else
        echo -e "${RED}❌ Backend health: FAIL${NC}"
    fi

    # Login endpoint
    echo -e "${YELLOW}🔐 Testing login endpoint...${NC}"
    LOGIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:$BACKEND_PORT/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email": "admin@gamifier.com", "password": "admin123"}')

    if [ "$LOGIN_RESPONSE" = "200" ] || [ "$LOGIN_RESPONSE" = "201" ]; then
        echo -e "${GREEN}✅ Login endpoint: OK (HTTP $LOGIN_RESPONSE)${NC}"
    else
        echo -e "${RED}❌ Login endpoint: FAIL (HTTP $LOGIN_RESPONSE)${NC}"
    fi

    # Feedback endpoint (nuevo)
    echo -e "${YELLOW}📝 Testing feedback endpoint...${NC}"
    FEEDBACK_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$BACKEND_PORT/feedback/ping")

    if [ "$FEEDBACK_RESPONSE" = "200" ]; then
        echo -e "${GREEN}✅ Feedback endpoint: OK${NC}"
    else
        echo -e "${RED}❌ Feedback endpoint: FAIL (HTTP $FEEDBACK_RESPONSE)${NC}"
    fi
}

# Función para abrir URLs relevantes
open_urls() {
    echo -e "\n${BLUE}🌐 Abriendo URLs del proyecto...${NC}"

    # Verificar que los servicios estén ejecutándose antes de abrir
    if lsof -i :$SUPERAPP_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}📱 Abriendo SuperApp...${NC}"
        open "http://localhost:$SUPERAPP_PORT"
    fi

    if lsof -i :$BACKEND_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}📚 Abriendo documentación Swagger...${NC}"
        open "http://localhost:$BACKEND_PORT/api"
    fi

    if lsof -i :$ADMIN_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}⚙️ Abriendo Admin Panel...${NC}"
        open "http://localhost:$ADMIN_PORT"
    fi
}

# Menú principal
show_menu() {
    echo -e "\n${BLUE}📋 Opciones disponibles:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. 📊 Mostrar estado de puertos"
    echo "2. 🧹 Limpiar puertos y procesos"
    echo "3. 🚀 Iniciar servicios"
    echo "4. 📋 Ver logs en tiempo real"
    echo "5. 🔍 Test endpoints críticos"
    echo "6. 🌐 Abrir URLs del proyecto"
    echo "7. 🔧 Verificar dependencias críticas"
    echo "8. ❌ Salir"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "Demo" ]; then
    echo -e "${RED}❌ Error: Ejecuta este script desde la raíz del monorepo CoomÜnity${NC}"
    echo -e "${YELLOW}📁 Directorio esperado: /Users/kevinp/Movies/GAMIFIER-copy${NC}"
    exit 1
fi

# Si no hay argumentos, mostrar menú interactivo
if [ $# -eq 0 ]; then
    while true; do
        show_menu
        echo -e "${YELLOW}Selecciona una opción (1-8): ${NC}"
        read -r choice

        case $choice in
            1) show_port_status ;;
            2) cleanup_ports ;;
            3)
                echo -e "${YELLOW}Opciones: all, backend, superapp, frontend${NC}"
                echo -e "${YELLOW}¿Qué servicios iniciar? ${NC}"
                read -r service_choice
                start_services "$service_choice"
                ;;
            4)
                echo -e "${YELLOW}Opciones: backend, superapp${NC}"
                echo -e "${YELLOW}¿Logs de qué servicio? ${NC}"
                read -r log_choice
                show_logs "$log_choice"
                ;;
            5) test_endpoints ;;
            6) open_urls ;;
            7) check_critical_dependencies ;;
            8)
                echo -e "${GREEN}👋 ¡Hasta pronto!${NC}"
                exit 0
                ;;
            *) echo -e "${RED}❌ Opción no válida${NC}" ;;
        esac

        echo -e "\n${YELLOW}Presiona Enter para continuar...${NC}"
        read -r
        clear
    done
else
    # Modo comando directo
    case $1 in
        "status") show_port_status ;;
        "clean") cleanup_ports ;;
        "start") start_services "$2" ;;
        "logs") show_logs "$2" ;;
        "test") test_endpoints ;;
        "open") open_urls ;;
        "deps") check_critical_dependencies ;;
        "check")
            check_critical_dependencies
            show_port_status
            ;;
        *)
            echo -e "${RED}❌ Comando no reconocido: $1${NC}"
            echo -e "${YELLOW}Comandos disponibles:${NC}"
            echo "  status  - Mostrar estado de puertos"
            echo "  clean   - Limpiar puertos y procesos"
            echo "  start   - Iniciar servicios (all/backend/superapp/frontend)"
            echo "  logs    - Ver logs (backend/superapp)"
            echo "  test    - Test endpoints críticos"
            echo "  open    - Abrir URLs del proyecto"
            echo "  deps    - Verificar dependencias críticas"
            echo "  check   - Verificación completa (deps + status)"
            echo ""
            echo -e "${BLUE}Ejemplo: $0 start all${NC}"
            echo -e "${BLUE}Ejemplo: $0 check${NC}"
            ;;
    esac
fi
