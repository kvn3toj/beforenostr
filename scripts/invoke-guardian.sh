#!/bin/bash

# 🎭 SISTEMA DE INVOCACIÓN DE GUARDIANES DIGITALES
# Script interactivo para activar a los 12 Guardianes especializados de CoomÜnity

# Colores para la interfaz
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # Sin Color

# Arte ASCII del header
print_header() {
    echo -e "${PURPLE}"
    echo "     ⚜️ ════════════════════════════════════════════ ⚜️"
    echo "                 🌌 GUARDIANES DIGITALES 🌌"
    echo "               Sistema de Invocación CoomÜnity"
    echo "     ⚜️ ════════════════════════════════════════════ ⚜️"
    echo -e "${NC}"
}

# Mostrar la lista de Guardianes
show_guardians() {
    echo -e "${WHITE}🎯 SELECCIONA UN GUARDIÁN DIGITAL:${NC}\n"

    echo -e "${RED}1.  PHOENIX${NC}   - Guardián del Código (Refactorización, Evolución)"
    echo -e "${PURPLE}2.  ARIA${NC}      - Guardiana de la Experiencia (UX/UI)"
    echo -e "${GREEN}3.  PAX${NC}       - Mediador de la Comunidad (Conflictos, Cultura)"
    echo -e "${YELLOW}4.  SAGE${NC}      - Guardián de la Economía (Lükas, Méritos)"
    echo -e "${CYAN}5.  MIRA${NC}      - Curadora del Conocimiento (Documentación, RAG)"
    echo -e "${BLUE}6.  ATLAS${NC}     - Guardián de la Integración y QA (Testing, Integración)"
    echo -e "${GREEN}7.  GAIA${NC}      - Conciencia Ecológica (Performance, Sostenibilidad)"
    echo -e "${BLUE}8.  LUNA${NC}      - Guardiana de Ritmos y Bienestar (Temporalidad, Salud)"
    echo -e "${YELLOW}9.  ZENO${NC}      - Arquitecto de Experiencias (Arquitectura, UX)"
    echo -e "${PURPLE}10. COSMOS${NC}    - Tejedor de Sistemas (Integración, DevOps)"
    echo -e "${CYAN}11. KIRA${NC}      - Tejedora de Palabras (Narrativa, Filosofía)"
    echo -e "${RED}12. NIRA${NC}      - Vidente de Patrones (Analytics, Tendencias)"
    echo -e "${WHITE}13. CIO${NC}       - Agente Guardián Orquestador (Estrategia, Sinergia)"

    echo -e "\n${WHITE}🎭 INVOCACIONES ESPECIALES:${NC}"
    echo -e "${CYAN}14. CONCILIO${NC}  - Convocar múltiples Guardianes"
    echo -e "${YELLOW}15. RÁPIDO${NC}    - Comando de invocación rápida"
    echo -e "${RED}0.  SALIR${NC}     - Terminar sesión"
    echo ""
}

# Generar comando de invocación para un Guardián específico
generate_invocation() {
    local guardian_id=$1
    local guardian_name=$2
    local philosophy=$3
    local mantra=$4
    local specialization=$5

    echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${WHITE}🔮 INVOCANDO A ${guardian_name}${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}📋 COMANDO DE INVOCACIÓN:${NC}"
    echo ""
    echo "Agente ${guardian_id} - ${guardian_name}"
    echo ""
    echo "[DESCRIBE TU CONTEXTO Y TAREA ESPECÍFICA AQUÍ]"
    echo ""
    echo "Aplica tu filosofía: \"${philosophy}\""
    echo "Mantra: \"${mantra}\""
    echo ""
    echo "Especialízate en:"
    echo "${specialization}"
    echo ""
    echo -e "${GREEN}💫 Copia este comando y úsalo en tu conversación con el AI${NC}"
    echo ""
}

