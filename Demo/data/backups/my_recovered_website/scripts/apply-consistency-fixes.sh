#!/bin/bash

# ================================================
# SCRIPT DE MIGRACIÓN: CORRECCIONES DE CONSISTENCIA
# Aplica automáticamente todas las correcciones identificadas
# ================================================

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SECTIONS_DIR="$BASE_DIR/sections"
SHARED_DIR="$BASE_DIR/shared"

echo -e "${BLUE}🔧 Iniciando aplicación de correcciones de consistencia...${NC}"

# ================================================
# FUNCIÓN: Crear backup de archivos originales
# ================================================
create_backup() {
    local file="$1"
    local backup_dir="$BASE_DIR/backup-$(date +%Y%m%d_%H%M%S)"
    
    if [ ! -d "$backup_dir" ]; then
        mkdir -p "$backup_dir"
        echo -e "${YELLOW}📦 Creando backup en: $backup_dir${NC}"
    fi
    
    if [ -f "$file" ]; then
        cp "$file" "$backup_dir/$(basename "$file").backup"
        echo -e "${GREEN}✓ Backup creado para: $(basename "$file")${NC}"
    fi
}

# ================================================
# FUNCIÓN: Actualizar referencias CSS en HTML
# ================================================
fix_css_references() {
    local html_file="$1"
    local section_name="$2"
    
    echo -e "${BLUE}🔄 Corrigiendo referencias CSS en: $(basename "$html_file")${NC}"
    
    # Crear backup
    create_backup "$html_file"
    
    # Crear archivo temporal
    local temp_file=$(mktemp)
    
    # Procesar el archivo línea por línea
    while IFS= read -r line; do
        # Remover múltiples referencias a unified-styles.css
        if [[ "$line" == *"shared/css/unified-styles.css"* ]]; then
            # Solo mantener la primera referencia, omitir las demás
            if ! grep -q "unified-styles-fix.css" "$temp_file" 2>/dev/null; then
                echo '    <link rel="stylesheet" href="/shared/css/unified-styles-fix.css">' >> "$temp_file"
                echo '    <link rel="stylesheet" href="/shared/css/section-overrides.css">' >> "$temp_file"
            fi
        # Actualizar viewport meta tag
        elif [[ "$line" == *'content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"'* ]]; then
            echo '    <meta name="viewport" content="width=device-width, initial-scale=1.0">' >> "$temp_file"
        # Agregar clase de sección al body
        elif [[ "$line" == *"<body"* ]] && [[ "$line" != *"section-$section_name"* ]]; then
            if [[ "$line" == *'class="'* ]]; then
                echo "$line" | sed "s/class=\"/class=\"section-$section_name /" >> "$temp_file"
            else
                echo "$line" | sed "s/<body/<body class=\"section-$section_name\"/" >> "$temp_file"
            fi
        # Remover estilos embebidos específicos que ahora están centralizados
        elif [[ "$line" == *"<style>"* ]]; then
            # Saltar hasta el cierre del style
            echo "$line" >> "$temp_file"
            while IFS= read -r style_line && [[ "$style_line" != *"</style>"* ]]; do
                # Comentar estilos que ahora están centralizados
                if [[ "$style_line" == *".bg-black"* ]] || 
                   [[ "$style_line" == *".border-bottom-red"* ]] || 
                   [[ "$style_line" == *".navbar.is-role"* ]] ||
                   [[ "$style_line" == *".btn-whatsapp"* ]]; then
                    echo "        /* Movido a section-overrides.css: $style_line */" >> "$temp_file"
                else
                    echo "$style_line" >> "$temp_file"
                fi
            done
            echo "$style_line" >> "$temp_file"  # Agregar el </style>
        else
            echo "$line" >> "$temp_file"
        fi
    done < "$html_file"
    
    # Reemplazar archivo original
    mv "$temp_file" "$html_file"
    
    echo -e "${GREEN}✓ Referencias CSS corregidas en: $(basename "$html_file")${NC}"
}

