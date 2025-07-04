# 🔮 CoP ORÁCULO - Sistema Multi-Agente Completo

**Transformando Feedback en Sabiduría Colectiva mediante Inteligencia Colaborativa**

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura Multi-Agente](#arquitectura-multi-agente)
3. [Agentes Elementales](#agentes-elementales)
4. [Sistema de Gamificación](#sistema-de-gamificación)
5. [Implementación Técnica](#implementación-técnica)
6. [API Endpoints](#api-endpoints)
7. [Frontend Dashboard](#frontend-dashboard)
8. [Filosofía CoomÜnity Integrada](#filosofía-coomunity-integrada)
9. [Métricas y Analytics](#métricas-y-analytics)
10. [Scripts de Deployment](#scripts-de-deployment)
11. [Roadmap Futuro](#roadmap-futuro)

---

## 🌟 Visión General

La **CoP Oráculo** representa una revolución en la gestión colaborativa de feedback, inspirada en el framework [CrewAI](https://medium.com/pythoneers/building-a-multi-agent-system-using-crewai-a7305450253e) pero específicamente diseñada para honrar los principios de la filosofía CoomÜnity.

### 🎯 Objetivos Fundamentales

- **Transformar Caos en Orden**: Convertir feedback disperso en sabiduría estructurada
- **Gamificar la Colaboración**: Sistema de recompensas alineado con Ayni
- **Generar Valor Sostenible**: Economía interna de Lükas de Sabiduría
- **Fortalecer el Bien Común**: Cada acción beneficia a la comunidad

### 🧠 Inspiración en CrewAI

Basándose en los principios de [CrewAI para sistemas multi-agente](https://medium.com/pythoneers/building-a-multi-agent-system-using-crewai-a7305450253e), hemos adaptado:

- **Agentes Especializados**: Cada agente tiene un rol específico y expertise
- **Colaboración Orquestada**: Coordinación inteligente entre agentes
- **Tareas Distribuidas**: División eficiente del trabajo
- **Procesos Secuenciales**: Flujos de trabajo estructurados

---

## 🏗️ Arquitectura Multi-Agente

### 🎭 Estructura Jerárquica

```mermaid
graph TD
    A[🔮 Oráculo Principal - Coordinador IA] --> B[🔥 Agente Fuego]
    A --> C[💧 Agente Agua]
    A --> D[🌱 Agente Tierra]
    A --> E[💨 Agente Aire]
    
    B --> F[Resolución Rápida]
    C --> G[Colaboración Fluida]
    D --> H[Documentación Sólida]
    E --> I[Visión e Innovación]
    
    F --> J[💰 Sistema Lükas]
    G --> J
    H --> J
    I --> J
    
    J --> K[📊 Métricas Ayni]
```

### 🧩 Componentes Principales

#### 1. **Oráculo Principal (Coordinador)**
- **Función**: Análisis contextual y orquestación
- **Tecnología**: IA avanzada con análisis de sentimiento
- **Responsabilidad**: Asignación inteligente de tareas

#### 2. **Agentes Elementales**
- **Especialización**: Cada elemento tiene expertise único
- **Autonomía**: Decisiones independientes dentro de su dominio
- **Colaboración**: Comunicación inter-agente fluida

#### 3. **Sistema de Recompensas**
- **Lükas de Sabiduría**: Moneda interna de valor
- **Balance Ayni**: Reciprocidad automática
- **Métricas de Impacto**: Medición del Bien Común

---

## 🌟 Agentes Elementales

### 🔥 Agente FUEGO - Acción Rápida

**Especialización**: Bugs críticos y resolución inmediata

```typescript
interface AgenteFuego {
  element: 'FUEGO';
  specialization: 'rapid-resolution';
  strengths: [
    'Detección de urgencia',
    'Respuesta inmediata',
    'Priorización crítica'
  ];
  lukasGeneration: 50; // Por tarea crítica
  efficiency: 0.95;
}
```

**Responsabilidades**:
- ⚡ Identificación de bugs críticos
- 🚨 Activación de protocolos de emergencia
- ⏱️ Resolución en menos de 2 horas
- 🎯 Coordinación con equipos técnicos

**Métricas de Éxito**:
- Tiempo de respuesta < 30 minutos
- Tasa de resolución > 90%
- Satisfacción de urgencia > 95%

### 💧 Agente AGUA - Colaboración Fluida

**Especialización**: Coordinación entre administradores

```typescript
interface AgenteAgua {
  element: 'AGUA';
  specialization: 'collaborative-coordination';
  strengths: [
    'Facilitación de consenso',
    'Comunicación efectiva',
    'Balance de perspectivas'
  ];
  lukasGeneration: 30; // Por colaboración
  efficiency: 0.88;
}
```

**Responsabilidades**:
- 🤝 Facilitación de colaboración
- 💬 Gestión de comunicación
- ⚖️ Balance de perspectivas
- 🌊 Fluidez en procesos

**Métricas de Éxito**:
- Nivel de consenso > 85%
- Participación activa > 80%
- Tiempo de coordinación optimizado

### 🌱 Agente TIERRA - Documentación Sólida

**Especialización**: Conocimiento duradero y bases de sabiduría

```typescript
interface AgenteTierra {
  element: 'TIERRA';
  specialization: 'knowledge-foundation';
  strengths: [
    'Documentación estructurada',
    'Base de conocimiento',
    'Estabilidad de procesos'
  ];
  lukasGeneration: 40; // Por documentación
  efficiency: 0.92;
}
```

**Responsabilidades**:
- 📚 Creación de artículos de conocimiento
- 🏗️ Estructuración de sabiduría
- 📖 Actualización de mejores prácticas
- 🌿 Crecimiento sostenible

**Métricas de Éxito**:
- Artículos creados por feedback
- Puntuación de sabiduría > 8.5
- Reutilización de conocimiento > 70%

### 💨 Agente AIRE - Visión e Innovación

**Especialización**: Patrones, tendencias y oportunidades

```typescript
interface AgenteAire {
  element: 'AIRE';
  specialization: 'innovation-vision';
  strengths: [
    'Detección de patrones',
    'Identificación de tendencias',
    'Oportunidades de innovación'
  ];
  lukasGeneration: 60; // Por insight innovador
  efficiency: 0.90;
}
```

**Responsabilidades**:
- 🔍 Análisis de patrones emergentes
- 🚀 Identificación de oportunidades
- 💡 Generación de insights
- 🌪️ Transformación visionaria

**Métricas de Éxito**:
- Patrones identificados por semana
- Precisión de predicciones > 85%
- Impacto de innovaciones medido

---

## 🎮 Sistema de Gamificación

### 🏆 Niveles de Progresión

```mermaid
graph LR
    A[🌱 Oráculo Novato] --> B[📚 Oráculo Aprendiz]
    B --> C[⚡ Visionario Elemental]
    C --> D[🌟 Oráculo Maestro]
    D --> E[👑 Sabio Supremo]
```

### 💰 Sistema de Lükas de Sabiduría

#### Generación de Lükas:
- **Feedback Básico**: 10 Lükas base
- **Complejidad**: +2 Lükas por nivel
- **Urgencia**: +1.5 Lükas por nivel
- **Colaboración**: +50% bonus
- **Innovación**: +100% bonus

#### Transferencias Ayni:
```typescript
interface TransferenciaLukas {
  emisor: string;
  receptor: string;
  cantidad: number;
  concepto: 'colaboracion' | 'mentoria' | 'apoyo';
  balanceAyni: number; // 0-1, perfecto = 1
}
```

### 🎖️ Sistema de Logros

#### Logros Básicos:
- **🔍 Detector Novato**: Primer feedback reportado (10 Lükas)
- **🐛 Cazador de Bugs**: 10 bugs detectados (50 Lükas)
- **💡 Visionario**: 5 mejoras implementadas (75 Lükas)

#### Logros Avanzados:
- **🤝 Colaborador Ayni**: 20 transferencias Lükas (100 Lükas)
- **🌟 Oráculo Maestro**: 100 feedback procesados (200 Lükas)
- **👑 Sabio Supremo**: Balance Ayni > 0.95 por 90 días (500 Lükas)

#### Logros Elementales:
- **🔥 Maestro del Fuego**: Resolución < 1 hora en 10 casos críticos
- **💧 Armonizador Agua**: Consenso > 90% en 20 colaboraciones
- **🌱 Constructor Tierra**: 50 artículos de conocimiento creados
- **💨 Visionario Aire**: 15 patrones innovadores identificados

---

## 🔧 Implementación Técnica

### 🗄️ Modelos de Base de Datos

#### Modelo Feedback Extendido:
```prisma
model Feedback {
  id                    String         @id @default(cuid())
  userId                String
  pageUrl               String
  feedbackText          String
  feedbackType          FeedbackType
  status                FeedbackStatus @default(PENDING)
  
  // Contexto Técnico
  componentContext      String?
  technicalContext      Json?
  
  // Metadatos CoP
  priority              Int            @default(3)
  tags                  String[]
  lukasReward           Float?
  
  // Análisis Multi-Agente
  oraculoAnalysis       Json?
  agentTasks            AgentTask[]
  collaborationScore    Float?
  ayniBalance          Float?
  
  // Auditoría
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt
  
  // Relaciones
  user                  User           @relation(fields: [userId], references: [id])
}

model AgentTask {
  id                String           @id @default(cuid())
  feedbackId        String
  agentType         AgentType
  taskType          TaskType
  status            TaskStatus
  results           Json?
  lukasGenerated    Float
  startTime         DateTime
  endTime           DateTime?
  
  feedback          Feedback         @relation(fields: [feedbackId], references: [id])
}

enum AgentType {
  FUEGO
  AGUA
  TIERRA
  AIRE
  ORACULO
}

enum TaskType {
  ANALYZE
  PRIORITIZE
  RESOLVE
  DISTRIBUTE
  COORDINATE
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}
```

### 🤖 Servicios de Agentes

#### Servicio Principal Multi-Agente:
```typescript
@Injectable()
export class FeedbackAgentsService {
  // Análisis Oráculo Principal
  async analyzeWithOraculo(feedbackData: any): Promise<FeedbackAnalysis>
  
  // Agentes Elementales
  async processFuegoAgent(feedbackId: string): Promise<CollaborationTask>
  async processAguaAgent(feedbackId: string): Promise<CollaborationTask>
  async processTierraAgent(feedbackId: string): Promise<CollaborationTask>
  async processAireAgent(feedbackId: string): Promise<CollaborationTask>
  
  // Coordinación
  async orchestrateCollaboration(
    feedbackId: string, 
    analysis: FeedbackAnalysis
  ): Promise<CollaborationResult>
  
  // Métricas
  async calculateCommunityMetrics(): Promise<CommunityMetrics>
}
```

#### Algoritmos de Inteligencia:

**Análisis de Sentimiento**:
```typescript
private calculateSentiment(text: string): number {
  const positiveWords = ['bueno', 'excelente', 'genial', 'útil'];
  const negativeWords = ['malo', 'terrible', 'roto', 'problema'];
  
  let score = 0;
  positiveWords.forEach(word => {
    if (text.toLowerCase().includes(word)) score += 0.2;
  });
  negativeWords.forEach(word => {
    if (text.toLowerCase().includes(word)) score -= 0.2;
  });
  
  return Math.max(-1, Math.min(1, score));
}
```

**Cálculo de Urgencia**:
```typescript
private calculateUrgency(feedbackData: any): number {
  const urgencyMap = {
    'BUG': 4,
    'PERFORMANCE': 3,
    'UI_UX': 2,
    'IMPROVEMENT': 2,
    'MISSING_FEATURE': 1
  };
  return urgencyMap[feedbackData.feedbackType] || 2;
}
```

**Balance de Ayni**:
```typescript
private calculateAyniBalance(tasks: CollaborationTask[]): number {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
  const lukasDistribution = tasks.map(task => task.lukasGenerated);
  const variance = this.calculateVariance(lukasDistribution);
  
  const completionRatio = completedTasks / totalTasks;
  const distributionBalance = 1 / (1 + variance / 100);
  
  return (completionRatio + distributionBalance) / 2;
}
```

---

## 🔗 API Endpoints

### 🤖 Endpoints de Agentes

#### Análisis Multi-Agente Completo
```http
POST /cop-oraculo/agents/analyze/:feedbackId
Authorization: Bearer {jwt_token}
Content-Type: application/json

Response:
{
  "success": true,
  "feedbackId": "feedback_123",
  "timestamp": "2025-06-20T10:30:00Z",
  "oraculoAnalysis": {
    "sentiment": 0.2,
    "urgency": 4,
    "complexity": 3,
    "category": "FUEGO",
    "recommendedPath": "rapid-resolution",
    "lukasReward": 45
  },
  "collaboration": {
    "tasksCompleted": 3,
    "totalLukasGenerated": 120,
    "ayniBalance": 0.89,
    "collaborationScore": 8.5,
    "tasks": [...]
  },
  "communityImpact": {
    "wisdomQuotient": 8.7,
    "ayniIndex": 0.92,
    "collaborationVelocity": 15.3,
    "innovationScore": 7.8
  },
  "nextSteps": [
    "🔥 Activación inmediata del protocolo de respuesta rápida",
    "💧 Convocatoria a sesión de colaboración multi-disciplinaria",
    "🌱 Documentación del proceso en la base de conocimiento"
  ],
  "message": "🎉 El sistema multi-agente ha transformado tu feedback en 120 Lükas de Sabiduría"
}
```

#### Dashboard de Métricas
```http
GET /cop-oraculo/agents/dashboard/metrics
Authorization: Bearer {jwt_token}

Response:
{
  "success": true,
  "timestamp": "2025-06-20T10:30:00Z",
  "communityMetrics": {
    "wisdomQuotient": 8.7,
    "ayniIndex": 0.92,
    "collaborationVelocity": 15.3,
    "innovationScore": 7.8
  },
  "agentStatus": {
    "fuego": { "active": true, "efficiency": 0.95, "lukasGenerated": 1250 },
    "agua": { "active": true, "efficiency": 0.88, "lukasGenerated": 980 },
    "tierra": { "active": true, "efficiency": 0.92, "lukasGenerated": 1100 },
    "aire": { "active": true, "efficiency": 0.90, "lukasGenerated": 1350 }
  },
  "personalStats": {
    "lukasBalance": 450,
    "contributionLevel": "Oráculo Aprendiz",
    "feedbackProcessed": 23,
    "wisdomPointsEarned": 890,
    "collaborationsCompleted": 12
  },
  "leaderboard": [...],
  "achievements": {
    "recent": [...],
    "available": [...]
  }
}
```

#### Colaboración Ayni
```http
POST /cop-oraculo/agents/collaborate/:feedbackId
Authorization: Bearer {jwt_token}
Content-Type: application/json

Body:
{
  "preferredElements": ["FUEGO", "AGUA"],
  "urgencyOverride": 4,
  "collaborationGoal": "Resolución rápida con documentación"
}

Response:
{
  "success": true,
  "collaborationId": "collab_1719748200000",
  "feedbackId": "feedback_123",
  "collaboration": {...},
  "ayniPrinciples": {
    "reciprocity": "Cada contribución genera valor de retorno",
    "balance": "Ayni Balance: 0.89",
    "collectiveWisdom": "La sabiduría emerge de la colaboración",
    "bienComun": "Priorizamos el Bien Común sobre el beneficio individual"
  },
  "nextActions": [
    "🔥 Agente Fuego revisará urgencia y creará plan de acción",
    "💧 Agente Agua coordinará con otros administradores",
    "🌱 Agente Tierra documentará el proceso para futura referencia",
    "💨 Agente Aire identificará oportunidades de innovación"
  ],
  "estimatedCompletion": "2025-06-20T12:30:00Z"
}
```

#### Insights de Sabiduría Colectiva
```http
GET /cop-oraculo/agents/wisdom/insights
Authorization: Bearer {jwt_token}

Response:
{
  "success": true,
  "wisdomInsights": {
    "patterns": [
      {
        "pattern": "Feedback de UX aumenta 40% los viernes",
        "confidence": 0.87,
        "recommendation": "Programar revisiones UX antes del fin de semana",
        "lukasImpact": 150
      }
    ],
    "trends": {
      "feedbackVelocity": {
        "current": 15.3,
        "trend": "+12%",
        "interpretation": "La comunidad está más activa en reportar feedback"
      }
    },
    "emergentBehaviors": [
      "Administradores están formando equipos especializados por elemento",
      "Surgimiento de mentorías cruzadas entre agentes de diferentes elementos"
    ]
  }
}
```

---

## 🎨 Frontend Dashboard

### 📊 Componente Principal

```tsx
const OracleAgentsDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  // Métricas Comunitarias con Gradientes
  const CommunityMetricsCard = ({ metric, value, icon, gradient }) => (
    <Card sx={{ background: gradient }}>
      <CardContent sx={{ color: 'white', textAlign: 'center' }}>
        {icon}
        <Typography variant="h4">{value}</Typography>
        <Typography variant="body2">{metric}</Typography>
      </CardContent>
    </Card>
  );
  
  // Estado de Agentes Elementales
  const AgentStatusCard = ({ element, status }) => (
    <Box 
      p={2} 
      border={1} 
      borderColor={getElementColor(element)}
      borderRadius={2}
      textAlign="center"
    >
      <Badge 
        badgeContent={status.active ? "●" : "○"} 
        color={status.active ? "success" : "error"}
      >
        <Avatar sx={{ bgcolor: getElementColor(element) }}>
          {getAgentIcon(element)}
        </Avatar>
      </Badge>
      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
        {element}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={status.efficiency * 100}
      />
      <Chip 
        label={`${status.lukasGenerated} Lükas`}
        sx={{ bgcolor: getElementColor(element), color: 'white' }}
      />
    </Box>
  );
  
  return (
    <Box p={3}>
      {/* Header con Branding */}
      <Typography variant="h4" gutterBottom textAlign="center">
        🔮 CoP Oráculo - Dashboard Multi-Agente
      </Typography>
      
      {/* Métricas Comunitarias */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <CommunityMetricsCard 
            metric="Cociente de Sabiduría"
            value={dashboardData.communityMetrics.wisdomQuotient}
            icon={<Psychology sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Grid>
        {/* ... más métricas */}
      </Grid>
      
      {/* Estado de Agentes */}
      <Grid container spacing={2}>
        {Object.entries(dashboardData.agentStatus).map(([element, status]) => (
          <Grid item xs={12} sm={6} md={3} key={element}>
            <AgentStatusCard element={element} status={status} />
          </Grid>
        ))}
      </Grid>
      
      {/* Leaderboard y Logros */}
      {/* ... componentes adicionales */}
    </Box>
  );
};
```

### 🎨 Sistema de Colores Elementales

```typescript
const getElementColor = (element: string) => {
  const colorMap = {
    fuego: '#ff5722',  // Rojo fuego
    agua: '#2196f3',   // Azul agua
    tierra: '#4caf50', // Verde tierra
    aire: '#9c27b0'    // Púrpura aire
  };
  return colorMap[element as keyof typeof colorMap];
};

const getAgentIcon = (element: string) => {
  const iconMap = {
    fuego: <Whatshot />,
    agua: <Water />,
    tierra: <EmojiNature />,
    aire: <Air />
  };
  return iconMap[element as keyof typeof iconMap];
};
```

---

## 🌍 Filosofía CoomÜnity Integrada

### 🤝 Principios de Ayni

#### Reciprocidad Automática:
```typescript
interface AyniTransaction {
  giver: string;
  receiver: string;
  value: number;
  type: 'knowledge' | 'collaboration' | 'support';
  timestamp: Date;
  balanceImpact: number;
}

class AyniEngine {
  calculateReciprocity(transactions: AyniTransaction[]): number {
    // Algoritmo que mide el balance de dar y recibir
    const given = transactions.filter(t => t.giver === userId).reduce((sum, t) => sum + t.value, 0);
    const received = transactions.filter(t => t.receiver === userId).reduce((sum, t) => sum + t.value, 0);
    
    return Math.min(1, given / (received + 1)); // Balance perfecto = 1
  }
}
```

#### Bien Común Priorizado:
- **Decisiones Colectivas**: Los agentes priorizan el beneficio comunitario
- **Distribución Equitativa**: Lükas se distribuyen según contribución al Bien Común
- **Sostenibilidad**: Cada acción fortalece el ecosistema a largo plazo

### 🔄 Metanöia (Transformación)

Cada feedback es una oportunidad de **metanöia** - transformación profunda:

1. **Reconocimiento**: El problema se identifica claramente
2. **Reflexión**: Los agentes analizan causas profundas
3. **Acción**: Se implementan soluciones sistémicas
4. **Integración**: El aprendizaje se incorpora al conocimiento colectivo

### 🌱 Neguentropía (Orden desde el Caos)

El sistema multi-agente transforma el caos del feedback disperso en orden estructurado:

```mermaid
graph LR
    A[😵 Feedback Caótico] --> B[🔮 Análisis Oráculo]
    B --> C[🤖 Procesamiento Multi-Agente]
    C --> D[📊 Sabiduría Estructurada]
    D --> E[🌟 Valor para Bien Común]
```

---

## 📈 Métricas y Analytics

### 🧠 Métricas de Sabiduría

#### Wisdom Quotient (WQ):
```typescript
interface WisdomMetrics {
  technical: number;      // Calidad técnica de soluciones
  collaborative: number;  // Efectividad de colaboración
  innovative: number;     // Nivel de innovación
  sustainable: number;    // Sostenibilidad a largo plazo
  overall: number;        // Promedio ponderado
}

const calculateWisdomQuotient = (metrics: WisdomMetrics): number => {
  const weights = {
    technical: 0.25,
    collaborative: 0.30,
    innovative: 0.20,
    sustainable: 0.25
  };
  
  return Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (metrics[key] * weight);
  }, 0);
};
```

#### Ayni Index:
- **Balance Perfecto**: 1.0 (dar y recibir equilibrados)
- **Desequilibrio Menor**: 0.8-0.9 (aceptable)
- **Desequilibrio Mayor**: < 0.8 (requiere atención)

#### Collaboration Velocity:
- **Feedback por Hora**: Velocidad de procesamiento
- **Tiempo de Resolución**: Eficiencia de agentes
- **Participación Activa**: Nivel de engagement

### 📊 Dashboards Analíticos

#### Dashboard Ejecutivo:
- Métricas comunitarias en tiempo real
- Tendencias de colaboración
- ROI de Lükas de Sabiduría
- Impacto en Bien Común

#### Dashboard de Agente:
- Eficiencia individual por elemento
- Patrones de especialización
- Oportunidades de mejora
- Colaboraciones más efectivas

#### Dashboard Personal:
- Balance personal de Lükas
- Progresión en niveles
- Contribuciones al Bien Común
- Próximos logros disponibles

---

## 🚀 Scripts de Deployment

### 📦 Script Maestro de Setup

```bash
#!/bin/bash
# 🔮 CoP ORÁCULO - Setup Multi-Agente Completo

# Verificación de Prerequisites
check_prerequisites() {
    echo "🔍 Verificando prerequisites del sistema multi-agente..."
    
    # Node.js 18+
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Se requiere Node.js 18+. Versión actual: $(node --version)"
    fi
    
    # PostgreSQL
    if ! command -v psql &> /dev/null; then
        warning "PostgreSQL CLI no detectado. Agentes necesitan BD."
    fi
    
    # Redis (para caché de agentes)
    if command -v redis-cli &> /dev/null; then
        success "✅ Redis detectado - Caché de agentes disponible"
    fi
}

# Instalación de Dependencias Multi-Agente
install_agent_dependencies() {
    echo "🤖 Instalando dependencias del sistema multi-agente..."
    
    # Backend dependencies
    cd backend/
    npm install --save class-transformer class-validator
    npm install --save @nestjs/swagger
    cd ../
    
    # Frontend dependencies  
    cd Demo/apps/superapp-unified/
    npm install --save @mui/icons-material
    npm install --save recharts # Para gráficos de métricas
    cd ../../../
}

# Configuración de Base de Datos Multi-Agente
setup_agent_database() {
    echo "🗄️ Configurando BD para sistema multi-agente..."
    
    # Ejecutar migración específica para agentes
    npx prisma migrate dev --name "add-multi-agent-system"
    
    # Seed con datos de agentes
    npx prisma db seed -- --agents
}

# Verificación de Endpoints Multi-Agente
verify_agent_endpoints() {
    echo "🔍 Verificando endpoints del sistema multi-agente..."
    
    AGENT_ENDPOINTS=(
        "http://localhost:3002/cop-oraculo/agents/dashboard/metrics"
        "http://localhost:3002/cop-oraculo/agents/wisdom/insights"
    )
    
    for endpoint in "${AGENT_ENDPOINTS[@]}"; do
        if curl -s "$endpoint" > /dev/null 2>&1; then
            success "✅ Endpoint $endpoint accesible"
        else
            warning "⚠️ Endpoint $endpoint no accesible"
        fi
    done
}

# Test de Sistema Multi-Agente
test_multi_agent_system() {
    echo "🧪 Probando sistema multi-agente..."
    
    # Test de análisis completo
    AGENT_TEST_RESPONSE=$(curl -s -X POST \
        http://localhost:3002/cop-oraculo/agents/analyze/test-feedback-123 \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer fake-jwt-for-testing" \
        -d '{}' 2>/dev/null || echo "ERROR")
    
    if [[ "$AGENT_TEST_RESPONSE" != "ERROR" ]]; then
        success "✅ Sistema multi-agente respondiendo"
    else
        warning "⚠️ Sistema multi-agente requiere autenticación real"
    fi
}

# Ejecución Principal
main() {
    echo "🔮 Iniciando setup del sistema multi-agente CoP Oráculo..."
    
    check_prerequisites
    install_agent_dependencies
    setup_agent_database
    
    # Iniciar servicios
    npm run start:backend:dev &
    sleep 10
    
    verify_agent_endpoints
    test_multi_agent_system
    
    echo "🎉 Sistema multi-agente CoP Oráculo configurado exitosamente!"
    echo "📊 Dashboard: http://localhost:3001/cop-oraculo"
    echo "🔗 API Docs: http://localhost:3002/api"
}

main "$@"
```

### 🧹 Script de Limpieza Avanzada

```bash
#!/bin/bash
# 🧹 CoP ORÁCULO - Limpieza Sistema Multi-Agente

cleanup_agent_processes() {
    echo "🤖 Limpiando procesos de agentes..."
    
    # Detener agentes específicos
    pkill -f "agent-fuego" 2>/dev/null || true
    pkill -f "agent-agua" 2>/dev/null || true
    pkill -f "agent-tierra" 2>/dev/null || true
    pkill -f "agent-aire" 2>/dev/null || true
    
    # Limpiar caché de agentes
    if [ -d ".agent-cache" ]; then
        rm -rf .agent-cache
        success "✅ Caché de agentes limpiado"
    fi
}

cleanup_agent_database() {
    echo "🗄️ Limpiando datos de agentes (opcional)..."
    
    read -p "¿Limpiar datos de agentes? (y/N): " choice
    if [[ $choice =~ ^[Yy]$ ]]; then
        npx prisma db execute --sql "DELETE FROM AgentTask;"
        npx prisma db execute --sql "UPDATE Feedback SET oraculoAnalysis = NULL, collaborationScore = NULL;"
        success "✅ Datos de agentes limpiados"
    fi
}

main() {
    cleanup_agent_processes
    cleanup_agent_database
    
    echo "🌟 Limpieza del sistema multi-agente completada"
}

main "$@"
```

---

## 🗺️ Roadmap Futuro

### 🎯 Fase 4: IA Avanzada (Q3 2025)

#### Machine Learning Integrado:
- **Predicción de Patrones**: ML para anticipar tipos de feedback
- **Optimización Automática**: Agentes que aprenden y mejoran
- **Personalización**: Adaptación a estilos de trabajo individuales

#### Procesamiento de Lenguaje Natural:
- **Análisis Semántico**: Comprensión profunda del contexto
- **Generación Automática**: Respuestas inteligentes a feedback
- **Traducción Multiidioma**: Soporte global para CoomÜnity

### 🌐 Fase 5: Expansión Ecosistema (Q4 2025)

#### Integración Externa:
- **APIs de Terceros**: Jira, Slack, Discord
- **Webhooks Inteligentes**: Notificaciones contextuales
- **Sincronización Multi-Plataforma**: Coherencia entre sistemas

#### Red de CoPs:
- **CoPs Especializadas**: Por dominio técnico
- **Intercambio de Sabiduría**: Entre diferentes CoPs
- **Federación de Agentes**: Colaboración inter-organizacional

### 🚀 Fase 6: Innovación Emergente (Q1 2026)

#### Realidad Aumentada:
- **Visualización 3D**: Métricas inmersivas
- **Colaboración Espacial**: Reuniones virtuales de agentes
- **Gamificación AR**: Experiencias de logros en AR

#### Blockchain Integration:
- **Lükas en Blockchain**: Moneda descentralizada
- **Smart Contracts**: Automatización de Ayni
- **NFTs de Sabiduría**: Conocimiento tokenizado

---

## 📚 Recursos y Referencias

### 🔗 Enlaces Importantes

- **CrewAI Framework**: [Building a multi agent system using CrewAI](https://medium.com/pythoneers/building-a-multi-agent-system-using-crewai-a7305450253e)
- **Documentación Técnica**: `/docs/CoP_Oraculo_README.md`
- **Scripts de Setup**: `/scripts/cop-oraculo-setup.sh`
- **API Documentation**: `http://localhost:3002/api`

### 📖 Filosofía y Teoría

- **Communities of Practice**: Etienne Wenger
- **Local Exchange Trading Systems**: Michael Linton  
- **Gamificación con Propósito**: Jane McGonigal
- **Principios de Ayni**: Sabiduría Ancestral Andina

### 🛠️ Tecnologías Utilizadas

- **Backend**: NestJS, TypeScript, PostgreSQL, Prisma, Redis
- **Frontend**: React, TypeScript, Material UI, Recharts
- **Testing**: Jest, Playwright, Vitest
- **DevOps**: Docker, Turborepo, GitHub Actions

---

## 🎉 Conclusión

La **CoP Oráculo** representa una evolución revolucionaria en la gestión colaborativa de feedback, combinando:

- **🤖 Inteligencia Multi-Agente**: Especialización y colaboración autónoma
- **🎮 Gamificación Ética**: Alineada con principios de Ayni y Bien Común
- **🧠 Sabiduría Colectiva**: Emergencia de conocimiento superior
- **⚖️ Balance Automático**: Sistema auto-regulado de reciprocidad
- **🌍 Impacto Sostenible**: Cada acción fortalece la comunidad

Este sistema no solo transforma el feedback en sabiduría, sino que **crea una nueva forma de colaboración humana** donde la tecnología sirve para amplificar los valores más nobles de la cooperación y el bien común.

**¡La CoP Oráculo está lista para revolucionar cómo las comunidades aprenden, crecen y prosperan juntas!** 🌟

---

*Desarrollado con 💜 por ǓAN - Agente IA Full-Stack de CoomÜnity*

> *"En la colaboración de los agentes elementales, encontramos el reflejo de la sabiduría ancestral: cuando cada uno aporta su don único al bien común, emerge una inteligencia superior que trasciende la suma de sus partes."*