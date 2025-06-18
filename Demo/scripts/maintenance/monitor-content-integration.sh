#!/bin/bash

# 🔍 Monitor de Integración de Contenido CoomÜnity SuperApp
# Script para verificar regularmente qué contenido extraído se ha integrado

set -e

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔍 Monitor de Integración de Contenido - CoomÜnity SuperApp"
echo "================================================================"

# Función para verificar si el servidor está ejecutándose
check_server() {
    if curl -s http://localhost:2222 > /dev/null; then
        echo -e "${GREEN}✅ Servidor ejecutándose en http://localhost:2222${NC}"
        return 0
    else
        echo -e "${RED}❌ Servidor no disponible${NC}"
        return 1
    fi
}

# Función para ejecutar tests de contenido
run_content_tests() {
    echo -e "${BLUE}🧪 Ejecutando tests de verificación de contenido...${NC}"
    
    if npx playwright test tests/e2e/content-verification.spec.ts --project=chromium --reporter=line; then
        echo -e "${GREEN}✅ Tests de contenido ejecutados exitosamente${NC}"
    else
        echo -e "${RED}❌ Tests de contenido fallaron${NC}"
        return 1
    fi
}

# Función para ejecutar análisis de contenido faltante
run_missing_content_analysis() {
    echo -e "${BLUE}🔍 Ejecutando análisis de contenido faltante...${NC}"
    
    if npx playwright test tests/e2e/missing-content-analysis.spec.ts --project=chromium --reporter=line; then
        echo -e "${GREEN}✅ Análisis de contenido faltante completado${NC}"
    else
        echo -e "${RED}❌ Análisis de contenido faltante falló${NC}"
        return 1
    fi
}

# Función para generar reporte de progreso
generate_progress_report() {
    echo -e "${BLUE}📊 Generando reporte de progreso...${NC}"
    
    # Crear directorio para reportes si no existe
    mkdir -p reports/progress
    
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local report_file="reports/progress/content_integration_${timestamp}.md"
    
    cat > "$report_file" << EOF
# 📊 Reporte de Progreso - Integración de Contenido

**Fecha**: $(date)
**Timestamp**: $timestamp

## 🎯 Estado Actual

### ✅ Funcionalidades Verificadas
- [ ] Sistema de Matches/Encuentros
- [ ] Sistema de Gigs/Trabajos  
- [ ] Sistema de Gossip/Chat
- [ ] Sistema Pilgrim Completo
- [ ] Sistema Merchant Avanzado

### 📊 Métricas de la Aplicación
$(curl -s http://localhost:2222 | grep -o '<title>[^<]*' | sed 's/<title>/Título: /' || echo "Título: No disponible")

### 🔗 Links de Verificación
- [Aplicación Principal](http://localhost:2222)
- [Reporte HTML Playwright](test-results/html-report/index.html)
- [Screenshots](test-results/screenshots/)

---
*Generado automáticamente por monitor-content-integration.sh*
EOF

    echo -e "${GREEN}✅ Reporte generado: $report_file${NC}"
}

# Función para verificar contenido extraído disponible
check_extracted_content() {
    echo -e "${BLUE}📁 Verificando contenido extraído disponible...${NC}"
    
    if [ -d "data/extracted" ]; then
        local count=$(ls -1 data/extracted | wc -l)
        echo -e "${GREEN}✅ $count módulos extraídos encontrados${NC}"
        
        echo "📂 Módulos disponibles:"
        ls -1 data/extracted | sed 's/^/   - /'
    else
        echo -e "${RED}❌ Directorio data/extracted no encontrado${NC}"
        return 1
    fi
}

# Función principal
main() {
    echo "🚀 Iniciando monitoreo de integración..."
    echo ""
    
    # Verificar estructura del proyecto
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ No se encontró package.json. Ejecutar desde la raíz del proyecto.${NC}"
        exit 1
    fi
    
    # Verificar que Playwright esté instalado
    if ! command -v npx > /dev/null; then
        echo -e "${RED}❌ npx no encontrado. Instalar Node.js y npm.${NC}"
        exit 1
    fi
    
    # Ejecutar verificaciones
    check_extracted_content
    echo ""
    
    if check_server; then
        echo ""
        run_content_tests
        echo ""
        run_missing_content_analysis
        echo ""
        generate_progress_report
    else
        echo -e "${YELLOW}⚠️ Servidor no disponible. Iniciando servidor...${NC}"
        echo "💡 Ejecuta en otra terminal: npm run dev"
        echo "💡 Luego ejecuta este script nuevamente"
    fi
    
    echo ""
    echo "================================================================"
    echo -e "${GREEN}✅ Monitoreo completado${NC}"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Revisar reportes en reports/progress/"
    echo "   2. Ver capturas en test-results/screenshots/"
    echo "   3. Consultar reporte detallado: docs/analysis/CONTENIDO_FALTANTE_REPORTE.md"
    echo "   4. Integrar módulos faltantes según prioridades"
}

# Ejecutar script
main "$@" 