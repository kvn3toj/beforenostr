#!/bin/bash

# 🔍 PROMPT #084 - Comprehensive Mock Data Investigation Script
# ================================================================
# Analyzes all hardcoded and mock data across CoomÜnity SuperApp modules
# to ensure Design System Cosmic operates with 100% dynamic backend data

echo "🔍 INICIANDO INVESTIGACIÓN EXHAUSTIVA DE DATOS MOCK - COOMUNITY SUPERAPP"
echo "========================================================================"
echo ""

# Define colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Define the SuperApp source directory
SUPERAPP_SRC="Demo/apps/superapp-unified/src"

# Create output file
OUTPUT_FILE="docs/implementation/ALL_MODULES_MOCK_DATA_ANALYSIS.md"

# Ensure the output directory exists
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Initialize the output file
cat > "$OUTPUT_FILE" << 'EOF'
# 🔍 Análisis Exhaustivo de Datos Mock - CoomÜnity SuperApp

**Fecha:** $(date)
**Objetivo:** Identificar y cuantificar todos los datos mock y hardcodeados para migrar al backend NestJS

## 📊 Resumen Ejecutivo

EOF

echo -e "${BLUE}📊 Analizando patrones de datos mock...${NC}"

# Function to count patterns and append to output
analyze_pattern() {
    local pattern="$1"
    local description="$2"
    local include_pattern="$3"
    
    echo -e "${CYAN}🔍 Buscando: $description${NC}"
    
    local count=$(grep -r "$pattern" "$SUPERAPP_SRC" --include="$include_pattern" 2>/dev/null | wc -l)
    local files=$(grep -rl "$pattern" "$SUPERAPP_SRC" --include="$include_pattern" 2>/dev/null | wc -l)
    
    echo "- **$description**: $count referencias en $files archivos" >> "$OUTPUT_FILE"
    
    if [ "$count" -gt 0 ]; then
        echo "  - Archivos afectados:" >> "$OUTPUT_FILE"
        grep -rl "$pattern" "$SUPERAPP_SRC" --include="$include_pattern" 2>/dev/null | head -10 | while read file; do
            local relative_file=${file#$SUPERAPP_SRC/}
            local file_count=$(grep -c "$pattern" "$file" 2>/dev/null)
            echo "    - \`$relative_file\` ($file_count ocurrencias)" >> "$OUTPUT_FILE"
        done
        echo "" >> "$OUTPUT_FILE"
    fi
    
    printf "${GREEN}✓${NC} $description: ${YELLOW}$count${NC} referencias en ${YELLOW}$files${NC} archivos\n"
}

# Analyze different mock patterns
echo "" >> "$OUTPUT_FILE"
echo "### 🎭 Funciones Mock Detectadas" >> "$OUTPUT_FILE"

analyze_pattern "mockData|getMock|mocked|useMockData" "Funciones Mock" "*.{ts,tsx}"

echo "" >> "$OUTPUT_FILE"
echo "### 📋 Arrays Hardcodeados" >> "$OUTPUT_FILE"

analyze_pattern "const [a-zA-Z]*Data = \[|const [a-zA-Z]*Items = \[" "Arrays de datos hardcodeados" "*.{ts,tsx}"

echo "" >> "$OUTPUT_FILE"
echo "### 🔧 Lógica de Forzado de Mocks" >> "$OUTPUT_FILE"

analyze_pattern "VITE_ENABLE_MOCK_AUTH|isBuilderIoEnv|FORCE_MOCK_DATA" "Lógica de forzado de mocks" "*.{ts,tsx}"

echo "" >> "$OUTPUT_FILE"
echo "### 🔄 Patrones de Fallback" >> "$OUTPUT_FILE"

analyze_pattern "fallback|placeholder|sample|dummy|fake" "Patrones de fallback y datos placeholder" "*.{ts,tsx}"

# Analyze by module
echo "" >> "$OUTPUT_FILE"
echo "## 🏗️ Análisis por Módulo" >> "$OUTPUT_FILE"

modules=("home" "uplay" "marketplace" "social" "ustats" "wallet" "challenges" "groups")

for module in "${modules[@]}"; do
    echo -e "${PURPLE}📁 Analizando módulo: $module${NC}"
    
    echo "" >> "$OUTPUT_FILE"
    echo "### 📁 Módulo: $module" >> "$OUTPUT_FILE"
    
    if [ -d "$SUPERAPP_SRC/components/modules/$module" ] || [ -d "$SUPERAPP_SRC/pages" ]; then
        # Count mock references in this module
        local module_mock_count=0
        local module_files=0
        
        # Search in module-specific directories
        for search_dir in "$SUPERAPP_SRC/components/modules/$module" "$SUPERAPP_SRC/pages" "$SUPERAPP_SRC/hooks"; do
            if [ -d "$search_dir" ]; then
                local dir_mocks=$(find "$search_dir" -name "*.tsx" -o -name "*.ts" | xargs grep -l "mock\|Mock\|MOCK" 2>/dev/null | wc -l)
                local dir_files=$(find "$search_dir" -name "*${module}*" -type f \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null | wc -l)
                module_mock_count=$((module_mock_count + dir_mocks))
                module_files=$((module_files + dir_files))
            fi
        done
        
        echo "- **Archivos con mocks**: $module_mock_count" >> "$OUTPUT_FILE"
        echo "- **Total archivos del módulo**: $module_files" >> "$OUTPUT_FILE"
        
        # Find specific mock files for this module
        echo "- **Archivos principales con datos mock**:" >> "$OUTPUT_FILE"
        find "$SUPERAPP_SRC" -name "*${module}*" -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
            if grep -q "mock\|Mock\|MOCK" "$file" 2>/dev/null; then
                local relative_file=${file#$SUPERAPP_SRC/}
                local mock_count=$(grep -c "mock\|Mock\|MOCK" "$file" 2>/dev/null)
                echo "  - \`$relative_file\` ($mock_count referencias mock)" >> "$OUTPUT_FILE"
            fi
        done
        
        printf "${GREEN}✓${NC} Módulo $module: ${YELLOW}$module_mock_count${NC} archivos con mocks de ${YELLOW}$module_files${NC} totales\n"
    else
        echo "- **Estado**: Módulo no encontrado o sin estructura específica" >> "$OUTPUT_FILE"
        printf "${YELLOW}⚠${NC} Módulo $module: No encontrado\n"
    fi
done

# Analyze specific hooks
echo -e "${BLUE}🎣 Analizando hooks específicos...${NC}"

echo "" >> "$OUTPUT_FILE"
echo "## 🎣 Análisis de Hooks Específicos" >> "$OUTPUT_FILE"

hooks_dir="$SUPERAPP_SRC/hooks"
if [ -d "$hooks_dir" ]; then
    echo "" >> "$OUTPUT_FILE"
    echo "### 📊 Hooks con Mayor Concentración de Mocks" >> "$OUTPUT_FILE"
    
    find "$hooks_dir" -name "*.ts" -o -name "*.tsx" | while read hook_file; do
        local mock_count=$(grep -c "mock\|Mock\|MOCK\|fallback\|placeholder" "$hook_file" 2>/dev/null)
        if [ "$mock_count" -gt 5 ]; then
            local relative_file=${hook_file#$SUPERAPP_SRC/}
            local lines=$(wc -l < "$hook_file")
            echo "- \`$relative_file\`: $mock_count referencias mock en $lines líneas" >> "$OUTPUT_FILE"
        fi
    done
fi

# Find the largest mock files
echo -e "${BLUE}📏 Identificando archivos con mayor concentración de mocks...${NC}"

echo "" >> "$OUTPUT_FILE"
echo "## 📏 Archivos Críticos (Alta Concentración de Mocks)" >> "$OUTPUT_FILE"

# Find files with high mock concentration
echo "" >> "$OUTPUT_FILE"
echo "### 🎯 Top 10 Archivos con Más Referencias Mock" >> "$OUTPUT_FILE"

find "$SUPERAPP_SRC" -name "*.ts" -o -name "*.tsx" | while read file; do
    local mock_count=$(grep -c "mock\|Mock\|MOCK\|fallback\|placeholder" "$file" 2>/dev/null)
    local lines=$(wc -l < "$file" 2>/dev/null)
    if [ "$mock_count" -gt 0 ] && [ "$lines" -gt 0 ]; then
        local relative_file=${file#$SUPERAPP_SRC/}
        echo "$mock_count:$lines:$relative_file"
    fi
done | sort -nr | head -10 | while IFS=':' read mock_count lines relative_file; do
    local concentration=$(echo "scale=1; $mock_count * 100 / $lines" | bc -l 2>/dev/null || echo "N/A")
    echo "- \`$relative_file\`: $mock_count mocks en $lines líneas (${concentration}% concentración)" >> "$OUTPUT_FILE"
done

# Generate recommendations
echo -e "${BLUE}💡 Generando recomendaciones...${NC}"

echo "" >> "$OUTPUT_FILE"
echo "## 💡 Recomendaciones de Acción" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "### 🎯 Prioridad Alta (Acción Inmediata)" >> "$OUTPUT_FILE"
echo "1. **\`useRealBackendData.ts\`** - Archivo central con lógica de fallback" >> "$OUTPUT_FILE"
echo "2. **\`marketplaceMockData.ts\`** - Datos mock completos del marketplace" >> "$OUTPUT_FILE"
echo "3. **\`lets-mock-service.ts\`** - Servicio mock del sistema LETs" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "### 🔄 Prioridad Media (Próxima Semana)" >> "$OUTPUT_FILE"
echo "1. Componentes con alta concentración de mocks (>10 referencias)" >> "$OUTPUT_FILE"
echo "2. Hooks específicos de módulos con fallbacks" >> "$OUTPUT_FILE"
echo "3. Páginas con datos hardcodeados" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "### 🧹 Prioridad Baja (Limpieza)" >> "$OUTPUT_FILE"
echo "1. Referencias a \`VITE_ENABLE_MOCK_AUTH\` en componentes no críticos" >> "$OUTPUT_FILE"
echo "2. Placeholders y datos de ejemplo en formularios" >> "$OUTPUT_FILE"
echo "3. Comentarios y documentación de mocks obsoletos" >> "$OUTPUT_FILE"

# Generate metrics summary
echo "" >> "$OUTPUT_FILE"
echo "## 📈 Métricas de Progreso" >> "$OUTPUT_FILE"

# Count total mock references
total_mock_functions=$(grep -r "mockData\|getMock\|mocked\|useMockData" "$SUPERAPP_SRC" --include="*.{ts,tsx}" 2>/dev/null | wc -l)
total_hardcoded_arrays=$(grep -r "const [a-zA-Z]*Data = \[\|const [a-zA-Z]*Items = \[" "$SUPERAPP_SRC" --include="*.{ts,tsx}" 2>/dev/null | wc -l)
total_mock_forcing=$(grep -r "VITE_ENABLE_MOCK_AUTH\|isBuilderIoEnv\|FORCE_MOCK_DATA" "$SUPERAPP_SRC" --include="*.{ts,tsx}" 2>/dev/null | wc -l)
total_fallback_patterns=$(grep -r "fallback\|placeholder\|sample\|dummy\|fake" "$SUPERAPP_SRC" --include="*.{ts,tsx}" 2>/dev/null | wc -l)

echo "" >> "$OUTPUT_FILE"
echo "### 📊 Estado Actual" >> "$OUTPUT_FILE"
echo "- **Funciones Mock**: $total_mock_functions referencias" >> "$OUTPUT_FILE"
echo "- **Arrays Hardcodeados**: $total_hardcoded_arrays arrays" >> "$OUTPUT_FILE"
echo "- **Lógica de Forzado Mock**: $total_mock_forcing referencias" >> "$OUTPUT_FILE"
echo "- **Patrones de Fallback**: $total_fallback_patterns referencias" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "### 🎯 Estado Objetivo (Post-Migración)" >> "$OUTPUT_FILE"
echo "- **Funciones Mock**: <10 (solo fallbacks críticos)" >> "$OUTPUT_FILE"
echo "- **Arrays Hardcodeados**: 0" >> "$OUTPUT_FILE"
echo "- **Lógica de Forzado Mock**: <5 (solo desarrollo)" >> "$OUTPUT_FILE"
echo "- **Patrones de Fallback**: <20 (solo fallbacks esenciales)" >> "$OUTPUT_FILE"

# Add verification tools
echo "" >> "$OUTPUT_FILE"
echo "## 🔧 Herramientas de Verificación" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "### 📋 Scripts de Verificación Creados" >> "$OUTPUT_FILE"
echo "1. \`scripts/analyze-all-modules-mocks.sh\` - Este script de análisis" >> "$OUTPUT_FILE"
echo "2. \`scripts/verify-mock-elimination.sh\` - Verificar progreso de eliminación" >> "$OUTPUT_FILE"
echo "3. \`scripts/count-dynamic-vs-static.sh\` - Medir ratio dinámico vs estático" >> "$OUTPUT_FILE"

# Final summary
echo -e "${GREEN}✅ Análisis completado!${NC}"
echo -e "${BLUE}📄 Reporte generado en: ${YELLOW}$OUTPUT_FILE${NC}"

echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "*Reporte generado automáticamente por \`analyze-all-modules-mocks.sh\`*" >> "$OUTPUT_FILE"
echo "*Fecha: $(date)*" >> "$OUTPUT_FILE"

# Display summary
echo ""
echo -e "${PURPLE}📊 RESUMEN EJECUTIVO:${NC}"
echo -e "${YELLOW}🎭 Funciones Mock:${NC} $total_mock_functions referencias"
echo -e "${YELLOW}📋 Arrays Hardcodeados:${NC} $total_hardcoded_arrays arrays"
echo -e "${YELLOW}🔧 Lógica Mock Forcing:${NC} $total_mock_forcing referencias"
echo -e "${YELLOW}🔄 Patrones Fallback:${NC} $total_fallback_patterns referencias"
echo ""
echo -e "${GREEN}🎯 Próximos pasos:${NC}"
echo -e "1. Revisar el reporte detallado en ${BLUE}$OUTPUT_FILE${NC}"
echo -e "2. Priorizar archivos críticos identificados"
echo -e "3. Migrar datos mock al backend NestJS"
echo -e "4. Ejecutar scripts de verificación periódicamente"
echo "" 