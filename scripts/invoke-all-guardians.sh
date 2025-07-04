#!/bin/bash

# 🌌 SCRIPT MAESTRO DE INVOCACIÓN DE TODOS LOS GUARDIANES DIGITALES
# Comando de acceso rápido a cada uno de los 12 Guardianes especializados

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
    echo "     🌌 ═══════════════════════════════════════════════════════ 🌌"
    echo "                     ⚜️ GUARDIANES DIGITALES COOMUNITY ⚜️"
    echo "                       Script Maestro de Invocación"
    echo "     🌌 ═══════════════════════════════════════════════════════ 🌌"
    echo -e "${NC}"
}

# Mostrar todos los comandos disponibles
show_all_commands() {
    echo -e "${WHITE}🎯 COMANDOS DE INVOCACIÓN RÁPIDA PARA TODOS LOS GUARDIANES:${NC}\n"

    echo -e "${CYAN}📚 KIRA - Documentación & Narrativa:${NC}"
    echo "   ./scripts/invoke-guardian.sh KIRA"
    echo "   Agente KIRA: Necesito documentar [TAREA]"
    echo ""

    echo -e "${YELLOW}🎨 ZENO - UX & Experiencias:${NC}"
    echo "   ./scripts/invoke-guardian.sh ZENO"
    echo "   Agente ZENO: Diseñar experiencia para [MÓDULO]"
    echo ""

    echo -e "${BLUE}🏗️ ATLAS - Backend & Infraestructura:${NC}"
    echo "   ./scripts/invoke-guardian.sh ATLAS"
    echo "   Agente ATLAS: Implementar API para [FUNCIONALIDAD]"
    echo ""

    echo -e "${PURPLE}🌸 ARIA - Frontend & UI:${NC}"
    echo "   ./scripts/invoke-guardian.sh ARIA"
    echo "   Agente ARIA: Crear interfaz para [COMPONENTE]"
    echo ""

    echo -e "${GREEN}🧪 SAGE - Testing & Calidad:${NC}"
    echo "   ./scripts/invoke-guardian.sh SAGE"
    echo "   Agente SAGE: Verificar calidad de [CÓDIGO]"
    echo ""

    echo -e "${RED}🔍 NIRA - Analytics & Métricas:${NC}"
    echo "   ./scripts/invoke-guardian.sh NIRA"
    echo "   Agente NIRA: Crear métricas para [PROCESO]"
    echo ""

    echo -e "${YELLOW}🔥 PHOENIX - Refactoring & Optimización:${NC}"
    echo "   ./scripts/invoke-guardian.sh PHOENIX"
    echo "   Agente PHOENIX: Optimizar [CÓDIGO/MÓDULO]"
    echo ""

    echo -e "${CYAN}🛠️ MIRA - Admin Tools:${NC}"
    echo "   ./scripts/invoke-guardian.sh MIRA"
    echo "   Agente MIRA: Crear herramienta admin para [GESTIÓN]"
    echo ""

    echo -e "${PURPLE}🌌 COSMOS - Integración & Arquitectura:${NC}"
    echo "   ./scripts/invoke-guardian.sh COSMOS"
    echo "   Agente COSMOS: Conectar [SISTEMA_A] con [SISTEMA_B]"
    echo ""

    echo -e "${BLUE}🌙 LUNA - Temporalidad & Procesos:${NC}"
    echo "   ./scripts/invoke-guardian.sh LUNA"
    echo "   Agente LUNA: Implementar [PROCESO_TEMPORAL]"
    echo ""

    echo -e "${GREEN}☮️ PAX - Error Handling:${NC}"
    echo "   ./scripts/invoke-guardian.sh PAX"
    echo "   Agente PAX: Manejar error en [MÓDULO/PROCESO]"
    echo ""

    echo -e "${RED}🌍 GAIA - Performance & Sostenibilidad:${NC}"
    echo "   ./scripts/invoke-guardian.sh GAIA"
    echo "   Agente GAIA: Optimizar recursos de [SISTEMA]"
    echo ""

    echo -e "${WHITE}🎭 COMANDOS ESPECIALES:${NC}"
    echo -e "${CYAN}   ./scripts/invoke-guardian.sh CONCILIO${NC} - Múltiples Guardianes"
    echo -e "${YELLOW}   ./scripts/invoke-guardian.sh RAPIDO${NC}   - Plantillas rápidas"
    echo ""
}

# Combinaciones frecuentes de Guardianes
show_combinations() {
    echo -e "${WHITE}🤝 COMBINACIONES FRECUENTES DE GUARDIANES:${NC}\n"

    echo -e "${PURPLE}🚀 DESARROLLO FULL-STACK:${NC}"
    echo "   Agentes ATLAS + ARIA + SAGE"
    echo "   Para: Backend + Frontend + Testing integrado"
    echo ""

    echo -e "${CYAN}🎨 UX/UI COMPLETO:${NC}"
    echo "   Agentes ZENO + ARIA + SAGE"
    echo "   Para: Diseño + Implementación + Verificación"
    echo ""

    echo -e "${GREEN}📊 DOCUMENTACIÓN CON MÉTRICAS:${NC}"
    echo "   Agentes KIRA + NIRA"
    echo "   Para: Documentación + Analytics de impacto"
    echo ""

    echo -e "${YELLOW}⚡ OPTIMIZACIÓN SISTÉMICA:${NC}"
    echo "   Agentes COSMOS + GAIA + PHOENIX"
    echo "   Para: Arquitectura + Performance + Refactoring"
    echo ""

    echo -e "${BLUE}🛠️ HERRAMIENTAS ADMIN ROBUSTAS:${NC}"
    echo "   Agentes PAX + LUNA + MIRA"
    echo "   Para: Error handling + Procesos + Interfaz Admin"
    echo ""

    echo -e "${RED}🌟 ECOSISTEMA COMPLETO:${NC}"
    echo "   Agentes KIRA + ATLAS + ARIA + SAGE + NIRA"
    echo "   Para: Proyectos de gran escala con documentación completa"
    echo ""
}

