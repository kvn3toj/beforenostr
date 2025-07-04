#!/bin/bash

# ================================================
# COOMUNITY - SCRIPT DE INSTALACIÓN UX IMPROVEMENTS
# Automatiza la aplicación de mejoras de usabilidad
# ================================================

echo "🚀 CoomÜnity UX Improvements - Instalador"
echo "========================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
PROJECT_ROOT="$(pwd)"
SHARED_DIR="$PROJECT_ROOT/shared"
SECTIONS_DIR="$PROJECT_ROOT/sections"
BACKUP_DIR="$PROJECT_ROOT/backup-$(date +%Y%m%d_%H%M%S)"

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "public/index.html" ]; then
    print_error "Por favor ejecuta este script desde el directorio raíz del proyecto web unificado"
    print_error "Debe contener las carpetas: public/, sections/, docs/"
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Crear backup
print_status "Creando backup de archivos originales..."
mkdir -p "$BACKUP_DIR"

if [ -d "$SECTIONS_DIR" ]; then
    cp -r "$SECTIONS_DIR" "$BACKUP_DIR/"
    print_success "Backup creado en: $BACKUP_DIR"
else
    print_warning "Directorio sections/ no encontrado"
fi

# Crear estructura de directorios compartidos
print_status "Creando estructura de directorios compartidos..."

mkdir -p "$SHARED_DIR/css"
mkdir -p "$SHARED_DIR/js"
mkdir -p "$SHARED_DIR/images"
mkdir -p "$SHARED_DIR/templates"

print_success "Estructura de directorios creada"

# Copiar archivos compartidos (si existen)
print_status "Verificando archivos de mejoras UX..."

UX_FILES_EXIST=true

if [ ! -f "$SHARED_DIR/css/unified-styles.css" ]; then
    print_warning "Archivo unified-styles.css no encontrado en shared/css/"
    UX_FILES_EXIST=false
fi

if [ ! -f "$SHARED_DIR/js/ux-enhancements.js" ]; then
    print_warning "Archivo ux-enhancements.js no encontrado en shared/js/"
    UX_FILES_EXIST=false
fi

if [ "$UX_FILES_EXIST" = false ]; then
    print_error "Faltan archivos de mejoras UX. Por favor copia los archivos:"
    print_error "- shared/css/unified-styles.css"
    print_error "- shared/js/ux-enhancements.js"
    print_error "- shared/templates/unified-navigation.html"
    echo ""
    print_status "¿Deseas continuar con la instalación de la estructura? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        exit 1
    fi
fi

# Función para crear archivo CSS base si no existe
create_base_css() {
    if [ ! -f "$SHARED_DIR/css/unified-styles.css" ]; then
        print_status "Creando archivo CSS base..."
        cat > "$SHARED_DIR/css/unified-styles.css" << 'EOF'
/* CoomÜnity - Unified Styles Base */
:root {
    --primary-color: #DC1A5B;
    --secondary-color: #3C4858;
    --background-color: #f8f9fa;
    --transition: all 0.3s ease;
}

.unified-navbar {
    background: var(--primary-color);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.unified-navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.unified-navbar .logo {
    max-height: 40px;
}

.unified-navbar .nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

.unified-navbar .nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: var(--transition);
}

.unified-navbar .nav-link:hover,
.unified-navbar .nav-link.active {
    background: rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
    .unified-navbar .nav-links {
        display: none;
    }
}
EOF
        print_success "Archivo CSS base creado"
    fi
}

# Función para crear archivo JavaScript base si no existe
create_base_js() {
    if [ ! -f "$SHARED_DIR/js/ux-enhancements.js" ]; then
        print_status "Creando archivo JavaScript base..."
        cat > "$SHARED_DIR/js/ux-enhancements.js" << 'EOF'
// CoomÜnity - UX Enhancements Base
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CoomÜnity UX Enhancements loaded');
    
    // Marcar enlace activo en navegación
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (currentPath.includes(section)) {
            link.classList.add('active');
        }
    });
});
EOF
        print_success "Archivo JavaScript base creado"
    fi
}

# Crear archivos base si no existen
create_base_css
create_base_js

