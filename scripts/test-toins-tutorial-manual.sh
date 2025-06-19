#!/bin/bash

# 🧪 SCRIPT DE PRUEBA MANUAL COMPLETA - TUTORIAL DISCOVERY TOINS
# Guía paso a paso para validar manualmente el tutorial completo

echo "🧪 PRUEBA MANUAL COMPLETA DEL TUTORIAL DISCOVERY TOINS"
echo "====================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function print_step() {
    echo -e "${BLUE}📋 PASO $1: $2${NC}"
    echo "   $3"
    echo ""
}

function print_action() {
    echo -e "${YELLOW}🎯 ACCIÓN:${NC} $1"
    echo ""
}

function print_verify() {
    echo -e "${GREEN}✅ VERIFICAR:${NC} $1"
    echo ""
}

function print_warning() {
    echo -e "${RED}⚠️ IMPORTANTE:${NC} $1"
    echo ""
}

print_step "1" "PREPARACIÓN DEL ENTORNO" "Verificar que todos los servicios estén ejecutándose"

print_action "Abrir una nueva terminal y ejecutar:"
echo "   curl http://localhost:3002/health"
echo "   curl -I http://localhost:3001"

print_verify "Backend responde con status 'ok' y frontend responde HTTP 200"

echo "───────────────────────────────────────────────────────────────────"

print_step "2" "ACCESO A LA SUPERAPP" "Navegar a la SuperApp y autenticarse"

print_action "1. Abrir navegador en http://localhost:3001"
print_action "2. Si no está autenticado, ir a /login"
print_action "3. Usar credenciales: admin@gamifier.com / admin123"

print_verify "Usuario logueado correctamente y puede navegar por la app"

echo "───────────────────────────────────────────────────────────────────"

print_step "3" "ACCESO AL MÓDULO WALLET" "Navegar al módulo donde está integrado el tutorial"

print_action "1. En la SuperApp, navegar a /wallet"
print_action "2. Localizar el botón o ícono de tutoriales"
print_action "3. Buscar específicamente el tutorial 'Discovery Wallet & TOINS'"

print_verify "El módulo Wallet carga correctamente y muestra opciones de tutorial"

echo "───────────────────────────────────────────────────────────────────"

print_step "4" "INICIO DEL TUTORIAL TOINS" "Activar el tutorial desde la consola del navegador"

print_action "1. Abrir DevTools (F12)"
print_action "2. Ir a la pestaña Console"
print_action "3. Ejecutar: useDiscoveryTutorial().startTutorial('wallet-discovery')"

print_verify "El tutorial se abre en un modal/dialog con el primer paso visible"

echo "───────────────────────────────────────────────────────────────────"

print_step "5" "VALIDACIÓN DE CONTENIDO EDUCATIVO" "Revisar cada uno de los 8 pasos del tutorial"

print_action "Recorrer todos los pasos verificando:"
echo "   • Paso 1: Bienvenida al Wallet"
echo "   • Paso 2: Introducción a TOINS"
echo "   • Paso 3: Sistema Dual Lükas/TOINS"
echo "   • Paso 4: Cómo Ganar TOINS"
echo "   • Paso 5: Usando TOINS Sabiamente"
echo "   • Paso 6: TOINS y el Principio Ayni"
echo "   • Paso 7: Maestría del Sistema"
echo "   • Paso 8: Finalización y Recompensas"

print_verify "Cada paso contiene:"
echo "   ✓ Título descriptivo"
echo "   ✓ Contenido educativo relevante"
echo "   ✓ Tips específicos (2-4 por paso)"
echo "   ✓ Iconos y alerts apropiados"

echo "───────────────────────────────────────────────────────────────────"

print_step "6" "VALIDACIÓN DE BOTONES DE ACCIÓN" "Probar los botones interactivos"

print_action "En los pasos que tengan botones de acción:"
echo "   • Verificar que los botones se muestren correctamente"
echo "   • Hacer clic en cada botón de acción"
echo "   • Verificar que las URLs/acciones funcionen"

