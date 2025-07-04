#!/bin/bash

# 🔍 SCRIPT DE DETECCIÓN DE BOTONES SIN ACCIONES REALES - PROYECTO COOMUNITY
# Detecta sistemáticamente botones con acciones vacías o placeholder

echo "🔍 DETECTANDO BOTONES SIN ACCIONES REALES EN COOMUNITY SUPERAPP"
echo "================================================================="
echo ""

# Verificar ubicación correcta
if [ ! -f "package.json" ] || [ ! -d "Demo/apps/superapp-unified" ]; then
    echo "❌ ERROR: Ejecutar desde la raíz del monorepo"
    exit 1
fi

echo "✅ Ubicación correcta verificada"
echo ""

# 1. Buscar console.log en onClick
echo "🚨 BOTONES CON CONSOLE.LOG (CRÍTICOS):"
echo "=====================================+"
CONSOLE_LOG_BUTTONS=$(grep -r "onClick.*console\.log" Demo/apps/superapp-unified/src/ --include="*.tsx" 2>/dev/null || true)
if [ ! -z "$CONSOLE_LOG_BUTTONS" ]; then
    echo "$CONSOLE_LOG_BUTTONS" | while IFS= read -r line; do
        file=$(echo "$line" | cut -d: -f1)
        line_num=$(echo "$line" | cut -d: -f2)
        content=$(echo "$line" | cut -d: -f3-)
        echo "  📍 $file:$line_num"
        echo "     🔧 ACCIÓN: $content"
        echo ""
    done
else
    echo "  ✅ No se encontraron botones con console.log"
fi

echo ""

# 2. Buscar onClick vacíos
echo "⚠️ BOTONES CON ONCLICK VACÍOS:"
echo "==============================="
EMPTY_ONCLICK=$(grep -r "onClick.*{.*}" Demo/apps/superapp-unified/src/ --include="*.tsx" 2>/dev/null | grep -E "\{\s*\}" || true)
if [ ! -z "$EMPTY_ONCLICK" ]; then
    echo "$EMPTY_ONCLICK" | while IFS= read -r line; do
        file=$(echo "$line" | cut -d: -f1)
        line_num=$(echo "$line" | cut -d: -f2)
        echo "  📍 $file:$line_num"
        echo "     🔧 REQUERIDO: Implementar acción real"
        echo ""
    done
else
    echo "  ✅ No se encontraron onClick vacíos"
fi

echo ""

# 3. Buscar botones disabled sin implementación
echo "🔒 BOTONES PERMANENTEMENTE DESHABILITADOS:"
echo "==========================================="
DISABLED_BUTTONS=$(grep -r "disabled.*=.*true" Demo/apps/superapp-unified/src/ --include="*.tsx" -A 2 -B 2 2>/dev/null || true)
if [ ! -z "$DISABLED_BUTTONS" ]; then
    echo "$DISABLED_BUTTONS" | head -20
    echo ""
    echo "  ℹ️ Revisar si estos botones necesitan implementación"
else
    echo "  ✅ No se encontraron botones permanentemente deshabilitados"
fi

echo ""

# 4. Buscar TODOs relacionados con botones
echo "📝 TODOs RELACIONADOS CON BOTONES:"
echo "=================================="
TODO_BUTTONS=$(grep -r -i -A 2 -B 2 "TODO.*button\|button.*TODO\|TODO.*click\|click.*TODO" Demo/apps/superapp-unified/src/ --include="*.tsx" 2>/dev/null || true)
if [ ! -z "$TODO_BUTTONS" ]; then
    echo "$TODO_BUTTONS" | head -30
    echo ""
    echo "  ⚠️ TODOs encontrados relacionados con botones"
else
    echo "  ✅ No se encontraron TODOs relacionados con botones"
fi

echo ""

# 5. Buscar undefined en onClick
echo "❌ BOTONES CON ONCLICK UNDEFINED:"
echo "=================================="
UNDEFINED_ONCLICK=$(grep -r "onClick.*undefined\|onClick.*null" Demo/apps/superapp-unified/src/ --include="*.tsx" 2>/dev/null || true)
if [ ! -z "$UNDEFINED_ONCLICK" ]; then
    echo "$UNDEFINED_ONCLICK"
else
    echo "  ✅ No se encontraron onClick undefined/null"
fi

echo ""

# 6. Resumen y estadísticas
echo "📊 RESUMEN DE DETECCIÓN:"
echo "========================"

CONSOLE_COUNT=$(grep -r "onClick.*console\.log" Demo/apps/superapp-unified/src/ --include="*.tsx" 2>/dev/null | wc -l || echo "0")
EMPTY_COUNT=$(grep -r "onClick.*{.*}" Demo/apps/superapp-unified/src/ --include="*.tsx" 2>/dev/null | grep -E "\{\s*\}" | wc -l || echo "0")
TODO_COUNT=$(grep -r -i "TODO.*button\|button.*TODO" Demo/apps/superapp-unified/src/ --include="*.tsx" 2>/dev/null | wc -l || echo "0")
DISABLED_COUNT=$(grep -r "disabled.*=.*true" Demo/apps/superapp-unified/src/ --include="*.tsx" 2>/dev/null | wc -l || echo "0")

echo "  🚨 Botones con console.log: $CONSOLE_COUNT"
echo "  ⚠️ onClick vacíos: $EMPTY_COUNT"
echo "  📝 TODOs de botones: $TODO_COUNT"
echo "  🔒 Botones disabled: $DISABLED_COUNT"

TOTAL_ISSUES=$((CONSOLE_COUNT + EMPTY_COUNT + TODO_COUNT))
echo ""
echo "  🎯 TOTAL DE PROBLEMAS DETECTADOS: $TOTAL_ISSUES"

if [ $TOTAL_ISSUES -eq 0 ]; then
    echo "  🎉 ¡EXCELENTE! No se detectaron botones sin acciones"
else
    echo "  ⚡ ACCIÓN REQUERIDA: Revisar y corregir botones detectados"
fi

echo ""
echo "🏁 DETECCIÓN COMPLETADA"
echo "📝 Para más detalles ver: Demo/COMPREHENSIVE_CODE_ANALYSIS.md"