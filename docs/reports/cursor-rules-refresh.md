# GAMIFIER - CURSOR RULES FOR DEBUGGING & FIXES
# =============================================

## 🔧 TEMPLATE PARA DEBUGGING Y RESOLUCIÓN DE PROBLEMAS

**USO**: Copia este template, reemplaza `{ERROR_DESCRIPTION}` con el problema específico y envía a Cursor AI.

---

### 🚨 PROBLEMA REPORTADO
{ERROR_DESCRIPTION}

### 🔍 ANÁLISIS SISTEMÁTICO REQUERIDO

1. **Re-evaluación Completa del Contexto**:
   - ✅ Revisar TODOS los archivos relacionados, no solo los que se han estado modificando
   - ✅ Verificar dependencias entre componentes/servicios
   - ✅ Comprobar si el problema se replica en diferentes navegadores/entornos
   - ✅ Revisar logs del servidor y consola del navegador

2. **Verificación de Servicios Base**:
   - ✅ Backend corriendo en puerto 3002 (`curl http://localhost:3002/health`)
   - ✅ Frontend accesible en puerto configurado
   - ✅ Base de datos conectada (verificar logs de Prisma)
   - ✅ Variables de entorno cargadas correctamente

3. **Revisión de Patrones Comunes de Error**:
   - ✅ Inyección de dependencias en NestJS (¿están los @Inject() explícitos?)
   - ✅ Hooks de React con dependencias correctas
   - ✅ Types de TypeScript consistentes y correctos
   - ✅ Imports de Prisma desde ubicación correcta
   - ✅ Estado de React Query (loading, error, data)

### 🛠️ ESTRATEGIA DE DEBUGGING

1. **Aislamiento del Problema**:
   - Reproducir el error paso a paso
   - Identificar el punto exacto de falla
   - Verificar si es frontend, backend o integración
   - Comprobar si el error es intermitente o consistente

2. **Revisión de Logs y Errores**:
   - Console.log strategically placed para rastrear flujo
   - Network tab para verificar API calls
   - React DevTools para estado de componentes
   - Backend logs para errores de servidor

3. **Verificación de Integridad**:
   - ¿Los tipos están alineados entre frontend y backend?
   - ¿Las rutas de API coinciden entre servicio y controller?
   - ¿Los DTOs validan correctamente los datos?
   - ¿Los mocks en tests reflejan la realidad?

### 🎯 RESOLUCIÓN SISTEMÁTICA

1. **Root Cause Analysis**:
   - No aplicar fixes superficiales
   - Entender la causa raíz del problema
   - Verificar si hay otros puntos que podrían tener el mismo issue
   - Considerar impacto de la solución en otras partes del sistema

2. **Fix Implementation**:
   - Implementar solución siguiendo patrones del proyecto
   - Mantener consistencia con código existente
   - Añadir validaciones/guards para prevenir recurrencia
   - Actualizar tipos si es necesario

3. **Testing de la Solución**:
   - Verificar que el problema original está resuelto
   - Comprobar que no se han introducido regresiones
   - Probar edge cases relacionados
   - Ejecutar tests automatizados relevantes

### 🧪 VERIFICACIÓN POST-FIX

1. **Funcionalidad Completa**:
   - [ ] Problema original resuelto
   - [ ] No hay regresiones en funcionalidad existente
   - [ ] Error handling apropiado implementado
   - [ ] Performance no degradada

2. **Calidad de Código**:
   - [ ] TypeScript sin errores
   - [ ] ESLint/Prettier sin warnings
   - [ ] Tests actualizados si es necesario
   - [ ] Documentación actualizada si es relevante

3. **Testing Comprehensivo**:
   - [ ] Unit tests pasando
   - [ ] Integration tests verificados
   - [ ] E2E tests para flujo crítico
   - [ ] Manual testing en diferentes scenarios

### 🔬 CASOS ESPECÍFICOS GAMIFIER

#### Error de Inyección de Dependencias (NestJS)
```typescript
// SÍNTOMA: "Cannot resolve dependencies"
// VERIFICAR:
- @Inject() explícitos en constructores
- Service en providers del módulo
- Módulo importado en app.module.ts
- PrismaModule importado donde se necesite
```

#### Error de React Query
```typescript
// SÍNTOMA: "Cannot read properties of undefined"
// VERIFICAR:
- Hook useQuery con queryKey y queryFn correctos
- Service returning proper Promise<T>
- Error boundary para manejar fallos
- Loading state mientras se resuelve
```

#### Error de Tipos Prisma
```typescript
// SÍNTOMA: Type errors con modelos
// VERIFICAR:
- Import desde '../generated/prisma'
- npx prisma generate ejecutado
- Tipos coinciden con schema.prisma
```

#### Error de Playwright Tests
```typescript
// SÍNTOMA: Tests fallando inconsistentemente
// VERIFICAR:
- baseURL configurado en playwright.config.ts
- Rutas relativas en page.goto()
- Múltiples estrategias de verificación
- Timeouts apropiados
```

---

## 📝 EJEMPLOS DE USO

### Para Error de API:
```
PROBLEMA: El endpoint /api/videos devuelve 500 error al intentar obtener lista de videos

{seguir análisis sistemático para identificar si es problema de controller, service, o base de datos}
```

### Para Error de UI:
```
PROBLEMA: El componente VideoItemCard no muestra datos después de hacer fetch exitoso

{revisar hook de React Query, estados de loading/error, y tipos de datos}
```

### Para Error de Tests:
```
PROBLEMA: Tests de Playwright fallan intermitentemente en verificación de login

{aplicar múltiples estrategias de verificación y debugging de selectores}
```

---

**IMPORTANTE**: No hacer cambios incrementales sin entender la causa raíz. Cada fix debe ser comprehensivo y considerar el ecosistema completo del proyecto GAMIFIER. 