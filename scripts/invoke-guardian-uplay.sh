#!/bin/bash

# 🎬 SCRIPT DE INVOCACIÓN - GUARDIANES DEL ÜPLAY
# ===============================================
# Invoca a los guardianes especializados para perfeccionar el módulo UPlay
# Versión: 1.0 | Fecha: Enero 2025

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Función para mostrar banners
show_banner() {
    echo -e "${PURPLE}"
    echo "🎬 ═══════════════════════════════════════════════════════════"
    echo "    INVOCACIÓN DE GUARDIANES DEL ÜPLAY"
    echo "    CoomÜnity Global - Sistema de Aprendizaje Gamificado"
    echo "═══════════════════════════════════════════════════════════${NC}"
    echo
}

# Función para mostrar guardianes disponibles
show_guardians() {
    echo -e "${WHITE}👑 GUARDIANES DISPONIBLES PARA ÜPLAY:${NC}"
    echo
    echo -e "${CYAN}🎨 ARIA${NC} - Artista del Frontend Consciente"
    echo -e "   ${BLUE}Especialización:${NC} UI/UX, Animaciones, Estética Cósmica"
    echo
    echo -e "${CYAN}🎮 ZENO${NC} - Arquitecto de Experiencias Orgánicas"
    echo -e "   ${BLUE}Especialización:${NC} Flujos de Usuario, Gamificación, UX"
    echo
    echo -e "${CYAN}🏗️ ATLAS${NC} - Guardián de la Infraestructura Sagrada"
    echo -e "   ${BLUE}Especialización:${NC} Performance, Caching, Escalabilidad"
    echo
    echo -e "${CYAN}🧪 SAGE${NC} - Alquimista de la Calidad Suprema"
    echo -e "   ${BLUE}Especialización:${NC} Testing, Calidad, Accesibilidad"
    echo
    echo -e "${CYAN}🔮 NIRA${NC} - Vidente de Patrones Conscientes"
    echo -e "   ${BLUE}Especialización:${NC} Analytics, Insights, Métricas"
    echo
    echo -e "${CYAN}🔄 PHOENIX${NC} - Transformador de la Perfección Continua"
    echo -e "   ${BLUE}Especialización:${NC} Refactoring, Arquitectura, Optimización"
    echo
    echo -e "${CYAN}🌍 COSMOS${NC} - Tejedor de Sistemas Universales"
    echo -e "   ${BLUE}Especialización:${NC} Integración Backend, WebSockets, Sincronización"
    echo
}

# Función para verificar estado del sistema
check_system_status() {
    echo -e "${YELLOW}🔍 VERIFICANDO ESTADO DEL SISTEMA...${NC}"
    echo

    # Verificar ubicación
    if [[ $(pwd) == *"GAMIFIER-copy"* ]]; then
        echo -e "${GREEN}✅ Ubicación correcta verificada${NC}"
    else
        echo -e "${RED}❌ Error: Ejecutar desde directorio raíz del proyecto${NC}"
        exit 1
    fi

    # Verificar directorio UPlay
    if [ -d "Demo/apps/superapp-unified/src/components/modules/uplay" ]; then
        echo -e "${GREEN}✅ Módulo UPlay encontrado${NC}"
        component_count=$(find Demo/apps/superapp-unified/src/components/modules/uplay -name "*.tsx" | wc -l)
        echo -e "${BLUE}   📊 Componentes encontrados: ${component_count}${NC}"
    else
        echo -e "${RED}❌ Error: Directorio UPlay no encontrado${NC}"
        exit 1
    fi

    # Verificar backend
    if curl -s http://localhost:3002/health &> /dev/null; then
        echo -e "${GREEN}✅ Backend NestJS conectado (puerto 3002)${NC}"
    else
        echo -e "${YELLOW}⚠️ Backend NestJS no disponible - algunas funciones pueden estar limitadas${NC}"
    fi

    # Verificar SuperApp
    if curl -s -I http://localhost:3001 &> /dev/null; then
        echo -e "${GREEN}✅ SuperApp disponible (puerto 3001)${NC}"
    else
        echo -e "${YELLOW}⚠️ SuperApp no iniciada - necesaria para testing${NC}"
    fi

    echo
}

