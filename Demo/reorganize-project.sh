#!/bin/bash

# 🏗️ Script de Reorganización del Proyecto CoomÜnity SuperApp
# Basado en principios de Screaming Architecture y mejores prácticas

set -e  # Detener en cualquier error

echo "🚀 Iniciando reorganización del proyecto CoomÜnity SuperApp..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Crear estructura de carpetas principal
create_folder_structure() {
    print_info "Creando estructura de carpetas principal..."
    
    # Carpetas principales
    mkdir -p apps/{superapp-unified,quiz-demo,pilgrim-demo}
    mkdir -p packages/{ui,utils,types,config}
    mkdir -p docs/{architecture,api,guides,assets}
    mkdir -p tools/{scrapers,analyzers,migration,testing}
    mkdir -p data/{extracted,analysis,assets,backups}
    mkdir -p demos/{interactive,screenshots,videos}
    mkdir -p tests/{e2e,unit,integration}
    mkdir -p scripts/{setup,deployment,maintenance}
    mkdir -p .github/{workflows,templates}
    
    print_status "Estructura de carpetas creada"
}

# Mover proyecto principal
move_main_app() {
    print_info "Moviendo aplicación principal..."
    
    if [ -d "coomunity-superapp-unified" ]; then
        # Mover contenido del proyecto principal
        cp -r coomunity-superapp-unified/* apps/superapp-unified/ 2>/dev/null || true
        print_status "Aplicación principal movida a apps/superapp-unified/"
    else
        print_warning "No se encontró coomunity-superapp-unified"
    fi
}

# Mover demos
move_demos() {
    print_info "Organizando demos..."
    
    # Mover quiz demo
    if [ -d "coomunity-quiz-clone" ]; then
        cp -r coomunity-quiz-clone/* apps/quiz-demo/ 2>/dev/null || true
        print_status "Quiz demo movido"
    fi
    
    # Mover pilgrim demo
    if [ -d "coomunity-pilgrim-clone" ]; then
        cp -r coomunity-pilgrim-clone/* apps/pilgrim-demo/ 2>/dev/null || true
        print_status "Pilgrim demo movido"
    fi
    
    # Mover carpetas de demos específicos
    demo_folders=(
        "coomunity_pilgrim_demo"
        "coomunity_gossip"
        "coomunity_matches"
        "coomunity_gigs_add"
        "coomunity_wallet"
        "coomunity_gig_felicidad"
        "coomunity_search_params"
        "coomunity_merchant_dev"
        "coomunity_match_edit"
        "coomunity_main_complete"
    )
    
    for folder in "${demo_folders[@]}"; do
        if [ -d "$folder" ]; then
            mv "$folder" "data/extracted/"
            print_status "Movido $folder a data/extracted/"
        fi
    done
}

# Organizar herramientas
organize_tools() {
    print_info "Organizando herramientas y scripts..."
    
    # Mover scrapers
    scraper_files=(
        "*-scraper.ts"
        "*-explorer.ts"
        "playwright-*.ts"
        "quick-scrape.js"
        "extract-*.ts"
        "integrated-scraper-*.ts"
    )
    
    for pattern in "${scraper_files[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                mv "$file" "tools/scrapers/"
                print_status "Movido $file a tools/scrapers/"
            fi
        done
    done
    
    # Mover scripts de setup
    setup_scripts=(
        "setup-*.sh"
        "verify-*.sh"
        "fix_*.sh"
        "open-*.sh"
    )
    
    for pattern in "${setup_scripts[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                mv "$file" "scripts/setup/"
                print_status "Movido $file a scripts/setup/"
            fi
        done
    done
    
    # Mover herramientas de análisis
    analyzer_files=(
        "*-comparison-*.ts"
        "*-verifier.ts"
        "*-unifier.ts"
        "demo-test.ts"
    )
    
    for pattern in "${analyzer_files[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                mv "$file" "tools/analyzers/"
                print_status "Movido $file a tools/analyzers/"
            fi
        done
    done
}

# Organizar documentación
organize_docs() {
    print_info "Organizando documentación..."
    
    # Mover documentos de arquitectura
    arch_docs=(
        "*ARCHITECTURE*.md"
        "*UNIFICATION*.md"
        "*STRUCTURE*.md"
        "COOMUNITY_SUPERAPP_*.md"
    )
    
    for pattern in "${arch_docs[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                mv "$file" "docs/architecture/"
                print_status "Movido $file a docs/architecture/"
            fi
        done
    done
    
    # Mover READMEs específicos
    readme_files=(
        "README_*.md"
        "*_SUMMARY.md"
        "*_REPORT.md"
        "RESUMEN_*.md"
        "*_EXTRACTION_*.md"
    )
    
    for pattern in "${readme_files[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                mv "$file" "docs/guides/"
                print_status "Movido $file a docs/guides/"
            fi
        done
    done
    
    # Mover assets de documentación
    if [ -d "demo-screenshots" ]; then
        mv demo-screenshots docs/assets/
        print_status "Screenshots movidos a docs/assets/"
    fi
    
    if [ -d "video_analysis_frames" ]; then
        mv video_analysis_frames docs/assets/
        print_status "Video frames movidos a docs/assets/"
    fi
}

# Organizar datos y assets
organize_data() {
    print_info "Organizando datos y assets..."
    
    # Mover código recuperado
    if [ -d "recovered_code" ]; then
        mv recovered_code data/backups/
        print_status "Código recuperado movido a data/backups/"
    fi
    
    if [ -d "my_recovered_website" ]; then
        mv my_recovered_website data/backups/
        print_status "Website recuperado movido a data/backups/"
    fi
    
    # Mover demo.coomunity a data/extracted
    if [ -d "demo.coomunity" ]; then
        mv demo.coomunity data/extracted/
        print_status "demo.coomunity movido a data/extracted/"
    fi
    
    # Mover archivos de video
    if [ -f "Videobotones.mov" ]; then
        mv Videobotones.mov demos/videos/
        print_status "Video movido a demos/videos/"
    fi
}

# Organizar tests
organize_tests() {
    print_info "Organizando tests..."
    
    if [ -d "tests" ]; then
        mv tests/* tests/e2e/ 2>/dev/null || true
        print_status "Tests movidos a tests/e2e/"
    fi
    
    if [ -d "test-results" ]; then
        mv test-results tests/
        print_status "Resultados de tests organizados"
    fi
    
    if [ -d "test_demo" ]; then
        mv test_demo tests/integration/
        print_status "Test demo movido a tests/integration/"
    fi
}

# Limpiar archivos temporales y duplicados
cleanup() {
    print_info "Limpiando archivos temporales..."
    
    # Eliminar archivos .DS_Store
    find . -name ".DS_Store" -delete 2>/dev/null || true
    
    # Eliminar carpetas node_modules duplicadas (mantener solo la principal)
    find . -name "node_modules" -not -path "./apps/*/node_modules" -not -path "./node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
    
    print_status "Archivos temporales eliminados"
}

