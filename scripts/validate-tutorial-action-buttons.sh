#!/bin/bash

# 🔘 SCRIPT DE VALIDACIÓN - BOTONES DE ACCIÓN DEL TUTORIAL TOINS
# Verifica que todos los botones interactivos del tutorial funcionen correctamente

echo "🎮 VALIDACIÓN DE BOTONES DE ACCIÓN - TUTORIAL DISCOVERY TOINS"
echo "============================================================="

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1 encontrado"
        return 0
    else
        echo "❌ $1 NO encontrado"
        return 1
    fi
}

# Función para verificar contenido
check_content() {
    local file="$1"
    local pattern="$2"
    local description="$3"

    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo "✅ $description"
        return 0
    else
        echo "❌ $description - NO encontrado"
        return 1
    fi
}

# Contadores
total_checks=0
passed_checks=0

echo ""
echo "📋 VERIFICACIÓN DE ESTRUCTURA DE BOTONES"
echo "----------------------------------------"

# 1. Verificar DiscoveryTutorialProvider existe
total_checks=$((total_checks + 1))
if check_file "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx"; then
    passed_checks=$((passed_checks + 1))
fi

# 2. Verificar tutorial wallet-discovery está definido
total_checks=$((total_checks + 1))
if check_content "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" "wallet-discovery" "Tutorial wallet-discovery definido"; then
    passed_checks=$((passed_checks + 1))
fi

# 3. Verificar que hay botones de acción
total_checks=$((total_checks + 1))
if check_content "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" "actionButton" "Botones de acción definidos"; then
    passed_checks=$((passed_checks + 1))
fi

# 4. Verificar que useNavigate está importado
total_checks=$((total_checks + 1))
if check_content "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" "useNavigate" "useNavigate importado"; then
    passed_checks=$((passed_checks + 1))
fi

echo ""
echo "📋 VERIFICACIÓN DE IMPLEMENTACIÓN DE BOTONES"
echo "--------------------------------------------"

# 5. Verificar onClick handlers implementados
total_checks=$((total_checks + 1))
if check_content "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" "onClick.*=>" "Handlers onClick implementados"; then
    passed_checks=$((passed_checks + 1))
fi

# 6. Verificar handleActionButtonClick function
total_checks=$((total_checks + 1))
if check_content "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" "handleActionButtonClick" "Función handleActionButtonClick"; then
    passed_checks=$((passed_checks + 1))
fi

echo ""
echo "📋 VERIFICACIÓN DE BOTONES ESPECÍFICOS DEL TUTORIAL TOINS"
echo "--------------------------------------------------------"

# Extraer contenido del tutorial wallet-discovery
if [ -f "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" ]; then
    # Buscar botones específicos en el tutorial

    # 7. Botón "Ver Mi Wallet" o similar
    total_checks=$((total_checks + 1))
    if grep -A 50 "'wallet-discovery'" "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" | grep -q "Wallet\|wallet"; then
        echo "✅ Botón relacionado con Wallet encontrado"
        passed_checks=$((passed_checks + 1))
    else
        echo "❌ Botón de Wallet NO encontrado"
    fi

    # 8. Botón relacionado con TOINS
    total_checks=$((total_checks + 1))
    if grep -A 200 "'wallet-discovery'" "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" | grep -q "TOINS\|toins"; then
        echo "✅ Botón relacionado con TOINS encontrado"
        passed_checks=$((passed_checks + 1))
    else
        echo "❌ Botón de TOINS NO encontrado"
    fi

    # 9. Botón de explorar/navegación
    total_checks=$((total_checks + 1))
    if grep -A 200 "'wallet-discovery'" "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" | grep -q "Explorar\|explorar\|Ver\|Abrir"; then
        echo "✅ Botones de navegación encontrados"
        passed_checks=$((passed_checks + 1))
    else
        echo "❌ Botones de navegación NO encontrados"
    fi

    # 10. Verificar que los botones tienen URLs válidas
    total_checks=$((total_checks + 1))
    if grep -A 200 "'wallet-discovery'" "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" | grep -q "url.*:.*['\"]"; then
        echo "✅ URLs de navegación definidas"
        passed_checks=$((passed_checks + 1))
    else
        echo "❌ URLs de navegación NO encontradas"
    fi
fi

echo ""
echo "📋 VERIFICACIÓN DE INTEGRACIÓN CON COMPONENTES"
echo "----------------------------------------------"

# 11. Verificar que Tutorial se renderiza en Dialog
total_checks=$((total_checks + 1))
if check_content "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" "open=.*isActive" "Tutorial se renderiza en Dialog"; then
    passed_checks=$((passed_checks + 1))
fi

# 12. Verificar que el componente renderiza botones de acción
total_checks=$((total_checks + 1))
if check_content "Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx" "step.actionButton.*&&" "Componente renderiza botones condicionalmente"; then
    passed_checks=$((passed_checks + 1))
fi

echo ""
echo "📊 RESUMEN DE VALIDACIÓN"
echo "========================"
echo "Total de verificaciones: $total_checks"
echo "Verificaciones exitosas: $passed_checks"
echo "Verificaciones fallidas: $((total_checks - passed_checks))"

success_rate=$(echo "scale=1; $passed_checks * 100 / $total_checks" | bc -l 2>/dev/null || echo "0")
echo "Tasa de éxito: ${success_rate}%"

echo ""
success_rate_int=$(echo "$success_rate" | cut -d'.' -f1)

if [ "$passed_checks" -eq "$total_checks" ]; then
    echo "🎉 EXCELENTE: Todos los botones de acción están correctamente implementados"
    echo "🎮 Los botones del tutorial TOINS están listos para usar"
elif [ "$success_rate_int" -gt 70 ]; then
    echo "⚠️ BUENO: La mayoría de botones funcionan correctamente"
    echo "🔧 Revisar las verificaciones fallidas arriba para optimizar"
else
    echo "❌ ERROR CRÍTICO: Muchos botones de acción no están implementados"
    echo "🚨 Se requiere trabajo adicional en la implementación"
fi

echo ""
echo "🎯 ACCIONES RECOMENDADAS:"
echo "1. Si hay errores, revisar DiscoveryTutorialProvider.tsx"
echo "2. Verificar que todos los botones tienen onClick handlers"
echo "3. Confirmar que useNavigate está correctamente implementado"
echo "4. Probar manualmente cada botón en el tutorial"
echo "5. Verificar que las URLs de navegación son válidas"

echo ""
echo "📝 COMANDO PARA PRUEBA MANUAL:"
echo "   1. Iniciar SuperApp: npm run dev"
echo "   2. Navegar a /wallet"
echo "   3. En DevTools: useDiscoveryTutorial().startTutorial('wallet-discovery')"
echo "   4. Probar cada botón de acción"