print_verify "Los botones responden correctamente y llevan a las secciones apropiadas"

echo "───────────────────────────────────────────────────────────────────"

print_step "7" "NAVEGACIÓN DEL TUTORIAL" "Probar controles de navegación"

print_action "Probar todos los controles:"
echo "   • Botón 'Siguiente' avanza al próximo paso"
echo "   • Botón 'Anterior' retrocede al paso previo"
echo "   • Botón 'Cerrar' cierra el tutorial"
echo "   • Stepper visual muestra progreso correcto"

print_verify "La navegación es fluida y el progreso se refleja visualmente"

echo "───────────────────────────────────────────────────────────────────"

print_step "8" "COMPLETACIÓN DEL TUTORIAL" "Finalizar y verificar recompensas"

print_action "1. Completar todos los pasos hasta el final"
print_action "2. Verificar el mensaje de completación"
print_action "3. Verificar las recompensas prometidas (35 Öndas, 8 Mëritos)"

print_verify "El tutorial se marca como completado y las recompensas se muestran"

echo "───────────────────────────────────────────────────────────────────"

print_step "9" "VALIDACIÓN DE INTEGRACIÓN BACKEND" "Verificar persistencia de datos"

print_action "En DevTools Console ejecutar:"
echo "   // Verificar estado del tutorial"
echo "   localStorage.getItem('COOMUNITY_TUTORIAL_PROGRESS')"
echo ""
echo "   // O verificar en backend si hay endpoint:"
echo "   fetch('/api/user/tutorial-progress')"

print_verify "Los datos del tutorial se persisten correctamente"

echo "───────────────────────────────────────────────────────────────────"

print_step "10" "VERIFICACIÓN DE CALIDAD UX" "Evaluación de experiencia de usuario"

print_action "Evaluar aspectos de calidad:"
echo "   • Claridad del contenido educativo"
echo "   • Fluidez de la navegación"
echo "   • Tiempo de completación (debe estar en 12-15 min)"
echo "   • Utilidad de los tips y consejos"
echo "   • Atractivo visual del tutorial"

print_verify "La experiencia es educativa, atractiva y cumple los objetivos de aprendizaje"

echo ""
echo "🎉 PRUEBA MANUAL COMPLETADA"
echo "=========================="
echo ""
print_warning "Si encuentras algún problema:"
echo "   1. Anota el paso específico donde ocurre"
echo "   2. Captura screenshot del error"
echo "   3. Revisa la consola del navegador por errores"
echo "   4. Verifica que no hay conflictos de CSS"
echo "   5. Confirma que el backend responde correctamente"

echo ""
echo "📝 REPORTE DE RESULTADOS:"
echo "   • Tutorial funciona: [ ] SÍ [ ] NO"
echo "   • Contenido educativo completo: [ ] SÍ [ ] NO"
echo "   • Botones de acción operativos: [ ] SÍ [ ] NO"
echo "   • Navegación fluida: [ ] SÍ [ ] NO"
echo "   • Recompensas funcionan: [ ] SÍ [ ] NO"
echo "   • Tiempo de completación apropiado: [ ] SÍ [ ] NO"
echo ""
echo "🎯 ¡Listo para usar en producción!"

echo "🔍 DIAGNÓSTICO DE PROBLEMA 'LOAD FAILED'"
echo "========================================"

# Obtener IP de la red
NETWORK_IP=$(ifconfig | grep -E 'inet 192\.168\.' | awk '{print $2}' | head -1)
if [ -z "$NETWORK_IP" ]; then
    NETWORK_IP=$(ifconfig | grep -E 'inet 10\.' | awk '{print $2}' | head -1)
fi

echo "🌐 IP de red detectada: $NETWORK_IP"
echo ""

# Test 1: Verificar servicios básicos
echo "📋 Test 1: Verificación de servicios básicos"
echo "--------------------------------------------"

# Backend health
backend_health=$(curl -s "http://$NETWORK_IP:3002/health" | grep -o '"status":"ok"' | wc -l)
if [ $backend_health -gt 0 ]; then
    echo "✅ Backend health check: OK"
