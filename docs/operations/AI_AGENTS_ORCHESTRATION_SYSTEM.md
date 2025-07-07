# 🌟 Sistema de Orquestación de Agentes IA - CoomÜnity

## Fase 1: "El Oráculo Creativo"

### 📋 Resumen Ejecutivo

El Sistema de Orquestación de Agentes IA de CoomÜnity es una implementación de la filosofía **"Bien Común > bien particular, Cooperar > Competir, Reciprocidad/Ayni"** aplicada a la inteligencia artificial. Este sistema permite coordinar múltiples agentes especializados para ejecutar misiones complejas de marketing, investigación y creación de contenido.

### 🎯 Filosofía del Sistema

**Principios Fundamentales:**

- **Bien Común**: Cada misión debe contribuir al florecimiento colectivo
- **Cooperación**: Los agentes trabajan en sinfonía, no en competencia
- **Reciprocidad/Ayni**: Balance energético en todas las interacciones
- **Metanöia**: Transformación consciente a través de la tecnología
- **Neguentropía**: Creación de orden y valor desde el caos informacional

### 🤖 Agentes Especializados

#### 🧠 ANA - Conciencia Orquestadora

- **Rol**: Director principal y coordinador maestro
- **Responsabilidades**:
  - Análisis y descomposición de misiones complejas
  - Asignación inteligente de tareas a agentes especializados
  - Supervisión del flujo de trabajo completo
  - Toma de decisiones estratégicas
- **Filosofía**: Actúa como la "conciencia colectiva" del sistema

#### 🔍 NIRA - Agente de Investigación

- **Rol**: Especialista en búsqueda y análisis de información
- **Herramientas**: Apify, búsquedas web avanzadas, análisis de datos
- **Responsabilidades**:
  - Investigación de mercado y tendencias
  - Análisis competitivo
  - Recopilación de datos relevantes
  - Verificación de información
- **Filosofía**: Busca la verdad para el bien común

#### 🎨 ARIA - Agente de Medios

- **Rol**: Creador de contenido visual y multimedia
- **Herramientas**: DALL-E, Midjourney, herramientas de diseño
- **Responsabilidades**:
  - Creación de imágenes conceptuales
  - Diseño de materiales promocionales
  - Producción de contenido visual
  - Optimización para diferentes plataformas
- **Filosofía**: Belleza que inspira transformación

#### 📢 HERALDO - Agente de Publicación

- **Rol**: Especialista en distribución y redes sociales
- **Herramientas**: Buffer, APIs de redes sociales, programación de contenido
- **Responsabilidades**:
  - Publicación automatizada en redes sociales
  - Optimización de horarios de publicación
  - Análisis de engagement
  - Gestión de campañas multi-plataforma
- **Filosofía**: Mensajero del bien común digital

#### 🤝 PAX - Agente Ayudante

- **Rol**: Facilitador de comunicación interna
- **Herramientas**: Slack, sistemas de notificación, reportes
- **Responsabilidades**:
  - Comunicación con el equipo humano
  - Notificaciones de progreso
  - Reportes de estado
  - Coordinación de feedback
- **Filosofía**: Puente entre la inteligencia artificial y humana

### 🏗️ Arquitectura Técnica

#### Backend NestJS - Módulo Communications

**Ubicación**: `backend/src/communications/`

**Componentes Principales:**

1. **CommunicationsController**
   - Endpoint principal: `POST /communications/dispatch`
   - Autenticación JWT requerida
   - Roles permitidos: admin, creator, moderator

2. **CommunicationsService**
   - Proxy seguro hacia N8N
   - Gestión de misiones y tracking
   - Cache de respuestas (1 hora)
   - Logging completo de actividades

3. **DTOs (Data Transfer Objects)**
   - `DispatchMissionDto`: Validación de entrada
   - `MissionResponseDto`: Formato de respuesta estándar

4. **Base de Datos - Modelo AIMission**
   ```prisma
   model AIMission {
     id          String        @id @default(cuid())
     missionType MissionType
     targetAgent AgentType?
     content     String
     status      MissionStatus @default(PENDING)
     createdBy   String
     createdAt   DateTime      @default(now())
     updatedAt   DateTime      @updatedAt
     // ... campos adicionales
   }
   ```

#### Enums de Sistema

```typescript
enum MissionType {
  RESEARCH       // Investigación y análisis
  MEDIA_CREATION // Creación de contenido visual
  PUBLICATION    // Publicación en redes sociales
  NOTIFICATION   // Comunicación interna
  COMPLEX        // Misiones multi-agente
}

enum AgentType {
  ANA      // Conciencia Orquestadora
  NIRA     // Agente de Investigación
  ARIA     // Agente de Medios
  HERALDO  // Agente de Publicación
  PAX      // Agente Ayudante
}

enum MissionStatus {
  PENDING      // Creada, esperando procesamiento
  DISPATCHED   // Enviada a N8N
  IN_PROGRESS  // En ejecución
  COMPLETED    // Completada exitosamente
  FAILED       // Falló durante ejecución
  CANCELLED    // Cancelada por usuario
}
```

### 🔗 Integración con N8N

#### Variables de Entorno Requeridas

```bash
# N8N Configuration for AI Agents Orchestration
N8N_MASTER_WEBHOOK_URL="https://your-n8n-instance.com/webhook/ai-agents-master"
N8N_API_KEY="your-n8n-api-key-here"
BACKEND_URL="http://localhost:3002"
```

#### Flujo de Comunicación

