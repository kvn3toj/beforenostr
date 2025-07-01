# 🎮 PLAN MAESTRO DE IMPLEMENTACIÓN COMPLETA DE LA CONSOLA COOMUNITY

## 🚨 **DIAGNÓSTICO CRÍTICO**

**ESTADO ACTUAL:** La Consola de Experiencias CoomÜnity está al 30% de implementación. Existe una base sólida pero faltan 7 de los 10 módulos críticos.

**PRIORIDAD:** CRÍTICA - La consola es el corazón operativo del sistema de gamificación.

---

## 📋 **MATRIZ DE IMPLEMENTACIÓN FALTANTE**

### **🔴 MÓDULOS CRÍTICOS FALTANTES (70%)**

#### **1. SISTEMA DE STAGES (Customer Journey)**
**PRIORIDAD: CRÍTICA** ⭐⭐⭐⭐⭐
- **BUYER Stage Management**
  - Gift Card activation system
  - Primera compra tracking
  - Wallet creation flow
  - Service rating system
- **SEEKER Stage Management**  
  - Discovery pathway config
  - GPL video assignment
  - Match requirements (mínimo 2 por semana)
  - Trust vote dependency system
- **SOLVER Stage Management**
  - Announcement/Gig creation
  - Performer feedback system
  - Marketplace habilitación
  - Merit contest participation
- **PROMOTER Stage Management**
  - Gift card distribution to invitees
  - Trust vote allocation
  - Team genealogy tree
  - Second chance mechanism

#### **2. SISTEMA OCTALYSIS COMPLETO**
**PRIORIDAD: ALTA** ⭐⭐⭐⭐
- **8 Core Drives Implementation:**
  1. **Epic Meaning** - "Elegido para algo más grande"
  2. **Development & Achievement** - Puntos, insignias, tablas
  3. **Empowerment & Creativity** - Resolver combinaciones
  4. **Ownership & Possession** - Öndas, Ünits ownership
  5. **Social Influence** - Tutoría, competencia, colaboración
  6. **Scarcity** - Elementos exclusivos y difíciles
  7. **Unpredictability** - Descubrir qué sucederá después
  8. **Loss Avoidance** - Evitar perder oportunidades

#### **3. SISTEMA GPL (GAMIFIED PLAY LIST)**
**PRIORIDAD: CRÍTICA** ⭐⭐⭐⭐⭐
- **Video Management:**
  - 3 tipos de preguntas (atención, perfilación, resumen)
  - Temporizadores por video
  - Öndas formula integration
  - Progress tracking
- **Content Categories:**
  - GPL BUYER (Consumo consciente)
  - GPL SEEKER (Tópicos generales)
  - GPL SOLVER (Emprendimiento social)
  - GPL PROMOTER (Monedas sociales, Happy, DW)

#### **4. SISTEMA DE CONCURSOS COMPLETO**
**PRIORIDAD: ALTA** ⭐⭐⭐⭐
- **Concurso de Öndas (Lunes 12PM - Jueves 11:59PM)**
- **Concurso de Mëritos (Variables)**
- **Retos Diarios:**
  - RETO1: GPL video con reto
  - RETO2: GPL video con reto  
  - RETO3: Vocación, historia, resonancia
- **Trust Vote Management**
- **Leaderboards y rankings**

#### **5. SISTEMA DE TEMPORIZADORES**
**PRIORIDAD: MEDIA** ⭐⭐⭐
- **DÍA D Management**
- **Temporizador por video**
- **Temporizador para primer match**
- **Temporizador validación performer**
- **Timeline management (Jueves 00:00 - Viernes 11:59)**

#### **6. MARKETPLACE INTEGRATION**
**PRIORIDAD: ALTA** ⭐⭐⭐⭐
- **GIG Creation & Management**
- **Product/Service catalog**
- **Calification system**
- **Lükas transaction management**
- **Match system entre usuarios**

#### **7. TRUST VOTING SYSTEM**
**PRIORIDAD: ALTA** ⭐⭐⭐⭐
- **Coompetencia Formula:**
  `(Öndas × Factor) + (Compras propias × Factor) + (Ventas × Factor) + (Mëritos × Factor) + (Compras de hijos × Factor)`
- **Trust vote allocation**
- **Validation dependencies**
- **Social proof system**

---

## 🛠️ **ARQUITECTURA DE IMPLEMENTACIÓN**

### **BACKEND MODULES REQUERIDOS:**