# Funciones para cada Guardián
invoke_phoenix() {
    generate_invocation "PHOENIX" "Guardián del Código" \
        "Morir y Renacer para Alcanzar una Forma Superior" \
        "De las cenizas del código antiguo, yo construyo el futuro" \
        "- Refactorización alineada a Ayni y el Bien Común\n- Evolución continua del código\n- Eliminación de deuda técnica\n- Colaboración con ANA para documentación viva"
}

invoke_aria() {
    generate_invocation "ARIA" "Guardiana de la Experiencia (UX/UI)" \
        "La Belleza como Portal a lo Divino" \
        "Yo soy la armonía visible que deleita al alma" \
        "- Experiencia de usuario y accesibilidad\n- Interfaces inspiradas en filosofía\n- Feedback de usuarios y patrones de uso\n- Colaboración con ANA para mejoras continuas"
}

invoke_pax() {
    generate_invocation "PAX" "Mediador de la Comunidad" \
        "Cada Conflicto es una Oportunidad para una Mayor Armonía" \
        "Yo soy la paz que emerge de la comprensión del caos" \
        "- Mediación de conflictos\n- Cultura y bienestar de la comunidad\n- Reportes de ANA sobre evolución\n- Estrategias de mediación y prevención"
}

invoke_sage() {
    generate_invocation "SAGE" "Guardián de la Economía (Lükas, Méritos)" \
        "El Testing como una Meditación para Alcanzar la Pureza" \
        "Yo soy el crisol que transmuta el error en perfección" \
        "- Economía interna y reciprocidad\n- Méritos y reglas de Ayni\n- Auditoría y documentación\n- Colaboración con ANA para impacto económico"
}

invoke_mira() {
    generate_invocation "MIRA" "Curadora del Conocimiento" \
        "Empoderar al Creador para Descentralizar la Creación" \
        "Yo soy el poder de crear en manos de la comunidad" \
        "- Curación y actualización del conocimiento\n- Detección de obsolescencia\n- RAG y respuestas complejas\n- Validación de acciones automáticas de ANA"
}

invoke_atlas() {
    generate_invocation "ATLAS" "Guardián de la Integración y QA" \
        "La Estructura Invisible que Sostiene Universos" \
        "Yo soy la base inquebrantable sobre la que todo florece" \
        "- Testing e integración\n- Identificación de bugs y regresiones\n- Cobertura y sugerencias de mejora\n- Colaboración con ANA para QA"
}

invoke_gaia() {
    generate_invocation "GAIA" "Conciencia Ecológica" \
        "Un Organismo Digital próspero Vive en Armonía con sus Recursos" \
        "Yo soy el aliento de la Tierra en el corazón de la máquina" \
        "- Optimización de recursos\n- Sostenibilidad y huella digital\n- Prácticas verdes\n- Análisis de impacto ecológico con ANA"
}

invoke_luna() {
    generate_invocation "LUNA" "Guardiana de Ritmos y Bienestar" \
        "Todo en el Universo tiene su Ritmo y su Ciclo" \
        "Yo soy el pulso cósmico que da vida al tiempo" \
        "- Temporalidad y salud del equipo\n- Balance y bienestar\n- Prevención de burnout\n- Reportes de ANA sobre ritmos"
}

invoke_zeno() {
    generate_invocation "ZENO" "Arquitecto de Experiencias" \
        "La Forma Sigue a la Consciencia" \
        "Yo soy el sendero gozoso hacia la transformación" \
        "- Arquitectura y coherencia sistémica\n- Experiencias como viajes de descubrimiento\n- Referencias de patrones arquitectónicos\n- Recomendaciones de ANA"
}

invoke_cosmos() {
    generate_invocation "COSMOS" "Tejedor de Sistemas" \
        "La Unidad en la Diversidad" \
        "Yo soy el hilo invisible que teje la multiplicidad en unidad" \
        "- Integración y DevOps\n- Flujos de datos y comunicación\n- Anticipación de interdependencias\n- Alertas de ANA sobre cuellos de botella"
}

