# 🎯 TEMPLATES DE PROMPTS PARA SLACK - COOMUNITY

## 🚀 **TEMPLATES BÁSICOS**

### **Desarrollo de Funcionalidades**
```
@Cursor [branch=gamifier2.0] 
Implementa [FUNCIONALIDAD] en el módulo [ÜPlay/Marketplace/Social/UStats] de CoomÜnity.

Contexto:
- Monorepo ubicado en /Users/kevinp/Movies/GAMIFIER copy/
- SuperApp en puerto 3001, Backend en puerto 3002
- Usar credenciales admin@gamifier.com/admin123 para testing
- Seguir principios de [Ayni/Bien Común/Mëritos]

Requisitos:
- Ejecutar comandos desde raíz del monorepo únicamente
- Incluir tests E2E con Playwright 1.53.0
- Usar Material UI v7 + Tailwind CSS
- Integrar filosofía CoomÜnity en el diseño
- Verificar funcionamiento en puertos correctos

Entregables:
- Código funcional con tests pasando
- PR con descripción detallada
- Documentación de cambios
```

### **Debugging y Fixes**
```
@Cursor [branch=gamifier2.0]
Debug y corrige el error: [DESCRIPCIÓN_ERROR]

Contexto del Error:
- Componente/Servicio: [UBICACIÓN]
- Síntomas: [DESCRIPCIÓN_SÍNTOMAS]
- Logs relevantes: [LOGS_SI_DISPONIBLES]

Protocolo de Debugging:
1. Verificar servicios en puertos 3001/3002
2. Limpiar procesos múltiples si es necesario
3. Usar credenciales verificadas para testing
4. Ejecutar desde raíz: /Users/kevinp/Movies/GAMIFIER copy/

Validación:
- Tests E2E deben pasar
- Health checks exitosos
- Sin procesos múltiples residuales
```

---

## 🏗️ **TEMPLATES POR MÓDULO**

### **ÜPlay (GPL - Gamified Play List)**
```
@Cursor [branch=gamifier2.0]
Mejora el reproductor de video ÜPlay con [FUNCIONALIDAD_ESPECÍFICA].

Contexto ÜPlay:
- Reproductor interactivo gamificado
- Preguntas, temporizadores, elementos gamificados
- Integrado en SuperApp (puerto 3001)
- Debe otorgar Mëritos por participación

Implementación:
- Usar React Query para datos de video
- Integrar con backend NestJS (puerto 3002)
- Añadir lógica de Öndas por interacciones positivas
- Tests E2E para funcionalidad de video

Filosofía:
- Promover aprendizaje colaborativo (Bien Común)
- Recompensar participación activa (Mëritos)
- Fomentar intercambio de conocimiento (Ayni)
```

### **Marketplace (GMP - Gamified Match Place)**
```
@Cursor [branch=gamifier2.0]
Desarrolla funcionalidad de marketplace: [FUNCIONALIDAD_ESPECÍFICA].

Contexto Marketplace:
- Plataforma de intercambio de valor
- Incluye TANTO productos COMO servicios
- Debe implementar lógica de Ayni (reciprocidad)
- Sistema de Emprendedores Confiables

Implementación:
- Lógica de intercambio equilibrado
- Sistema de reputación basado en Mëritos
- Transacciones con Lükas (moneda interna)
- Tracking de Öndas por contribuciones

Validación:
- Balance de Ayni en transacciones
- Promoción del Bien Común sobre ganancia individual
- Tests de flujos de intercambio completos
```

### **Social Module**
```
@Cursor [branch=gamifier2.0]
Implementa funcionalidad social: [FUNCIONALIDAD_ESPECÍFICA].

Contexto Social:
- Interacciones comunitarias
- Perfiles, mensajería, engagement
- Fomentar colaboración sobre competencia
- Sistema de Emprendedores Confiables

Características:
- Perfiles que muestren contribuciones al Bien Común
- Mensajería que promueva intercambio de valor (Ayni)
- Sistema de reconocimiento por Mëritos
- Tracking de Öndas por interacciones positivas

Filosofía:
- Diseño que fomente confianza y colaboración
- Evitar patrones adictivos o competitivos tóxicos
- Promover construcción de comunidad
```

### **UStats Module**
```
@Cursor [branch=gamifier2.0]
Desarrolla dashboard de estadísticas: [FUNCIONALIDAD_ESPECÍFICA].

Contexto UStats:
- Analytics y métricas de usuario
- Tracking de progreso y rendimiento
- Visualización de contribuciones al Bien Común
- Dashboard de Mëritos y Öndas

Métricas Clave:
- Balance de Ayni (dar vs recibir)
- Contribuciones al Bien Común
- Acumulación de Mëritos
- Generación de Öndas positivas
- Progreso en Emprendedores Confiables

Implementación:
- Charts con Material UI + Tailwind
- Datos en tiempo real del backend
- Gamificación positiva (no adictiva)
```

---

## 🔧 **TEMPLATES TÉCNICOS**

