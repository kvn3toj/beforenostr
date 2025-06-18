#!/bin/bash

# 📊 SCRIPT DE ANÁLISIS DE COMPLETITUD POR MÓDULO - PROYECTO COOMUNITY
# Evalúa el estado de desarrollo y completitud de cada módulo

echo "📊 ANÁLISIS DE COMPLETITUD POR MÓDULO - COOMUNITY SUPERAPP"
echo "==========================================================="
echo ""

# Verificar ubicación correcta
if [ ! -f "package.json" ] || [ ! -d "Demo/apps/superapp-unified" ]; then
    echo "❌ ERROR: Ejecutar desde la raíz del monorepo"
    exit 1
fi

echo "✅ Ubicación correcta verificada"
echo ""

# Definir módulos a analizar
MODULES=("marketplace" "uplay" "social" "challenges" "wallet" "lets" "ustats")

# Variables para totales
TOTAL_FILES=0
TOTAL_TODOS=0
TOTAL_DISABLED=0
TOTAL_CONSOLE_LOGS=0

echo "🔍 ANÁLISIS DETALLADO POR MÓDULO:"
echo "=================================="

for module in "${MODULES[@]}"; do
    MODULE_PATH="Demo/apps/superapp-unified/src/components/modules/$module/"
    
    if [ -d "$MODULE_PATH" ]; then
        echo ""
        echo "📂 MÓDULO: ${module^^}"
        echo "$(printf '=%.0s' {1..40})"
        
        # Contar archivos .tsx
        FILE_COUNT=$(find "$MODULE_PATH" -name "*.tsx" 2>/dev/null | wc -l)
        echo "  📄 Archivos .tsx: $FILE_COUNT"
        
        # Contar TODOs y FIXME
        TODO_COUNT=$(grep -r "TODO\|FIXME" "$MODULE_PATH" --include="*.tsx" 2>/dev/null | wc -l)
        echo "  ⚠️ TODOs/FIXME: $TODO_COUNT"
        
        # Contar botones deshabilitados
        DISABLED_COUNT=$(grep -r "disabled.*true\|disabled.*{" "$MODULE_PATH" --include="*.tsx" 2>/dev/null | wc -l)
        echo "  🔒 Botones disabled: $DISABLED_COUNT"
        
        # Contar console.log en onClick
        CONSOLE_LOG_COUNT=$(grep -r "onClick.*console\.log" "$MODULE_PATH" --include="*.tsx" 2>/dev/null | wc -l)
        echo "  🚨 onClick con console.log: $CONSOLE_LOG_COUNT"
        
        # Buscar mocks específicos del módulo
        MOCK_COUNT=$(grep -r "mock\|Mock" "$MODULE_PATH" --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
        echo "  🎭 Referencias a mocks: $MOCK_COUNT"
        
        # Calcular puntuación de completitud
        # Fórmula: 100 - (TODOs*2 + DISABLED*1 + CONSOLE_LOGS*3 + MOCKS*1)
        PENALTY=$((TODO_COUNT * 2 + DISABLED_COUNT * 1 + CONSOLE_LOG_COUNT * 3 + MOCK_COUNT * 1))
        COMPLETENESS=$((100 - PENALTY))
        
        # Asegurar que no sea negativo
        if [ $COMPLETENESS -lt 0 ]; then
            COMPLETENESS=0
        fi
        
        # Determinar estado basado en completitud
        if [ $COMPLETENESS -ge 90 ]; then
            STATUS="🟢 EXCELENTE"
        elif [ $COMPLETENESS -ge 75 ]; then
            STATUS="🟡 BUENO"
        elif [ $COMPLETENESS -ge 60 ]; then
            STATUS="🟠 REGULAR"
        else
            STATUS="🔴 NECESITA TRABAJO"
        fi
        
        echo "  📊 Completitud estimada: ${COMPLETENESS}% - $STATUS"
        
        # Mostrar TODOs críticos si existen
        if [ $TODO_COUNT -gt 0 ]; then
            echo "  📝 TODOs críticos encontrados:"
            grep -r "TODO\|FIXME" "$MODULE_PATH" --include="*.tsx" 2>/dev/null | head -3 | while IFS= read -r line; do
                file=$(basename $(echo "$line" | cut -d: -f1))
                line_num=$(echo "$line" | cut -d: -f2)
                echo "     - $file:$line_num"
            done
        fi
        
        # Mostrar console.log críticos si existen
        if [ $CONSOLE_LOG_COUNT -gt 0 ]; then
            echo "  🚨 Botones con console.log detectados:"
            grep -r "onClick.*console\.log" "$MODULE_PATH" --include="*.tsx" 2>/dev/null | while IFS= read -r line; do
                file=$(basename $(echo "$line" | cut -d: -f1))
                line_num=$(echo "$line" | cut -d: -f2)
                echo "     - $file:$line_num"
            done
        fi
        
        # Actualizar totales
        TOTAL_FILES=$((TOTAL_FILES + FILE_COUNT))
        TOTAL_TODOS=$((TOTAL_TODOS + TODO_COUNT))
        TOTAL_DISABLED=$((TOTAL_DISABLED + DISABLED_COUNT))
        TOTAL_CONSOLE_LOGS=$((TOTAL_CONSOLE_LOGS + CONSOLE_LOG_COUNT))
        
    else
        echo ""
        echo "📂 MÓDULO: ${module^^}"
        echo "$(printf '=%.0s' {1..40})"
        echo "  ❌ Directorio no encontrado: $MODULE_PATH"
    fi
done

echo ""
echo ""
echo "📈 RESUMEN GENERAL DEL PROYECTO:"
echo "================================="
echo "  📄 Total de archivos analizados: $TOTAL_FILES"
echo "  ⚠️ Total de TODOs/FIXME: $TOTAL_TODOS"
echo "  🔒 Total de botones disabled: $TOTAL_DISABLED"
echo "  🚨 Total de console.log en botones: $TOTAL_CONSOLE_LOGS"

# Calcular completitud general
GENERAL_PENALTY=$((TOTAL_TODOS * 2 + TOTAL_DISABLED * 1 + TOTAL_CONSOLE_LOGS * 3))
GENERAL_COMPLETENESS=$((100 - (GENERAL_PENALTY / 7)))  # Dividir por número de módulos

if [ $GENERAL_COMPLETENESS -lt 0 ]; then
    GENERAL_COMPLETENESS=0
fi

echo ""
echo "🎯 COMPLETITUD GENERAL DEL PROYECTO: ${GENERAL_COMPLETENESS}%"

if [ $GENERAL_COMPLETENESS -ge 85 ]; then
    echo "🎉 ¡EXCELENTE! El proyecto está muy bien desarrollado"
elif [ $GENERAL_COMPLETENESS -ge 70 ]; then
    echo "👍 BUEN ESTADO - Algunas mejoras necesarias"
elif [ $GENERAL_COMPLETENESS -ge 50 ]; then
    echo "⚠️ ESTADO REGULAR - Requiere atención en varios módulos"
else
    echo "🚨 ACCIÓN URGENTE - Múltiples módulos necesitan trabajo"
fi

echo ""
echo "🎯 PRÓXIMOS PASOS RECOMENDADOS:"
echo "==============================="

if [ $TOTAL_CONSOLE_LOGS -gt 0 ]; then
    echo "  1. 🔥 ALTA PRIORIDAD: Corregir $TOTAL_CONSOLE_LOGS botones con console.log"
fi

if [ $TOTAL_TODOS -gt 10 ]; then
    echo "  2. ⚠️ MEDIA PRIORIDAD: Resolver TODOs críticos (total: $TOTAL_TODOS)"
fi

if [ $TOTAL_DISABLED -gt 20 ]; then
    echo "  3. 📈 BAJA PRIORIDAD: Revisar botones disabled (total: $TOTAL_DISABLED)"
fi

echo "  4. 📋 Ejecutar: ./Demo/scripts/detect-buttons-without-actions.sh para detalles"
echo "  5. 📖 Revisar: Demo/COMPREHENSIVE_CODE_ANALYSIS.md para plan completo"

echo ""
echo "🏁 ANÁLISIS COMPLETADO"
echo "⏰ $(date)"