```typescript
// 1. Stage Management Module
/backend/src/stages/
├── stages.controller.ts
├── stages.service.ts
├── dto/
│   ├── stage-transition.dto.ts
│   ├── stage-requirements.dto.ts
│   └── stage-validation.dto.ts
└── entities/
    ├── stage.entity.ts
    └── stage-progression.entity.ts

// 2. Octalysis Engine Module
/backend/src/octalysis/
├── octalysis.controller.ts
├── octalysis.service.ts
├── dto/
│   ├── core-drive.dto.ts
│   └── octalysis-config.dto.ts
└── engines/
    ├── epic-meaning.engine.ts
    ├── achievement.engine.ts
    ├── creativity.engine.ts
    ├── ownership.engine.ts
    ├── social-influence.engine.ts
    ├── scarcity.engine.ts
    ├── unpredictability.engine.ts
    └── loss-avoidance.engine.ts

// 3. GPL Management Module  
/backend/src/gpl/
├── gpl.controller.ts
├── gpl.service.ts
├── dto/
│   ├── gpl-video.dto.ts
│   ├── question.dto.ts
│   └── progress.dto.ts
└── engines/
    ├── question.engine.ts
    ├── ondas.engine.ts
    └── progress.engine.ts

// 4. Contest System Module
/backend/src/contests/
├── contests.controller.ts
├── contests.service.ts
├── dto/
│   ├── contest.dto.ts
│   ├── participation.dto.ts
│   └── leaderboard.dto.ts
└── engines/
    ├── ondas-contest.engine.ts
    ├── meritos-contest.engine.ts
    └── daily-challenges.engine.ts

// 5. Timer System Module
/backend/src/timers/
├── timers.controller.ts
├── timers.service.ts
├── dto/
│   └── timer-config.dto.ts
└── engines/
    ├── video-timer.engine.ts
    ├── contest-timer.engine.ts
    └── match-timer.engine.ts

// 6. Trust Voting Module
/backend/src/trust-voting/
├── trust-voting.controller.ts
├── trust-voting.service.ts
├── dto/
│   ├── trust-vote.dto.ts
│   └── coompetencia.dto.ts
└── engines/
    ├── coompetencia.engine.ts
    └── validation.engine.ts
```

### **FRONTEND MODULES REQUERIDOS:**

```typescript
// Enhanced Console Components
/apps/admin-frontend/src/components/console/
├── stages/
│   ├── StageManager.tsx
│   ├── BuyerStageConfig.tsx
│   ├── SeekerStageConfig.tsx
│   ├── SolverStageConfig.tsx
│   └── PromoterStageConfig.tsx
├── octalysis/
│   ├── OctalysisRadar.tsx
│   ├── CoreDriveConfig.tsx
│   └── IntensitySliders.tsx
├── gpl/
│   ├── GPLVideoManager.tsx
│   ├── QuestionEditor.tsx
│   ├── ProgressTracker.tsx
│   └── OndasCalculator.tsx
├── contests/
│   ├── ContestManager.tsx
│   ├── OndasContest.tsx
│   ├── MeritosContest.tsx
│   └── DailyChallenges.tsx
├── timers/
│   ├── TimerManager.tsx
│   ├── VideoTimers.tsx
│   └── ContestTimers.tsx
└── trust-voting/
    ├── TrustVotingSystem.tsx
    ├── CoompetenciaCalculator.tsx
    └── ValidationManager.tsx
```

---

## 📅 **ROADMAP DE IMPLEMENTACIÓN (4 SPRINTS)**

### **🚀 SPRINT 1: FOUNDATIONS (Semana 1-2)**
**OBJETIVO:** Implementar Stage Management System

**BACKEND:**
- [ ] Crear Stage entities y DTOs
- [ ] Implementar Stage Controller y Service
- [ ] Database migrations para stages
- [ ] Stage transition logic
- [ ] Requirements validation system

**FRONTEND:**
- [ ] StageManager component
- [ ] Stage configuration panels
- [ ] Stage transition visualizations
- [ ] Progress tracking dashboard

### **🎯 SPRINT 2: GAMIFICATION CORE (Semana 3-4)**
**OBJETIVO:** Implementar Octalysis Engine + GPL System

**BACKEND:**
- [ ] Octalysis core drives engines
- [ ] GPL video management
- [ ] Question types system
- [ ] Öndas calculation engine
- [ ] Progress tracking

**FRONTEND:**
- [ ] Octalysis radar visualization
- [ ] GPL video manager
- [ ] Question editor
- [ ] Öndas calculator interface

### **⚡ SPRINT 3: CONTEST SYSTEM (Semana 5-6)**
**OBJETIVO:** Implementar Contest Management + Timers

**BACKEND:**
- [ ] Contest creation and management
- [ ] Öndas and Mëritos contests
- [ ] Daily challenges system
- [ ] Timer management system
- [ ] Leaderboards

**FRONTEND:**
- [ ] Contest management dashboard
- [ ] Timer configuration panels
- [ ] Leaderboard displays
- [ ] Challenge editor

