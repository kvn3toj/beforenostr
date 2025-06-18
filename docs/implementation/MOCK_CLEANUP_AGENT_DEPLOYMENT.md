# 🤖 AGENTE DE LIMPIEZA MASIVA DE MOCKS - DEPLOYMENT GUIDE

## 📋 Resumen Ejecutivo

Este documento describe el **Mock Cleanup Background Agent** optimizado para Claude Sonnet, diseñado para eliminar sistemáticamente todos los datos mock y hardcodeados de la SuperApp CoomÜnity, conectándola completamente con el backend NestJS real.

## 🎯 Objetivos del Agente

### Objetivo Principal

Transformar la SuperApp de un estado con **458 funciones mock** a una aplicación **100% dinámica** conectada al backend NestJS.

### Objetivos Específicos

1. **Eliminar getMockQuestions()** del módulo ÜPlay
2. **Migrar configuración elemental** del módulo Home
3. **Eliminar archivos mock completos** (marketplaceMockData.ts, lets-mock-service.ts)
4. **Limpiar useRealBackendData.ts** de lógica Builder.io forzada
5. **Documentar endpoints backend faltantes**
6. **Generar PR con reporte detallado**

## 🧠 Optimización Claude Sonnet

### Características de Optimización

- **Tokens estimados**: ~326 tokens por comando
- **Temperatura**: 0.1 (máxima precisión)
- **Procesamiento por fases** para eficiencia
- **JSON compacto** sin espacios innecesarios
- **Prompts concisos** y directos

### Técnicas Aplicadas

