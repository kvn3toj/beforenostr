#!/bin/bash

# Script de Setup Completo para CoomÜnity Website Recuperado
# Este script automatiza todo el proceso de unificación y puesta en marcha

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging con colores
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner de inicio
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║          CoomÜnity Website Setup              ║"
echo "║        Unificación y Servidor Local          ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar prerrequisitos
log_info "Verificando prerrequisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado. Por favor instala Node.js 16+ y vuelve a ejecutar."
    exit 1
else
    NODE_VERSION=$(node --version)
    log_success "Node.js encontrado: $NODE_VERSION"
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    log_error "npm no está instalado. Por favor instala npm y vuelve a ejecutar."
    exit 1
else
    NPM_VERSION=$(npm --version)
    log_success "npm encontrado: $NPM_VERSION"
fi

# Verificar TypeScript/ts-node
if ! command -v npx &> /dev/null; then
    log_error "npx no está disponible. Verifica tu instalación de npm."
    exit 1
fi

# Verificar que las carpetas de código recuperado existen
log_info "Verificando código recuperado..."

REQUIRED_DIRS=("recovered_code/pilgrim_demo" "recovered_code/merchant_dev" "recovered_code/red_pill_interactive")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        log_error "Directorio requerido no encontrado: $dir"
        log_error "Asegúrate de que todas las carpetas de código recuperado estén presentes."
        exit 1
    else
        log_success "Encontrado: $dir"
    fi
done

# Instalar dependencias de desarrollo si no existen
log_info "Verificando dependencias de desarrollo..."

if [ ! -f "package.json" ]; then
    log_info "Creando package.json temporal para dependencias de desarrollo..."
    cat > package.json << 'EOF'
{
  "name": "coomunity-website-setup",
  "version": "1.0.0",
  "description": "Setup tools for CoomÜnity recovered website",
  "scripts": {
    "unify": "npx ts-node unify-coomunity-website.ts",
    "serve": "node coomunity-local-server.js"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "typescript": "^4.9.0",
    "ts-node": "^10.9.0",
    "fs-extra": "^11.1.0",
    "glob": "^8.1.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
EOF
fi

# Instalar dependencias
log_info "Instalando dependencias..."
npm install --silent

# Ejecutar script de unificación
log_info "Ejecutando script de unificación..."
log_info "Esto puede tomar varios minutos dependiendo del tamaño de los archivos..."

if npx ts-node unify-coomunity-website.ts; then
    log_success "¡Unificación completada exitosamente!"
else
    log_error "Error durante la unificación. Revisa los logs para más detalles."
    exit 1
fi

# Verificar que la unificación fue exitosa
if [ ! -d "my_recovered_website" ]; then
    log_error "La carpeta my_recovered_website no fue creada. La unificación falló."
    exit 1
fi

# Copiar el servidor a la carpeta unificada
log_info "Configurando servidor local..."
cp coomunity-local-server.js my_recovered_website/server.js

# Crear scripts de conveniencia
log_info "Creando scripts de conveniencia..."

# Script para iniciar el servidor
cat > start-server.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando servidor CoomÜnity..."
cd my_recovered_website
node server.js
EOF

# Script para iniciar solo archivos estáticos
cat > start-static.sh << 'EOF'
#!/bin/bash
echo "📁 Iniciando servidor estático simple..."
if command -v python3 &> /dev/null; then
    echo "Usando Python 3..."
    cd my_recovered_website
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "Usando Python 2..."
    cd my_recovered_website
    python -m SimpleHTTPServer 8080
elif command -v npx &> /dev/null; then
    echo "Usando http-server de Node.js..."
    npx http-server my_recovered_website -p 8080 -c-1
else
    echo "❌ No se encontró Python ni Node.js para servidor estático"
    exit 1
fi
EOF

# Hacer ejecutables los scripts
chmod +x start-server.sh
chmod +x start-static.sh

# Generar reporte final
log_info "Generando reporte final..."

REPORT_FILE="setup-report.txt"
cat > "$REPORT_FILE" << EOF
================================================================
           REPORTE DE SETUP - CoomÜnity Website
================================================================

Fecha de setup: $(date)
Directorio de trabajo: $(pwd)

ESTRUCTURA GENERADA:
- my_recovered_website/          (Proyecto unificado)
  ├── public/                    (Página principal de navegación)
  ├── sections/                  (Demos organizados)
  │   ├── pilgrim/              (Demo Pilgrim)
  │   ├── merchant/             (Demo Merchant + variaciones)
  │   └── red-pill/             (Demo Red Pill + journey)
  ├── shared/                   (Recursos compartidos)
  ├── api/                      (APIs mockeadas)
  ├── docs/                     (Documentación y reportes)
  └── server.js                 (Servidor local)

SCRIPTS DISPONIBLES:
- ./start-server.sh             (Servidor completo con APIs)
- ./start-static.sh            (Servidor estático simple)

COMANDOS PARA INICIAR:

1. Servidor completo (recomendado):
   ./start-server.sh
   
2. Servidor estático:
   ./start-static.sh
   
3. Manual:
   cd my_recovered_website && node server.js

URLS DISPONIBLES:
- Página principal: http://localhost:8080/public/
- Pilgrim Demo: http://localhost:8080/sections/pilgrim/
- Merchant Demo: http://localhost:8080/sections/merchant/
- Red Pill Demo: http://localhost:8080/sections/red-pill/
- API Health: http://localhost:8080/api/health

NOTAS:
- El servidor incluye APIs mockeadas para funcionalidad completa
- Los archivos estáticos están optimizados para desarrollo local
- Ver logs del servidor para debugging de rutas y APIs
- Documentación completa en my_recovered_website/docs/

PRÓXIMOS PASOS:
1. Ejecutar ./start-server.sh
2. Abrir http://localhost:8080/public/ en tu navegador
3. Explorar las diferentes secciones del sitio
4. Revisar logs del servidor para cualquier problema

================================================================
EOF

# Mostrar resumen final
echo
log_success "🎉 ¡Setup completado exitosamente!"
echo
log_info "📋 RESUMEN:"
log_info "✅ Código unificado en: my_recovered_website/"
log_info "✅ Servidor configurado con APIs mockeadas"
log_info "✅ Scripts de conveniencia creados"
log_info "✅ Reporte detallado: $REPORT_FILE"
echo
log_info "🚀 PARA INICIAR EL SITIO:"
log_info "   ./start-server.sh"
echo
log_info "🌐 LUEGO VISITA:"
log_info "   http://localhost:8080/public/"
echo
log_warning "💡 Si encuentras problemas:"
log_warning "   - Revisa los logs del servidor"
log_warning "   - Verifica que el puerto 8080 esté libre"
log_warning "   - Consulta my_recovered_website/docs/ para más info"
echo

# Preguntar si quiere iniciar el servidor automáticamente
read -p "¿Quieres iniciar el servidor ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Iniciando servidor..."
    ./start-server.sh
fi 