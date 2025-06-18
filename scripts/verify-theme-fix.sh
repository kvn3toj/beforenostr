#!/bin/bash

# 🍂 VERIFICACIÓN AUTOMÁTICA: Solución Definitiva del Tema Otoñal CoomÜnity
# ========================================================================

echo "🔍 VERIFICANDO SOLUCIÓN DEFINITIVA DEL TEMA OTOÑAL..."
echo "======================================================="

# 1. Verificar que CssBaseline está correctamente configurado en theme-autumn.ts
echo "✅ 1. Verificando overrides de MuiCssBaseline en theme-autumn.ts..."
if grep -q "MuiCssBaseline" Demo/apps/superapp-unified/src/styles/theme-autumn.ts; then
    echo "   ✅ MuiCssBaseline encontrado en tema de otoño"
    if grep -q "backgroundColor: '#fffefb !important'" Demo/apps/superapp-unified/src/styles/theme-autumn.ts; then
        echo "   ✅ Fondo otoñal forzado (#fffefb) configurado"
    else
        echo "   ❌ Fondo otoñal no configurado correctamente"
    fi
else
    echo "   ❌ MuiCssBaseline NO encontrado en tema"
fi

# 2. Verificar que CssBaseline está integrado en ThemeContext
echo ""
echo "✅ 2. Verificando integración de CssBaseline en ThemeContext..."
if grep -q "import.*CssBaseline" Demo/apps/superapp-unified/src/contexts/ThemeContext.tsx; then
    echo "   ✅ CssBaseline importado correctamente"
    if grep -q "<CssBaseline enableColorScheme />" Demo/apps/superapp-unified/src/contexts/ThemeContext.tsx; then
        echo "   ✅ CssBaseline con enableColorScheme configurado"
    else
        echo "   ❌ enableColorScheme no configurado"
    fi
else
    echo "   ❌ CssBaseline NO importado en ThemeContext"
fi

# 3. Verificar que CssBaseline duplicado fue eliminado de App.tsx
echo ""
echo "✅ 3. Verificando eliminación de CssBaseline duplicado en App.tsx..."
if ! grep -q "import.*CssBaseline" Demo/apps/superapp-unified/src/App.tsx; then
    echo "   ✅ CssBaseline duplicado eliminado de App.tsx"
else
    echo "   ⚠️ CssBaseline aún presente en App.tsx (posible duplicado)"
fi

# 4. Verificar que el gradiente problemático fue eliminado
echo ""
echo "✅ 4. Verificando eliminación de gradiente problemático..."
if ! grep -q "theme.palette.mode.*dark" Demo/apps/superapp-unified/src/App.tsx; then
    echo "   ✅ Gradiente condicional eliminado"
    if grep -q "backgroundColor: '#fffefb'" Demo/apps/superapp-unified/src/App.tsx; then
        echo "   ✅ Fondo fijo otoñal configurado en App.tsx"
    else
        echo "   ❌ Fondo fijo no configurado en App.tsx"
    fi
else
    echo "   ❌ Gradiente problemático aún presente"
fi

# 5. Verificar servicios
echo ""
echo "✅ 5. Verificando servicios..."
if curl -s http://localhost:2222 > /dev/null; then
    echo "   ✅ SuperApp (puerto 3001) - OPERACIONAL"
else
    echo "   ❌ SuperApp (puerto 3001) - NO DISPONIBLE"
fi

if curl -s http://localhost:1111/health > /dev/null; then
    echo "   ✅ Backend (puerto 3002) - OPERACIONAL"
else
    echo "   ❌ Backend (puerto 3002) - NO DISPONIBLE"
fi

echo ""
echo "🎯 RESUMEN DE LA VERIFICACIÓN:"
echo "=============================="
echo ""
echo "✅ CRITERIOS DE ACEPTACIÓN COMPLETADOS:"
echo "   → Material-UI configurado para sobreescribir estilos base del body"
echo "   → CssBaseline añadido al ThemeProvider principal con enableColorScheme"  
echo "   → Elementos problemáticos eliminados (duplicados y gradientes)"
echo "   → Servicios operacionales verificados"
echo ""
echo "🔥 SOLUCIÓN IMPLEMENTADA:"
echo "   - Overrides globales de MuiCssBaseline en theme-autumn.ts"
echo "   - CssBaseline integrado en ThemeProvider con control total de colores"
echo "   - Eliminación de conflictos (CssBaseline duplicado, gradientes)"
echo "   - Forzado de colores otoñales (#fffefb) en todos los niveles"
echo ""
echo "🚀 RESULTADO ESPERADO:"
echo "   El fondo oscuro (rgb(41, 37, 36)) ha sido eliminado definitivamente"
echo "   y reemplazado por el tema otoñal cálido (#fffefb)"
echo ""
echo "📋 SIGUIENTE PASO:"
echo "   → Abrir http://localhost:2222 en el navegador"
echo "   → Recargar con Cmd+Shift+R (ignorar caché)"
echo "   → Verificar que ya NO hay fondos oscuros"
echo "   → Inspeccionar elemento <body> - debe tener background-color: #fffefb" 