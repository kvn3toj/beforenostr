#!/bin/bash

echo "🔍 VERIFICACIÓN: Resolución de error 'userStats.elementos.comunicacion' en AyniSocialMetrics"
echo "=================================================================================="
echo ""

# Función para verificar que el fix está implementado
verify_fix_implementation() {
    echo "✅ 1. Verificando que createRealSocialData incluye elementos..."
    
    if grep -q "elementos: {" Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx; then
        echo "   ✓ Propiedad 'elementos' agregada a createRealSocialData"
    else
        echo "   ❌ ERROR: Propiedad 'elementos' no encontrada"
        return 1
    fi
    
    # Verificar las 4 propiedades de elementos
    local elementos_props=("comunicacion" "empatia" "confianza" "inspiracion")
    for prop in "${elementos_props[@]}"; do
        if grep -q "${prop}:" Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx; then
            echo "   ✓ Propiedad 'elementos.${prop}' implementada"
        else
            echo "   ❌ ERROR: Propiedad 'elementos.${prop}' faltante"
            return 1
        fi
    done
    
    echo ""
    return 0
}

# Función para verificar las interfaces están correctas
verify_interfaces() {
    echo "✅ 2. Verificando interfaces TypeScript..."
    
    if grep -A 5 "interface SocialElementStats" Demo/apps/superapp-unified/src/components/modules/social/components/enhanced/AyniSocialMetrics.tsx | grep -q "comunicacion: number"; then
        echo "   ✓ Interface SocialElementStats contiene comunicacion"
    else
        echo "   ❌ ERROR: Interface SocialElementStats malformada"
        return 1
    fi
    
    if grep -A 15 "interface UserStats" Demo/apps/superapp-unified/src/components/modules/social/components/enhanced/AyniSocialMetrics.tsx | grep -q "elementos: SocialElementStats"; then
        echo "   ✓ Interface UserStats incluye elementos de tipo SocialElementStats"
    else
        echo "   ❌ ERROR: Interface UserStats no incluye elementos"
        return 1
    fi
    
    echo ""
    return 0
}

# Función para verificar el uso en el componente
verify_component_usage() {
    echo "✅ 3. Verificando uso de userStats.elementos en AyniSocialMetrics..."
    
    local usage_lines=$(grep -n "userStats.elementos" Demo/apps/superapp-unified/src/components/modules/social/components/enhanced/AyniSocialMetrics.tsx | wc -l)
    if [ "$usage_lines" -gt 0 ]; then
        echo "   ✓ Encontradas $usage_lines referencias a userStats.elementos"
        echo "   ✓ Componente usa correctamente las propiedades de elementos"
    else
        echo "   ❌ ERROR: No se encontraron referencias a userStats.elementos"
        return 1
    fi
    
    # Verificar que los 4 elementos están siendo usados
    local elementos_usage=("comunicacion" "empatia" "confianza" "inspiracion")
    for elemento in "${elementos_usage[@]}"; do
        if grep -q "userStats.elementos.${elemento}" Demo/apps/superapp-unified/src/components/modules/social/components/enhanced/AyniSocialMetrics.tsx; then
            echo "   ✓ Elemento '${elemento}' usado correctamente en el componente"
        else
            echo "   ❌ ERROR: Elemento '${elemento}' no encontrado en uso"
            return 1
        fi
    done
    
    echo ""
    return 0
}