# Función para aplicar mejoras a una página HTML
apply_improvements_to_file() {
    local file_path="$1"
    local file_name=$(basename "$file_path")
    
    print_status "Aplicando mejoras a: $file_name"
    
    # Verificar que el archivo existe
    if [ ! -f "$file_path" ]; then
        print_warning "Archivo no encontrado: $file_path"
        return 1
    fi
    
    # Crear backup del archivo individual
    cp "$file_path" "$file_path.backup"
    
    # Variables para las rutas relativas
    local depth=$(echo "$file_path" | grep -o "/" | wc -l)
    local relative_path=""
    
    for ((i=1; i<depth-1; i++)); do
        relative_path="../$relative_path"
    done
    
    # Crear archivo temporal con mejoras
    local temp_file=$(mktemp)
    
    # Procesar el archivo línea por línea
    while IFS= read -r line; do
        # Agregar meta viewport si no existe
        if [[ "$line" == *"<head>"* ]] && ! grep -q "viewport" "$file_path"; then
            echo "$line"
            echo "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
        # Agregar CSS unificado antes del primer <link>
        elif [[ "$line" == *"<link"* ]] && ! grep -q "unified-styles.css" "$file_path"; then
            echo "    <!-- CoomÜnity UX Improvements -->"
            echo "    <link rel=\"stylesheet\" href=\"${relative_path}shared/css/unified-styles.css\">"
            echo "$line"
        # Agregar JavaScript antes del </body>
        elif [[ "$line" == *"</body>"* ]]; then
            if ! grep -q "ux-enhancements.js" "$file_path"; then
                echo "    <!-- CoomÜnity UX Enhancements -->"
                echo "    <script src=\"${relative_path}shared/js/ux-enhancements.js\"></script>"
            fi
            echo "$line"
        else
            echo "$line"
        fi
    done < "$file_path" > "$temp_file"
    
    # Reemplazar archivo original
    mv "$temp_file" "$file_path"
    
    print_success "Mejoras aplicadas a: $file_name"
}

# Aplicar mejoras a archivos principales
print_status "Aplicando mejoras a archivos HTML..."

# Lista de archivos a procesar
files_to_process=(
    "public/index.html"
    "sections/pilgrim/index.html"
    "sections/merchant/index.html"
    "sections/red-pill/index.html"
)

# Procesar cada archivo
for file in "${files_to_process[@]}"; do
    if [ -f "$file" ]; then
        apply_improvements_to_file "$file"
    else
        print_warning "Archivo no encontrado: $file"
    fi
done

# Buscar y procesar archivos adicionales en journey
if [ -d "sections/red-pill/journey" ]; then
    print_status "Procesando archivos del journey..."
    find "sections/red-pill/journey" -name "*.html" -type f | while read -r file; do
        apply_improvements_to_file "$file"
    done
fi

# Crear archivo de logo placeholder si no existe
if [ ! -f "$SHARED_DIR/images/logo.png" ]; then
    print_status "Creando logo placeholder..."
    # Nota: En un entorno real, copiarías el logo real aquí
    touch "$SHARED_DIR/images/logo.png"
    print_warning "Logo placeholder creado. Reemplaza shared/images/logo.png con el logo real."
fi

# Crear documentación de implementación
print_status "Creando documentación de implementación..."

cat > "$PROJECT_ROOT/UX-IMPLEMENTATION-GUIDE.md" << 'EOF'
# 🚀 CoomÜnity UX Improvements - Guía de Implementación

## ✅ Instalación Completada

Las mejoras de UX han sido aplicadas automáticamente a tu proyecto web unificado.

### Archivos Modificados:
- `public/index.html`
- `sections/pilgrim/index.html`
- `sections/merchant/index.html`
- `sections/red-pill/index.html`
- Archivos del journey en `sections/red-pill/journey/`

### Archivos Agregados:
- `shared/css/unified-styles.css` - Estilos unificados
- `shared/js/ux-enhancements.js` - Funcionalidades mejoradas
- `shared/images/logo.png` - Logo placeholder

### Backups Creados:
Todos los archivos originales tienen backup con extensión `.backup`

## 🔧 Próximos Pasos Manuales:

