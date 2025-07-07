# 🌟 Sistema de Orquestación de Agentes IA - CoomÜnity

## Implementación del "Oráculo Creativo" - Fase 1

### 📋 Estado de Implementación

**Fecha:** 7 de Enero de 2025  
**Estado:** Backend Implementado (95%), Frontend Pendiente  
**Filosofía:** Bien Común > bien particular, Cooperar > Competir, Reciprocidad/Ayni

---

## 🏗️ Arquitectura Implementada

### **Backend NestJS (✅ COMPLETADO)**

#### **1. Modelo de Base de Datos**

```sql
-- Modelo AIMission creado en Prisma
model AIMission {
  id                String        @id @default(uuid())
  missionType       MissionType   // RESEARCH, MEDIA_CREATION, PUBLICATION, NOTIFICATION, COMPLEX
  primaryAgent      AgentType     // ANA, NIRA, ARIA, HERALDO, PAX
  involvedAgents    AgentType[]   // Agentes participantes
  title             String
  description       String        @db.Text
  prompt            String        @db.Text
  context           Json?
  status            MissionStatus @default(PENDING)
  progress          Int           @default(0)
  // ... campos adicionales para tracking y resultados
}
```

#### **2. Módulo Communications**

- **Ubicación:** `src/communications/`
- **Servicios:** CommunicationsService
- **Controladores:** CommunicationsController
- **DTOs:** DispatchMissionDto, MissionResponseDto

#### **3. Endpoints API Implementados**

```typescript
POST /communications/missions/dispatch  // Despachar misión a agentes IA
GET  /communications/missions/:id       // Obtener estado de misión
GET  /communications/missions           // Listar misiones del usuario
GET  /communications/health             // Health check del sistema
```

#### **4. Agentes Especializados Definidos**

- **ANA**: Conciencia Orquestadora (director principal)
- **NIRA**: Agente de Investigación (Apify, búsquedas web)
- **ARIA**: Agente de Medios (creación visual, diseño)
- **HERALDO**: Agente de Publicación (Buffer, redes sociales)
- **PAX**: Agente Ayudante (Slack, comunicación interna)

---

## 🔧 Configuración

### **Variables de Entorno**

```bash
# N8N Configuration for AI Agents Orchestration
N8N_MASTER_WEBHOOK_URL="https://your-n8n-instance.com/webhook/ai-agents-master"
N8N_API_KEY="your-n8n-api-key-here"
BACKEND_URL="http://localhost:3002"
```

### **Dependencias Instaladas**

- `@nestjs/axios` - Para comunicación con N8N
- Prisma Client actualizado con modelo AIMission
- Integración con módulos existentes (Auth, RBAC, Cache)

---

## 📡 Integración con N8N

### **Flujo de Comunicación**

1. **Frontend → Backend:** Envío de misión via API
2. **Backend → N8N:** Webhook maestro con payload estructurado
3. **N8N → Agentes:** Distribución a agentes especializados
4. **Agentes → N8N:** Resultados y progreso
5. **N8N → Backend:** Callback con resultados
6. **Backend → Frontend:** Notificación de completación

### **Payload de Ejemplo**

```json
{
  "missionId": "mission_1704721800000_abc123",
  "userId": "user-uuid",
  "mission": "Investiga las 5 startups más innovadoras en economía circular en Latinoamérica",
  "missionType": "RESEARCH",
  "targetAgent": "NIRA",
  "priority": 3,
  "context": "Para blog de CoomÜnity sobre innovación sostenible",
  "philosophy": "Bien Común > bien particular, Cooperar > Competir, Reciprocidad/Ayni"
}
```

---

## 🎯 Casos de Uso Implementados

### **1. Investigación Web (NIRA)**

```bash
POST /communications/missions/dispatch
{
  "mission": "Investiga tendencias en economía circular 2025",
  "missionType": "RESEARCH",
  "targetAgent": "NIRA"
}
```