# Función para invocar guardián específico
invoke_guardian() {
    local guardian=$1
    local task=$2

    echo -e "${PURPLE}🔮 INVOCANDO A ${guardian}...${NC}"

    case $guardian in
        "ARIA")
            echo -e "${CYAN}🎨 Iniciando mejoras estéticas y animaciones...${NC}"
            echo "📂 Archivos objetivo:"
            echo "   - Demo/apps/superapp-unified/src/pages/UPlay.tsx"
            echo "   - Demo/apps/superapp-unified/src/components/modules/uplay/UPlayGamifiedDashboard.tsx"
            echo "   - Demo/apps/superapp-unified/src/styles/uplay-advanced.css"
            ;;
        "ZENO")
            echo -e "${CYAN}🎮 Optimizando experiencia de usuario y gamificación...${NC}"
            echo "📂 Archivos objetivo:"
            echo "   - Demo/apps/superapp-unified/src/components/modules/uplay/UPlayModeSelector.tsx"
            echo "   - Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx"
            echo "   - Demo/apps/superapp-unified/src/components/modules/uplay/UPlayAchievementSystem.tsx"
            ;;
        "ATLAS")
            echo -e "${CYAN}🏗️ Fortaleciendo infraestructura y performance...${NC}"
            echo "📂 Archivos objetivo:"
            echo "   - Demo/apps/superapp-unified/src/hooks/data/useVideoData.ts"
            echo "   - Demo/apps/superapp-unified/src/lib/api-service.ts"
            echo "   - Demo/apps/superapp-unified/src/utils/lazyComponents.ts"
            ;;
        "SAGE")
            echo -e "${CYAN}🧪 Implementando testing y calidad suprema...${NC}"
            echo "📂 Archivos objetivo:"
            echo "   - Demo/apps/superapp-unified/e2e/ (nuevos tests UPlay)"
            echo "   - Cobertura completa de componentes UPlay"
            ;;
        "NIRA")
            echo -e "${CYAN}🔮 Desarrollando analytics y métricas conscientes...${NC}"
            echo "📂 Archivos objetivo:"
            echo "   - Demo/apps/superapp-unified/src/hooks/analytics/useUPlayAnalytics.ts"
            echo "   - Demo/apps/superapp-unified/src/components/dashboard/UPlayInsightsDashboard.tsx"
            ;;
        "PHOENIX")
            echo -e "${CYAN}🔄 Refactorizando hacia la perfección arquitectónica...${NC}"
            echo "📂 Archivos objetivo:"
            echo "   - Todo el directorio Demo/apps/superapp-unified/src/components/modules/uplay/"
            echo "   - Optimización y limpieza general"
            ;;
        "COSMOS")
            echo -e "${CYAN}🌍 Perfeccionando integración y sincronización...${NC}"
            echo "📂 Archivos objetivo:"
            echo "   - Integración backend en todos los componentes UPlay"
            echo "   - WebSocket implementation para funciones en tiempo real"
            ;;
        *)
            echo -e "${RED}❌ Guardián no reconocido: $guardian${NC}"
            return 1
            ;;
    esac

    echo
    echo -e "${GREEN}🚀 $guardian está listo para comenzar la transformación${NC}"
    echo -e "${BLUE}📋 Consulta el prompt detallado en:${NC}"
    echo "   NARRATIVA/02_AGENTES_GUARDIANES/PROMPT_INVOCACION_GUARDIANES_UPLAY.md"
    echo
}

