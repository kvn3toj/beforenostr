#!/bin/bash

# 🌱 Script de Instalación de Extensiones CoomÜnity
# Basado en principios naturales y filosofía Ayni
# Actualizado con las extensiones faltantes implementadas

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función de logging
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

# Banner
echo -e "${GREEN}"
echo "🌱 ================================================================"
echo "   INSTALADOR DE EXTENSIONES COOMUNITY VS CODE"
echo "   Configuración Natural de Productividad y Bienestar"
echo "================================================================${NC}"
echo ""

# Verificar que code command está disponible
if ! command -v code &> /dev/null; then
    log_error "VS Code CLI 'code' no está disponible"
    echo "Instala VS Code y asegúrate de que 'code' esté en PATH"
    exit 1
fi

log_info "Instalando extensiones CoomÜnity optimizadas..."
echo ""

# === PACK ESENCIAL DE PRODUCTIVIDAD ===
echo -e "${BLUE}🌳 TRONCO - Pack Esencial de Productividad${NC}"

# Array de extensiones esenciales
ESSENTIAL_EXTENSIONS=(
    "GitHub.copilot"                      # GitHub Copilot - IA Colaborativa
    "GitHub.copilot-chat"                 # GitHub Copilot Chat - Ayni con IA
    "rangav.vscode-thunder-client"        # Thunder Client - REST sin salir de VS Code
    "eamodio.gitlens"                     # GitLens - Transparencia en Git
    "esbenp.prettier-vscode"              # Prettier - Belleza Automática
    "dbaeumer.vscode-eslint"              # ESLint - Calidad Preventiva
    "formulahendry.auto-rename-tag"       # Auto Rename Tag - Eficiencia JSX
    "christian-kohler.path-intellisense"  # Path Intellisense - Navegación Sin Errores
)

for extension in "${ESSENTIAL_EXTENSIONS[@]}"; do
    log_info "Instalando: $extension"
    if code --install-extension "$extension" --force; then
        log_success "✓ $extension instalado"
    else
        log_warning "⚠ Error instalando $extension"
    fi
done

echo ""

# === MONITOREO Y PERFORMANCE ===
echo -e "${BLUE}🍃 HOJAS - Monitoreo y Performance${NC}"

PERFORMANCE_EXTENSIONS=(
    "wix.vscode-import-cost"              # Import Cost - Consciencia de Tamaño
    "ms-vscode.vscode-typescript-next"    # TypeScript Insider - Última versión
    "bradlc.vscode-tailwindcss"           # Tailwind CSS - Styling Eficiente
)

for extension in "${PERFORMANCE_EXTENSIONS[@]}"; do
    log_info "Instalando: $extension"
    if code --install-extension "$extension" --force; then
        log_success "✓ $extension instalado"
    else
        log_warning "⚠ Error instalando $extension"
    fi
done

echo ""

# === ORGANIZACIÓN Y NAVEGACIÓN ===
echo -e "${BLUE}🌿 RAMAS - Organización y Navegación${NC}"

ORGANIZATION_EXTENSIONS=(
    "alefragnani.project-manager"         # Project Manager - Gestión Multi-Proyecto
    "alefragnani.bookmarks"               # Bookmarks - Marcadores de Código
    "johnpapa.vscode-peacock"             # Peacock - Colores por Proyecto
    "PKief.material-icon-theme"           # Material Icon Theme - Iconos Naturales
    "Equinusocio.vsc-material-theme"      # Material Theme - Tema Natural
)

for extension in "${ORGANIZATION_EXTENSIONS[@]}"; do
    log_info "Instalando: $extension"
    if code --install-extension "$extension" --force; then
        log_success "✓ $extension instalado"
    else
        log_warning "⚠ Error instalando $extension"
    fi
done

echo ""

# === COLABORACIÓN Y GIT ===
echo -e "${BLUE}🌬️ AIRE - Colaboración y Flujo${NC}"

COLLABORATION_EXTENSIONS=(
    "ms-vsliveshare.vsliveshare"          # Live Share - Colaboración Real Time
    "GitHub.vscode-pull-request-github"   # GitHub PR - Gestión de PR
    "mhutchie.git-graph"                  # Git Graph - Visualización de Ramas
    "donjayamanne.githistory"             # Git History - Memoria del Proyecto
    "ms-vsliveshare.vsliveshare-pack"     # Live Share Pack - Suite Completa
)

for extension in "${COLLABORATION_EXTENSIONS[@]}"; do
    log_info "Instalando: $extension"
    if code --install-extension "$extension" --force; then
        log_success "✓ $extension instalado"
    else
        log_warning "⚠ Error instalando $extension"
    fi
done

echo ""

# === REACT/TYPESCRIPT ESPECÍFICAS ===
echo -e "${BLUE}⚛️ DESARROLLO - React y TypeScript${NC}"

REACT_EXTENSIONS=(
    "dsznajder.es7-react-js-snippets"     # React Snippets - Eficiencia React
    "ms-playwright.playwright"            # Playwright - Testing E2E
    "ms-vscode.vscode-json"               # JSON Language Support
)

for extension in "${REACT_EXTENSIONS[@]}"; do
    log_info "Instalando: $extension"
    if code --install-extension "$extension" --force; then
        log_success "✓ $extension instalado"
    else
        log_warning "⚠ Error instalando $extension"
    fi
done

echo ""

