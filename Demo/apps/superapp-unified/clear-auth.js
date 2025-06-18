// Script temporal para limpiar datos de autenticación corruptos
console.log('🧹 Limpiando datos de autenticación...');

// Abrir consola del navegador en http://localhost:2222 y ejecutar:
localStorage.removeItem('coomunity_token');
localStorage.removeItem('coomunity_user');
localStorage.removeItem('auth_user');
localStorage.removeItem('user');
localStorage.removeItem('token');

// Limpiar cualquier sesión almacenada
sessionStorage.clear();

console.log('✅ Datos de autenticación limpiados');
console.log('🔄 Recarga la página para hacer login fresco');

// Para ejecutar automáticamente:
window.location.reload(); 