### 1. Reemplazar Navegación (Opcional)
Para una navegación completamente unificada, reemplaza las barras de navegación existentes con el template en:
`shared/templates/unified-navigation.html`

### 2. Actualizar Logo
Reemplaza `shared/images/logo.png` con el logo real de CoomÜnity.

### 3. Personalizar Colores
Edita las variables CSS en `shared/css/unified-styles.css`:
```css
:root {
    --primary-color: #TU_COLOR_PRINCIPAL;
    --secondary-color: #TU_COLOR_SECUNDARIO;
}
```

### 4. Testing
1. Abre cada sección en el navegador
2. Verifica la navegación entre secciones
3. Prueba en dispositivos móviles
4. Valida formularios si existen

## 📚 Funcionalidades Incluidas:

✅ **Navegación Consistente** - Estados activos automáticos
✅ **Diseño Responsive** - Optimizado para móviles
✅ **Validación de Formularios** - Feedback en tiempo real
✅ **Estados de Carga** - Indicadores visuales
✅ **Sistema de Notificaciones** - Mensajes de estado
✅ **Breadcrumbs Automáticos** - Navegación contextual

## 🐛 Troubleshooting:

**Estilos no se cargan:**
- Verifica las rutas relativas en los enlaces CSS
- Asegúrate de que `shared/css/unified-styles.css` existe

**JavaScript no funciona:**
- Verifica que `shared/js/ux-enhancements.js` se carga correctamente
- Revisa la consola del navegador por errores

**Navegación no funciona:**
- Verifica que los enlaces en la navegación apuntan a las rutas correctas
- Asegúrate de que los atributos `data-section` están configurados

## 📞 Soporte:

Para problemas o mejoras adicionales, consulta la documentación completa en:
`ux-improvements.md`
EOF

print_success "Documentación creada: UX-IMPLEMENTATION-GUIDE.md"

# Crear script de rollback
print_status "Creando script de rollback..."

cat > "$PROJECT_ROOT/rollback-ux-improvements.sh" << EOF
#!/bin/bash
# Script de rollback para las mejoras UX

echo "🔄 Restaurando archivos originales..."

# Restaurar archivos desde backup
if [ -d "$BACKUP_DIR" ]; then
    cp -r "$BACKUP_DIR/sections/"* "sections/" 2>/dev/null || true
    echo "✅ Archivos restaurados desde $BACKUP_DIR"
else
    echo "⚠️  Backup no encontrado. Restaurando desde archivos .backup individuales..."
    
    find . -name "*.backup" -type f | while read -r backup_file; do
        original_file="\${backup_file%.backup}"
        cp "\$backup_file" "\$original_file"
        echo "Restaurado: \$original_file"
    done
fi

echo "✅ Rollback completado"
echo "ℹ️  Los archivos compartidos en shared/ se mantienen para futuras implementaciones"
EOF

chmod +x "$PROJECT_ROOT/rollback-ux-improvements.sh"
print_success "Script de rollback creado: rollback-ux-improvements.sh"

# Resumen final
echo ""
echo "========================================"
print_success "🎉 INSTALACIÓN COMPLETADA"
echo "========================================"
echo ""
print_status "Resumen de cambios aplicados:"
echo "  📁 Estructura shared/ creada"
echo "  🎨 Estilos unificados aplicados"
echo "  ⚡ JavaScript de mejoras agregado"
echo "  📱 Meta viewport agregado"
echo "  💾 Backups creados automáticamente"
echo ""
print_status "Archivos importantes:"
echo "  📖 UX-IMPLEMENTATION-GUIDE.md - Guía de implementación"
echo "  🔄 rollback-ux-improvements.sh - Script de rollback"
echo "  📂 $BACKUP_DIR/ - Backup de archivos originales"
echo ""
print_warning "PRÓXIMOS PASOS RECOMENDADOS:"
echo "  1. Abre public/index.html en tu navegador"
echo "  2. Navega entre las secciones para verificar"
echo "  3. Prueba en dispositivos móviles"
echo "  4. Lee UX-IMPLEMENTATION-GUIDE.md para más detalles"
echo ""
print_success "¡Las mejoras de UX han sido instaladas exitosamente! 🚀" 