else
    echo "❌ Backend health check: FAILED"
    echo "   Verifica que el backend esté ejecutándose"
    exit 1
fi

# Frontend basic response
frontend_response=$(curl -s "http://$NETWORK_IP:3001" | grep -o 'id="root"' | wc -l)
if [ $frontend_response -gt 0 ]; then
    echo "✅ Frontend HTML: OK"
else
    echo "❌ Frontend HTML: FAILED"
    echo "   Verifica que la SuperApp esté ejecutándose"
    exit 1
fi

echo ""

# Test 2: Verificar estructura específica del HTML
echo "📄 Test 2: Verificación de estructura HTML crítica"
echo "--------------------------------------------------"

html_content=$(curl -s "http://$NETWORK_IP:3001")

# Verificar que el main.tsx esté referenciado
main_tsx_ref=$(echo "$html_content" | grep -o 'src="/src/main.tsx' | wc -l)
if [ $main_tsx_ref -gt 0 ]; then
    echo "✅ Referencia a main.tsx: ENCONTRADA"
else
    echo "❌ Referencia a main.tsx: NO ENCONTRADA"
    echo "   Esto puede causar 'load failed'"
fi

# Verificar que el root div esté presente
root_div=$(echo "$html_content" | grep -o 'id="root"' | wc -l)
if [ $root_div -gt 0 ]; then
    echo "✅ Div #root: ENCONTRADO"
else
    echo "❌ Div #root: NO ENCONTRADO"
    echo "   React no puede montar sin este elemento"
fi

# Verificar que React scripts estén presentes
react_scripts=$(echo "$html_content" | grep -o '@react-refresh' | wc -l)
if [ $react_scripts -gt 0 ]; then
    echo "✅ Scripts de React: ENCONTRADOS"
else
    echo "❌ Scripts de React: NO ENCONTRADOS"
    echo "   React hot reload puede no funcionar"
fi

echo ""

# Test 3: Verificar endpoints críticos de API
echo "🔌 Test 3: Verificación de endpoints críticos de API"
echo "---------------------------------------------------"

# Video items endpoint (usado por la SuperApp al cargar)
video_items_response=$(curl -s "http://$NETWORK_IP:3002/video-items" | head -c 100)
if echo "$video_items_response" | grep -q '\['; then
    echo "✅ Endpoint /video-items: RESPONDE"
    echo "   Datos: $(echo "$video_items_response" | head -c 50)..."
else
    echo "❌ Endpoint /video-items: NO RESPONDE"
    echo "   Response: $video_items_response"
fi