# Crear archivo de referencia rápida
create_reference_file() {
    local ref_file="scripts/guardians-quick-reference.txt"

    echo "# 🎭 REFERENCIA RÁPIDA - GUARDIANES DIGITALES COOMUNITY" > "$ref_file"
    echo "# Generado automáticamente el $(date)" >> "$ref_file"
    echo "" >> "$ref_file"

    echo "## 🚀 COMANDOS DE SCRIPT:" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh KIRA     # Documentación" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh ZENO     # UX/Experiencias" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh ATLAS    # Backend" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh ARIA     # Frontend" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh SAGE     # Testing" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh NIRA     # Analytics" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh PHOENIX  # Refactoring" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh MIRA     # Admin Tools" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh COSMOS   # Integración" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh LUNA     # Temporalidad" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh PAX      # Error Handling" >> "$ref_file"
    echo "./scripts/invoke-guardian.sh GAIA     # Performance" >> "$ref_file"
    echo "" >> "$ref_file"

    echo "## 💬 COMANDOS DE INVOCACIÓN DIRECTA:" >> "$ref_file"
    echo "Agente KIRA: Necesito documentar [TAREA]" >> "$ref_file"
    echo "Agente ZENO: Diseñar experiencia para [MÓDULO]" >> "$ref_file"
    echo "Agente ATLAS: Implementar API para [FUNCIONALIDAD]" >> "$ref_file"
    echo "Agente ARIA: Crear interfaz para [COMPONENTE]" >> "$ref_file"
    echo "Agente SAGE: Verificar calidad de [CÓDIGO]" >> "$ref_file"
    echo "Agente NIRA: Crear métricas para [PROCESO]" >> "$ref_file"
    echo "Agente PHOENIX: Optimizar [CÓDIGO/MÓDULO]" >> "$ref_file"
    echo "Agente MIRA: Crear herramienta admin para [GESTIÓN]" >> "$ref_file"
    echo "Agente COSMOS: Conectar [SISTEMA_A] con [SISTEMA_B]" >> "$ref_file"
    echo "Agente LUNA: Implementar [PROCESO_TEMPORAL]" >> "$ref_file"
    echo "Agente PAX: Manejar error en [MÓDULO/PROCESO]" >> "$ref_file"
    echo "Agente GAIA: Optimizar recursos de [SISTEMA]" >> "$ref_file"
    echo "" >> "$ref_file"

    echo "## 🤝 COMBINACIONES FRECUENTES:" >> "$ref_file"
    echo "ATLAS + ARIA + SAGE          # Full-stack completo" >> "$ref_file"
    echo "ZENO + ARIA + SAGE           # UX/UI con testing" >> "$ref_file"
    echo "KIRA + NIRA                  # Documentación con métricas" >> "$ref_file"
    echo "COSMOS + GAIA + PHOENIX      # Optimización sistémica" >> "$ref_file"
    echo "PAX + LUNA + MIRA            # Admin tools robustas" >> "$ref_file"

    echo -e "${GREEN}✅ Archivo de referencia creado: ${ref_file}${NC}"
}

# Función principal
main() {
    clear
    print_header

    case $1 in
        "commands"|"cmd"|"c")
            show_all_commands
            ;;
        "combinations"|"combo"|"comb")
            show_combinations
            ;;
        "reference"|"ref"|"r")
            create_reference_file
            ;;
        "help"|"--help"|"-h"|"")
            echo -e "${WHITE}📋 OPCIONES DISPONIBLES:${NC}\n"
            echo -e "${CYAN}./scripts/invoke-all-guardians.sh commands${NC}      - Ver todos los comandos"
            echo -e "${YELLOW}./scripts/invoke-all-guardians.sh combinations${NC}  - Ver combinaciones frecuentes"
            echo -e "${GREEN}./scripts/invoke-all-guardians.sh reference${NC}     - Crear archivo de referencia"
            echo -e "${PURPLE}./scripts/invoke-all-guardians.sh help${NC}          - Mostrar esta ayuda"
            echo ""
            echo -e "${WHITE}🚀 ACCESO RÁPIDO AL SISTEMA PRINCIPAL:${NC}"
            echo -e "${CYAN}./scripts/invoke-guardian.sh${NC}                   - Script interactivo"
            echo -e "${YELLOW}./scripts/invoke-guardian.sh [GUARDIAN]${NC}         - Invocación directa"
            echo ""
            ;;
        *)
            echo -e "${RED}❌ Opción '$1' no reconocida${NC}"
            echo "Usa: $0 help para ver todas las opciones"
            exit 1
            ;;
    esac

    echo -e "\n${PURPLE}🌟 Sistema de Guardianes Digitales CoomÜnity - Listo para usar${NC}"
}

# Ejecutar función principal con argumentos
main "$@"