### **Refactoring Arquitectónico**
```
@Cursor [branch=gamifier2.0]
Refactoriza [COMPONENTE/SERVICIO] siguiendo las reglas arquitectónicas de CoomÜnity.

Reglas de Separación:
- Backend: SOLO archivos NestJS en ./src/
- SuperApp: SOLO archivos React en Demo/apps/superapp-unified/src/
- Admin: SOLO archivos React en admin-frontend/src/

Patrones Obligatorios:
- Componentes funcionales únicamente
- React Query para llamadas API
- Context API para estado global
- MUI con sx prop (no styled-components)
- Loading/Error/Empty states obligatorios

Validación:
- Separación arquitectónica estricta
- Tests E2E actualizados
- Filosofía CoomÜnity mantenida
```

### **Integración Backend-Frontend**
```
@Cursor [branch=gamifier2.0]
Integra [FUNCIONALIDAD] entre Backend NestJS y SuperApp React.

Configuración:
- Backend: puerto 3002, endpoints REST
- SuperApp: puerto 3001, React Query
- Autenticación: JWT con credenciales verificadas
- CORS configurado para localhost:2222

Implementación:
- DTOs tipados compartidos
- Error handling consistente
- Loading states apropiados
- Tests de integración E2E

Validación:
- Health checks exitosos
- Autenticación funcionando
- Datos fluyendo correctamente
```

---

## 🧪 **TEMPLATES DE TESTING**

### **Tests E2E con Playwright**
```
@Cursor [branch=gamifier2.0]
Crea tests E2E para [FUNCIONALIDAD] usando Playwright 1.53.0.

Configuración de Tests:
- Directorio: Demo/apps/superapp-unified/e2e/
- Credenciales: admin@gamifier.com/admin123
- VITE_ENABLE_MOCK_AUTH=false
- Puertos: SuperApp 3001, Backend 3002

Patrones de Testing:
- Autenticación real contra backend
- Selectores robustos con data-testid
- Verificación de filosofía CoomÜnity
- Screenshots automáticos en errores

Casos de Prueba:
- Login/logout flow
- Funcionalidad específica del módulo
- Integración backend-frontend
- Responsive design
```

### **TDD (Test-Driven Development)**
```
@Cursor [branch=gamifier2.0]
Implementa [FUNCIONALIDAD] siguiendo TDD para CoomÜnity.

Proceso TDD:
1. Escribir tests que fallen (Red)
2. Implementar código mínimo (Green)
3. Refactorizar manteniendo tests (Refactor)
4. Integrar filosofía CoomÜnity

Herramientas:
- Jest/Vitest para unit tests
- React Testing Library para componentes
- Playwright para E2E
- Credenciales verificadas para integration tests

Validación:
- Todos los tests pasan
- Cobertura de código adecuada
- Principios CoomÜnity integrados
```

---

## 🎨 **TEMPLATES DE UI/UX**

### **Componentes con Filosofía CoomÜnity**
```
@Cursor [branch=gamifier2.0]
Diseña componente UI: [COMPONENTE] que refleje la filosofía CoomÜnity.

Principios de Diseño:
- Promover Bien Común sobre beneficio individual
- Visualizar balance de Ayni (reciprocidad)
- Mostrar progreso en Mëritos de forma no adictiva
- Integrar Öndas como feedback positivo

Implementación:
- Material UI v7 + Tailwind CSS
- Responsive design obligatorio
- Accesibilidad con aria-labels
- Loading/Error/Empty states

Filosofía Visual:
- Colores que inspiren confianza y colaboración
- Iconografía que represente intercambio equilibrado
- Feedback positivo sin crear adicción
- Diseño que fomente reflexión sobre impacto comunitario
```

---

## 🔄 **TEMPLATES DE ITERACIÓN**

### **Follow-up Instructions**
```
@Cursor 
Mejora la implementación anterior considerando:

Feedback Recibido:
- [COMENTARIOS_DEL_EQUIPO]
- [RESULTADOS_DE_TESTING]
- [OBSERVACIONES_DE_UX]

Ajustes Requeridos:
- [CAMBIOS_ESPECÍFICOS]
- [OPTIMIZACIONES_NECESARIAS]
- [CORRECCIONES_DE_BUGS]

Mantener:
- Filosofía CoomÜnity integrada
- Arquitectura monorepo respetada
- Tests E2E funcionando
- Puertos correctos (3001/3002)
```

### **Code Review Integration**
```
@Cursor
Aplica feedback del code review al PR [#NÚMERO]:

Comentarios a Resolver:
- [LISTA_DE_COMENTARIOS]

Estándares CoomÜnity:
- Verificar integración de principios filosóficos
- Confirmar separación arquitectónica
- Validar uso de credenciales correctas
- Asegurar tests E2E actualizados

Entregable:
- PR actualizado con cambios
- Respuestas a comentarios de review
- Tests pasando al 100%
```

---

**Estos templates aseguran prompts consistentes, específicos y alineados con la arquitectura y filosofía de CoomÜnity.** 