Basado en [mejores prácticas de optimización de tokens](https://levelup.gitconnected.com/reduce-your-openai-api-costs-by-70-a9f123ce55a6):

1. **Eliminación de palabras innecesarias**: "please", "kindly", "very"
2. **Abreviaciones inteligentes**: "cfg" en lugar de "configuration"
3. **JSON minificado**: Sin espacios, formato compacto
4. **Prompts estructurados**: Formato específico y directo
5. **Batch processing**: Múltiples tareas por fase

## 🗂️ Estructura del Agente

### Archivos Principales

```
scripts/
├── mock-cleanup-background-agent.js     # Agente principal
├── slack-mock-cleanup-dispatcher.js     # Dispatcher para Slack
├── claude-token-optimizer.js            # Optimizador de tokens
└── claude-sonnet-integration-agent.js   # Integración Claude Sonnet
```

### Comandos NPM

```bash
npm run mock-cleanup-agent      # Ejecutar agente principal
npm run mock-cleanup-dispatch   # Enviar comando a Slack
```

## 🚀 Fases de Ejecución

### Fase 1: ÜPlay Critical (CRÍTICA)

**Duración estimada**: 2-3 horas
**Prioridad**: CRITICAL

**Archivos objetivo**:

- `EnhancedInteractiveVideoPlayer.tsx`
- `useVideoQuestions.ts`

**Acciones**:

- Eliminar `getMockQuestions()` y datos hardcodeados
- Integrar `useVideoQuestions` hook para preguntas dinámicas
- Habilitar llamadas backend comentadas
- Agregar estados de carga cósmicos

**Endpoint backend**: `/video-items/:videoId/questions`

### Fase 2: Home Optimization (ALTA)

**Duración estimada**: 1-2 horas
**Prioridad**: HIGH

**Archivos objetivo**:

- `useElementalConfig.ts`
- `useAyniMetrics.ts`

**Acciones**:

- Migrar `elementConfig` a hooks dinámicos
- Conectar métricas Ayni a endpoints backend
- Eliminar configuración hardcodeada

**Endpoints backend**:

- `/config/elemental-system`
- `/users/:userId/ayni-metrics`

### Fase 3: Global Cleanup (MEDIA)

**Duración estimada**: 3-4 horas
**Prioridad**: MEDIUM

**Archivos objetivo**:

- `marketplaceMockData.ts` (eliminar completo)
- `lets-mock-service.ts` (eliminar completo)
- `useRealBackendData.ts` (limpiar lógica Builder.io)

**Acciones**:

- Eliminar archivos mock completos
- Limpiar lógica de mock forzada en Builder.io
- Establecer `fallbackData: []` en hooks de React Query
- Documentar endpoints faltantes

### Fase 4: Verification & PR (ALTA)

**Duración estimada**: 1 hora
**Prioridad**: HIGH

**Acciones**:

- Ejecutar tests E2E relevantes
- Verificar integridad del sistema
- Generar commit estructurado
- Crear PR con reporte detallado

## 📊 Endpoints Backend Verificados

Según los logs del backend adjuntos, estos endpoints están **funcionando**:

✅ **Video Items**: `/video-items` (6 items encontrados)
✅ **LETS**: `/lets/ping`, `/lets/balance/:userId`, `/lets/history/:userId`
✅ **Marketplace**: `/marketplace/ping`, `/marketplace/items`
✅ **Social**: `/social/publications` (2 publicaciones encontradas)
✅ **Notifications**: `/notifications/user/:userId`

## 🔗 Endpoints Backend Necesarios

El agente documentará automáticamente estos endpoints faltantes:

❌ **Analytics**: `/analytics/dashboard-metrics`
❌ **Config**: `/config/elemental-system`
❌ **Metrics**: `/users/:userId/ayni-metrics`
❌ **Questions**: `/video-items/:videoId/questions`

## 📋 Comando para Slack

### Comando Optimizado Completo

```
@Cursor [branch=gamifier2.0] [model=claude-3-sonnet-20240229]

**🎯 OBJETIVO:** Eliminar TODOS los mocks de SuperApp, conectar a backend NestJS

**⚡ OPTIMIZACIÓN CLAUDE SONNET:**
- Tokens estimados: ~326
- Temperatura: 0.1
- Procesamiento por fases para máxima eficiencia

**🚨 FASE 1 - CRÍTICA (ÜPlay):**
```

Files: EnhancedInteractiveVideoPlayer.tsx, useVideoQuestions.ts
Actions: Remove getMockQuestions() | Enable backend calls | Add cosmic loading
Backend: /video-items/:videoId/questions

```

**📈 FASE 2 - ALTA (Home):**
```

Files: useElementalConfig.ts, useAyniMetrics.ts
Actions: Migrate to dynamic hooks | Connect backend endpoints
Endpoints: /config/elemental-system, /users/:userId/ayni-metrics

```

**🧹 FASE 3 - GLOBAL (Cleanup):**
```

Files: marketplaceMockData.ts, lets-mock-service.ts, useRealBackendData.ts
Actions: Delete mock files | Clean Builder.io logic | Set fallbackData:[]
Target: Eliminar lógica Builder.io y archivos mock completos

```

**✅ BACKEND VERIFICADO:**
• /video-items (✅ funcionando)
• /lets/ping (✅ funcionando)
• /marketplace/ping (✅ funcionando)
• /social/publications (✅ funcionando)

**📋 REGLAS OBLIGATORIAS:**
• Ejecutar desde raíz monorepo ÚNICAMENTE
• Backend NestJS puerto 3002 OBLIGATORIO
• Tests E2E después de cada fase
• Documentar endpoints faltantes
• Generar PR con reporte detallado

**🎁 ENTREGABLES:**
• Archivos modificados con lista completa
• Endpoints backend necesarios (URL + descripción)
• Tests E2E exitosos
• Commit con mensaje estructurado
• PR listo para review

**🚀 EJECUTAR:** `npm run mock-cleanup-agent` desde raíz del monorepo

---
*Generado por Mock Cleanup Dispatcher v1.0 | Optimizado para Claude Sonnet*
```

## 🛠️ Instrucciones de Ejecución

### Paso 1: Generar Comando

```bash
npm run mock-cleanup-dispatch
```

### Paso 2: Copiar y Pegar en Slack

Copiar el comando generado y pegarlo en el canal `#coomunity-dev`

### Paso 3: Monitorear Progreso

El agente generará reportes automáticos en `docs/reports/`

### Paso 4: Revisar PR

Una vez completado, revisar el PR generado automáticamente

## 📊 Métricas Esperadas

### Antes de la Limpieza

- **458 funciones mock** identificadas
- **1 array hardcodeado**
- **93 referencias Builder.io/Mock**
- **312 patrones fallback**

### Después de la Limpieza

- **0 funciones mock** (objetivo)
- **100% datos dinámicos** del backend
- **Endpoints faltantes documentados**
- **Tests E2E al 100%**

## 🔧 Troubleshooting

### Error: Backend no disponible

```bash
# Verificar backend
curl http://localhost:3002/health

# Iniciar si es necesario
npm run dev:backend
```

### Error: Rama incorrecta

```bash
# Cambiar a rama correcta
git checkout gamifier2.0
```

### Error: Archivos no encontrados

```bash
# Verificar estructura
ls -la scripts/mock-cleanup-*
```

## 📈 Beneficios Esperados

### Técnicos

- **Reducción 100% de mocks** en la SuperApp
- **Integración completa** con backend NestJS
- **Código más limpio** y mantenible
- **Tests más robustos** con datos reales

### Negocio

- **SuperApp lista para beta** con datos reales
- **Experiencia de usuario mejorada** con datos dinámicos
- **Escalabilidad garantizada** sin dependencias mock
- **Tiempo de desarrollo reducido** en futuras features

## 🎯 Próximos Pasos

1. **Ejecutar el comando** en Slack
2. **Monitorear progreso** del agente
3. **Revisar PR generado** automáticamente
4. **Implementar endpoints faltantes** en backend (si es necesario)
5. **Validar manualmente** funcionalidades críticas
6. **Preparar para beta launch** con SuperApp 100% dinámica

---

**Fecha de creación**: 18 de junio, 2025
**Versión**: 1.0.0
**Autor**: Mock Cleanup Background Agent Team
**Estado**: Listo para deployment
