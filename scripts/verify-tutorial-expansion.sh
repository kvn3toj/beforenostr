#!/bin/bash

echo "🎓 VERIFICACIÓN DE TUTORIALES DISCOVERY EXPANDIDOS"
echo "=================================================="

# Verificar que la SuperApp esté funcionando
echo ""
echo "🌐 Verificando SuperApp..."
SUPERAPP_STATUS=$(curl -s -I http://localhost:3001 | head -1)
if [[ $SUPERAPP_STATUS == *"200 OK"* ]]; then
    echo "✅ SuperApp funcionando correctamente en puerto 3001"
else
    echo "❌ SuperApp no está disponible en puerto 3001"
    echo "   Ejecuta: cd Demo/apps/superapp-unified && npm run dev"
fi

# Verificar el archivo de tutoriales
echo ""
echo "📚 Verificando archivo de tutoriales..."
TUTORIAL_FILE="Demo/apps/superapp-unified/src/components/tutorials/DiscoveryTutorialProvider.tsx"
if [ -f "$TUTORIAL_FILE" ]; then
    echo "✅ Archivo de tutoriales encontrado"
    
    # Contar líneas de código
    LINES=$(wc -l < "$TUTORIAL_FILE")
    echo "📊 Líneas de código: $LINES"
    
    # Verificar características implementadas
    echo ""
    echo "🔍 Verificando características implementadas..."
    
    if grep -q "completionRewards" "$TUTORIAL_FILE"; then
        echo "✅ Sistema de recompensas implementado"
    else
        echo "❌ Sistema de recompensas faltante"
    fi
    
    if grep -q "renderStepContent" "$TUTORIAL_FILE"; then
        echo "✅ Función de renderizado mejorada implementada"
    else
        echo "❌ Función de renderizado mejorada faltante"
    fi
    
    if grep -q "type.*'info'.*'warning'.*'success'" "$TUTORIAL_FILE"; then
        echo "✅ Tipos de contenido expandidos implementados"
    else
        echo "❌ Tipos de contenido expandidos faltantes"
    fi
    
    if grep -q "tips.*string" "$TUTORIAL_FILE"; then
        echo "✅ Sistema de tips implementado"
    else
        echo "❌ Sistema de tips faltante"
    fi
    
    if grep -q "actionButton" "$TUTORIAL_FILE"; then
        echo "✅ Botones de acción implementados"
    else
        echo "❌ Botones de acción faltantes"
    fi
    
    # Contar pasos del tutorial de marketplace
    echo ""
    echo "📈 Análisis del tutorial Marketplace Discovery:"
    MARKETPLACE_STEPS=$(grep -A 200 "id: 'marketplace-discovery'" "$TUTORIAL_FILE" | grep "id: 'marketplace-" | wc -l)
    echo "   Pasos implementados: $MARKETPLACE_STEPS"
    
    if [ $MARKETPLACE_STEPS -ge 8 ]; then
        echo "✅ Tutorial marketplace completamente expandido (8+ pasos)"
    elif [ $MARKETPLACE_STEPS -gt 2 ]; then
        echo "🔄 Tutorial marketplace parcialmente expandido ($MARKETPLACE_STEPS pasos)"
    else
        echo "❌ Tutorial marketplace no expandido ($MARKETPLACE_STEPS pasos)"
    fi
    
    # Verificar otros tutoriales
    echo ""
    echo "📊 Estado de otros tutoriales:"
    
    OTHER_TUTORIALS=("uplay-discovery" "social-discovery" "wallet-discovery" "console-discovery")
    for tutorial in "${OTHER_TUTORIALS[@]}"; do
        STEPS=$(grep -A 50 "id: '$tutorial'" "$TUTORIAL_FILE" | grep "id: '$tutorial-" | wc -l)
        if [ $STEPS -gt 3 ]; then
            echo "✅ $tutorial: $STEPS pasos (expandido)"
        elif [ $STEPS -gt 1 ]; then
            echo "🔄 $tutorial: $STEPS pasos (parcialmente expandido)"
        else
            echo "⏳ $tutorial: $STEPS pasos (pendiente de expansión)"
        fi
    done
    
else
    echo "❌ Archivo de tutoriales no encontrado"
fi

# Verificar documentación
echo ""
echo "📋 Verificando documentación..."
SUMMARY_FILE="docs/implementation/DISCOVERY_TUTORIALS_EXPANSION_SUMMARY.md"
if [ -f "$SUMMARY_FILE" ]; then
    echo "✅ Documentación de resumen encontrada"
    SUMMARY_LINES=$(wc -l < "$SUMMARY_FILE")
    echo "📊 Líneas de documentación: $SUMMARY_LINES"
else
    echo "❌ Documentación de resumen faltante"
fi

# Resumen final
echo ""
echo "🎯 RESUMEN DE VERIFICACIÓN:"
echo "=========================="

if [[ $SUPERAPP_STATUS == *"200 OK"* ]] && [ -f "$TUTORIAL_FILE" ] && [ $MARKETPLACE_STEPS -ge 8 ]; then
    echo "✅ EXPANSIÓN EXITOSA: Tutorial marketplace completamente implementado"
    echo "🎓 Los usuarios ahora tienen acceso a una experiencia de discovery profunda"
    echo ""
    echo "📋 PRÓXIMOS PASOS:"
    echo "1. Abrir http://localhost:3001 en el navegador"
    echo "2. Buscar el botón flotante de tutoriales (🎓)"
    echo "3. Seleccionar 'Marketplace Discovery'"
    echo "4. Experimentar los 8 pasos expandidos con tips y recompensas"
    echo "5. Expandir los tutoriales restantes (ÜPlay, Social, Wallet, Console)"
    
elif [ -f "$TUTORIAL_FILE" ]; then
    echo "🔄 EXPANSIÓN PARCIAL: Archivo modificado pero requiere más trabajo"
    echo "⏳ Continuar expandiendo los tutoriales restantes"
    
else
    echo "❌ EXPANSIÓN INCOMPLETA: Problemas encontrados"
    echo "🔧 Revisar la implementación y corregir errores"
fi

echo ""
echo "🎉 ¡Gracias por mejorar la experiencia de onboarding de CoomÜnity!"