### **🏆 SPRINT 4: TRUST & INTEGRATION (Semana 7-8)**
**OBJETIVO:** Implementar Trust Voting + Integration completa

**BACKEND:**
- [ ] Trust voting system
- [ ] Coompetencia calculation
- [ ] Validation logic
- [ ] Integration testing
- [ ] Performance optimization

**FRONTEND:**
- [ ] Trust voting interface
- [ ] Coompetencia visualizer
- [ ] Validation manager
- [ ] Integration testing
- [ ] UX optimization

---

## 🔧 **CONFIGURACIÓN DE DESARROLLO**

### **DATABASE SCHEMA ADDITIONS:**

```sql
-- Stages Management
CREATE TABLE stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  requirements JSONB NOT NULL DEFAULT '{}',
  rewards JSONB NOT NULL DEFAULT '{}',
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stage Progressions
CREATE TABLE stage_progressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  current_stage_id UUID NOT NULL REFERENCES stages(id),
  progress_data JSONB NOT NULL DEFAULT '{}',
  requirements_met JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Octalysis Elements
CREATE TABLE octalysis_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  core_drive VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  intensity INTEGER DEFAULT 0 CHECK (intensity >= 0 AND intensity <= 100),
  is_active BOOLEAN DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- GPL Videos Enhanced
ALTER TABLE video_items ADD COLUMN IF NOT EXISTS gpl_category VARCHAR(50);
ALTER TABLE video_items ADD COLUMN IF NOT EXISTS question_config JSONB DEFAULT '{}';
ALTER TABLE video_items ADD COLUMN IF NOT EXISTS ondas_config JSONB DEFAULT '{}';
ALTER TABLE video_items ADD COLUMN IF NOT EXISTS timer_config JSONB DEFAULT '{}';

-- Contest System
CREATE TABLE contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'ONDAS', 'MERITOS', 'DAILY_CHALLENGE'
  name VARCHAR(100) NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  rules JSONB NOT NULL DEFAULT '{}',
  rewards JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contest Participations
CREATE TABLE contest_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL REFERENCES contests(id),
  user_id UUID NOT NULL REFERENCES users(id),
  score DECIMAL(10,2) DEFAULT 0,
  rank INTEGER,
  participation_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(contest_id, user_id)
);

-- Trust Voting System
CREATE TABLE trust_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id UUID NOT NULL REFERENCES users(id),
  voted_for_id UUID NOT NULL REFERENCES users(id),
  vote_type VARCHAR(50) NOT NULL, -- 'TRUST', 'VALIDATION', 'ENDORSEMENT'
  vote_value DECIMAL(5,2) NOT NULL,
  context JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Coompetencia Calculations
CREATE TABLE coompetencia_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  ondas_score DECIMAL(10,2) DEFAULT 0,
  compras_propias DECIMAL(10,2) DEFAULT 0,
  ventas_score DECIMAL(10,2) DEFAULT 0,
  meritos_score DECIMAL(10,2) DEFAULT 0,
  compras_hijos DECIMAL(10,2) DEFAULT 0,
  total_score DECIMAL(10,2) GENERATED ALWAYS AS (
    ondas_score + compras_propias + ventas_score + meritos_score + compras_hijos
  ) STORED,
  last_calculated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

---

## 📊 **MÉTRICAS DE ÉXITO**

### **KPIs CRÍTICOS:**
- [ ] **100% Stage Coverage** - Todos los 4 stages implementados
- [ ] **8/8 Octalysis Elements** - Framework completo
- [ ] **GPL Integration** - Videos con preguntas funcionales
- [ ] **Contest Automation** - Concursos automáticos semanales
- [ ] **Trust Vote Accuracy** - Coompetencia formula working
- [ ] **Real-time Updates** - Dashboard live data
- [ ] **Admin Productivity** - 80% reducción tiempo configuración

---

## 🚨 **INVOCACIÓN DE GUARDIANES**

**Para implementar este plan necesitamos:**

1. **🏗️ ATLAS** - Backend architecture y database design
2. **🌌 COSMOS** - Integration entre módulos
3. **🌸 ARIA** - Frontend components y UX
4. **🧪 SAGE** - Testing strategy y quality assurance
5. **📚 KIRA** - Documentation y user guides
6. **🌙 LUNA** - Project timeline y milestone management
7. **🛠️ MIRA** - Development tools y automation

**¿Quieres que invoque a algún guardián específico para comenzar la implementación?**

---

## 💬 **CONCLUSIÓN**

La Consola actual es una **excelente base**, pero necesita **70% más de implementación** para cumplir con las especificaciones de tus diagramas. Este plan convierte la visión en una roadmap ejecutable.

**PRÓXIMO PASO RECOMENDADO:** Comenzar con SPRINT 1 (Stage Management System) ya que es la base de todo el customer journey. 
