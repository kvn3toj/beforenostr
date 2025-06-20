// 🧹 LIMPIEZA PROFUNDA DE NAVEGADOR - COOMUNITY
console.log('🧹 [DEEP CLEANUP] Iniciando limpieza profunda...');

// 1. Limpiar TODOS los storages
localStorage.clear();
sessionStorage.clear();

// 2. Limpiar específicamente keys de CoomÜnity (por si acaso)
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

// 3. Verificar que todo está limpio
console.log('✅ [DEEP CLEANUP] localStorage keys después de limpieza:', Object.keys(localStorage));
console.log('✅ [DEEP CLEANUP] sessionStorage keys después de limpieza:', Object.keys(sessionStorage));

// 4. Limpiar Service Workers si existen
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
        console.log('✅ [DEEP CLEANUP] Service Workers limpiados');
    });
}

// 5. Forzar recarga para aplicar cambios
console.log('🔄 [DEEP CLEANUP] Recargando página en 2 segundos...');
setTimeout(() => {
    location.reload();
}, 2000);
