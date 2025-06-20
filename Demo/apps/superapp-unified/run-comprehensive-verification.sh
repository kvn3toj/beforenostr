#!/bin/bash

# 🎯 Comprehensive Verification Script
# Ejecuta todos los tests de Playwright para verificar las implementaciones al 100%

echo "🚀 Starting Comprehensive Verification of CoomÜnity SuperApp"
echo "=============================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz de la aplicación"
    exit 1
fi

# Verificar que la aplicación esté ejecutándose
echo "🔍 Verificando que la aplicación esté ejecutándose..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Aplicación detectada en puerto 3000"
elif curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Aplicación detectada en puerto 3001"
elif curl -f http://localhost:3005 > /dev/null 2>&1; then
    echo "✅ Aplicación detectada en puerto 3005"
else
    echo "⚠️  Aplicación no detectada. Asegúrate de que esté ejecutándose."
    echo "   Ejecuta: npm run dev"
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📋 Tests a ejecutar:"
echo "  1. 🎮 ÜPlay Gamified Module"
echo "  2. 🤝 Social Feed Gamified"  
echo "  3. 📱 PWA Features"
echo "  4. 🧭 Navigation & Routing"
echo ""

# Función para ejecutar un test específico
run_test() {
    local test_file=$1
    local test_name=$2
    
    echo "🧪 Ejecutando: $test_name"
    echo "----------------------------------------"
    
    if npx playwright test "$test_file" --reporter=list; then
        echo "✅ $test_name - PASSED"
        return 0
    else
        echo "❌ $test_name - FAILED"
        return 1
    fi
}

# Contador de resultados
passed_tests=0
failed_tests=0
total_tests=4

echo "🎯 Iniciando verificación..."
echo ""

# Test 1: ÜPlay Gamified Module
if run_test "tests/uplay-gamified-verification.spec.ts" "ÜPlay Gamified Module"; then
    ((passed_tests++))
else
    ((failed_tests++))
fi
echo ""

# Test 2: Social Feed Gamified
if run_test "tests/social-feed-gamified-verification.spec.ts" "Social Feed Gamified"; then
    ((passed_tests++))
else
    ((failed_tests++))
fi
echo ""

# Test 3: PWA Features
if run_test "tests/pwa-features-verification.spec.ts" "PWA Features"; then
    ((passed_tests++))
else
    ((failed_tests++))
fi
echo ""

# Test 4: Navigation & Routing
if run_test "tests/navigation-and-routing-verification.spec.ts" "Navigation & Routing"; then
    ((passed_tests++))
else
    ((failed_tests++))
fi
echo ""

# Resumen final
echo "🏁 RESUMEN DE VERIFICACIÓN"
echo "=============================================================="
echo "📊 Tests ejecutados: $total_tests"
echo "✅ Tests exitosos: $passed_tests"
echo "❌ Tests fallidos: $failed_tests"

if [ $failed_tests -eq 0 ]; then
    echo ""
    echo "🎉 ¡VERIFICACIÓN COMPLETADA AL 100%!"
    echo "✨ Todas las funcionalidades implementadas están funcionando correctamente:"
    echo "   🎮 ÜPlay con sistema gamificado completo"
    echo "   🤝 Social Feed con gamificación y filtros avanzados"
    echo "   📱 PWA con funcionalidades nativas"
    echo "   🧭 Navegación y ruteo completamente funcional"
    echo ""
    echo "🚀 La SuperApp está lista para producción!"
else
    echo ""
    echo "⚠️  VERIFICACIÓN PARCIAL"
    echo "📝 $failed_tests funcionalidades requieren atención"
    echo "💡 Revisa los logs arriba para detalles específicos"
fi

echo ""
echo "📋 Para ejecutar tests individuales:"
echo "   npx playwright test tests/uplay-gamified-verification.spec.ts"
echo "   npx playwright test tests/social-feed-gamified-verification.spec.ts"
echo "   npx playwright test tests/pwa-features-verification.spec.ts"
echo "   npx playwright test tests/navigation-and-routing-verification.spec.ts"
echo ""

# Código de salida
if [ $failed_tests -eq 0 ]; then
    exit 0
else
    exit 1
fi 