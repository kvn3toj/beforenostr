#!/bin/bash

# 🔍 Script de Verificación de Monitoreo - CoomÜnity SuperApp
# Ejecuta pruebas E2E para verificar la implementación de monitoreo en tiempo real

echo "🔍 Iniciando verificación de monitoreo en tiempo real..."
echo "=========================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar desde el directorio apps/superapp-unified"
    exit 1
fi

# Verificar que la aplicación está corriendo
echo "📡 Verificando que la aplicación esté corriendo..."
if curl -s http://localhost:3333 > /dev/null; then
    echo "✅ Aplicación corriendo en localhost:3333"
else
    echo "❌ Aplicación no está corriendo. Iniciando..."
    npm run dev &
    APP_PID=$!
    echo "⏳ Esperando que la aplicación inicie..."
    sleep 10
    STARTED_APP=true
fi

# Ejecutar pruebas de monitoreo
echo ""
echo "🧪 Ejecutando pruebas de monitoreo..."
echo "=========================================="

# Prueba rápida de integración
echo "🚀 Test de integración completa..."
npx playwright test monitoring-verification-fixed.spec.ts --project=chromium --grep="Complete Monitoring Stack Integration" --reporter=line

# Pruebas específicas importantes
echo ""
echo "⚡ Tests específicos importantes..."
npx playwright test monitoring-verification-fixed.spec.ts --project=chromium --grep="Monitoring Initialization|Error Boundary|Performance Monitoring" --reporter=line

# Resultados finales
echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================================="

# Verificar archivos de monitoreo
if [ -f "src/lib/monitoring.ts" ]; then
    echo "✅ Librería de monitoreo: Presente"
else
    echo "❌ Librería de monitoreo: No encontrada"
fi

if [ -f "src/components/ui/ErrorBoundary.tsx" ]; then
    echo "✅ Error Boundary: Presente"
else
    echo "❌ Error Boundary: No encontrado"
fi

if [ -f "src/hooks/useMonitoring.ts" ]; then
    echo "✅ Hooks de monitoreo: Presentes"
else
    echo "❌ Hooks de monitoreo: No encontrados"
fi

# Verificar configuración de entorno
echo ""
echo "🔧 Configuración de Entorno:"
if [ -f ".env" ]; then
    echo "✅ Archivo .env: Presente"
    if grep -q "VITE_SENTRY_DSN" .env; then
        echo "✅ Sentry DSN: Configurado"
    else
        echo "⚠️ Sentry DSN: No configurado (opcional para desarrollo)"
    fi
    
    if grep -q "VITE_GA4_MEASUREMENT_ID" .env; then
        echo "✅ GA4 Measurement ID: Configurado"
    else
        echo "⚠️ GA4 Measurement ID: No configurado (opcional para desarrollo)"
    fi
else
    echo "⚠️ Archivo .env: No encontrado (copiar desde env.example)"
fi

# Verificar dependencias
echo ""
echo "📦 Dependencias de Monitoreo:"
if npm list @sentry/react > /dev/null 2>&1; then
    echo "✅ @sentry/react: Instalado"
else
    echo "❌ @sentry/react: No instalado"
fi

if npm list web-vitals > /dev/null 2>&1; then
    echo "✅ web-vitals: Instalado"
else
    echo "❌ web-vitals: No instalado"
fi

if npm list @playwright/test > /dev/null 2>&1; then
    echo "✅ @playwright/test: Instalado"
else
    echo "❌ @playwright/test: No instalado"
fi

# Generar reporte final
echo ""
echo "📋 PRÓXIMOS PASOS RECOMENDADOS:"
echo "1. Configurar variables de entorno reales (Sentry DSN, GA4 ID)"
echo "2. Probar en entorno de staging con monitoreo activo"
echo "3. Configurar alertas en Sentry dashboard"
echo "4. Crear dashboards personalizados en GA4"

# Limpiar si iniciamos la aplicación
if [ "$STARTED_APP" = true ]; then
    echo ""
    echo "🧹 Cerrando aplicación iniciada por el script..."
    kill $APP_PID
fi

echo ""
echo "🎉 Verificación de monitoreo completada!"
echo "Ver reporte detallado en: PLAYWRIGHT_MONITORING_VERIFICATION_RESULTS.md" 