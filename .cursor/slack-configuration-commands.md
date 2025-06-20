# 🔧 COMANDOS DE CONFIGURACIÓN DESDE SLACK

## **CONFIGURAR DEFAULTS PERSONALES**

En cualquier canal de Slack donde tengas acceso a @Cursor:

```
@Cursor settings
```

Esto abrirá un modal donde puedes configurar:

### **Configuración Recomendada para CoomÜnity:**

1. **Default Repository**: 
   ```
   tu-usuario/coomunity
   ```
   (Reemplaza "tu-usuario" con tu username real de GitHub)

2. **Default Branch**: 
   ```
   gamifier2.0
   ```

3. **Default Model**: 
   ```
   claude-3.5-sonnet
   ```

## **CONFIGURAR DEFAULTS DEL CANAL**

Para configurar defaults específicos del canal (todos en el equipo usarán estos):

```
@Cursor settings
```

En el modal, selecciona "Channel Settings" y configura:
- **Repository**: `tu-usuario/coomunity`
- **Branch**: `gamifier2.0`

## **VERIFICAR CONFIGURACIÓN**

Para verificar que está configurado correctamente:

```
@Cursor list my agents
```

O simplemente prueba:

```
@Cursor help
```

## **EJEMPLO DE USO DESPUÉS DE CONFIGURAR**

Una vez configurado, puedes usar simplemente:

```
@Cursor fix the login authentication issue
```

En lugar de:

```
@Cursor [repo=tu-usuario/coomunity] [branch=gamifier2.0] [model=claude-3.5-sonnet] fix the login authentication issue
```

## **COMANDOS ESPECÍFICOS PARA COOMUNITY**

### **Desarrollo de Funcionalidades**
```
@Cursor implement new ÜPlay video player feature with gamification elements
```

### **Corrección de Bugs**
```
@Cursor fix the marketplace product listing not showing correctly
```

### **Testing**
```
@Cursor add E2E tests for the social module using Playwright
```

### **Optimización**
```
@Cursor optimize the SuperApp performance and reduce bundle size
``` 