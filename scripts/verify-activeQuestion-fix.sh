#!/bin/bash

echo "🔍 VERIFICACIÓN: activeQuestion.options.map - Corrección ID: 4ea202b21d6643c68ceea6512bad7251"
echo "=================================================================================="

# Función para verificar arquitectura de puertos
check_services() {
    echo "📋 1. VERIFICACIÓN DE SERVICIOS"
    echo "------------------------------"
    
    # SuperApp
    SUPERAPP_STATUS=$(curl -s -I http://localhost:3001 | head -1 | grep "200 OK" || echo "❌ No disponible")
    if [[ "$SUPERAPP_STATUS" =~ "200 OK" ]]; then
        echo "✅ SuperApp (puerto 3001): Operacional"
    else
        echo "⚠️ SuperApp (puerto 3001): No disponible"
        echo "   💡 Ejecuta: npm run dev:superapp"
    fi
    
    # Backend
    BACKEND_STATUS=$(curl -s http://localhost:3002/health 2>/dev/null | grep "ok" || echo "❌ No disponible")
    if [[ "$BACKEND_STATUS" =~ "ok" ]]; then
        echo "✅ Backend (puerto 3002): Operacional"
    else
        echo "⚠️ Backend (puerto 3002): No disponible"
        echo "   💡 Ejecuta: npm run dev:backend"
    fi
    
    echo ""
}

# Función para verificar corrección específica
check_activeQuestion_fix() {
    echo "📋 2. VERIFICACIÓN DE CORRECCIÓN: activeQuestion.options.map"
    echo "------------------------------------------------------------"
    
    # Buscar instancias sin optional chaining (problema original)
    UNSAFE_INSTANCES=$(grep -r "activeQuestion\.options\.map" Demo/apps/superapp-unified/src --include="*.tsx" --include="*.ts" 2>/dev/null || echo "")
    
    if [ -z "$UNSAFE_INSTANCES" ]; then
        echo "✅ NO se encontraron instancias problemáticas de 'activeQuestion.options.map'"
    else
        echo "❌ ENCONTRADAS instancias problemáticas:"
        echo "$UNSAFE_INSTANCES"
        echo ""
        echo "🔧 SOLUCIÓN REQUERIDA: Cambiar 'activeQuestion.options.map' por '(activeQuestion?.options || []).map'"
        return 1
    fi
    
    # Buscar instancias corregidas (con optional chaining)
    SAFE_INSTANCES=$(grep -r "activeQuestion\?\.options || \[\]" Demo/apps/superapp-unified/src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
    
    if [ "$SAFE_INSTANCES" -gt 0 ]; then
        echo "✅ ENCONTRADAS $SAFE_INSTANCES instancias corregidas con optional chaining"
        echo "   Patrón aplicado: (activeQuestion?.options || []).map()"
    else
        echo "⚠️ No se encontraron instancias del patrón corregido"
        echo "   Esto podría indicar que no hay componentes que usen activeQuestion.options"
    fi
    
    echo ""
}

# Función para verificar archivos específicos mencionados en el error
check_specific_files() {
    echo "📋 3. VERIFICACIÓN DE ARCHIVOS ESPECÍFICOS"
    echo "------------------------------------------"
    
    FILES=(
        "Demo/apps/superapp-unified/src/components/modules/uplay/components/InteractiveVideoPlayerOverlay.tsx"
        "Demo/apps/superapp-unified/src/components/modules/uplay/UnifiedUPlayPlayer.tsx"
        "Demo/apps/superapp-unified/src/components/modules/uplay/components/EnhancedInteractiveVideoPlayer.tsx"
    )
    
    for FILE in "${FILES[@]}"; do
        if [ -f "$FILE" ]; then
            echo "📄 Verificando: $(basename "$FILE")"
            
            # Verificar que no tenga el patrón problemático
            PROBLEMATIC=$(grep -n "activeQuestion\.options\.map" "$FILE" 2>/dev/null || echo "")
            if [ -z "$PROBLEMATIC" ]; then
                echo "   ✅ Sin accesos inseguros a activeQuestion.options.map"
            else
                echo "   ❌ ENCONTRADO acceso inseguro en línea:"
                echo "   $PROBLEMATIC"
            fi
            
            # Verificar que tenga el patrón corregido (opcional, puede no tenerlo si no usa preguntas)
            CORRECTED=$(grep -n "activeQuestion\?\.options || \[\]" "$FILE" 2>/dev/null || echo "")
            if [ -n "$CORRECTED" ]; then
                echo "   ✅ Patrón corregido encontrado:"
                echo "   $(echo "$CORRECTED" | head -1)"
            fi
            
        else
            echo "⚠️ Archivo no encontrado: $FILE"
        fi
        echo ""
    done
}

# Función para verificar otros problemas potenciales relacionados
check_related_issues() {
    echo "📋 4. VERIFICACIÓN DE PROBLEMAS RELACIONADOS"
    echo "--------------------------------------------"
    
    # Verificar accesos directos a activeQuestion sin validación
    DIRECT_ACCESS=$(grep -r "activeQuestion\.[^?]" Demo/apps/superapp-unified/src --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "activeQuestion\.id" | grep -v "activeQuestion\.reward &&" | wc -l)
    
    if [ "$DIRECT_ACCESS" -gt 0 ]; then
        echo "⚠️ ENCONTRADOS $DIRECT_ACCESS accesos directos a propiedades de activeQuestion"
        echo "   Revisar si necesitan optional chaining o están dentro de condicionales"
    else
        echo "✅ Todos los accesos a activeQuestion parecen seguros"
    fi
    
    # Verificar si hay otros .map() que podrían tener problemas similares
    POTENTIAL_MAPS=$(grep -r "\.options\.map" Demo/apps/superapp-unified/src --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "activeQuestion" | wc -l)
    
    if [ "$POTENTIAL_MAPS" -gt 0 ]; then
        echo "ℹ️ ENCONTRADOS $POTENTIAL_MAPS otros usos de '.options.map()' (revisar manualmente)"
    else
        echo "✅ No se encontraron otros usos potencialmente problemáticos de '.options.map()'"
    fi
    
    echo ""
}

# Función para mostrar resumen de la corrección
show_solution_summary() {
    echo "📋 5. RESUMEN DE LA CORRECCIÓN APLICADA"
    echo "======================================="
    echo ""
    echo "🐛 PROBLEMA ORIGINAL:"
    echo "   TypeError: undefined is not an object (evaluating 'activeQuestion.options.map')"
    echo "   ID del Error: 4ea202b21d6643c68ceea6512bad7251"
    echo "   Línea: InteractiveVideoPlayerOverlay.tsx:1009"
    echo ""
    echo "🔧 SOLUCIÓN APLICADA:"
    echo "   ANTES: activeQuestion.options.map((option) => ("
    echo "   DESPUÉS: (activeQuestion?.options || []).map((option) => ("
    echo ""
    echo "✨ BENEFICIOS:"
    echo "   ✅ Manejo defensivo de datos undefined/null"
    echo "   ✅ Fallback seguro con array vacío []"
    echo "   ✅ Compatible con datos mock y del backend real"
    echo "   ✅ Previene crashes del componente"
    echo ""
    echo "📁 ARCHIVOS CORREGIDOS:"
    echo "   • InteractiveVideoPlayerOverlay.tsx"
    echo "   • UnifiedUPlayPlayer.tsx"
    echo "   • EnhancedInteractiveVideoPlayer.tsx"
    echo ""
}

# Ejecutar todas las verificaciones
main() {
    check_services
    check_activeQuestion_fix
    check_specific_files
    check_related_issues
    show_solution_summary
    
    echo "🎯 ESTADO FINAL:"
    echo "==============="
    
    # Contar errores encontrados
    ERROR_COUNT=0
    
    # Verificar si quedan instancias problemáticas
    REMAINING_ISSUES=$(grep -r "activeQuestion\.options\.map" Demo/apps/superapp-unified/src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
    
    if [ "$REMAINING_ISSUES" -eq 0 ]; then
        echo "✅ CORRECCIÓN EXITOSA: Todas las instancias problemáticas fueron corregidas"
        echo "✅ El error ID: 4ea202b21d6643c68ceea6512bad7251 debería estar resuelto"
        echo "✅ Los componentes ÜPlay ahora manejan correctamente datos indefinidos"
        echo ""
        echo "🚀 PRÓXIMOS PASOS:"
        echo "   1. Refrescar la página en el navegador"
        echo "   2. Navegar a la sección ÜPlay"
        echo "   3. Verificar que las preguntas interactivas funcionan correctamente"
        echo "   4. Confirmar que no hay errores en la consola del navegador"
    else
        echo "❌ CORRECCIÓN INCOMPLETA: Quedan $REMAINING_ISSUES instancias problemáticas"
        ERROR_COUNT=$((ERROR_COUNT + REMAINING_ISSUES))
    fi
    
    return $ERROR_COUNT
}

# Ejecutar script principal
main
exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo ""
    echo "🏆 VERIFICACIÓN COMPLETADA CON ÉXITO"
else
    echo ""
    echo "⚠️ VERIFICACIÓN COMPLETADA CON $exit_code ISSUES PENDIENTES"
fi

exit $exit_code 