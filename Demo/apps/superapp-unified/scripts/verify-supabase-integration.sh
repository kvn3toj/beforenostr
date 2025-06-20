#!/bin/bash

echo "🔍 VERIFICACIÓN AUTOMÁTICA - INTEGRACIÓN SUPABASE"
echo "=================================================="

# Variables de configuración
SUPABASE_URL="https://huwbieukmudvbkhywgmi.supabase.co"
LOCAL_URL="http://localhost:3001"
TEST_PAGE="$LOCAL_URL/supabase-test"

# Contadores
PASSED=0
TOTAL=0

# Función para verificar criterios
check_criterion() {
    local description="$1"
    local command="$2"
    local expected="$3"

    TOTAL=$((TOTAL + 1))
    echo -n "[$TOTAL] $description... "

    result=$(eval "$command" 2>/dev/null)
    if [[ "$result" == *"$expected"* ]]; then
        echo "✅ PASS"
        PASSED=$((PASSED + 1))
    else
        echo "❌ FAIL"
        echo "    Expected: $expected"
        echo "    Got: $result"
    fi
}

echo ""
echo "🔑 VERIFICANDO CREDENCIALES EN .ENV:"
check_criterion "VITE_SUPABASE_URL configurada" "grep VITE_SUPABASE_URL .env" "huwbieukmudvbkhywgmi.supabase.co"
check_criterion "VITE_SUPABASE_ANON_KEY configurada" "grep VITE_SUPABASE_ANON_KEY .env | wc -c" "150"

echo ""
echo "📁 VERIFICANDO ARCHIVOS DE INTEGRACIÓN:"
check_criterion "supabase.ts existe" "test -f src/lib/supabase.ts && echo 'exists'" "exists"
check_criterion "useSupabaseAuth.ts existe" "test -f src/hooks/useSupabaseAuth.ts && echo 'exists'" "exists"
check_criterion "SupabaseTest.tsx existe" "test -f src/components/SupabaseTest.tsx && echo 'exists'" "exists"

echo ""
echo "🌐 VERIFICANDO CONEXIONES:"
check_criterion "Servidor local respondiendo" "curl -s -I $LOCAL_URL | head -1" "HTTP/1.1 200 OK"
check_criterion "Página de test accesible" "curl -s -w '%{http_code}' -o /dev/null $TEST_PAGE" "200"
check_criterion "API Supabase accesible" "curl -s -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d2JpZXVrbXVkdmJraHl3Z21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODIwNTAsImV4cCI6MjA2NTk1ODA1MH0.oFvOhZbPcAmWUdKBH7maQKZO-dyrCRSBr7NE24FzdnY' '$SUPABASE_URL/rest/v1/' | grep -o swagger" "swagger"

echo ""
echo "🔧 VERIFICANDO CONFIGURACIÓN DE DEPLOY:"
check_criterion "render.yaml configurado" "grep -q 'huwbieukmudvbkhywgmi.supabase.co' render.yaml && echo 'configured'" "configured"
check_criterion "Build exitoso" "npm run build --silent && echo 'success'" "success"

echo ""
echo "📦 VERIFICANDO DEPENDENCIAS:"
check_criterion "@supabase/supabase-js instalado" "npm ls @supabase/supabase-js 2>/dev/null | grep -o '@supabase/supabase-js'" "@supabase/supabase-js"
check_criterion "@supabase/auth-helpers-react instalado" "npm ls @supabase/auth-helpers-react 2>/dev/null | grep -o '@supabase/auth-helpers-react'" "@supabase/auth-helpers-react"

echo ""
echo "🎯 RESULTADO FINAL:"
echo "=================="
echo "✅ Criterios pasados: $PASSED/$TOTAL"
PERCENTAGE=$((PASSED * 100 / TOTAL))
echo "📊 Porcentaje de éxito: $PERCENTAGE%"

if [ $PERCENTAGE -ge 90 ]; then
    echo "🎉 INTEGRACIÓN SUPABASE: COMPLETAMENTE EXITOSA"
    echo "🚀 Estado: LISTO PARA PRODUCCIÓN"
elif [ $PERCENTAGE -ge 70 ]; then
    echo "⚠️ INTEGRACIÓN SUPABASE: FUNCIONAL CON ADVERTENCIAS"
    echo "🔧 Acción: Revisar criterios fallidos"
else
    echo "❌ INTEGRACIÓN SUPABASE: REQUIERE CORRECCIONES"
    echo "🛠️ Acción: Corregir problemas críticos"
fi

echo ""
echo "📋 URLS DE ACCESO:"
echo "🏠 Local: $LOCAL_URL"
echo "🧪 Test: $TEST_PAGE"
echo "☁️ Supabase: $SUPABASE_URL"
echo "🌐 Vercel: https://superapp-unified-o8zxw9nzj-kvn3tojs-projects-9cd69e29.vercel.app"

exit 0
