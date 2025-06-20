#!/bin/bash

echo "LIMPIEZA COMPLETA DE STORAGE - COOMUNITY SUPERAPP"
echo "=================================================="
echo "ELIMINANDO todas las fuentes de localStorage corrupto:"
echo "1. Archivos de autenticacion de Playwright"
echo "2. Scripts de localStorage temporales"
echo "3. Datos de tests E2E"
echo "4. Caches de navegador"
echo ""

# 1. ELIMINAR ARCHIVOS DE AUTENTICACION DE PLAYWRIGHT
echo "1. ELIMINANDO archivos de autenticacion de Playwright..."
if [ -d "Demo/apps/superapp-unified/playwright/.auth" ]; then
    rm -rf Demo/apps/superapp-unified/playwright/.auth
    echo "Directorio playwright/.auth eliminado"
else
    echo "Directorio playwright/.auth no existe"
fi

# 2. ELIMINAR SCRIPTS TEMPORALES DE LOCALSTORAGE
echo "2. ELIMINANDO scripts temporales de localStorage..."
find . -name "*clear-auth*" -type f -delete 2>/dev/null || true
find . -name "*localStorage*" -type f -delete 2>/dev/null || true
echo "Scripts temporales eliminados"

# 3. LIMPIAR ARCHIVOS DE TESTS
echo "3. LIMPIANDO archivos de test con datos corruptos..."
if [ -d "Demo/apps/superapp-unified/test-results" ]; then
    rm -rf Demo/apps/superapp-unified/test-results
    echo "test-results eliminado"
fi

if [ -d "Demo/apps/superapp-unified/playwright-report" ]; then
    rm -rf Demo/apps/superapp-unified/playwright-report
    echo "playwright-report eliminado"
fi

# 4. CREAR SCRIPT DE LIMPIEZA PROFUNDA PARA NAVEGADOR
echo "4. CREANDO script de limpieza profunda para navegador..."
cat > scripts/deep-browser-cleanup.js << 'EOF'
// LIMPIEZA PROFUNDA DE NAVEGADOR - COOMUNITY
console.log('DEEP CLEANUP: Iniciando limpieza profunda...');

// 1. Limpiar TODOS los storages
localStorage.clear();
sessionStorage.clear();

// 2. Limpiar especificamente keys de CoomUnity (por si acaso)
const coomunityKeys = [
    'COOMUNITY_AUTH_TOKEN',
    'COOMUNITY_USER_DATA',
    'COOMUNITY_REFRESH_TOKEN',
    'coomunity_token',
    'coomunity_user',
    'coomunity-tutorials-seen',
    'coomunity_tutorial_completed',
    'coomunity_tutorial_skipped',
    'coomunity_onboarding_completed',
    'coomunity_completed_checklist_items',
    'coomunity_user_stage',
    'coomunity-ai-learning-data',
    'coomunity-ai-theme-preference',
    'coomunity-theme-applications',
    'coomunity-behavior-patterns',
    'coomunity-quantum-optimization',
    'coomunity-last-tutorial'
];

coomunityKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
});

// 3. Verificar que todo esta limpio
console.log('DEEP CLEANUP: localStorage keys despues de limpieza:', Object.keys(localStorage));
console.log('DEEP CLEANUP: sessionStorage keys despues de limpieza:', Object.keys(sessionStorage));

// 4. Limpiar Service Workers si existen
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
        console.log('DEEP CLEANUP: Service Workers limpiados');
    });
}

// 5. Forzar recarga para aplicar cambios
console.log('DEEP CLEANUP: Recargando pagina en 2 segundos...');
setTimeout(() => {
    location.reload();
}, 2000);
EOF

echo "Script de limpieza profunda creado: scripts/deep-browser-cleanup.js"

# 5. VERIFICAR SERVICIOS
echo "5. VERIFICANDO que los servicios esten funcionando..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "Backend NestJS operacional en puerto 3002"
else
    echo "Backend NestJS no responde en puerto 3002"
fi

SUPERAPP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$SUPERAPP_STATUS" = "200" ]; then
    echo "SuperApp operacional en puerto 3001"
else
    echo "SuperApp no responde en puerto 3001"
fi

echo ""
echo "LIMPIEZA COMPLETA FINALIZADA"
echo "=================================="
echo "SIGUIENTE PASO: Ejecutar en consola del navegador:"
echo ""
echo "fetch('/scripts/deep-browser-cleanup.js')"
echo "  .then(r => r.text())"
echo "  .then(script => eval(script))"
echo ""
echo "O copiar y pegar el contenido de: scripts/deep-browser-cleanup.js"
echo ""
echo "Despues de la limpieza, el login deberia funcionar correctamente"
