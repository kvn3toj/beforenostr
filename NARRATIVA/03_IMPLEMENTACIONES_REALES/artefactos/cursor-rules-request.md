# GAMIFIER - CURSOR RULES FOR NEW FEATURES/REQUESTS
# ================================================

## 📋 TEMPLATE PARA NUEVAS FUNCIONALIDADES

**USO**: Copia este template, reemplaza `{REQUEST_DESCRIPTION}` con tu solicitud específica y envía a Cursor AI.

---

### 🎯 SOLICITUD
{REQUEST_DESCRIPTION}

### 🔍 ANÁLISIS REQUERIDO ANTES DE IMPLEMENTAR

1. **Verificación de Stack**:
   - ✅ Confirmar si es frontend (React/MUI), backend (NestJS/Prisma) o fullstack
   - ✅ Identificar componentes/servicios existentes que se puedan reutilizar
   - ✅ Verificar dependencias necesarias

2. **Análisis de Impacto**:
   - ✅ Revisar archivos relacionados que podrían verse afectados
   - ✅ Identificar tipos/interfaces que necesitan actualización
   - ✅ Considerar migraciones de BD si es necesario

3. **Patrones del Proyecto**:
   - ✅ Seguir estructura de carpetas existente (`src/components/features/`, `src/hooks/features/`)
   - ✅ Usar convenciones de naming establecidas
   - ✅ Mantener consistencia con componentes similares

### 🏗️ IMPLEMENTACIÓN STEP-BY-STEP

1. **Backend (si aplica)**:
   - Crear/actualizar DTOs con validaciones apropiadas
   - Implementar service con inyección explícita de dependencias
   - Crear controller con rutas RESTful
   - Actualizar module imports
   - Añadir a `app.module.ts` si es nuevo módulo

2. **Frontend (si aplica)**:
   - Crear interfaces TypeScript para tipos de datos
   - Implementar service para API calls
   - Crear hook personalizado con React Query
   - Implementar componente con estados loading/error/empty
   - Añadir navegación/routing si es necesario

3. **Testing**:
   - Unit tests para servicios backend
   - Component tests para frontend
   - E2E tests para flujos críticos
   - Mocks tipados para dependencias

4. **Documentación**:
   - Comentarios JSDoc para funciones complejas
   - README updates si añade funcionalidad mayor
   - API documentation updates

### 🎨 ESTÁNDARES DE CALIDAD

- **Error Handling**: Try-catch en backend, Error boundaries en frontend
- **Loading States**: Spinners/skeletons para mejor UX
- **Accessibility**: ARIA labels y semantic HTML
- **Performance**: Memoización donde sea apropiado
- **Types**: Strict typing, no `any` types
- **Validation**: Input validation en frontend y backend

### 🧪 VERIFICACIÓN FINAL

1. **Funcionalidad**: Feature trabajando end-to-end
2. **Tests**: Todos los tests pasando
3. **Types**: No errores de TypeScript
4. **Linting**: ESLint y Prettier sin warnings
5. **Performance**: No re-renders innecesarios
6. **Accessibility**: Navegación con keyboard funciona

### 🚀 DEPLOYMENT CHECKLIST

- [ ] Variables de entorno necesarias documentadas
- [ ] Migraciones de BD aplicadas si es necesario
- [ ] Build de producción exitoso
- [ ] Tests E2E pasando en ambiente similar a producción

---

## 📝 EJEMPLOS DE USO

### Para Feature Frontend:
```
SOLICITUD: Crear página de gestión de usuarios con tabla, filtros y acciones CRUD

{análisis y implementación siguiendo template anterior}
```

### Para Feature Backend:
```
SOLICITUD: Implementar API endpoint para analytics de engagement de videos

{análisis y implementación siguiendo template anterior}
```

### Para Feature Fullstack:
```
SOLICITUD: Sistema de notificaciones en tiempo real para administradores

{análisis y implementación siguiendo template anterior}
```

---

**NOTA**: Este template asegura implementaciones consistentes, mantenibles y alineadas con la arquitectura del proyecto GAMIFIER. 