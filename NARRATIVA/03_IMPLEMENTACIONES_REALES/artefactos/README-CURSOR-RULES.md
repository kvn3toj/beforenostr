# 🎯 CURSOR AI RULES - PROYECTO GAMIFIER

Este conjunto de reglas está diseñado específicamente para optimizar el trabajo con Cursor AI en el proyecto GAMIFIER, siguiendo las mejores prácticas del artículo ["Getting Better Results from Cursor AI with Simple Rules"](https://medium.com/@aashari/getting-better-results-from-cursor-ai-with-simple-rules-cbc87346ad88).

## 📁 ESTRUCTURA DE ARCHIVOS

### `.cursorrules` (CORE)
**Ubicación**: Raíz del proyecto  
**Propósito**: Reglas fundamentales que Cursor AI debe seguir SIEMPRE  
**Configuración**: Este archivo se carga automáticamente en el proyecto

### `cursor-rules-request.md` (NUEVAS FUNCIONALIDADES)
**Propósito**: Template para solicitar nuevas features o implementaciones  
**Uso**: Copiar contenido, reemplazar placeholders y enviar a Cursor AI

### `cursor-rules-refresh.md` (DEBUGGING & FIXES)
**Propósito**: Template para resolución de problemas y debugging  
**Uso**: Copiar contenido, describir el problema específico y enviar a Cursor AI

## 🚀 CÓMO USAR LAS REGLAS

### 1. CONFIGURACIÓN INICIAL

#### Opción A: Archivo de Proyecto (Recomendado)
El archivo `.cursorrules` ya está configurado en la raíz del proyecto y se aplicará automáticamente.

#### Opción B: Reglas de Usuario Global
1. Abrir Cursor
2. `Cmd + Shift + P` (Mac) o `Ctrl + Shift + P` (Windows/Linux)
3. Buscar "Rules"
4. Seleccionar "User Rules" en el sidebar
5. Pegar el contenido de `.cursorrules`

### 2. PARA NUEVAS FUNCIONALIDADES

**Ejemplo de uso:**

```markdown
🎯 SOLICITUD
Implementar sistema de comentarios para videos con likes/dislikes y respuestas anidadas

🔍 ANÁLISIS REQUERIDO ANTES DE IMPLEMENTAR
1. Verificación de Stack: ✅ Fullstack (React + NestJS + Prisma)
2. Análisis de Impacto: ✅ Requiere nuevas tablas, API endpoints, y componentes UI
3. Patrones del Proyecto: ✅ Seguir estructura /features/comments/

{... seguir template completo de cursor-rules-request.md}
```

**Flujo:**
1. Copia el contenido de `cursor-rules-request.md`
2. Reemplaza `{REQUEST_DESCRIPTION}` con tu solicitud específica
3. Envía el mensaje completo a Cursor AI
4. Cursor seguirá el análisis sistemático y implementación step-by-step

### 3. PARA DEBUGGING Y FIXES

**Ejemplo de uso:**

```markdown
🚨 PROBLEMA REPORTADO
Los tests de Playwright fallan intermitentemente en la verificación de login con error "Element not found: text=Gamifier Admin"

🔍 ANÁLISIS SISTEMÁTICO REQUERIDO
1. Re-evaluación Completa del Contexto: ✅ Revisar selectores y estrategias
2. Verificación de Servicios Base: ✅ Frontend y backend corriendo
3. Revisión de Patrones Comunes: ✅ Verificar anti-patrón de texto hardcodeado

{... seguir template completo de cursor-rules-refresh.md}
```

**Flujo:**
1. Copia el contenido de `cursor-rules-refresh.md`
2. Reemplaza `{ERROR_DESCRIPTION}` con el problema específico
3. Envía el mensaje completo a Cursor AI
4. Cursor realizará un análisis sistemático y resolución comprehensiva

## 🎨 BENEFICIOS ESPECÍFICOS PARA GAMIFIER

### ✅ PROBLEMAS RESUELTOS

1. **Inyección de Dependencias NestJS**: Las reglas fuerzan el uso de `@Inject()` explícito
2. **Tipos Prisma Inconsistentes**: Importaciones desde `../generated/prisma` únicamente
3. **Tests Frágiles**: Múltiples estrategias de verificación en lugar de texto hardcodeado
4. **React Query Errors**: Estados loading/error/empty obligatorios
5. **Arquitectura Inconsistente**: Patrones claros para componentes, hooks y servicios

### 🚀 MEJORAS EN PRODUCTIVIDAD

1. **Análisis Previo**: Cursor entiende el contexto completo antes de implementar
2. **Consistencia**: Todos los cambios siguen los patrones establecidos del proyecto
3. **Quality Gates**: Verificaciones automáticas de tipos, tests y performance
4. **Documentation**: Comentarios JSDoc para funciones complejas

### 🛡️ PREVENCIÓN DE ERRORES

1. **Pre-flight Checks**: Verificación de servicios antes de implementar backend
2. **Type Safety**: TypeScript estricto sin `any` types
3. **Error Boundaries**: Manejo robusto de errores en React
4. **Test Coverage**: Tests automatizados para cada feature

## 📊 MÉTRICAS DE ÉXITO

### Antes de las Reglas:
- ❌ Errores recurrentes de inyección de dependencias
- ❌ Tests frágiles que fallan intermitentemente
- ❌ Inconsistencias en tipos Prisma
- ❌ Componentes sin manejo de errores
- ❌ Tiempo perdido en debugging repetitivo

### Después de las Reglas:
- ✅ Implementaciones consistentes first-time-right
- ✅ Tests robustos con múltiples verification strategies
- ✅ Tipado estricto y consistente
- ✅ Error handling comprehensivo
- ✅ Desarrollo más eficiente y predecible

## 🔧 PERSONALIZACIÓN

Las reglas pueden adaptarse según evolucione el proyecto:

1. **Actualizar `.cursorrules`** para cambios en arquitectura base
2. **Modificar templates** para nuevos patrones específicos
3. **Añadir casos específicos** en la sección de debugging

## 📚 RECURSOS ADICIONALES

- [Cursor AI Official Documentation](https://docs.cursor.sh/)
- [Artículo original sobre reglas](https://medium.com/@aashari/getting-better-results-from-cursor-ai-with-simple-rules-cbc87346ad88)
- [React Best Practices](https://www.uxpin.com/studio/blog/react-best-practices/)
- [Gist con ejemplos de reglas](https://gist.github.com/aashari/07cc9c1b6c0debbeb4f4d94a3a81339e)

---

**¡Con estas reglas, Cursor AI será un colaborador más efectivo y consistente en el desarrollo del proyecto GAMIFIER!** 🚀 