# Crear package.json del workspace
create_workspace_config() {
    print_info "Creando configuración del workspace..."
    
    cat > package.json << 'EOF'
{
  "name": "coomunity-superapp-workspace",
  "version": "1.0.0",
  "description": "CoomÜnity SuperApp - Workspace monorepo organizado",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev -w apps/superapp-unified",
    "dev:quiz": "npm run dev -w apps/quiz-demo",
    "dev:pilgrim": "npm run dev -w apps/pilgrim-demo",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces",
    "clean": "npm run clean --workspaces",
    "setup": "npm install && npm run setup --workspaces"
  },
  "keywords": [
    "coomunity",
    "superapp",
    "ayni",
    "gamification",
    "collaboration"
  ],
  "author": "CoomÜnity Team",
  "license": "MIT"
}
EOF
    
    print_status "Configuración del workspace creada"
}

# Crear README principal actualizado
create_main_readme() {
    print_info "Creando README principal..."
    
    cat > README.md << 'EOF'
# 🌍 CoomÜnity SuperApp - Workspace Organizado

> Plataforma gamificada para una economía colaborativa global basada en Ayni y el Bien Común

## 📁 Estructura del Proyecto

```
coomunity-superapp/
├── 📱 apps/                    # Aplicaciones principales
├── 📦 packages/                # Paquetes compartidos  
├── 📚 docs/                    # Documentación completa
├── 🛠️  tools/                  # Herramientas de desarrollo
├── 💾 data/                    # Datos y assets organizados
├── 🎮 demos/                   # Demos y prototipos
├── 🧪 tests/                   # Suite de tests
└── 📜 scripts/                 # Scripts de automatización
```

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo - App principal
npm run dev

# Desarrollo - Quiz demo  
npm run dev:quiz

# Desarrollo - Pilgrim demo
npm run dev:pilgrim

# Build todas las apps
npm run build

# Tests
npm run test
```

## 📖 Documentación

- [Arquitectura del Sistema](./docs/architecture/)
- [Guías de Desarrollo](./docs/guides/)
- [Documentación API](./docs/api/)

## 🎯 Filosofía CoomÜnity

- **Ayni**: Reciprocidad y equilibrio
- **Bien Común**: Priorizar el bienestar colectivo
- **Gamificación**: Motivación a través del juego
- **Colaboración**: Cooperar > Competir

## 🤝 Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para guías de contribución.

## 📄 Licencia

MIT - Ver [LICENSE](./LICENSE) para más detalles.
EOF
    
    print_status "README principal creado"
}

# Función principal
main() {
    print_info "🏗️ Reorganización del Proyecto CoomÜnity SuperApp"
    print_info "Basado en Screaming Architecture y mejores prácticas"
    echo ""
    
    # Crear backup de la estructura actual
    print_info "Creando backup de la estructura actual..."
    mkdir -p .backup-$(date +%Y%m%d_%H%M%S)
    
    # Ejecutar pasos de reorganización
    create_folder_structure
    move_main_app
    move_demos
    organize_tools
    organize_docs
    organize_data
    organize_tests
    cleanup
    create_workspace_config
    create_main_readme
    
    echo ""
    print_status "🎉 ¡Reorganización completada exitosamente!"
    print_info "Estructura basada en Screaming Architecture implementada"
    print_info "El proyecto ahora está organizado de forma modular y escalable"
    echo ""
    print_info "Próximos pasos:"
    print_info "1. Revisar la nueva estructura en: ./NUEVA_ESTRUCTURA_PROYECTO.md"
    print_info "2. Ejecutar: npm install"
    print_info "3. Probar: npm run dev"
    print_info "4. Actualizar referencias rotas si las hay"
}

# Ejecutar reorganización
main "$@" 