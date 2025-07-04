#!/bin/bash

echo "🎯 CoomÜnity Unification & Testing - Verificación Final"
echo "====================================================="
echo ""

# Verificar servidor
echo "🔍 Verificando servidor..."
HEALTH_RESPONSE=$(curl -s http://localhost:8080/api/health)
if [[ $? -eq 0 ]]; then
    echo "✅ Servidor respondiendo en puerto 8080"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Servidor no responde"
    exit 1
fi

echo ""

# Verificar APIs principales
echo "🔍 Verificando APIs principales..."

APIs=(
    "/api/pilgrim/profile"
    "/api/merchant/profile" 
    "/api/red-pill/journey"
    "/api/red-pill/videos"
)

for api in "${APIs[@]}"; do
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080$api)
    if [[ $STATUS_CODE -eq 200 ]]; then
        echo "✅ $api - OK ($STATUS_CODE)"
    else
        echo "❌ $api - FAIL ($STATUS_CODE)"
    fi
done

echo ""

# Verificar páginas principales
echo "🔍 Verificando páginas principales..."

PAGES=(
    "/public/"
    "/sections/pilgrim/"
    "/sections/merchant/"
    "/sections/red-pill/"
)

for page in "${PAGES[@]}"; do
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080$page)
    if [[ $STATUS_CODE -eq 200 ]]; then
        echo "✅ $page - OK ($STATUS_CODE)"
    else
        echo "❌ $page - FAIL ($STATUS_CODE)"
    fi
done

echo ""

# Verificar estructura de archivos
echo "🔍 Verificando estructura de archivos..."

REQUIRED_DIRS=(
    "my_recovered_website/public"
    "my_recovered_website/sections/pilgrim"
    "my_recovered_website/sections/merchant"
    "my_recovered_website/sections/red-pill"
    "tests"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
        echo "✅ $dir - EXISTS"
    else
        echo "❌ $dir - MISSING"
    fi
done

echo ""

# Verificar archivos de prueba
echo "🔍 Verificando archivos de prueba..."

TEST_FILES=(
    "tests/api.test.ts"
    "tests/navigation.test.ts"
    "tests/e2e-flows.test.ts"
)

for file in "${TEST_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file - EXISTS"
    else
        echo "❌ $file - MISSING"
    fi
done

echo ""
echo "🏆 VERIFICACIÓN COMPLETADA"
echo ""
echo "📋 URLs disponibles:"
echo "   • Homepage: http://localhost:8080/"
echo "   • Navegación: http://localhost:8080/public/"
echo "   • Pilgrim: http://localhost:8080/sections/pilgrim/"
echo "   • Merchant: http://localhost:8080/sections/merchant/"
echo "   • Red Pill: http://localhost:8080/sections/red-pill/"
echo ""
echo "🧪 Para ejecutar pruebas:"
echo "   npx playwright test --project=chromium tests/api.test.ts"
echo "   npx playwright test --project=chromium tests/navigation.test.ts"
echo "   npx playwright test --project=chromium tests/e2e-flows.test.ts"
echo ""
echo "✨ ¡Todo listo para desarrollo!" 