# Función para ejecutar testing
run_uplay_tests() {
    echo -e "${YELLOW}🧪 EJECUTANDO TESTS DE ÜPLAY...${NC}"
    echo

    cd Demo/apps/superapp-unified/

    # Tests unitarios
    echo -e "${BLUE}🔬 Tests unitarios...${NC}"
    npm run test:uplay 2>/dev/null || echo -e "${YELLOW}⚠️ Tests unitarios UPlay no configurados aún${NC}"

    # Tests E2E
    echo -e "${BLUE}🎭 Tests E2E...${NC}"
    if [ -f "e2e/uplay.spec.ts" ]; then
        npx playwright test e2e/uplay.spec.ts
    else
        echo -e "${YELLOW}⚠️ Tests E2E UPlay pendientes de implementación${NC}"
    fi

    cd ../../..
    echo
}

# Función para mostrar métricas actuales
show_uplay_metrics() {
    echo -e "${BLUE}📊 MÉTRICAS ACTUALES DEL ÜPLAY:${NC}"
    echo

    # Contar archivos
    component_count=$(find Demo/apps/superapp-unified/src/components/modules/uplay -name "*.tsx" | wc -l)
    hook_count=$(find Demo/apps/superapp-unified/src/hooks -name "*uplay*" -o -name "*video*" | wc -l)
    style_count=$(find Demo/apps/superapp-unified/src/styles -name "*uplay*" | wc -l)

    echo -e "${CYAN}📁 Componentes:${NC} $component_count archivos .tsx"
    echo -e "${CYAN}🪝 Hooks:${NC} $hook_count archivos relacionados"
    echo -e "${CYAN}🎨 Estilos:${NC} $style_count archivos CSS específicos"

    # Verificar tamaño del bundle (aproximado)
    total_size=$(find Demo/apps/superapp-unified/src/components/modules/uplay -name "*.tsx" -exec wc -c {} \; | awk '{sum += $1} END {print sum}')
    echo -e "${CYAN}📦 Tamaño total:${NC} $(echo "scale=2; $total_size/1024" | bc)KB aproximado"

    echo
}

# Función principal
main() {
    show_banner

    if [ $# -eq 0 ]; then
        show_guardians
        echo -e "${WHITE}Uso:${NC}"
        echo "  $0 [guardián] [tarea]"
        echo
        echo -e "${WHITE}Ejemplos:${NC}"
        echo "  $0 ARIA                    # Invocar a ARIA para mejoras estéticas"
        echo "  $0 ZENO                    # Invocar a ZENO para optimizar UX"
        echo "  $0 ALL                     # Invocar a todos los guardianes"
        echo "  $0 STATUS                  # Mostrar estado del sistema"
        echo "  $0 TEST                    # Ejecutar tests de UPlay"
        echo "  $0 METRICS                 # Mostrar métricas actuales"
        echo
        exit 0
    fi

    case $1 in
        "STATUS")
            check_system_status
            show_uplay_metrics
            ;;
        "TEST")
            check_system_status
            run_uplay_tests
            ;;
        "METRICS")
            show_uplay_metrics
            ;;
        "ALL")
            echo -e "${PURPLE}🌟 INVOCANDO A TODOS LOS GUARDIANES DEL ÜPLAY...${NC}"
            echo
            check_system_status
            for guardian in "ARIA" "ZENO" "ATLAS" "SAGE" "NIRA" "PHOENIX" "COSMOS"; do
                invoke_guardian $guardian
                sleep 1
            done
            echo -e "${GREEN}🎉 TODOS LOS GUARDIANES HAN SIDO INVOCADOS${NC}"
            echo -e "${BLUE}⏳ Tiempo estimado de transformación: 4-6 horas${NC}"
            ;;
        "ARIA"|"ZENO"|"ATLAS"|"SAGE"|"NIRA"|"PHOENIX"|"COSMOS")
            check_system_status
            invoke_guardian $1 $2
            ;;
        *)
            echo -e "${RED}❌ Comando no reconocido: $1${NC}"
            echo -e "${BLUE}💡 Usa '$0' sin argumentos para ver la ayuda${NC}"
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"
