#!/bin/bash
echo "🔍 ANÁLISIS DE DATOS MOCK QUE BLOQUEAN VISUALIZACIÓN DE CAMBIOS - SUPERAPP COOMUNITY"
echo "=============================================================================="
echo ""

# Directorio de la SuperApp
SUPERAPP_DIR="Demo/apps/superapp-unified/src"

# Función para analizar archivos mock
analyze_mock_files() {
    local module_name=$1
    local search_path=$2
    
    echo "📂 MÓDULO: $module_name"
    echo "   Ruta: $search_path"
    echo ""
    
    # Buscar archivos con contenido mock
    mock_files=$(find "$search_path" -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "mock\|Mock\|MOCK\|hardcoded\|fallback" 2>/dev/null)
    
    if [ -n "$mock_files" ]; then
        echo "   ⚠️  ARCHIVOS CON DATOS MOCK DETECTADOS:"
        for file in $mock_files; do
            echo "      📄 $(basename $file)"
            # Contar líneas con mock
            mock_lines=$(grep -c "mock\|Mock\|MOCK\|hardcoded\|fallback" "$file" 2>/dev/null || echo "0")
            echo "         Líneas mock: $mock_lines"
            
            # Mostrar algunos patrones específicos
            if grep -q "getMockQuestions\|useMockData\|simulateData" "$file" 2>/dev/null; then
                echo "         🚨 PATRÓN CRÍTICO: Funciones mock de datos"
            fi
            if grep -q "mockCategories\|MOCK_ROOMS\|mockQuestions" "$file" 2>/dev/null; then
                echo "         🚨 PATRÓN CRÍTICO: Variables mock constantes"
            fi
            if grep -q "fallbackData\|VITE_ENABLE_MOCK" "$file" 2>/dev/null; then
                echo "         🚨 PATRÓN CRÍTICO: Lógica de bypass"
            fi
        done
        echo ""
    else
        echo "   ✅ Sin archivos mock detectados"
        echo ""
    fi
}

echo "🎯 ANÁLISIS POR MÓDULO PRINCIPAL:"
echo ""

# Analizar cada módulo
analyze_mock_files "ÜPLAY" "$SUPERAPP_DIR/components/modules/uplay"
analyze_mock_files "MARKETPLACE" "$SUPERAPP_DIR/components/modules/marketplace" 
analyze_mock_files "LETS" "$SUPERAPP_DIR/components/modules/lets"
analyze_mock_files "SOCIAL" "$SUPERAPP_DIR/components/modules/social"
analyze_mock_files "USTATS" "$SUPERAPP_DIR/components/modules/ustats"
analyze_mock_files "CHALLENGES" "$SUPERAPP_DIR/components/modules/challenges"
analyze_mock_files "WALLET" "$SUPERAPP_DIR/components/modules/wallet"

echo "🔧 ANÁLISIS DE ARCHIVOS DE DATOS Y SERVICIOS:"
echo ""
analyze_mock_files "DATA FILES" "$SUPERAPP_DIR/data"
analyze_mock_files "SERVICES" "$SUPERAPP_DIR/services"
analyze_mock_files "HOOKS" "$SUPERAPP_DIR/hooks"
analyze_mock_files "STORES" "$SUPERAPP_DIR/stores"
analyze_mock_files "LIB" "$SUPERAPP_DIR/lib"

echo "📋 PÁGINAS CON DATOS MOCK:"
echo ""
analyze_mock_files "PAGES" "$SUPERAPP_DIR/pages"

echo ""
echo "🎯 RESUMEN DE ARCHIVOS CRÍTICOS IDENTIFICADOS:"
echo "=============================================="

# Buscar archivos específicos problemáticos
echo ""
echo "📄 ARCHIVOS DE DATOS MOCK PRINCIPALES:"
find $SUPERAPP_DIR -name "*mock*" -type f 2>/dev/null | while read file; do
    echo "   🔸 $(basename $file) -> $file"
done

echo ""
echo "📄 ARCHIVOS CON PATRONES CRÍTICOS:"
grep -r "marketplaceMockData\|letsMockService\|MOCK_ROOMS\|getMockQuestions" $SUPERAPP_DIR --include="*.ts" --include="*.tsx" -l 2>/dev/null | while read file; do
    echo "   🚨 $(basename $file) -> $file"
done

echo ""
echo "🔍 ANÁLISIS COMPLETADO - BACKGROUND AGENT PUEDE PROCESAR ESTOS RESULTADOS" 