# === HERRAMIENTAS AVANZADAS ===
echo -e "${BLUE}🔧 AVANZADO - Herramientas Especializadas${NC}"

ADVANCED_EXTENSIONS=(
    "WallabyJs.quokka-vscode"             # Quokka - Prototipado JS/TS
    "SonarSource.sonarlint-vscode"        # SonarLint - Calidad de Código
    "ms-vscode.vscode-docker"             # Docker - Contenedores
)

for extension in "${ADVANCED_EXTENSIONS[@]}"; do
    log_info "Instalando: $extension"
    if code --install-extension "$extension" --force; then
        log_success "✓ $extension instalado"
    else
        log_warning "⚠ Error instalando $extension"
    fi
done

echo ""

# === TESTING Y CALIDAD ===
echo -e "${BLUE}🧪 TESTING - Calidad y Verificación${NC}"

TESTING_EXTENSIONS=(
    "hbenl.vscode-test-explorer"          # Test Explorer - Vista Unificada de Tests
    "ms-vscode.test-adapter-converter"    # Test Adapter - Compatibilidad
)

for extension in "${TESTING_EXTENSIONS[@]}"; do
    log_info "Instalando: $extension"
    if code --install-extension "$extension" --force; then
        log_success "✓ $extension instalado"
    else
        log_warning "⚠ Error instalando $extension"
    fi
done

echo ""

# === PRODUCTIVIDAD ADICIONAL ===
echo -e "${BLUE}📋 PRODUCTIVIDAD - Herramientas Adicionales${NC}"

PRODUCTIVITY_EXTENSIONS=(
    "ms-vscode.vscode-todo-highlight"     # TODO Highlight - Resaltado de Tareas
    "Gruntfuggly.todo-tree"               # TODO Tree - Vista de Tareas
)

for extension in "${PRODUCTIVITY_EXTENSIONS[@]}"; do
    log_info "Instalando: $extension"
    if code --install-extension "$extension" --force; then
        log_success "✓ $extension instalado"
    else
        log_warning "⚠ Error instalando $extension"
    fi
done

echo ""

# === CONFIGURACIÓN AUTOMÁTICA ===
echo -e "${BLUE}⚙️ CONFIGURACIÓN - Aplicando Settings Optimizados${NC}"

# Crear directorio .vscode si no existe
mkdir -p .vscode

# Verificar si los archivos de configuración fueron creados
if [ -f ".vscode/settings.json" ]; then
    log_success "✓ Configuración de settings.json aplicada"
else
    log_warning "⚠ Archivo .vscode/settings.json no encontrado"
fi

if [ -f ".vscode/extensions.json" ]; then
    log_success "✓ Configuración de extensions.json aplicada"
else
    log_warning "⚠ Archivo .vscode/extensions.json no encontrado"
fi

echo ""

# === VERIFICACIÓN FINAL ===
echo -e "${BLUE}🔍 VERIFICACIÓN - Estado de Extensiones${NC}"

# Contar extensiones instaladas
TOTAL_EXTENSIONS=$(code --list-extensions | wc -l)
log_info "Total de extensiones instaladas: $TOTAL_EXTENSIONS"

# Verificar extensiones críticas
CRITICAL_EXTENSIONS=("eamodio.gitlens" "esbenp.prettier-vscode" "dbaeumer.vscode-eslint" "ms-playwright.playwright")
MISSING_CRITICAL=0

for extension in "${CRITICAL_EXTENSIONS[@]}"; do
    if code --list-extensions | grep -q "$extension"; then
        log_success "✓ $extension verificado"
    else
        log_error "✗ $extension NO ENCONTRADO"
        ((MISSING_CRITICAL++))
    fi
done

echo ""

# === RESUMEN FINAL ===
echo -e "${GREEN}"
echo "🎉 =============================================================="
echo "   INSTALACIÓN COMPLETADA - EXTENSIONES COOMUNITY"
echo "=============================================================="
echo -e "${NC}"

if [ $MISSING_CRITICAL -eq 0 ]; then
    log_success "🌟 Todas las extensiones críticas instaladas correctamente"
    echo ""
    log_info "🚀 Próximos pasos:"
    echo "   1. Reinicia VS Code para cargar todas las extensiones"
    echo "   2. Verifica que el tema Material Theme esté aplicado"
    echo "   3. Configura Peacock con colores CoomÜnity"
    echo "   4. Prueba GitHub Copilot si tienes acceso"
    echo "   5. Configura GitLens con tus preferencias"
    echo ""
    log_info "📖 Documentación adicional en:"
    echo "   docs/implementation/RECOMMENDED_EXTENSIONS.md"
else
    log_warning "⚠️  $MISSING_CRITICAL extensiones críticas no se instalaron correctamente"
    echo "   Revisa los mensajes de error y reintenta la instalación"
fi

echo ""
log_info "💡 Tips para usar las nuevas extensiones:"
echo "   • Cmd/Ctrl+Shift+P: Command Palette"
echo "   • GitLens: Hover sobre líneas para ver git blame"
echo "   • Thunder Client: Nuevo panel en sidebar"
echo "   • Live Share: Comparte sesiones con el equipo"
echo "   • Import Cost: Ve el tamaño de imports en código"
echo "   • TODO Tree: Panel especial para tareas CoomÜnity"

echo ""
echo -e "${GREEN}🌱 ¡Feliz desarrollo con filosofía CoomÜnity! 🌱${NC}"
echo "" 