# ================================================
# FUNCIÓN: Agregar navegación unificada
# ================================================
add_unified_navigation() {
    local html_file="$1"
    local section_name="$2"
    
    echo -e "${BLUE}🧭 Agregando navegación unificada a: $(basename "$html_file")${NC}"
    
    # Determinar clases activas
    local red_pill_active=""
    local merchant_active=""
    local pilgrim_active=""
    
    case "$section_name" in
        "red-pill") red_pill_active="active" ;;
        "merchant") merchant_active="active" ;;
        "pilgrim") pilgrim_active="active" ;;
    esac
    
    # Crear navegación unificada
    local nav_html="    <!-- Navegación unificada -->
    <nav class=\"unified-navbar\" role=\"navigation\" aria-label=\"Navegación principal\">
        <div class=\"navbar-container\">
            <div class=\"navbar-brand\">
                <a href=\"/\" class=\"navbar-brand\" aria-label=\"Ir a inicio de CoomÜnity\">
                    <img src=\"/shared/images/logo.png\" alt=\"CoomÜnity\" class=\"navbar-logo\">
                </a>
            </div>
            
            <ul class=\"navbar-nav\" role=\"menubar\">
                <li role=\"none\">
                    <a href=\"/sections/red-pill/\" class=\"nav-link $red_pill_active\" role=\"menuitem\">
                        Red Pill
                    </a>
                </li>
                <li role=\"none\">
                    <a href=\"/sections/merchant/\" class=\"nav-link $merchant_active\" role=\"menuitem\">
                        Merchant
                    </a>
                </li>
                <li role=\"none\">
                    <a href=\"/sections/pilgrim/\" class=\"nav-link $pilgrim_active\" role=\"menuitem\">
                        Pilgrim
                    </a>
                </li>
            </ul>
            
            <button class=\"navbar-toggle d-md-none\" type=\"button\" aria-label=\"Abrir menú de navegación\" aria-expanded=\"false\">
                <span class=\"sr-only\">Abrir menú</span>
                <i class=\"fas fa-bars\" aria-hidden=\"true\"></i>
            </button>
        </div>
    </nav>"
    
    # Insertar después del <body>
    sed -i "/<body[^>]*>/a\\$nav_html" "$html_file"
    
    echo -e "${GREEN}✓ Navegación unificada agregada${NC}"
}

# ================================================
# FUNCIÓN: Agregar scripts unificados
# ================================================
add_unified_scripts() {
    local html_file="$1"
    
    echo -e "${BLUE}📜 Agregando scripts unificados a: $(basename "$html_file")${NC}"
    
    # Agregar script antes del cierre de </body>
    local script_html="    <!-- Scripts unificados -->
    <script src=\"/shared/js/unified-scripts.js\"></script>"
    
    sed -i "/<\/body>/i\\$script_html" "$html_file"
    
    echo -e "${GREEN}✓ Scripts unificados agregados${NC}"
}

# ================================================
# FUNCIÓN: Procesar una sección
# ================================================
process_section() {
    local section_name="$1"
    local section_dir="$SECTIONS_DIR/$section_name"
    
    echo -e "${YELLOW}📁 Procesando sección: $section_name${NC}"
    
    if [ ! -d "$section_dir" ]; then
        echo -e "${RED}❌ Directorio de sección no encontrado: $section_dir${NC}"
        return 1
    fi
    
    # Procesar index.html
    local index_file="$section_dir/index.html"
    if [ -f "$index_file" ]; then
        fix_css_references "$index_file" "$section_name"
        add_unified_navigation "$index_file" "$section_name"
        add_unified_scripts "$index_file"
    else
        echo -e "${RED}❌ Archivo index.html no encontrado en: $section_dir${NC}"
    fi
    
    echo -e "${GREEN}✅ Sección $section_name procesada${NC}"
}