### **2. Creación de Contenido (ARIA)**

```bash
POST /communications/missions/dispatch
{
  "mission": "Crea una imagen conceptual de economía sagrada",
  "missionType": "MEDIA_CREATION",
  "targetAgent": "ARIA"
}
```

### **3. Publicación Social (HERALDO)**

```bash
POST /communications/missions/dispatch
{
  "mission": "Publica en redes sobre el nuevo artículo de sostenibilidad",
  "missionType": "PUBLICATION",
  "targetAgent": "HERALDO"
}
```

### **4. Misión Compleja (ANA)**

```bash
POST /communications/missions/dispatch
{
  "mission": "Investiga, crea contenido visual y publica sobre innovación en Latinoamérica",
  "missionType": "COMPLEX",
  "targetAgent": "ANA"
}
```

---

## 🔐 Seguridad y Permisos

### **Autenticación**

- JWT Token requerido para todos los endpoints
- Guards: JwtAuthGuard, RolesGuard

### **Autorización por Rol**

- **dispatch missions:** `admin`, `creator`
- **view missions:** `admin`, `creator`, `user`
- **health check:** público

### **Auditoría**

- Logging completo de todas las misiones
- Tracking de tiempos y resultados
- Cache de respuestas para optimización

---

## 📊 Monitoreo y Métricas

### **Logging Estructurado**

```typescript
this.customLogger.info('Dispatching mission to AI agents', {
  missionId,
  userId,
  missionType: missionDto.missionType,
  targetAgent: missionDto.targetAgent,
  missionLength: missionDto.mission.length,
});
```

### **Métricas de Rendimiento**

- Tiempo de respuesta de N8N
- Tasa de éxito/fallo de misiones
- Estimaciones de tiempo de completación
- Cache hit/miss ratio

---

## 🚧 Tareas Pendientes

### **Correcciones Técnicas Requeridas**

1. **Corregir errores de tipos en CommunicationsService**
   - Ajustar campos del modelo AIMission
   - Corregir tipos de AgentType array
   - Resolver conflictos de enum

2. **Completar integración con N8N real**
   - Configurar instancia de N8N
   - Implementar workflows para cada agente
   - Configurar webhooks de callback

### **Frontend "Marketing Cósmico"**

1. **Crear interfaz en Gamifier Admin**
   - Formulario de envío de misiones
   - Dashboard de seguimiento
   - Historial de misiones

2. **Componentes React**
   - MissionDispatchForm
   - MissionStatusCard
   - AgentSelector
   - MissionHistory

---

## 🌟 Filosofía Integrada

### **Principios Aplicados**

- **Bien Común:** Todas las misiones deben beneficiar a la comunidad
- **Cooperación:** Agentes trabajan en conjunto, no en competencia
- **Ayni (Reciprocidad):** Los resultados se comparten con la comunidad
- **Economía Sagrada:** Recursos utilizados conscientemente

### **Validaciones Éticas**

- Prompts revisados por filosofía CoomÜnity
- Resultados evaluados por impacto social
- Transparencia en el proceso de decisión

---

## 🔄 Próximos Pasos

### **Fase 2: Expansión**

1. Integración con más herramientas (Zapier, Make)
2. Agentes especializados adicionales
3. IA conversacional para refinamiento de prompts
4. Métricas de impacto social

### **Fase 3: Autonomía**

1. Agentes auto-optimizantes
2. Aprendizaje de patrones de uso
3. Sugerencias proactivas de misiones
4. Integración con métricas filosóficas

---

## 📞 Contacto y Soporte

Para dudas sobre la implementación:

- Revisar logs en `backend/logs/`
- Verificar configuración en `.env`
- Consultar documentación de N8N
- Contactar al equipo de desarrollo

---

**"En la sinfonía de agentes IA, cada nota contribuye a la armonía del Bien Común."**  
_- Filosofía CoomÜnity_