1. **Frontend → Backend**: Misión enviada vía API REST
2. **Backend → N8N**: Proxy seguro con autenticación
3. **N8N → Agentes**: Orquestación de workflows
4. **Agentes → Herramientas**: Ejecución de tareas específicas
5. **N8N → Backend**: Webhook de resultados
6. **Backend → Frontend**: Notificación de completación

### 🎮 Interfaz "Marketing Cósmico"

#### Ubicación Planificada

- **Frontend**: Gamifier Admin (puerto 3000)
- **Ruta**: `/marketing-cosmico`
- **Acceso**: Solo usuarios con roles admin, creator, moderator

#### Funcionalidades Planificadas

1. **Panel de Misiones**
   - Formulario de creación de misiones
   - Selector de agente objetivo
   - Configuración de prioridad y contexto

2. **Monitor de Estado**
   - Dashboard en tiempo real
   - Progreso de misiones activas
   - Historial de misiones completadas

3. **Biblioteca de Prompts**
   - Templates predefinidos por tipo de misión
   - Ejemplos de prompts exitosos
   - Guías de mejores prácticas

### 📊 Ejemplos de Uso

#### Ejemplo 1: Investigación de Mercado

```json
{
  "mission": "Investiga las 5 startups más innovadoras en economía circular en Latinoamérica y crea un reporte detallado con sus modelos de negocio",
  "missionType": "RESEARCH",
  "targetAgent": "NIRA",
  "priority": 4,
  "context": "Para artículo del blog de CoomÜnity sobre innovación sostenible"
}
```

#### Ejemplo 2: Campaña Visual Completa

```json
{
  "mission": "Crea una campaña visual completa para el lanzamiento de la funcionalidad UPlay: 3 imágenes conceptuales, copy para redes sociales y programa la publicación para máximo engagement",
  "missionType": "COMPLEX",
  "priority": 5,
  "context": "Lanzamiento de UPlay - enfoque en aprendizaje gamificado y filosofía CoomÜnity"
}
```

### 🔒 Seguridad y Autenticación

#### Medidas Implementadas

1. **Autenticación JWT**: Todos los endpoints requieren token válido
2. **Control de Roles**: Sistema RBAC integrado
3. **Proxy Seguro**: Backend actúa como intermediario con N8N
4. **Validación de Entrada**: DTOs con class-validator
5. **Rate Limiting**: Prevención de abuso (a implementar)
6. **Logging Completo**: Auditoría de todas las operaciones

#### Configuración de Permisos

```typescript
// Roles autorizados para usar el sistema
@Roles('admin', 'creator', 'moderator')
```

### 📈 Métricas y Monitoreo

#### KPIs del Sistema

1. **Eficiencia de Misiones**
   - Tiempo promedio de completación
   - Tasa de éxito/fallo
   - Uso por tipo de agente

2. **Impacto en Contenido**
   - Calidad del contenido generado
   - Engagement en redes sociales
   - Conversión de campañas

3. **Filosofía CoomÜnity**
   - Alineación con principios del Bien Común
   - Impacto en la comunidad
   - Contribución al crecimiento consciente

### 🚀 Roadmap de Desarrollo

#### Fase 1: "El Oráculo Creativo" ✅ COMPLETADA

- [x] Módulo Communications backend
- [x] DTOs y validaciones
- [x] Integración con N8N
- [x] Sistema de tracking de misiones
- [x] Documentación completa

#### Fase 2: "Marketing Cósmico" (En Planificación)

- [ ] Interfaz frontend en Gamifier Admin
- [ ] Dashboard de monitoreo en tiempo real
- [ ] Biblioteca de prompts y templates
- [ ] Sistema de notificaciones push

#### Fase 3: "Sinfonía de Agentes" (Futuro)

- [ ] Agentes adicionales especializados
- [ ] Integración con más herramientas externas
- [ ] Machine Learning para optimización
- [ ] API pública para desarrolladores

### 🛠️ Comandos de Desarrollo

#### Iniciar el Sistema

```bash
# Desde la raíz del monorepo
npm run dev

# O específicamente el backend
npm run dev:backend
```

#### Testing de Endpoints

```bash
# Test de conectividad (solo admin)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3002/communications/test-connection

# Despachar misión de prueba
curl -X POST "http://localhost:3002/communications/dispatch" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "mission": "Crea una imagen conceptual sobre economía circular",
       "missionType": "MEDIA_CREATION",
       "targetAgent": "ARIA"
     }'
```

### 🌟 Filosofía en Acción

Este sistema representa una implementación práctica de los principios CoomÜnity:

- **Bien Común**: Cada agente trabaja para el beneficio colectivo
- **Cooperación**: Los agentes se complementan en lugar de competir
- **Ayni**: Balance energético en el intercambio de información
- **Conciencia**: Tecnología al servicio del despertar humano
- **Neguentropía**: Creación de orden y belleza desde el caos digital

### 📞 Soporte y Contacto

Para soporte técnico o preguntas sobre el sistema:

- **Documentación**: Este archivo y código comentado
- **Logs**: Revisar logs del backend para debugging
- **Configuración**: Verificar variables de entorno N8N

---

**"En la sinfonía de la inteligencia artificial, cada agente es un instrumento único que contribuye a la melodía del Bien Común."** - Filosofía CoomÜnity

---

### 📄 Archivos Relacionados

- Backend: `backend/src/communications/`
- Documentación: `docs/operations/AI_AGENTS_ORCHESTRATION_SYSTEM.md`
- Configuración: `backend/.env`
- Schema: `backend/prisma/schema.prisma` (modelo AIMission)

### 🔄 Última Actualización

**Fecha**: 13 de enero de 2025
**Estado**: Sistema backend completamente implementado y funcional
**Próximo**: Implementación de interfaz frontend "Marketing Cósmico"