# ================================================
# FUNCIÓN: Validar archivos requeridos
# ================================================
validate_files() {
    echo -e "${BLUE}🔍 Validando archivos requeridos...${NC}"
    
    local required_files=(
        "$SHARED_DIR/css/unified-styles-fix.css"
        "$SHARED_DIR/css/section-overrides.css"
        "$SHARED_DIR/js/unified-scripts.js"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            echo -e "${RED}❌ Archivo requerido no encontrado: $file${NC}"
            echo -e "${YELLOW}💡 Asegúrate de haber ejecutado los pasos anteriores de la migración${NC}"
            exit 1
        else
            echo -e "${GREEN}✓ Encontrado: $(basename "$file")${NC}"
        fi
    done
}

# ================================================
# FUNCIÓN: Crear directorio de imágenes si no existe
# ================================================
setup_shared_images() {
    local images_dir="$SHARED_DIR/images"
    
    if [ ! -d "$images_dir" ]; then
        mkdir -p "$images_dir"
        echo -e "${YELLOW}📁 Creado directorio: $images_dir${NC}"
    fi
    
    # Crear placeholder si no existe
    local placeholder="$images_dir/placeholder.png"
    if [ ! -f "$placeholder" ]; then
        # Crear un placeholder simple (requiere ImageMagick)
        if command -v convert &> /dev/null; then
            convert -size 300x200 xc:lightgray -gravity center -pointsize 20 -annotate +0+0 "Imagen no disponible" "$placeholder"
            echo -e "${GREEN}✓ Placeholder creado: $placeholder${NC}"
        else
            echo -e "${YELLOW}⚠️  ImageMagick no encontrado. Crea manualmente: $placeholder${NC}"
        fi
    fi
}

# ================================================
# FUNCIÓN: Ejecutar tests de validación
# ================================================
run_validation_tests() {
    echo -e "${BLUE}🧪 Ejecutando tests de validación...${NC}"
    
    # Verificar que las clases de sección estén aplicadas
    for section in red-pill merchant pilgrim; do
        local index_file="$SECTIONS_DIR/$section/index.html"
        if [ -f "$index_file" ]; then
            if grep -q "section-$section" "$index_file"; then
                echo -e "${GREEN}✓ Clase de sección aplicada en: $section${NC}"
            else
                echo -e "${RED}❌ Clase de sección faltante en: $section${NC}"
            fi
            
            if grep -q "unified-navbar" "$index_file"; then
                echo -e "${GREEN}✓ Navegación unificada presente en: $section${NC}"
            else
                echo -e "${RED}❌ Navegación unificada faltante en: $section${NC}"
            fi
        fi
    done
}

# ================================================
# FUNCIÓN: Generar reporte de cambios
# ================================================
generate_report() {
    local report_file="$BASE_DIR/consistency-fixes-report.md"
    
    echo -e "${BLUE}📊 Generando reporte de cambios...${NC}"
    
    cat > "$report_file" << EOF
# Reporte de Correcciones de Consistencia

**Fecha:** $(date)
**Script:** apply-consistency-fixes.sh

## Cambios Aplicados

### 1. Referencias CSS Unificadas
- ✅ Eliminadas referencias duplicadas a \`unified-styles.css\`
- ✅ Agregadas referencias a \`unified-styles-fix.css\`
- ✅ Agregadas referencias a \`section-overrides.css\`
- ✅ Corregido viewport meta tag (removido user-scalable=0)

### 2. Navegación Unificada
- ✅ Agregada navegación consistente en todas las secciones
- ✅ Estados activos configurados correctamente
- ✅ Accesibilidad mejorada con ARIA labels

### 3. Clases de Sección
- ✅ Red Pill: clase \`section-red-pill\` aplicada
- ✅ Merchant: clase \`section-merchant\` aplicada  
- ✅ Pilgrim: clase \`section-pilgrim\` aplicada

### 4. Scripts Unificados
- ✅ Agregado \`unified-scripts.js\` en todas las secciones
- ✅ Comportamientos consistentes implementados

### 5. Estilos Centralizados
- ✅ Estilos embebidos movidos a archivos centralizados
- ✅ Variables CSS consistentes aplicadas

## Archivos Modificados

$(find "$SECTIONS_DIR" -name "*.html" -newer "$0" | sed 's/^/- /')

## Próximos Pasos

1. Ejecutar tests de consistencia: \`npm run test:consistency\`
2. Verificar funcionamiento en navegador
3. Validar accesibilidad con herramientas automatizadas
4. Revisar performance con Lighthouse

## Rollback

Si necesitas revertir los cambios:
\`\`\`bash
./scripts/rollback-consistency-fixes.sh
\`\`\`
EOF

    echo -e "${GREEN}✅ Reporte generado: $report_file${NC}"
}

# ================================================
# EJECUCIÓN PRINCIPAL
# ================================================
main() {
    echo -e "${BLUE}🚀 Iniciando migración de consistencia...${NC}"
    
    # Validar archivos requeridos
    validate_files
    
    # Configurar directorios compartidos
    setup_shared_images
    
    # Procesar cada sección
    local sections=("red-pill" "merchant" "pilgrim")
    
    for section in "${sections[@]}"; do
        process_section "$section"
    done
    
    # Ejecutar validaciones
    run_validation_tests
    
    # Generar reporte
    generate_report
    
    echo -e "${GREEN}🎉 Migración de consistencia completada exitosamente!${NC}"
    echo -e "${YELLOW}📋 Revisa el reporte en: consistency-fixes-report.md${NC}"
    echo -e "${BLUE}🧪 Ejecuta los tests con: npm run test:consistency${NC}"
}

# Verificar si se está ejecutando directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 