#!/bin/bash

# 🏗️ CoomÜnity Monorepo Selective Actions
# Ejecuta acciones solo en las partes del monorepo que han cambiado

echo "🏗️ CoomÜnity Monorepo Selective Actions"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para detectar cambios
detect_changes() {
    echo "🔍 Detectando cambios desde el último commit..."
    
    # Detectar archivos modificados
    CHANGED_FILES=$(git diff --name-only HEAD~1)
    
    if [ -z "$CHANGED_FILES" ]; then
        echo "ℹ️  No hay cambios detectados"
        return 1
    fi
    
    echo "📝 Archivos modificados:"
    echo "$CHANGED_FILES" | sed 's/^/   /'
    echo ""
    
    return 0
}

# Función para builds selectivos
selective_build() {
    echo "🔨 BUILDS SELECTIVOS"
    echo "==================="
    
    if echo "$CHANGED_FILES" | grep -q "Demo/apps/superapp-unified/"; then
        echo -e "${YELLOW}🚀 Cambios detectados en SuperApp - Ejecutando build...${NC}"
        cd Demo/apps/superapp-unified
        npm run build
        cd ../../../
    fi
    
    if echo "$CHANGED_FILES" | grep -q "src/"; then
        echo -e "${YELLOW}⚙️ Cambios detectados en Backend - Ejecutando verificaciones...${NC}"
        # Aquí podrías agregar comandos específicos del backend
        echo "   Backend build simulation"
    fi
    
    if echo "$CHANGED_FILES" | grep -q "packages/"; then
        echo -e "${YELLOW}📦 Cambios detectados en Packages - Ejecutando builds...${NC}"
        # Lerna o nx builds selectivos
        echo "   Package builds simulation"
    fi
    
    echo ""
}

# Función para tests selectivos
selective_tests() {
    echo "🧪 TESTS SELECTIVOS"
    echo "=================="
    
    if echo "$CHANGED_FILES" | grep -q "Demo/apps/superapp-unified/.*\.\(ts\|tsx\|js\|jsx\|vue\)$"; then
        echo -e "${YELLOW}🧪 Ejecutando tests de SuperApp...${NC}"
        cd Demo/apps/superapp-unified
        npm test -- --passWithNoTests
        cd ../../../
    fi
    
    if echo "$CHANGED_FILES" | grep -q "src/.*\.\(ts\|js\)$"; then
        echo -e "${YELLOW}🧪 Ejecutando tests de Backend...${NC}"
        # npm test en backend
        echo "   Backend tests simulation"
    fi
    
    echo ""
}

# Función para linting selectivo
selective_lint() {
    echo "✨ LINTING SELECTIVO"
    echo "=================="
    
    # Solo archivos TS/JS/Vue modificados
    LINTABLE_FILES=$(echo "$CHANGED_FILES" | grep -E '\.(ts|tsx|js|jsx|vue)$' || true)
    
    if [ -n "$LINTABLE_FILES" ]; then
        echo -e "${YELLOW}✨ Ejecutando ESLint en archivos modificados...${NC}"
        echo "$LINTABLE_FILES" | sed 's/^/   /'
        
        # ESLint solo en archivos modificados
        echo "$LINTABLE_FILES" | xargs npx eslint --fix 2>/dev/null || echo "   ESLint completado con advertencias"
    else
        echo "ℹ️  No hay archivos JS/TS/Vue para procesar"
    fi
    
    echo ""
}

# Función para caché inteligente
intelligent_cache() {
    echo "💾 GESTIÓN INTELIGENTE DE CACHÉ"
    echo "==============================="
    
    # Limpiar caché solo si hay cambios en dependencias
    if echo "$CHANGED_FILES" | grep -q "package.*\.json\|yarn\.lock\|pnpm-lock\.yaml"; then
        echo -e "${YELLOW}📦 Dependencias modificadas - Limpiando cachés...${NC}"
        
        # Limpiar caché de npm/pnpm
        if command -v pnpm &> /dev/null; then
            pnpm store prune
        else
            npm cache clean --force 2>/dev/null || true
        fi
        
        # Limpiar caché de TypeScript
        find . -name "*.tsbuildinfo" -delete 2>/dev/null || true
        
        echo "   Cachés limpiados"
    else
        echo "✅ No hay cambios en dependencias - Cachés preservados"
    fi
    
    echo ""
}

# Función para optimización de Git
optimize_git() {
    echo "🔧 OPTIMIZACIÓN DE GIT"
    echo "====================="
    
    # Solo si hay muchos commits no pusheados
    UNPUSHED_COMMITS=$(git log --oneline @{u}.. 2>/dev/null | wc -l || echo "0")
    
    if [ "$UNPUSHED_COMMITS" -gt 10 ]; then
        echo -e "${YELLOW}🔄 Muchos commits sin push ($UNPUSHED_COMMITS) - Considera hacer push${NC}"
    fi
    
    # Limpiar referencias muertas
    git gc --quiet 2>/dev/null || true
    
    echo "✅ Git optimizado"
    echo ""
}

# Menú interactivo
show_menu() {
    echo "🎯 OPCIONES DISPONIBLES"
    echo "======================"
    echo "1. 🔍 Solo detectar cambios"
    echo "2. 🔨 Builds selectivos"
    echo "3. 🧪 Tests selectivos"
    echo "4. ✨ Linting selectivo"
    echo "5. 💾 Gestión de caché"
    echo "6. 🚀 Todo (recomendado)"
    echo "7. 🔧 Solo optimización Git"
    echo ""
    echo -n "Selecciona una opción (1-7): "
}

# Función principal
main() {
    # Detectar cambios primero
    if ! detect_changes; then
        echo "💡 Consejo: Haz algunos cambios y vuelve a ejecutar el script"
        exit 0
    fi
    
    # Mostrar menú si no hay argumentos
    if [ $# -eq 0 ]; then
        show_menu
        read -r choice
    else
        choice=$1
    fi
    
    case $choice in
        1)
            echo "✅ Detección de cambios completada"
            ;;
        2)
            selective_build
            ;;
        3)
            selective_tests
            ;;
        4)
            selective_lint
            ;;
        5)
            intelligent_cache
            ;;
        6)
            echo "🚀 Ejecutando pipeline completo..."
            selective_build
            selective_tests
            selective_lint
            intelligent_cache
            optimize_git
            echo -e "${GREEN}🎉 Pipeline selectivo completado${NC}"
            ;;
        7)
            optimize_git
            ;;
        *)
            echo "❌ Opción inválida"
            exit 1
            ;;
    esac
}

# Verificar que estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

# Ejecutar función principal
main "$@" 