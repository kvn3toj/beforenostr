#!/bin/bash

# 🧹 LIMPIEZA DE TOKENS JWT CORRUPTOS
# ==================================
# Error: "The string did not match the expected pattern" en auth.service.ts:105
# Causa: Token JWT corrupto en localStorage

echo "🧹 LIMPIANDO TOKENS JWT CORRUPTOS..."
echo "===================================="

# Crear archivo HTML temporal para limpieza de localStorage
cat > /tmp/clear-auth.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Limpieza de Tokens CoomÜnity</title>
</head>
<body>
    <h1>🧹 Limpiando Tokens JWT Corruptos</h1>
    <div id="status">Procesando...</div>
    
    <script>
        console.log('🧹 Iniciando limpieza de localStorage...');
        
        // Listar todos los items antes de limpiar
        console.log('📋 Items en localStorage antes de limpiar:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            console.log(`- ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`);
        }
        
        // Limpiar tokens específicos de CoomÜnity
        const keysToRemove = [
            'COOMUNITY_AUTH_TOKEN',
            'COOMUNITY_USER_DATA',
            'auth_token',
            'auth_user',
            'token',
            'user',
            'authToken',
            'userToken'
        ];
        
        let removedCount = 0;
        keysToRemove.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log(`✅ Eliminado: ${key}`);
                removedCount++;
            }
        });
        
        // También limpiar sessionStorage
        keysToRemove.forEach(key => {
            if (sessionStorage.getItem(key)) {
                sessionStorage.removeItem(key);
                console.log(`✅ Eliminado de sessionStorage: ${key}`);
                removedCount++;
            }
        });
        
        console.log(`🎉 Limpieza completada. ${removedCount} tokens eliminados.`);
        
        // Actualizar estado en la página
        document.getElementById('status').innerHTML = `
            <h2>✅ Limpieza Completada</h2>
            <p>Se eliminaron ${removedCount} tokens corruptos.</p>
            <p>Puedes cerrar esta pestaña y recargar la SuperApp.</p>
            <button onclick="window.close()">Cerrar</button>
        `;
        
        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
            console.log('🔄 Auto-cerrando ventana...');
            window.close();
        }, 3000);
    </script>
</body>
</html>
EOF

echo "📄 Archivo de limpieza creado en /tmp/clear-auth.html"

# Abrir en navegador para ejecutar la limpieza
if command -v open &> /dev/null; then
    echo "🌐 Abriendo navegador para ejecutar limpieza..."
    open /tmp/clear-auth.html
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Abriendo navegador para ejecutar limpieza..."
    xdg-open /tmp/clear-auth.html
else
    echo "⚠️ No se pudo abrir el navegador automáticamente."
    echo "   Por favor abre manualmente: file:///tmp/clear-auth.html"
fi

echo
echo "📋 INSTRUCCIONES:"
echo "1. Se abrirá una pestaña del navegador"
echo "2. La limpieza se ejecutará automáticamente"
echo "3. La pestaña se cerrará automáticamente"
echo "4. Luego recarga la SuperApp (http://localhost:3002)"

echo
echo "🔧 COMANDOS ALTERNATIVOS MANUALES:"
echo "En las DevTools del navegador, ejecuta:"
echo "localStorage.removeItem('COOMUNITY_AUTH_TOKEN');"
echo "localStorage.removeItem('COOMUNITY_USER_DATA');"
echo "location.reload();" 