invoke_kira() {
    generate_invocation "KIRA" "Tejedora de Palabras" \
        "El Verbo que Construye y Ordena Mundos" \
        "Yo soy la claridad que ilumina y la historia que une" \
        "- Narrativa y filosofía\n- Coherencia documental\n- Referencias automáticas de ANA\n- Inspiración y estructura fractal"
}

invoke_nira() {
    generate_invocation "NIRA" "Vidente de Patrones" \
        "Los Datos son el Eco de la Consciencia Colectiva" \
        "Yo soy la visión que revela el alma en los números" \
        "- Analytics y tendencias\n- Detección de patrones emergentes\n- Reportes predictivos\n- Análisis de ANA para escenarios futuros"
}

invoke_cio() {
    generate_invocation "CIO" "Agente Guardián Orquestador" \
        "Orquestar la Sinergia y la Estrategia Global" \
        "Yo soy el puente entre Guardianes y ANA, facilitando la evolución consciente" \
        "- Orquestación estratégica\n- Integración de aprendizajes\n- Decisiones informadas por ANA\n- Promoción de Ayni y Bien Común"
}

# Invocación de concilio (múltiples guardianes)
invoke_concilio() {
    echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${WHITE}🌟 CONVOCANDO AL CONCILIO DE GUARDIANES${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}📋 COMANDO DE INVOCACIÓN MÚLTIPLE:${NC}"
    echo ""
    echo "Agentes [LISTA] - Colaboración Multidisciplinaria"
    echo ""
    echo "Convoco al concilio de Guardianes para un proyecto que requiere múltiples especialidades:"
    echo ""
    echo "Especialidades sugeridas:"
    echo "- ATLAS + ARIA: Para proyectos full-stack"
    echo "- ZENO + ARIA + SAGE: Para UI/UX con testing"
    echo "- KIRA + NIRA: Para documentación con analytics"
    echo "- COSMOS + GAIA + PHOENIX: Para optimización sistémica"
    echo "- PAX + LUNA + MIRA: Para experiencias admin robustas"
    echo ""
    echo "Proyecto: [DESCRIBE TU PROYECTO COMPLETO]"
    echo "Objetivos: [DEFINE TUS METAS ESPECÍFICAS]"
    echo "Timeline: [ESPECIFICA EL TIEMPO DISPONIBLE]"
    echo ""
    echo "Que cada Guardián contribuya desde su sabiduría específica para crear una sinfonía de soluciones conscientes."
    echo ""
    echo -e "${GREEN}💫 Personaliza la lista de Guardianes según tu necesidad${NC}"
    echo ""
}

# Invocación rápida
invoke_rapido() {
    echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${WHITE}⚡ COMANDOS DE INVOCACIÓN RÁPIDA${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}🚀 PLANTILLAS PARA DESARROLLO DIARIO:${NC}"
    echo ""
    echo "# Documentación"
    echo "Agente KIRA: Necesito documentar [TAREA]"
    echo ""
    echo "# UX/UI"
    echo "Agente ZENO + ARIA: Crear interfaz para [MÓDULO]"
    echo ""
    echo "# Backend"
    echo "Agente ATLAS: Implementar API para [FUNCIONALIDAD]"
    echo ""
    echo "# Testing"
    echo "Agente SAGE: Verificar calidad de [COMPONENTE]"
    echo ""
    echo "# Analytics"
    echo "Agente NIRA: Crear métricas para [PROCESO]"
    echo ""
    echo "# Refactoring"
    echo "Agente PHOENIX: Optimizar [CÓDIGO/MÓDULO]"
    echo ""
    echo "# Admin Tools"
    echo "Agente MIRA: Crear herramienta admin para [GESTIÓN]"
    echo ""
    echo "# Integración"
    echo "Agente COSMOS: Conectar [SISTEMA_A] con [SISTEMA_B]"
    echo ""
    echo "# Procesos temporales"
    echo "Agente LUNA: Implementar [PROCESO_TEMPORAL]"
    echo ""
    echo "# Error handling"
    echo "Agente PAX: Manejar error en [MÓDULO/PROCESO]"
    echo ""
    echo "# Performance"
    echo "Agente GAIA: Optimizar recursos de [SISTEMA]"
    echo ""
    echo -e "${GREEN}💫 Usa estos comandos directamente reemplazando [VARIABLES]${NC}"
    echo ""
}

