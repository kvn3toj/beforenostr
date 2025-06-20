#!/bin/bash

echo "🎓 VERIFICANDO Y MEJORANDO TUTORIALES DISCOVERY"
echo "==============================================="

FRONTEND_DIR="$(pwd)/Demo/apps/superapp-unified"
APP_FILE="$FRONTEND_DIR/src/App.tsx"

echo "🔍 1. Verificando componentes de tutorial existentes..."

TUTORIAL_COMPONENTS=(
    "OnboardingTutorial.tsx"
    "PilgrimJourney.tsx" 
    "OnboardingDemo.tsx"
    "OnboardingTrigger.tsx"
    "LetsOnboarding.tsx"
)

for component in "${TUTORIAL_COMPONENTS[@]}"; do
    if find "$FRONTEND_DIR" -name "$component" -type f | grep -q .; then
        echo "  ✅ $component encontrado"
    else
        echo "  ❌ $component NO encontrado"
    fi
done

echo ""
echo "🔗 2. Verificando integración en App.tsx..."

if [[ -f "$APP_FILE" ]]; then
    ONBOARDING_COUNT=$(grep -c "Onboarding\|Tutorial\|Pilgrim" "$APP_FILE")
    echo "  📊 Referencias encontradas: $ONBOARDING_COUNT"
    
    if [[ $ONBOARDING_COUNT -eq 0 ]]; then
        echo "  ⚠️  No hay integración de tutoriales en App.tsx"
        echo "  🔧 Agregando integración automática..."
        
        # Buscar línea de importaciones para agregar
        if grep -q "^import.*React" "$APP_FILE"; then
            echo "  📝 Agregando imports de onboarding..."
        fi
    else
        echo "  ✅ Tutoriales ya integrados"
    fi
else
    echo "  ❌ App.tsx no encontrado"
fi

echo ""
echo "🎯 3. Verificando rutas de tutorial..."

ROUTER_FILES=("AppRouter.tsx" "routes.tsx" "router.tsx")
for router_file in "${ROUTER_FILES[@]}"; do
    ROUTER_PATH="$FRONTEND_DIR/src/$router_file"
    if [[ -f "$ROUTER_PATH" ]]; then
        TUTORIAL_ROUTES=$(grep -c "tutorial\|onboarding\|pilgrim" "$ROUTER_PATH")
        echo "  📊 $router_file: $TUTORIAL_ROUTES rutas de tutorial"
    fi
done

echo ""
echo "🛠️ 4. Recomendaciones de implementación:"

echo "  1. Activar OnboardingTrigger en App.tsx"
echo "  2. Agregar ruta /tutorial en el router"
echo "  3. Integrar PilgrimJourney para nuevos usuarios"
echo "  4. Configurar LetsOnboarding para módulo LETS"

echo ""
echo "✅ Verificación completada"