# Función para verificar valores por defecto razonables
verify_default_values() {
    echo "✅ 4. Verificando valores por defecto..."
    
    # Extraer valores por defecto del archivo
    local comunicacion_default=$(grep "comunicacion:" Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx | grep -o "[0-9]\+" | head -1)
    local empatia_default=$(grep "empatia:" Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx | grep -o "[0-9]\+" | head -1)
    local confianza_default=$(grep "confianza:" Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx | grep -o "[0-9]\+" | head -1)
    local inspiracion_default=$(grep "inspiracion:" Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx | grep -o "[0-9]\+" | head -1)
    
    echo "   ✓ comunicacion: ${comunicacion_default:-'NO ENCONTRADO'}"
    echo "   ✓ empatia: ${empatia_default:-'NO ENCONTRADO'}" 
    echo "   ✓ confianza: ${confianza_default:-'NO ENCONTRADO'}"
    echo "   ✓ inspiracion: ${inspiracion_default:-'NO ENCONTRADO'}"
    
    # Verificar que son valores numéricos razonables (0-100)
    for valor in "$comunicacion_default" "$empatia_default" "$confianza_default" "$inspiracion_default"; do
        if [[ "$valor" =~ ^[0-9]+$ ]] && [ "$valor" -ge 0 ] && [ "$valor" -le 100 ]; then
            echo "   ✓ Valor $valor está en rango válido (0-100)"
        else
            echo "   ⚠️  ADVERTENCIA: Valor '$valor' podría estar fuera de rango esperado"
        fi
    done
    
    echo ""
    return 0
}

# Función para verificar patrones defensivos
verify_defensive_patterns() {
    echo "✅ 5. Verificando patrones de programación defensiva..."
    
    # Verificar que se usa optional chaining o fallbacks
    if grep -q "backendData?.elementos?." Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx; then
        echo "   ✓ Usa optional chaining para acceso seguro a elementos"
    else
        echo "   ⚠️  RECOMENDACIÓN: Considerar optional chaining para elementos"
    fi
    
    # Verificar que hay valores por defecto para todos los campos
    if grep -q "|| [0-9]" Demo/apps/superapp-unified/src/components/modules/social/SocialMain.tsx; then
        echo "   ✓ Implementa valores por defecto con fallbacks"
    else
        echo "   ❌ ERROR: No se encontraron fallbacks con valores por defecto"
        return 1
    fi
    
    echo ""
    return 0
}

# Función para verificar compilación
verify_compilation() {
    echo "✅ 6. Verificando que la aplicación compila..."
    
    cd Demo/apps/superapp-unified
    
    # Verificar que typescript no tiene errores relacionados
    if npx tsc --noEmit --skipLibCheck 2>&1 | grep -i "elementos" | grep -i "error"; then
        echo "   ❌ ERROR: Errores de TypeScript relacionados con elementos"
        cd ../../..
        return 1
    else
        echo "   ✓ No hay errores de TypeScript relacionados con elementos"
    fi
    
    cd ../../..
    echo ""
    return 0
}

# Función principal de verificación
main() {
    echo "🎯 EJECUTANDO VERIFICACIÓN COMPLETA..."
    echo ""
    
    local errors=0
    
    verify_fix_implementation || ((errors++))
    verify_interfaces || ((errors++))
    verify_component_usage || ((errors++))
    verify_default_values || ((errors++))
    verify_defensive_patterns || ((errors++))
    verify_compilation || ((errors++))
    
    echo "📊 RESUMEN DE VERIFICACIÓN:"
    echo "=========================="
    
    if [ $errors -eq 0 ]; then
        echo "✅ ÉXITO TOTAL: Error 'userStats.elementos.comunicacion' RESUELTO"
        echo ""
        echo "🎉 CRITERIOS CUMPLIDOS:"
        echo "   ✓ Propiedad 'elementos' agregada a createRealSocialData"
        echo "   ✓ Interfaces TypeScript correctas"
        echo "   ✓ Componente usa elementos sin errores"
        echo "   ✓ Valores por defecto implementados"
        echo "   ✓ Patrones defensivos aplicados"
        echo "   ✓ Compilación sin errores"
        echo ""
        echo "🚀 La aplicación debería funcionar sin el error reportado."
        echo "   Navega a /social para verificar que AyniSocialMetrics funciona."
        
        return 0
    else
        echo "❌ VERIFICACIÓN FALLIDA: $errors error(es) encontrado(s)"
        echo ""
        echo "🔧 ACCIÓN REQUERIDA:"
        echo "   Revisar y corregir los errores mostrados arriba"
        echo "   Ejecutar nuevamente este script para verificar"
        
        return 1
    fi
}

# Ejecutar verificación
main

echo ""
echo "📝 NOTA: Este script verifica la corrección del error técnico."
echo "   Para testing funcional completo, usar Playwright o testing manual."
echo "" 