# Auth endpoint
auth_test=$(curl -s -X POST "http://$NETWORK_IP:3002/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}' | head -c 100)

if echo "$auth_test" | grep -q 'access_token'; then
    echo "✅ Endpoint /auth/login: RESPONDE"
    echo "   Token generado correctamente"
else
    echo "❌ Endpoint /auth/login: NO RESPONDE"
    echo "   Response: $auth_test"
fi

echo ""

# Test 4: Verificar CORS específicamente
echo "🌐 Test 4: Verificación de CORS para red"
echo "---------------------------------------"

cors_test=$(curl -s -o /dev/null -w "%{http_code}" \
  -X OPTIONS "http://$NETWORK_IP:3002/auth/login" \
  -H "Origin: http://$NETWORK_IP:3001" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization")

if [ "$cors_test" = "200" ] || [ "$cors_test" = "204" ]; then
    echo "✅ CORS preflight: OK (HTTP $cors_test)"
else
    echo "❌ CORS preflight: FAILED (HTTP $cors_test)"
    echo "   Esto puede causar 'load failed' en el frontend"
    echo "   El frontend no puede comunicarse con el backend"
fi

echo ""

# Test 5: Verificar archivos estáticos críticos
echo "📁 Test 5: Verificación de archivos estáticos críticos"
echo "------------------------------------------------------"

# Verificar que Vite client esté disponible
vite_client=$(curl -s -o /dev/null -w "%{http_code}" "http://$NETWORK_IP:3001/@vite/client")
if [ "$vite_client" = "200" ]; then
    echo "✅ Vite client: DISPONIBLE"
else
    echo "❌ Vite client: NO DISPONIBLE (HTTP $vite_client)"
    echo "   Vite hot reload puede no funcionar"
fi

# Verificar que main.tsx esté disponible
main_tsx_param=$(curl -s "$html_content" | grep -o 'src="/src/main.tsx[^"]*' | head -1 | cut -d'"' -f2)
if [ -n "$main_tsx_param" ]; then
    main_tsx_status=$(curl -s -o /dev/null -w "%{http_code}" "http://$NETWORK_IP:3001${main_tsx_param}")
    if [ "$main_tsx_status" = "200" ]; then
        echo "✅ main.tsx: DISPONIBLE"
    else
        echo "❌ main.tsx: NO DISPONIBLE (HTTP $main_tsx_status)"
        echo "   URL: http://$NETWORK_IP:3001${main_tsx_param}"
        echo "   Esto CAUSARÁ 'load failed'"
    fi
else
    echo "⚠️ main.tsx: No se pudo extraer la URL del parámetro"
fi

echo ""

# Test 6: Verificar errores comunes en logs
echo "📋 Test 6: Búsqueda de errores comunes"
echo "-------------------------------------"

echo "🔍 Revisando logs recientes del backend..."

# Buscar errores recientes en logs del backend (si está ejecutándose)
if ps aux | grep -q "npm run.*backend" || ps aux | grep -q "nest start"; then
    echo "✅ Backend process detectado ejecutándose"
else
    echo "⚠️ Backend process no detectado en ps aux"
fi

# Buscar errores recientes en logs del frontend (si está ejecutándose)
if ps aux | grep -q "vite.*3001" || ps aux | grep -q "npm run.*dev.*superapp"; then
    echo "✅ Frontend process detectado ejecutándose"
else
    echo "⚠️ Frontend process no detectado en ps aux"
fi

echo ""

# Test 7: Instrucciones para debugging manual
echo "🛠️ Test 7: Instrucciones para debugging manual"
echo "----------------------------------------------"

echo "1. **Abrir navegador en otro dispositivo:**"
echo "   URL: http://$NETWORK_IP:3001"
echo ""
echo "2. **Abrir Developer Tools (F12):**"
echo "   - Ir a la pestaña 'Console'"
echo "   - Buscar errores en color rojo"
echo "   - Buscar específicamente:"
echo "     * 'Load failed'"
echo "     * 'Failed to fetch'"
echo "     * 'CORS error'"
echo "     * 'Network error'"
echo ""
echo "3. **Ir a la pestaña 'Network':**"
echo "   - Refrescar la página (F5)"
echo "   - Buscar archivos que fallen (en rojo)"
echo "   - Verificar que main.tsx se cargue correctamente"
echo ""
echo "4. **Si encuentra errores, buscar estos patrones:**"
echo "   - ❌ main.tsx: Error 404 → Problema con Vite build"
echo "   - ❌ API calls: Error CORS → Problema de configuración backend"
echo "   - ❌ Failed to fetch → Problema de conectividad"
echo ""
echo "5. **URLs importantes para testing manual:**"
echo "   Backend Health: http://$NETWORK_IP:3002/health"
echo "   Frontend: http://$NETWORK_IP:3001"
echo "   API Test: http://$NETWORK_IP:3002/video-items"

echo ""
echo "🎯 RESUMEN DE DIAGNÓSTICO"
echo "========================"
echo "Si todos los tests anteriores pasaron ✅, el problema 'load failed'"
echo "está probablemente en:"
echo "1. JavaScript runtime errors en el browser"
echo "2. Archivos estáticos no disponibles"
echo "3. Problemas de red intermitentes"
echo ""
echo "📱 PRÓXIMO PASO: Abrir http://$NETWORK_IP:3001 en browser"
echo "y revisar Console + Network tabs para errores específicos."
