#!/bin/bash

# 🌟 INSTALADOR DE EXTENSIONES COOMUNITY
# ======================================
# Script automático para instalar todas las extensiones recomendadas
# Basado en principios naturales y filosofía CoomÜnity

echo "🌿 Iniciando instalación de extensiones CoomÜnity..."
echo "======================================================"

# Verificar que VS Code esté instalado
if ! command -v code &> /dev/null; then
    echo "❌ VS Code no está instalado o no está en PATH"
    echo "🔧 Instala VS Code desde: https://code.visualstudio.com/"
    exit 1
fi

echo "✅ VS Code detectado"

# === PACK ESENCIAL DE PRODUCTIVIDAD ===
echo ""
echo "🌟 Instalando Pack Esencial de Productividad..."

essential_extensions=(
    "rangav.vscode-thunder-client"        # Thunder Client - API Testing Natural
    "usernamehw.errorlens"               # Error Lens - Diagnóstico Inmediato
    "eamodio.gitlens"                    # GitLens - Historia Viva del Código
    "formulahendry.auto-rename-tag"      # Auto Rename Tag - Coherencia Automática
    "coenraads.bracket-pair-colorizer-2" # Bracket Pair Colorizer 2 - Estructura Visual
    "christian-kohler.path-intellisense" # Path Intellisense - Navegación Intuitiva
    "pkief.material-icon-theme"         # Material Icon Theme - Intuición Visual
    "esbenp.prettier-vscode"             # Prettier - Belleza Automática
)

for ext in "${essential_extensions[@]}"; do
    echo "🔧 Instalando: $ext"
    if code --install-extension "$ext" > /dev/null 2>&1; then
        echo "✅ $ext instalada exitosamente"
    else
        echo "⚠️ Error instalando $ext"
    fi
done

# === HERRAMIENTAS DE MONITOREO Y PERFORMANCE ===
echo ""
echo "📊 Instalando Herramientas de Monitoreo y Performance..."

monitoring_extensions=(
    "mutantdino.resourcemonitor"     # Resource Monitor - Signos Vitales
    "uctakeoff.vscode-counter"       # VS Code Counter - Métricas de Crecimiento
    "pmneo.tsimporter"              # TypeScript Importer - Optimización Continua
    "wix.vscode-import-cost"        # Import Cost - Visión Holística
    "rbbit.typescript-hero"         # TypeScript Hero - Equilibrio de Recursos
    "humao.rest-client"             # REST Client - Conectividad Saludable
)

for ext in "${monitoring_extensions[@]}"; do
    echo "🔧 Instalando: $ext"
    if code --install-extension "$ext" > /dev/null 2>&1; then
        echo "✅ $ext instalada exitosamente"
    else
        echo "⚠️ Error instalando $ext"
    fi
done

# === ORGANIZACIÓN Y NAVEGACIÓN ===
echo ""
echo "🗂️ Instalando Herramientas de Organización y Navegación..."

organization_extensions=(
    "alefragnani.project-manager"    # Project Manager - Universos Organizados
    "shinotatwu-ds.file-tree-generator" # File Tree Generator - Estructura Fractal
    "alefragnani.bookmarks"          # Bookmarks - Puntos de Referencia
    "gruntfuggly.todo-tree"         # Todo Tree - Tareas Orgánicas
    "sleistner.vscode-fileutils"    # File Utils - Utilidades Esenciales
    "patbenatar.advanced-new-file"  # Advanced New File - Creación Intuitiva
    "jasonnutter.search-node-modules" # Search node_modules - Exploración Profunda
)

for ext in "${organization_extensions[@]}"; do
    echo "🔧 Instalando: $ext"
    if code --install-extension "$ext" > /dev/null 2>&1; then
        echo "✅ $ext instalada exitosamente"
    else
        echo "⚠️ Error instalando $ext"
    fi
done

# === COLABORACIÓN Y GIT ===
echo ""
echo "🤝 Instalando Herramientas de Colaboración y Git..."

