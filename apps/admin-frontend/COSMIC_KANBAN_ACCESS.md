# 🌌 ACCESO AL PORTAL KANBAN CÓSMICO

## 📋 INSTRUCCIONES DE ACCESO

### **Opción 1: Acceso Directo (Recomendado)**

Para acceder directamente al Portal Kanban Cósmico, simplemente navega a:

```
http://localhost:3000/cosmic-kanban
```

### **Opción 2: Desde el Menú Principal**

1. Inicia sesión en el Gamifier Admin (http://localhost:3000)
2. Credenciales: admin@gamifier.com / admin123
3. Haz clic en el icono de menú (☰) en la esquina superior izquierda
4. Busca la sección "Gestión CoomÜnity"
5. Dentro de esta sección, haz clic en "Portal Kanban Cósmico"

### **Opción 3: Limpiar Caché y Reiniciar**

Si no ves la sección "Gestión CoomÜnity" o "Portal Kanban Cósmico" en el menú:

1. Cierra sesión si estás autenticado
2. Limpia la caché del navegador:
   - Chrome/Edge: Ctrl+Shift+Del (Windows) o Cmd+Shift+Del (Mac)
   - Firefox: Ctrl+Shift+Del (Windows) o Cmd+Shift+Del (Mac)
   - Safari: Cmd+Alt+E
3. Selecciona "Cookies y datos del sitio" y "Imágenes y archivos en caché"
4. Haz clic en "Borrar datos"
5. Reinicia el navegador
6. Accede nuevamente a http://localhost:3000
7. Inicia sesión con admin@gamifier.com / admin123

### **Opción 4: Script de Acceso Directo**

Si continúas teniendo problemas, puedes usar este script en la consola del navegador:

1. Abre http://localhost:3000 en tu navegador
2. Abre las Herramientas de Desarrollo (F12 o Cmd+Option+I en Mac)
3. Ve a la pestaña "Console"
4. Copia y pega este script:

```javascript
(async function() {
  try {
    // Obtener token de autenticación
    const loginResponse = await fetch('http://localhost:3002/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'admin@gamifier.com', 
        password: 'admin123' 
      })
    });
    
    const authData = await loginResponse.json();
    const token = authData.access_token;
    
    if (!token) {
      console.error('Error: No se pudo obtener el token');
      return;
    }
    
    // Obtener datos del usuario
    const userResponse = await fetch('http://localhost:3002/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const userData = await userResponse.json();
    
    // Guardar datos en localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    
    console.log('✅ Autenticación completada. Redirigiendo al Portal Kanban Cósmico...');
    
    // Redirigir al Portal Kanban Cósmico
    window.location.href = '/cosmic-kanban';
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
```

5. Presiona Enter para ejecutar el script
6. Serás redirigido automáticamente al Portal Kanban Cósmico

## 🔧 SOLUCIÓN DE PROBLEMAS

Si continúas teniendo problemas para acceder al Portal Kanban Cósmico:

1. **Verifica que el backend esté funcionando:**
   ```bash
   curl http://localhost:3002/health
   ```

2. **Verifica que el Gamifier Admin esté funcionando:**
   ```bash
   curl http://localhost:3000
   ```

3. **Reinicia los servicios:**
   ```bash
   # Desde la raíz del proyecto
   cd /Users/kevinp/Movies/GAMIFIER-copy
   pkill -f "vite" && pkill -f "npm run dev"
   npm run dev:admin
   ```

4. **Accede directamente a la URL:**
   http://localhost:3000/cosmic-kanban 
