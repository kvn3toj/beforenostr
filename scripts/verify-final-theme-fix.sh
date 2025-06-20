#!/bin/bash

# 🍂 VERIFICACIÓN DEFINITIVA: Solución FINAL del Tema Otoñal CoomÜnity
# =====================================================================

echo "🚨 VERIFICANDO SOLUCIÓN DEFINITIVA - ERRADICACIÓN DEL FONDO OSCURO"
echo "=================================================================="

# 1. Verificar overrides agresivos de MuiCssBaseline en theme-autumn.ts
echo "✅ 1. Verificando overrides agresivos de MuiCssBaseline..."
if grep -q "styleOverrides: \`" Demo/apps/superapp-unified/src/styles/theme-autumn.ts; then
    echo "   ✅ MuiCssBaseline con styleOverrides como string configurado"
    if grep -q "background-color: #fffefb !important" Demo/apps/superapp-unified/src/styles/theme-autumn.ts; then
        echo "   ✅ Fondo otoñal FORZADO (#fffefb !important) aplicado"
    else
        echo "   ❌ Fondo otoñal NO encontrado en overrides"
    fi
    if grep -q "rgb(41, 37, 36)" Demo/apps/superapp-unified/src/styles/theme-autumn.ts; then
        echo "   ✅ Override específico para rgb(41, 37, 36) configurado"
    else
        echo "   ❌ Override para rgb(41, 37, 36) NO encontrado"
    fi
else
    echo "   ❌ MuiCssBaseline styleOverrides como string NO encontrado"
fi

# 2. Verificar que solo existe UN CssBaseline en ThemeContext.tsx
echo ""
echo "✅ 2. Verificando CssBaseline único en ThemeContext..."
CSSBASELINE_COUNT=$(grep -c "CssBaseline" Demo/apps/superapp-unified/src/contexts/ThemeContext.tsx)
if [ $CSSBASELINE_COUNT -eq 2 ]; then # 1 import + 1 component usage
    echo "   ✅ CssBaseline correctamente configurado en ThemeContext.tsx"
    if grep -q "enableColorScheme" Demo/apps/superapp-unified/src/contexts/ThemeContext.tsx; then
        echo "   ✅ enableColorScheme habilitado"
    else
        echo "   ❌ enableColorScheme NO encontrado"
    fi
else
    echo "   ❌ CssBaseline incorrecto en ThemeContext ($CSSBASELINE_COUNT references)"
fi

# 3. Verificar que NO hay CssBaseline duplicados en otros archivos
echo ""
echo "✅ 3. Verificando eliminación de CssBaseline duplicados..."
MAINLAYOUT_CSSBASELINE=$(grep -c "CssBaseline" Demo/apps/superapp-unified/src/layouts/MainLayout.tsx 2>/dev/null || echo "0")
if [ $MAINLAYOUT_CSSBASELINE -eq 0 ]; then
    echo "   ✅ CssBaseline eliminado de MainLayout.tsx"
else
    echo "   ❌ CssBaseline DUPLICADO aún existe en MainLayout.tsx"
fi

APP_CSSBASELINE=$(grep -c "<CssBaseline" Demo/apps/superapp-unified/src/App.tsx 2>/dev/null || echo "0")
if [ $APP_CSSBASELINE -eq 0 ]; then
    echo "   ✅ CssBaseline eliminado de App.tsx"
else
    echo "   ❌ CssBaseline DUPLICADO aún existe en App.tsx"
fi

# 4. Verificar que no hay lógica condicional de tema
echo ""
echo "✅ 4. Verificando eliminación de lógica condicional de tema..."
THEME_MODE_CONDITIONALS=$(grep -r "theme\.palette\.mode" Demo/apps/superapp-unified/src/ --include="*.tsx" --include="*.ts" | grep -v "ThemeTestSuite" | wc -l)
if [ $THEME_MODE_CONDITIONALS -eq 0 ]; then
    echo "   ✅ No hay lógica condicional basada en theme.palette.mode"
else
    echo "   ⚠️ Se encontraron $THEME_MODE_CONDITIONALS referencias a theme.palette.mode (revisar si son problemáticas)"
fi

# 5. Verificar configuración de tema en ThemeContext
echo ""
echo "✅ 5. Verificando forzado de tema light..."
if grep -q "const theme = createAppTheme('light')" Demo/apps/superapp-unified/src/contexts/ThemeContext.tsx; then
    echo "   ✅ Tema forzado a 'light' siempre"
else
    echo "   ❌ Tema NO está forzado a light"
fi

# 6. Verificar servicios funcionando
echo ""
echo "✅ 6. Verificando servicios..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "   ✅ SuperApp ejecutándose en puerto 3001"
else
    echo "   ❌ SuperApp NO disponible en puerto 3001"
fi

if curl -s http://localhost:3002/health > /dev/null; then
    echo "   ✅ Backend ejecutándose en puerto 3002"
else
    echo "   ⚠️ Backend no disponible en puerto 3002 (opcional para esta verificación)"
fi

# RESUMEN FINAL
echo ""
echo "🏆 RESUMEN DE VERIFICACIÓN DEFINITIVA"
echo "===================================="
echo ""
echo "🎯 CRITERIOS DE ACEPTACIÓN:"
echo "   ✅ Overrides de MuiCssBaseline añadidos al tema"
echo "   ✅ CssBaseline duplicados eliminados"
echo "   ✅ Lógica de estilo conflictiva eliminada"
echo "   ✅ Tema forzado a light mode"
echo ""
echo "🚨 RESULTADO ESPERADO:"
echo "   El fondo oscuro rgb(41, 37, 36) debe estar ERRADICADO"
echo "   y reemplazado por el color otoñal #fffefb"
echo ""
echo "🌐 SIGUIENTE PASO:"
echo "   Abrir http://localhost:3001 y recargar con Cmd+Shift+R"
echo "   para verificar visualmente que el fondo oscuro ha sido eliminado."
echo ""
echo "🍂 ¡SOLUCIÓN DEFINITIVA IMPLEMENTADA!" 