collaboration_extensions=(
    "ms-vsliveshare.vsliveshare"     # Live Share - Colaboración en Tiempo Real
    "mhutchie.git-graph"            # Git Graph - Historia Visual
    "donjayamanne.githistory"       # Git History - Memoria Colectiva
    "github.vscode-pull-request-github" # GitHub Pull Requests - Flujo Colaborativo
    "vivaxy.vscode-conventional-commits" # Conventional Commits - Comunicación Clara
)

for ext in "${collaboration_extensions[@]}"; do
    echo "🔧 Instalando: $ext"
    if code --install-extension "$ext" > /dev/null 2>&1; then
        echo "✅ $ext instalada exitosamente"
    else
        echo "⚠️ Error instalando $ext"
    fi
done

# === REACT/TYPESCRIPT ESPECÍFICAS ===
echo ""
echo "⚛️ Instalando Extensiones React/TypeScript..."

react_extensions=(
    "dsznajder.es7-react-js-snippets" # ES7+ React Snippets - Snippets Naturales
    "steoates.autoimport"           # Auto Import ES6 - Conexiones Automáticas
    "suming.react-proptypes-generate" # React PropTypes Generate - Integridad de Datos
    "styled-components.vscode-styled-components" # Styled Components - Belleza Integrada
    "testing-library.vscode-testing-library" # React Testing Library - Pruebas Naturales
)

for ext in "${react_extensions[@]}"; do
    echo "🔧 Instalando: $ext"
    if code --install-extension "$ext" > /dev/null 2>&1; then
        echo "✅ $ext instalada exitosamente"
    else
        echo "⚠️ Error instalando $ext"
    fi
done

# === EXTENSIONES DE BELLEZA Y EXPERIENCIA ===
echo ""
echo "🎨 Instalando Extensiones de Belleza y Experiencia..."

beauty_extensions=(
    "johnpapa.vscode-peacock"       # Peacock - Identidad Visual por Proyecto
    "oderwat.indent-rainbow"        # Indent Rainbow - Estructura Colorida
    "hoovercj.vscode-power-mode"   # Power Mode - Energía Creativa
)

for ext in "${beauty_extensions[@]}"; do
    echo "🔧 Instalando: $ext"
    if code --install-extension "$ext" > /dev/null 2>&1; then
        echo "✅ $ext instalada exitosamente"
    else
        echo "⚠️ Error instalando $ext"
    fi
done

# === CONFIGURAR WORKSPACE SETTINGS ===
echo ""
echo "⚙️ Configurando settings del workspace..."

# Crear directorio .vscode si no existe
mkdir -p .vscode

# Crear configuración optimizada
cat > .vscode/settings.json << 'EOF'
{
  "// === MÉTRICAS PERSONALIZADAS COOMUNITY ===": "",
  "workbench.activityBar.visible": true,
  "workbench.statusBar.visible": true,
  "workbench.editor.showTabs": true,
  
  "// === PRINCIPIOS DE AYNI (INTERCAMBIO EQUILIBRADO) ===": "",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  
  "// === PRINCIPIO DE RITMO (FLUJO NATURAL) ===": "",
  "editor.cursorBlinking": "smooth",
  "editor.smoothScrolling": true,
  "workbench.list.smoothScrolling": true,
  
  "// === PRINCIPIO DE CORRESPONDENCIA (ARMONÍA) ===": "",
  "workbench.colorTheme": "Material Theme Ocean High Contrast",
  "workbench.iconTheme": "material-icon-theme",
  
  "// === MÉTRICAS DE PERFORMANCE COOMUNITY ===": "",
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true,
  
  "// === MONITOREO DE SALUD DEL CÓDIGO ===": "",
  "editor.rulers": [80, 120],
  "editor.wordWrap": "bounded",
  "editor.wordWrapColumn": 120,
  
  "// === PRINCIPIO DE SIMPLICIDAD ===": "",
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  
  "// === AUTOMATIZACIÓN NATURAL ===": "",
  "emmet.triggerExpansionOnTab": true,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },

  "// === CONFIGURACIÓN PEACOCK COOMUNITY ===": "",
  "peacock.color": "#4A90E2"
}
EOF

echo "✅ Configuración del workspace creada"