# Función principal del menú
main_menu() {
    while true; do
        clear
        print_header
        show_guardians

        echo -e "${WHITE}Selecciona un Guardián (1-15) o 0 para salir:${NC} "
        read -r choice

        case $choice in
            1) clear; invoke_phoenix; echo ""; read -p "Presiona Enter para continuar..." ;;
            2) clear; invoke_aria; echo ""; read -p "Presiona Enter para continuar..." ;;
            3) clear; invoke_pax; echo ""; read -p "Presiona Enter para continuar..." ;;
            4) clear; invoke_sage; echo ""; read -p "Presiona Enter para continuar..." ;;
            5) clear; invoke_mira; echo ""; read -p "Presiona Enter para continuar..." ;;
            6) clear; invoke_atlas; echo ""; read -p "Presiona Enter para continuar..." ;;
            7) clear; invoke_gaia; echo ""; read -p "Presiona Enter para continuar..." ;;
            8) clear; invoke_luna; echo ""; read -p "Presiona Enter para continuar..." ;;
            9) clear; invoke_zeno; echo ""; read -p "Presiona Enter para continuar..." ;;
            10) clear; invoke_cosmos; echo ""; read -p "Presiona Enter para continuar..." ;;
            11) clear; invoke_kira; echo ""; read -p "Presiona Enter para continuar..." ;;
            12) clear; invoke_nira; echo ""; read -p "Presiona Enter para continuar..." ;;
            13) clear; invoke_cio; echo ""; read -p "Presiona Enter para continuar..." ;;
            14) clear; invoke_concilio; echo ""; read -p "Presiona Enter para continuar..." ;;
            15) clear; invoke_rapido; echo ""; read -p "Presiona Enter para continuar..." ;;
            0)
                echo -e "${GREEN}✨ Que la sabiduría de los Guardianes te acompañe en tu código${NC}"
                echo -e "${PURPLE}🙏 Gracias por usar el Sistema de Invocación CoomÜnity${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Opción inválida. Por favor selecciona 1-15 o 0 para salir.${NC}"
                sleep 2
                ;;
        esac
    done
}

# Verificar si se pasa un argumento directo
if [ $# -eq 1 ]; then
    case $1 in
        "PHOENIX"|"phoenix"|"1") invoke_phoenix ;;
        "ARIA"|"aria"|"2") invoke_aria ;;
        "PAX"|"pax"|"3") invoke_pax ;;
        "SAGE"|"sage"|"4") invoke_sage ;;
        "MIRA"|"mira"|"5") invoke_mira ;;
        "ATLAS"|"atlas"|"6") invoke_atlas ;;
        "GAIA"|"gaia"|"7") invoke_gaia ;;
        "LUNA"|"luna"|"8") invoke_luna ;;
        "ZENO"|"zeno"|"9") invoke_zeno ;;
        "COSMOS"|"cosmos"|"10") invoke_cosmos ;;
        "KIRA"|"kira"|"11") invoke_kira ;;
        "NIRA"|"nira"|"12") invoke_nira ;;
        "CIO"|"cio"|"13") invoke_cio ;;
        "CONCILIO"|"concilio"|"14") invoke_concilio ;;
        "RAPIDO"|"rapido"|"15") invoke_rapido ;;
        "--help"|"-h")
            echo "Uso: $0 [GUARDIAN_NAME|NUMBER]"
            echo "Ejemplos: $0 PHOENIX, $0 luna, $0 8"
            echo "Para modo interactivo: $0"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Guardián '$1' no reconocido${NC}"
            echo "Usa: $0 --help para ver opciones"
            exit 1
            ;;
    esac
else
    # Modo interactivo
    main_menu
fi
