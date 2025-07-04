# 🧪 COMANDOS DE PRUEBA PARA VERIFICAR CONFIGURACIÓN

## **1. Verificar que @Cursor responde**
```
@Cursor help
```
**Resultado esperado**: Lista de comandos disponibles

## **2. Verificar configuración personal**
```
@Cursor list my agents
```
**Resultado esperado**: Lista de agentes activos (puede estar vacía)

## **3. Prueba básica de funcionalidad**
```
@Cursor create a simple hello world function in TypeScript
```
**Resultado esperado**: El agente debería:
- ✅ Clonar tu repositorio automáticamente
- ✅ Crear una rama nueva
- ✅ Agregar el código
- ✅ Crear un Pull Request
- ✅ Notificarte en Slack cuando termine

## **4. Prueba específica para CoomÜnity**
```
@Cursor add a comment to the main App.tsx file explaining the CoomÜnity philosophy
```
**Resultado esperado**: 
- ✅ Encuentra el archivo `Demo/apps/superapp-unified/src/App.tsx`
- ✅ Agrega comentarios sobre Ayni, Bien Común, etc.
- ✅ Crea PR con los cambios

## **5. Verificar que usa los defaults correctos**

Si configuraste correctamente, el agente debería:
- ✅ Usar tu repositorio sin especificarlo
- ✅ Trabajar en la rama `gamifier2.0`
- ✅ Usar el modelo `claude-3.5-sonnet`

## **TROUBLESHOOTING**

### **Si @Cursor no responde:**
1. Verifica que el bot esté en el canal: `/invite @Cursor`
2. Verifica permisos del workspace
3. Revisa que completaste la instalación en https://cursor.com/dashboard

### **Si dice "Repository not found":**
1. Verifica que el nombre del repo sea correcto
2. Asegúrate de que @Cursor tenga acceso a tu GitHub
3. Revisa que el repositorio sea público o que hayas dado permisos

### **Si no puede acceder a la rama:**
1. Verifica que la rama `gamifier2.0` existe
2. Asegúrate de que tienes permisos de escritura
3. Prueba con `main` temporalmente 