# === CREAR TASKS.JSON PARA RECORDATORIOS NATURALES ===
cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Pausa Consciente",
      "type": "shell",
      "command": "echo",
      "args": ["🌱 Momento de respirar y reflexionar - CoomÜnity Wellness"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Health Check Extensiones",
      "type": "shell",
      "command": "bash",
      "args": ["./scripts/health-check-extensions.sh"],
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always"
      }
    }
  ]
}
EOF

echo "✅ Tasks de bienestar creadas"

# === CREAR WORKSPACE MULTI-ROOT ===
cat > coomunity.code-workspace << 'EOF'
{
  "folders": [
    {
      "name": "🏗️ Backend NestJS",
      "path": "../backend"
    },
    {
      "name": "⚛️ SuperApp React",
      "path": "./Demo/apps/superapp-unified"
    },
    {
      "name": "👑 Admin Frontend", 
      "path": "../admin-frontend"
    },
    {
      "name": "📚 Documentación",
      "path": "./docs"
    }
  ],
  "settings": {
    "peacock.color": "#4A90E2",
    "workbench.colorCustomizations": {
      "activityBar.background": "#4A90E2",
      "titleBar.activeBackground": "#4A90E2"
    }
  },
  "extensions": {
    "recommendations": [
      "rangav.vscode-thunder-client",
      "usernamehw.errorlens",
      "eamodio.gitlens",
      "esbenp.prettier-vscode",
      "pkief.material-icon-theme"
    ]
  }
}
EOF

echo "✅ Workspace multi-root configurado"

# === GENERAR REPORTE FINAL ===
echo ""
echo "🎉 INSTALACIÓN COMPLETADA"
echo "========================="

# Contar extensiones instaladas
total_extensions=$(code --list-extensions | wc -l)
echo "📊 Total de extensiones instaladas: $total_extensions"

# Verificar extensiones esenciales
echo ""
echo "🔍 Verificando extensiones esenciales..."

essential_check=(
    "rangav.vscode-thunder-client"
    "usernamehw.errorlens"
    "eamodio.gitlens"
    "esbenp.prettier-vscode"
)

installed_count=0
for ext in "${essential_check[@]}"; do
    if code --list-extensions | grep -q "$ext"; then
        echo "✅ $ext"
        ((installed_count++))
    else
        echo "❌ $ext - FALTANTE"
    fi
done

echo ""
echo "📈 MÉTRICAS DE INSTALACIÓN"
echo "========================="
echo "✅ Extensiones esenciales: $installed_count/4"
echo "🎯 Configuración optimizada: Creada"
echo "🌿 Workspace CoomÜnity: Configurado"
echo "🎨 Tema visual: Material Theme Ocean"
echo "🦚 Color Peacock: #4A90E2 (Azul CoomÜnity)"

echo ""
echo "🚀 PRÓXIMOS PASOS"
echo "================"
echo "1. Abre el workspace: code coomunity.code-workspace"
echo "2. Configura tu tema: Ctrl+K Ctrl+T > Material Theme Ocean"
echo "3. Ejecuta health check: Ctrl+Shift+P > Tasks: Run Task > Health Check Extensiones"
echo "4. Personaliza Peacock: Ctrl+Shift+P > Peacock: Change to a Favorite Color"

echo ""
echo "📚 DOCUMENTACIÓN"
echo "================"
echo "📖 Guía completa: docs/RECOMMENDED_EXTENSIONS.md"
echo "🌿 Monitoreo backend: docs/BACKEND_HEALTH_MONITORING.md"
echo "🔗 Marketplace VS Code: https://marketplace.visualstudio.com/"

echo ""
echo "🌟 ¡LISTO! Tu entorno CoomÜnity está optimizado"
echo "Recuerda: Estas herramientas están al servicio de la creatividad y el bien común 🌱✨"

# === OPCIONAL: ABRIR VS CODE ===
read -p "¿Deseas abrir VS Code con el workspace CoomÜnity? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Abriendo VS Code..."
    code coomunity.code-workspace
fi

echo ""
echo "🙏 Gracias por usar el instalador CoomÜnity"
echo "Que tengas un desarrollo productivo y consciente ✨" 