# 🔄 Guía de Implementación del Sistema LETS en CoomÜnity SuperApp

## 📋 Resumen Ejecutivo

Esta guía proporciona instrucciones detalladas para implementar el sistema LETS (Local Exchange Trading System) en los módulos **Marketplace** (GMP Gamified Match Place) y **Grupos/Comunidades de Práctica** de la SuperApp CoomÜnity, basándose en la filosofía de economía colaborativa, reciprocidad (Ayni) y bien común.

## 🎯 Objetivos de la Implementación

### 1. **Marketplace Vocacional (GMP)**

- Implementar las **Ünits** como token extrínseco principal para intercambios
- Crear sistema de crédito mutuo basado en confianza comunitaria
- Establecer valoración temporal equitativa ("una hora = una hora")
- Facilitar intercambios de productos, servicios y experiencias locales

### 2. **Comunidades de Práctica (CoPs)**

- Integrar sistema de intercambio de conocimiento y habilidades
- Implementar tokens intrínsecos (Mëritos, Öndas, Vibras) para reconocimiento
- Crear herramientas de colaboración y transferencia de conocimiento
- Establecer sistema de roles jerárquicos (Aprendiz → Maestro)

---

## 🏗️ Arquitectura Técnica Requerida

### Base de Datos - Nuevas Tablas

#### 1. **Sistema de Ünits (LETS Tokens)**

```sql
-- Tabla principal de Ünits
CREATE TABLE units_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  balance DECIMAL(10,2) DEFAULT 0.00,
  credit_limit DECIMAL(10,2) DEFAULT 0.00, -- Límite de saldo negativo permitido
  trust_score DECIMAL(3,2) DEFAULT 0.00, -- Puntuación de confianza (0-1)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de transacciones de Ünits
CREATE TABLE units_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'service', 'product', 'knowledge', 'cop_participation'
  reference_id UUID, -- ID del marketplace item, cop activity, etc.
  description TEXT,
  metadata JSONB, -- Información adicional específica del contexto
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'disputed'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_units_wallets_user_id ON units_wallets(user_id);
CREATE INDEX idx_units_transactions_from_user ON units_transactions(from_user_id);
CREATE INDEX idx_units_transactions_to_user ON units_transactions(to_user_id);
CREATE INDEX idx_units_transactions_created_at ON units_transactions(created_at);
```

#### 2. **Sistema de Confianza LETS**

```sql
-- Tabla de evaluaciones de confianza entre usuarios
CREATE TABLE trust_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID NOT NULL REFERENCES users(id),
  rated_id UUID NOT NULL REFERENCES users(id),
  transaction_id UUID REFERENCES units_transactions(id),
  rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
  communication_rating DECIMAL(2,1),
  delivery_rating DECIMAL(2,1),
  quality_rating DECIMAL(2,1),
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(rater_id, rated_id, transaction_id)
);

-- Tabla de límites de crédito dinámicos
CREATE TABLE credit_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  limit_amount DECIMAL(10,2) NOT NULL,
  reason TEXT, -- 'initial', 'trust_increase', 'community_endorsement'
  granted_by UUID REFERENCES users(id),
  valid_until TIMESTAMP,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. **Marketplace LETS Integration**

```sql
-- Extensión de la tabla marketplace_items para LETS
ALTER TABLE marketplace_items
ADD COLUMN units_price DECIMAL(10,2),
ADD COLUMN accepts_hybrid_payment BOOLEAN DEFAULT false,
ADD COLUMN estimated_hours DECIMAL(4,2), -- Para servicios basados en tiempo
ADD COLUMN lets_category VARCHAR(50), -- 'product', 'service', 'experience', 'knowledge'
ADD COLUMN requires_trust_level DECIMAL(3,2) DEFAULT 0.00;

-- Tabla de ofertas y demandas LETS
CREATE TABLE lets_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(20) NOT NULL, -- 'offer', 'request'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  units_value DECIMAL(10,2),
  estimated_hours DECIMAL(4,2),
  location VARCHAR(255),
  availability_schedule JSONB,
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'fulfilled', 'expired', 'cancelled'
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. **Comunidades de Práctica LETS**

```sql
-- Extensión de la tabla cops para funcionalidades LETS
ALTER TABLE cops
ADD COLUMN knowledge_exchange_enabled BOOLEAN DEFAULT true,
ADD COLUMN units_pool DECIMAL(10,2) DEFAULT 0.00, -- Pool de Ünits de la comunidad
ADD COLUMN ayni_score DECIMAL(3,2) DEFAULT 0.00;

-- Tabla de actividades de intercambio de conocimiento
CREATE TABLE cop_knowledge_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cop_id UUID NOT NULL REFERENCES cops(id),
  teacher_id UUID NOT NULL REFERENCES users(id),
  learner_id UUID REFERENCES users(id), -- NULL para sesiones grupales
  session_type VARCHAR(50), -- 'one_to_one', 'workshop', 'mentoring', 'group_session'
  title VARCHAR(255),
  description TEXT,
  knowledge_areas TEXT[],
  units_cost DECIMAL(10,2),
  duration_hours DECIMAL(3,1),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  materials_shared JSONB,
  feedback JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de participación en intercambios de conocimiento
CREATE TABLE cop_knowledge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id UUID NOT NULL REFERENCES cop_knowledge_exchanges(id),
  participant_id UUID NOT NULL REFERENCES users(id),
  role VARCHAR(20) NOT NULL, -- 'teacher', 'learner', 'observer'
  units_paid DECIMAL(10,2),
  attendance_confirmed BOOLEAN DEFAULT false,
  feedback_rating DECIMAL(2,1),
  feedback_comment TEXT,
  meritos_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(exchange_id, participant_id)
);

-- Tabla de roles jerárquicos en CoPs
CREATE TABLE cop_hierarchy_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cop_id UUID NOT NULL REFERENCES cops(id),
  user_id UUID NOT NULL REFERENCES users(id),
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 7), -- 1=Aprendiz, 7=Maestro
  level_name VARCHAR(50), -- 'Aprendiz', 'Iniciado', 'Practicante', 'Competente', 'Especialista', 'Experto', 'Maestro'
  earned_at TIMESTAMP DEFAULT NOW(),
  requirements_met JSONB, -- Criterios cumplidos para alcanzar este nivel
  mentor_id UUID REFERENCES users(id), -- Quién validó/mentoreó este nivel
  UNIQUE(cop_id, user_id)
);
```

---

## 🔧 Backend - Servicios e Implementación

### 1. **Servicio de Ünits (LetsCurrencyService)**

```typescript
// src/lets/services/lets-currency.service.ts
@Injectable()
export class LetsCurrencyService {
  constructor(
    @InjectRepository(UnitsWallet)
    private unitsWalletRepository: Repository<UnitsWallet>,
    @InjectRepository(UnitsTransaction)
    private unitsTransactionRepository: Repository<UnitsTransaction>,
    @InjectRepository(TrustRating)
    private trustRatingRepository: Repository<TrustRating>
  ) {}

  // Crear wallet inicial para nuevo usuario
  async createInitialWallet(userId: string): Promise<UnitsWallet> {
    const wallet = this.unitsWalletRepository.create({
      userId,
      balance: 0.0,
      creditLimit: 3.0, // 3 horas iniciales de crédito
      trustScore: 0.5, // Confianza inicial media
    });
    return this.unitsWalletRepository.save(wallet);
  }

  // Realizar transacción LETS
  async transferUnits(
    fromUserId: string,
    toUserId: string,
    amount: number,
    transactionType: string,
    referenceId?: string,
    description?: string,
    metadata?: any
  ): Promise<UnitsTransaction> {
    return this.dataSource.transaction(async (manager) => {
      // Verificar wallets
      const fromWallet = await manager.findOne(UnitsWallet, {
        where: { userId: fromUserId },
      });
      const toWallet = await manager.findOne(UnitsWallet, {
        where: { userId: toUserId },
      });

      if (!fromWallet || !toWallet) {
        throw new BadRequestException('Wallet no encontrada');
      }

      // Verificar límite de crédito
      const newBalance = fromWallet.balance - amount;
      const creditAvailable = fromWallet.creditLimit;

      if (newBalance < -creditAvailable) {
        throw new BadRequestException(
          `Límite de crédito excedido. Disponible: ${creditAvailable} Ünits`
        );
      }

      // Actualizar balances
      fromWallet.balance = newBalance;
      toWallet.balance += amount;

      await manager.save(UnitsWallet, [fromWallet, toWallet]);

      // Crear registro de transacción
      const transaction = manager.create(UnitsTransaction, {
        fromUserId,
        toUserId,
        amount,
        transactionType,
        referenceId,
        description,
        metadata,
        status: 'completed',
      });

      return manager.save(UnitsTransaction, transaction);
    });
  }

  // Calcular confianza del usuario
  async calculateTrustScore(userId: string): Promise<number> {
    const ratings = await this.trustRatingRepository.find({
      where: { ratedId: userId },
    });

    if (ratings.length === 0) return 0.5; // Confianza inicial

    const averageRating =
      ratings.reduce((sum, rating) => sum + Number(rating.rating), 0) /
      ratings.length;

    const transactionCount = ratings.length;
    const experienceBonus = Math.min(transactionCount * 0.01, 0.2); // Máximo 20% bonus

    return Math.min(averageRating / 5.0 + experienceBonus, 1.0);
  }

  // Ajustar límite de crédito basado en confianza
  async adjustCreditLimit(userId: string): Promise<void> {
    const trustScore = await this.calculateTrustScore(userId);
    const wallet = await this.unitsWalletRepository.findOne({
      where: { userId },
    });

    if (!wallet) return;

    // Fórmula: límite base (3) + (confianza * 47) = máximo 50 Ünits
    const newLimit = 3 + trustScore * 47;

    wallet.creditLimit = newLimit;
    wallet.trustScore = trustScore;

    await this.unitsWalletRepository.save(wallet);
  }
}
```

### 2. **Servicio de Marketplace LETS**

```typescript
// src/marketplace/services/marketplace-lets.service.ts
@Injectable()
export class MarketplaceLetsService {
  constructor(
    private letsCurrencyService: LetsCurrencyService,
    @InjectRepository(MarketplaceItem)
    private marketplaceRepository: Repository<MarketplaceItem>,
    @InjectRepository(LetsListing)
    private letsListingRepository: Repository<LetsListing>
  ) {}

  // Crear oferta o demanda LETS
  async createLetsListing(
    userId: string,
    createListingDto: CreateLetsListingDto
  ): Promise<LetsListing> {
    const listing = this.letsListingRepository.create({
      ...createListingDto,
      userId,
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    });

    return this.letsListingRepository.save(listing);
  }

  // Procesar intercambio LETS en marketplace
  async processLetsExchange(
    buyerId: string,
    sellerId: string,
    itemId: string,
    unitsAmount: number
  ): Promise<UnitsTransaction> {
    const item = await this.marketplaceRepository.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Verificar que el producto acepta Ünits
    if (!item.unitsPrice) {
      throw new BadRequestException('Este producto no acepta Ünits');
    }

    // Realizar transferencia
    return this.letsCurrencyService.transferUnits(
      buyerId,
      sellerId,
      unitsAmount,
      'marketplace_purchase',
      itemId,
      `Compra: ${item.title}`,
      {
        itemTitle: item.title,
        category: item.category,
        estimatedHours: item.estimatedHours,
      }
    );
  }

  // Buscar ofertas y demandas por criterios
  async searchLetsListings(filters: LetsSearchFilters): Promise<LetsListing[]> {
    const query = this.letsListingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.user', 'user')
      .where('listing.status = :status', { status: 'active' })
      .andWhere('listing.expiresAt > :now', { now: new Date() });

    if (filters.type) {
      query.andWhere('listing.type = :type', { type: filters.type });
    }

    if (filters.category) {
      query.andWhere('listing.category = :category', {
        category: filters.category,
      });
    }

    if (filters.location) {
      query.andWhere('listing.location ILIKE :location', {
        location: `%${filters.location}%`,
      });
    }

    if (filters.maxUnitsValue) {
      query.andWhere('listing.unitsValue <= :maxValue', {
        maxValue: filters.maxUnitsValue,
      });
    }

    return query.orderBy('listing.createdAt', 'DESC').getMany();
  }
}
```

### 3. **Servicio de CoPs LETS**

```typescript
// src/social/services/cops-lets.service.ts
@Injectable()
export class CopsLetsService {
  constructor(
    private letsCurrencyService: LetsCurrencyService,
    @InjectRepository(Cop)
    private copRepository: Repository<Cop>,
    @InjectRepository(CopKnowledgeExchange)
    private knowledgeExchangeRepository: Repository<CopKnowledgeExchange>,
    @InjectRepository(CopHierarchyLevel)
    private hierarchyLevelRepository: Repository<CopHierarchyLevel>
  ) {}

  // Crear sesión de intercambio de conocimiento
  async createKnowledgeExchange(
    teacherId: string,
    copId: string,
    createExchangeDto: CreateKnowledgeExchangeDto
  ): Promise<CopKnowledgeExchange> {
    // Verificar que el usuario tiene nivel suficiente para enseñar
    const teacherLevel = await this.hierarchyLevelRepository.findOne({
      where: { userId: teacherId, copId },
    });

    if (!teacherLevel || teacherLevel.level < 3) {
      throw new BadRequestException(
        'Nivel mínimo requerido: Practicante (nivel 3) para enseñar'
      );
    }

    const exchange = this.knowledgeExchangeRepository.create({
      ...createExchangeDto,
      teacherId,
      copId,
      status: 'scheduled',
    });

    return this.knowledgeExchangeRepository.save(exchange);
  }

  // Registrar participación en intercambio
  async joinKnowledgeExchange(
    exchangeId: string,
    participantId: string,
    role: 'learner' | 'observer' = 'learner'
  ): Promise<void> {
    const exchange = await this.knowledgeExchangeRepository.findOne({
      where: { id: exchangeId },
    });

    if (!exchange) {
      throw new NotFoundException('Intercambio no encontrado');
    }

    if (exchange.currentParticipants >= exchange.maxParticipants) {
      throw new BadRequestException('Intercambio lleno');
    }

    // Cobrar Ünits si es rol de aprendiz
    let unitsPaid = 0;
    if (role === 'learner' && exchange.unitsCost > 0) {
      await this.letsCurrencyService.transferUnits(
        participantId,
        exchange.teacherId,
        exchange.unitsCost,
        'knowledge_exchange',
        exchangeId,
        `Sesión: ${exchange.title}`
      );
      unitsPaid = exchange.unitsCost;
    }

    // Registrar participación
    const participation = this.copKnowledgeParticipantsRepository.create({
      exchangeId,
      participantId,
      role,
      unitsPaid,
    });

    await this.copKnowledgeParticipantsRepository.save(participation);

    // Actualizar contador de participantes
    exchange.currentParticipants += 1;
    await this.knowledgeExchangeRepository.save(exchange);
  }

  // Evaluar progreso y otorgar Mëritos
  async evaluateParticipationAndAwardMeritos(
    exchangeId: string,
    participantId: string,
    feedbackRating: number,
    feedbackComment?: string
  ): Promise<void> {
    const exchange = await this.knowledgeExchangeRepository.findOne({
      where: { id: exchangeId },
      relations: ['cop'],
    });

    // Calcular Mëritos basado en:
    // - Calidad de la participación (rating)
    // - Duración de la sesión
    // - Nivel de la CoP
    // - Factor Ayni (balance de dar/recibir)

    const basePoints = Math.floor(exchange.durationHours * 10); // 10 puntos por hora
    const qualityMultiplier = feedbackRating / 5.0; // Factor de calidad
    const meritosEarned = Math.floor(basePoints * qualityMultiplier);

    // Actualizar participación con feedback y Mëritos
    await this.copKnowledgeParticipantsRepository.update(
      { exchangeId, participantId },
      {
        feedbackRating,
        feedbackComment,
        meritosEarned,
        attendanceConfirmed: true,
      }
    );

    // Otorgar Mëritos al usuario (integración con sistema de Mëritos existente)
    // await this.meritsService.awardMerits(participantId, meritosEarned, 'cop_participation');
  }

  // Evaluar progreso jerárquico
  async evaluateHierarchyProgression(
    userId: string,
    copId: string
  ): Promise<void> {
    const currentLevel = await this.hierarchyLevelRepository.findOne({
      where: { userId, copId },
    });

    if (!currentLevel) {
      // Crear nivel inicial
      const initialLevel = this.hierarchyLevelRepository.create({
        userId,
        copId,
        level: 1,
        levelName: 'Aprendiz',
        requirementsMet: {
          sessionsAttended: 0,
          hoursLearned: 0,
          sessionsTaught: 0,
          averageRating: 0,
        },
      });
      await this.hierarchyLevelRepository.save(initialLevel);
      return;
    }

    // Calcular métricas de progreso
    const participation = await this.copKnowledgeParticipantsRepository
      .createQueryBuilder('p')
      .leftJoin('p.exchange', 'e')
      .where('p.participantId = :userId', { userId })
      .andWhere('e.copId = :copId', { copId })
      .andWhere('p.attendanceConfirmed = true')
      .select([
        'COUNT(*) as sessionsAttended',
        'SUM(e.durationHours) as totalHours',
        'AVG(p.feedbackRating) as averageRating',
        'COUNT(CASE WHEN p.role = "teacher" THEN 1 END) as sessionsTaught',
      ])
      .getRawOne();

    // Lógica de progresión jerárquica
    const requirements = this.getHierarchyRequirements();
    const nextLevel = currentLevel.level + 1;

    if (
      nextLevel <= 7 &&
      this.meetsRequirements(participation, requirements[nextLevel])
    ) {
      currentLevel.level = nextLevel;
      currentLevel.levelName = this.getLevelName(nextLevel);
      currentLevel.requirementsMet = participation;
      currentLevel.earnedAt = new Date();

      await this.hierarchyLevelRepository.save(currentLevel);
    }
  }

  private getHierarchyRequirements() {
    return {
      2: { sessionsAttended: 3, hoursLearned: 6, averageRating: 3.5 }, // Iniciado
      3: { sessionsAttended: 8, hoursLearned: 15, averageRating: 4.0 }, // Practicante
      4: {
        sessionsAttended: 15,
        hoursLearned: 30,
        sessionsTaught: 2,
        averageRating: 4.2,
      }, // Competente
      5: {
        sessionsAttended: 25,
        hoursLearned: 50,
        sessionsTaught: 5,
        averageRating: 4.5,
      }, // Especialista
      6: {
        sessionsAttended: 40,
        hoursLearned: 80,
        sessionsTaught: 10,
        averageRating: 4.7,
      }, // Experto
      7: {
        sessionsAttended: 60,
        hoursLearned: 120,
        sessionsTaught: 20,
        averageRating: 4.8,
      }, // Maestro
    };
  }

  private getLevelName(level: number): string {
    const names = {
      1: 'Aprendiz',
      2: 'Iniciado',
      3: 'Practicante',
      4: 'Competente',
      5: 'Especialista',
      6: 'Experto',
      7: 'Maestro',
    };
    return names[level] || 'Desconocido';
  }
}
```

---

## 🎨 Frontend - Componentes y Interfaces

### 1. **Componente de Wallet de Ünits**

```typescript
// src/components/modules/marketplace/components/UnitsWallet.tsx
import React from 'react';
import { Box, Card, Typography, Chip, LinearProgress } from '@mui/material';
import { useUnitsWallet } from '../../../../hooks/useUnitsWallet';

interface UnitsWalletProps {
  userId: string;
  compact?: boolean;
}

export const UnitsWallet: React.FC<UnitsWalletProps> = ({
  userId,
  compact = false
}) => {
  const { wallet, isLoading, error } = useUnitsWallet(userId);

  if (isLoading) return <Typography>Cargando wallet...</Typography>;
  if (error) return <Typography color="error">Error cargando wallet</Typography>;
  if (!wallet) return null;

  const balanceColor = wallet.balance >= 0 ? 'success' : 'warning';
  const creditUsed = Math.max(0, -wallet.balance);
  const creditUsagePercentage = (creditUsed / wallet.creditLimit) * 100;

  return (
    <Card sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="white">
          💫 Wallet de Ünits
        </Typography>
        <Chip
          label={`Confianza: ${(wallet.trustScore * 100).toFixed(0)}%`}
          size="small"
          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
        />
      </Box>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Box>
          <Typography variant="h4" color="white" fontWeight="bold">
            {wallet.balance.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.8)">
            Ünits disponibles
          </Typography>
        </Box>

        <Box flex={1}>
          {wallet.balance < 0 && (
            <>
              <Typography variant="caption" color="white">
                Crédito usado: {creditUsed.toFixed(2)} / {wallet.creditLimit.toFixed(2)} Ünits
              </Typography>
              <LinearProgress
                variant="determinate"
                value={creditUsagePercentage}
                sx={{
                  mt: 1,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: creditUsagePercentage > 80 ? '#ff5722' : '#ffeb3b'
                  }
                }}
              />
            </>
          )}
        </Box>
      </Box>

      {!compact && (
        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip
            size="small"
            label="💰 LETS Activo"
            sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: 'white' }}
          />
          <Chip
            size="small"
            label="🤝 Sistema de Confianza"
            sx={{ bgcolor: 'rgba(33, 150, 243, 0.2)', color: 'white' }}
          />
          <Chip
            size="small"
            label="⚖️ Ayni Balance"
            sx={{ bgcolor: 'rgba(156, 39, 176, 0.2)', color: 'white' }}
          />
        </Box>
      )}
    </Card>
  );
};
```

### 2. **Componente de Ofertas y Demandas LETS**

```typescript
// src/components/modules/marketplace/components/LetsListings.tsx
import React, { useState } from 'react';
import {
  Box, Card, Typography, Chip, Button, Grid, TextField,
  Select, MenuItem, FormControl, InputLabel, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add, Search, FilterList } from '@mui/icons-material';
import { useLetsListings, useCreateLetsListing } from '../../../../hooks/useLetsListings';

export const LetsListings: React.FC = () => {
  const [listingType, setListingType] = useState<'all' | 'offer' | 'request'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { listings, isLoading, refetch } = useLetsListings({
    type: listingType === 'all' ? undefined : listingType,
    search: searchTerm,
    category: category || undefined
  });

  const createMutation = useCreateLetsListing();

  const handleCreateListing = async (listingData: any) => {
    try {
      await createMutation.mutateAsync(listingData);
      setCreateModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creando listado:', error);
    }
  };

  return (
    <Box>
      {/* Header con filtros */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          🔄 Intercambios LETS Locales
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            color: 'white'
          }}
        >
          Crear Oferta/Demanda
        </Button>
      </Box>

      {/* Filtros */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={listingType}
                onChange={(e) => setListingType(e.target.value as any)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="offer">Ofertas</MenuItem>
                <MenuItem value="request">Demandas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="servicios">Servicios</MenuItem>
                <MenuItem value="productos">Productos</MenuItem>
                <MenuItem value="conocimiento">Conocimiento</MenuItem>
                <MenuItem value="experiencias">Experiencias</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ height: '56px' }}
            >
              Más Filtros
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Lista de intercambios */}
      <Grid container spacing={2}>
        {listings?.map((listing) => (
          <Grid item xs={12} md={6} lg={4} key={listing.id}>
            <LetsListingCard
              listing={listing}
              onInteract={() => {/* Lógica de interacción */}}
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal de creación */}
      <CreateLetsListingModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateListing}
      />
    </Box>
  );
};

// Componente de tarjeta individual
interface LetsListingCardProps {
  listing: any;
  onInteract: () => void;
}

const LetsListingCard: React.FC<LetsListingCardProps> = ({ listing, onInteract }) => {
  const isOffer = listing.type === 'offer';

  return (
    <Card
      sx={{
        p: 2,
        height: '100%',
        border: `2px solid ${isOffer ? '#4CAF50' : '#FF9800'}`,
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
        <Chip
          label={isOffer ? '🤲 OFREZCO' : '🙏 NECESITO'}
          size="small"
          sx={{
            bgcolor: isOffer ? '#E8F5E8' : '#FFF3E0',
            color: isOffer ? '#2E7D32' : '#F57C00',
            fontWeight: 'bold'
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {listing.location}
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight="bold" mb={1}>
        {listing.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {listing.description}
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {listing.unitsValue} Ünits
          </Typography>
          {listing.estimatedHours && (
            <Typography variant="caption" color="text.secondary">
              ≈ {listing.estimatedHours}h
            </Typography>
          )}
        </Box>
        <Chip
          label={listing.category}
          size="small"
          variant="outlined"
        />
      </Box>

      <Box display="flex" gap={1} mb={2}>
        {listing.tags?.slice(0, 3).map((tag: string, index: number) => (
          <Chip
            key={index}
            label={tag}
            size="small"
            sx={{ fontSize: '0.7rem' }}
          />
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={onInteract}
        sx={{
          background: isOffer
            ? 'linear-gradient(45deg, #4CAF50, #81C784)'
            : 'linear-gradient(45deg, #FF9800, #FFB74D)',
          color: 'white'
        }}
      >
        {isOffer ? 'Contactar Proveedor' : 'Ofrecer Ayuda'}
      </Button>
    </Card>
  );
};
```

### 3. **Componente de Intercambio de Conocimiento en CoPs**

```typescript
// src/components/modules/social/components/KnowledgeExchangeHub.tsx
import React, { useState } from 'react';
import {
  Box, Card, Typography, Button, Grid, Avatar, Chip,
  Dialog, DialogTitle, DialogContent, TextField, Rating,
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector,
  TimelineContent, TimelineDot
} from '@mui/material';
import { School, Group, Star, AccessTime } from '@mui/icons-material';
import { useKnowledgeExchanges, useCopHierarchy } from '../../../../hooks/useCopsLets';

interface KnowledgeExchangeHubProps {
  copId: string;
  userId: string;
}

export const KnowledgeExchangeHub: React.FC<KnowledgeExchangeHubProps> = ({
  copId,
  userId
}) => {
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const { exchanges, isLoading } = useKnowledgeExchanges(copId);
  const { userLevel, levelProgress } = useCopHierarchy(userId, copId);

  const levelNames = {
    1: 'Aprendiz', 2: 'Iniciado', 3: 'Practicante',
    4: 'Competente', 5: 'Especialista', 6: 'Experto', 7: 'Maestro'
  };

  return (
    <Box>
      {/* Header con nivel jerárquico */}
      <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" color="white" fontWeight="bold">
              🎓 Hub de Intercambio de Conocimiento
            </Typography>
            <Typography variant="subtitle1" color="rgba(255,255,255,0.8)">
              Comparte y aprende dentro de la comunidad
            </Typography>
          </Box>

          <Box textAlign="right">
            <Chip
              label={`${levelNames[userLevel?.level || 1]} - Nivel ${userLevel?.level || 1}`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                mb: 1
              }}
            />
            <Typography variant="caption" color="rgba(255,255,255,0.8)" display="block">
              Progreso al siguiente nivel: {levelProgress || 0}%
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Acciones principales */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <School sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" mb={1}>Crear Sesión</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Comparte tu conocimiento y gana Mëritos
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setCreateSessionOpen(true)}
              disabled={!userLevel || userLevel.level < 3}
            >
              {userLevel?.level >= 3 ? 'Crear Sesión' : 'Nivel 3+ requerido'}
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Group sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h6" mb={1}>Unirse a Taller</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Participa en sesiones de aprendizaje grupal
            </Typography>
            <Button variant="outlined" fullWidth>
              Ver Talleres
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Star sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6" mb={1}>Mentoría 1:1</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Sesiones personalizadas de aprendizaje
            </Typography>
            <Button variant="outlined" fullWidth>
              Buscar Mentor
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Timeline de intercambios */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={3}>
          📅 Próximos Intercambios de Conocimiento
        </Typography>

        <Timeline>
          {exchanges?.slice(0, 5).map((exchange, index) => (
            <TimelineItem key={exchange.id}>
              <TimelineSeparator>
                <TimelineDot
                  color={exchange.status === 'scheduled' ? 'primary' : 'success'}
                  sx={{
                    width: 12,
                    height: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <School sx={{ fontSize: 8 }} />
                </TimelineDot>
                {index < exchanges.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent>
                <KnowledgeExchangeCard
                  exchange={exchange}
                  onJoin={() => {/* Lógica para unirse */}}
                />
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Card>

      {/* Modal de creación de sesión */}
      <CreateKnowledgeSessionModal
        open={createSessionOpen}
        onClose={() => setCreateSessionOpen(false)}
        copId={copId}
        teacherId={userId}
      />
    </Box>
  );
};

// Componente de tarjeta de intercambio
interface KnowledgeExchangeCardProps {
  exchange: any;
  onJoin: () => void;
}

const KnowledgeExchangeCard: React.FC<KnowledgeExchangeCardProps> = ({
  exchange,
  onJoin
}) => {
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
        <Box flex={1}>
          <Typography variant="h6" fontWeight="bold">
            {exchange.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {exchange.description}
          </Typography>
        </Box>

        <Chip
          label={exchange.sessionType === 'workshop' ? 'Taller' : 'Mentoría'}
          size="small"
          color="primary"
        />
      </Box>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar
          src={exchange.teacher.avatar}
          sx={{ width: 32, height: 32 }}
        />
        <Box>
          <Typography variant="subtitle2">
            {exchange.teacher.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Nivel {exchange.teacher.level} - {exchange.teacher.levelName}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={2}>
          <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
            <AccessTime sx={{ fontSize: 16 }} />
            {exchange.durationHours}h
          </Typography>
          <Typography variant="body2" color="primary" fontWeight="bold">
            {exchange.unitsCost} Ünits
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {exchange.currentParticipants}/{exchange.maxParticipants}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={onJoin}
          disabled={exchange.currentParticipants >= exchange.maxParticipants}
        >
          Unirse
        </Button>
      </Box>
    </Card>
  );
};
```

---

## 🔗 Integración con Sistema Existente

### 1. **Hooks Personalizados**

```typescript
// src/hooks/useLetsIntegration.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api-service';

// Hook para wallet de Ünits
export const useUnitsWallet = (userId: string) => {
  return useQuery({
    queryKey: ['units-wallet', userId],
    queryFn: () => apiService.get(`/lets/wallet/${userId}`),
    staleTime: 30000, // 30 segundos
  });
};

// Hook para transferir Ünits
export const useTransferUnits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferData: TransferUnitsData) =>
      apiService.post('/lets/transfer', transferData),
    onSuccess: (data, variables) => {
      // Invalidar wallets de ambos usuarios
      queryClient.invalidateQueries(['units-wallet', variables.fromUserId]);
      queryClient.invalidateQueries(['units-wallet', variables.toUserId]);
      queryClient.invalidateQueries(['units-transactions']);
    },
  });
};

// Hook para listados LETS
export const useLetsListings = (filters?: LetsSearchFilters) => {
  return useQuery({
    queryKey: ['lets-listings', filters],
    queryFn: () => apiService.get('/lets/listings', { params: filters }),
    staleTime: 60000, // 1 minuto
  });
};

// Hook para intercambios de conocimiento
export const useKnowledgeExchanges = (copId: string) => {
  return useQuery({
    queryKey: ['knowledge-exchanges', copId],
    queryFn: () => apiService.get(`/cops/${copId}/knowledge-exchanges`),
    staleTime: 30000,
  });
};

// Hook para jerarquía en CoP
export const useCopHierarchy = (userId: string, copId: string) => {
  return useQuery({
    queryKey: ['cop-hierarchy', userId, copId],
    queryFn: () => apiService.get(`/cops/${copId}/hierarchy/${userId}`),
    staleTime: 300000, // 5 minutos
  });
};
```

### 2. **Integración con Rutas**

```typescript
// src/App.tsx - Agregar rutas LETS
{/* 🔄 Rutas LETS */}
<Route path="/lets" element={<LetsOverview />} />
<Route path="/lets/listings" element={<LetsListings />} />
<Route path="/lets/wallet" element={<UnitsWalletPage />} />
<Route path="/lets/transactions" element={<TransactionHistory />} />

{/* 🏪 Marketplace con LETS */}
<Route path="/marketplace" element={<MarketplaceMain />} />
<Route path="/marketplace/lets" element={<MarketplaceLetsView />} />

{/* 👥 Social/CoPs con LETS */}
<Route path="/social/cops/:copId/knowledge" element={<KnowledgeExchangeHub />} />
<Route path="/social/cops/:copId/hierarchy" element={<CopHierarchyView />} />
```

### 3. **Configuración de Feature Flags**

```typescript
// src/lib/feature-flags.tsx - Agregar flags LETS
export interface FeatureFlags {
  // ... flags existentes

  // 🔄 Sistema LETS
  letsEnabled: boolean;
  unitsTransfers: boolean;
  knowledgeExchange: boolean;
  copHierarchy: boolean;
  trustSystem: boolean;
  hybridPayments: boolean;
}

export const defaultFeatureFlags: FeatureFlags = {
  // ... flags existentes

  // 🔄 LETS Features
  letsEnabled: true,
  unitsTransfers: true,
  knowledgeExchange: true,
  copHierarchy: true,
  trustSystem: true,
  hybridPayments: false, // Deshabilitado inicialmente
};
```

---

## 📊 Métricas y Analytics LETS

### 1. **Dashboard de Métricas LETS**

```typescript
// src/components/admin/LetsAnalyticsDashboard.tsx
import React from 'react';
import { Grid, Card, Typography, Box } from '@mui/material';
import { BarChart, LineChart, PieChart, TrendingUp } from '@mui/icons-material';
import { useLetsAnalytics } from '../../hooks/useLetsAnalytics';

export const LetsAnalyticsDashboard: React.FC = () => {
  const { analytics, isLoading } = useLetsAnalytics();

  if (isLoading) return <Typography>Cargando métricas LETS...</Typography>;

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        📊 Analytics del Sistema LETS
      </Typography>

      <Grid container spacing={3}>
        {/* Métricas principales */}
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Ünits en Circulación"
            value={analytics.totalUnitsCirculating}
            icon={<TrendingUp />}
            color="primary"
            subtitle="Total de Ünits activas en el sistema"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <MetricCard
            title="Transacciones Hoy"
            value={analytics.dailyTransactions}
            icon={<BarChart />}
            color="success"
            subtitle="Intercambios realizados hoy"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <MetricCard
            title="Usuarios Activos"
            value={analytics.activeUsers}
            icon={<PieChart />}
            color="info"
            subtitle="Usuarios que han transaccionado en 30 días"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <MetricCard
            title="Índice de Ayni"
            value={`${(analytics.ayniIndex * 100).toFixed(1)}%`}
            icon={<LineChart />}
            color="secondary"
            subtitle="Balance de reciprocidad en la comunidad"
          />
        </Grid>

        {/* Gráficos detallados */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              📈 Evolución de Transacciones LETS
            </Typography>
            {/* Aquí iría un componente de gráfico */}
            <Box height={300} display="flex" alignItems="center" justifyContent="center">
              <Typography color="text.secondary">
                Gráfico de líneas mostrando transacciones por día
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              🏷️ Categorías Más Intercambiadas
            </Typography>
            <Box>
              {analytics.topCategories.map((category, index) => (
                <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">{category.name}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {category.count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'info' | 'secondary';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle
}) => (
  <Card sx={{ p: 2, textAlign: 'center' }}>
    <Box display="flex" justifyContent="center" mb={1}>
      {React.cloneElement(icon as React.ReactElement, {
        sx: { fontSize: 48, color: `${color}.main` }
      })}
    </Box>
    <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
      {value}
    </Typography>
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Card>
);
```

---

## 🧪 Plan de Testing

### 1. **Tests de Backend**

```typescript
// src/lets/services/lets-currency.service.spec.ts
describe('LetsCurrencyService', () => {
  let service: LetsCurrencyService;
  let mockRepository: Repository<UnitsWallet>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LetsCurrencyService,
        {
          provide: getRepositoryToken(UnitsWallet),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LetsCurrencyService>(LetsCurrencyService);
  });

  describe('transferUnits', () => {
    it('should transfer units between users successfully', async () => {
      // Test implementation
    });

    it('should reject transfer when credit limit exceeded', async () => {
      // Test implementation
    });

    it('should update trust scores after successful transfer', async () => {
      // Test implementation
    });
  });

  describe('calculateTrustScore', () => {
    it('should calculate correct trust score based on ratings', async () => {
      // Test implementation
    });
  });
});
```

### 2. **Tests de Frontend**

```typescript
// src/components/modules/marketplace/components/UnitsWallet.test.tsx
import { render, screen } from '@testing-library/react';
import { UnitsWallet } from './UnitsWallet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('UnitsWallet', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('should display wallet balance correctly', () => {
    renderWithProviders(<UnitsWallet userId="test-user" />);

    expect(screen.getByText('💫 Wallet de Ünits')).toBeInTheDocument();
  });

  it('should show credit usage when balance is negative', () => {
    // Test implementation
  });

  it('should display trust score correctly', () => {
    // Test implementation
  });
});
```

### 3. **Tests E2E (Playwright)**

```typescript
// e2e/lets-integration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('LETS Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'user@coomunity.com');
    await page.fill('[data-testid="password-input"]', 'test123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/');
  });

  test('should display units wallet in marketplace', async ({ page }) => {
    await page.goto('/marketplace');

    await expect(page.locator('[data-testid="units-wallet"]')).toBeVisible();
    await expect(page.getByText('💫 Wallet de Ünits')).toBeVisible();
  });

  test('should create LETS listing successfully', async ({ page }) => {
    await page.goto('/marketplace/lets');

    await page.click('[data-testid="create-listing-button"]');
    await page.fill('[data-testid="listing-title"]', 'Clases de Yoga');
    await page.fill(
      '[data-testid="listing-description"]',
      'Enseño yoga básico'
    );
    await page.selectOption('[data-testid="listing-type"]', 'offer');
    await page.fill('[data-testid="listing-units"]', '5');

    await page.click('[data-testid="submit-listing"]');

    await expect(page.getByText('Clases de Yoga')).toBeVisible();
  });

  test('should join knowledge exchange in CoP', async ({ page }) => {
    await page.goto('/social/cops/test-cop/knowledge');

    await page.click('[data-testid="join-exchange-button"]');

    await expect(page.getByText('Te has unido al intercambio')).toBeVisible();
  });
});
```

---

## 🚀 Plan de Implementación por Fases

### **Fase 1: Fundación LETS (Semanas 1-2)**

- ✅ Crear tablas de base de datos para Ünits y transacciones
- ✅ Implementar LetsCurrencyService básico
- ✅ Crear componente UnitsWallet
- ✅ Integrar con sistema de autenticación existente

### **Fase 2: Marketplace LETS (Semanas 3-4)**

- ✅ Extender MarketplaceService para soportar Ünits
- ✅ Crear componente LetsListings
- ✅ Implementar flujo de compra con Ünits
- ✅ Agregar filtros y búsqueda LETS

### **Fase 3: Comunidades de Práctica (Semanas 5-6)**

- ✅ Implementar CopsLetsService
- ✅ Crear sistema de jerarquía de conocimiento
- ✅ Desarrollar KnowledgeExchangeHub
- ✅ Integrar con sistema de Mëritos existente

### **Fase 4: Sistema de Confianza (Semanas 7-8)**

- ✅ Implementar ratings y evaluaciones
- ✅ Crear algoritmo de ajuste de límites de crédito
- ✅ Desarrollar sistema de resolución de disputas
- ✅ Crear dashboard de métricas de confianza

### **Fase 5: Optimización y Analytics (Semanas 9-10)**

- ✅ Implementar analytics avanzados
- ✅ Crear dashboard administrativo
- ✅ Optimizar performance de consultas
- ✅ Implementar sistema de notificaciones LETS

---

## 📋 Checklist de Implementación

### **Backend**

- [ ] Crear migraciones de base de datos
- [ ] Implementar LetsCurrencyService completo
- [ ] Crear endpoints REST para operaciones LETS
- [ ] Implementar validaciones de negocio
- [ ] Crear sistema de auditoria de transacciones
- [ ] Implementar job scheduler para expiración de listings

### **Frontend**

- [ ] Crear componentes base (UnitsWallet, LetsListings)
- [ ] Implementar formularios de creación/edición
- [ ] Crear interfaces para intercambio de conocimiento
- [ ] Implementar sistema de notificaciones en tiempo real
- [ ] Crear dashboards de analytics
- [ ] Implementar PWA features para uso offline

### **Testing**

- [ ] Escribir tests unitarios para servicios
- [ ] Crear tests de integración para APIs
- [ ] Implementar tests E2E con Playwright
- [ ] Crear tests de performance para transacciones
- [ ] Implementar monitoring y alertas

### **Documentación**

- [ ] Documentar APIs con Swagger/OpenAPI
- [ ] Crear guía de usuario para LETS
- [ ] Documentar flujos de integración
- [ ] Crear troubleshooting guide
- [ ] Documentar métricas y KPIs

---

## 🎯 Consideraciones Especiales

### **1. Aspectos de Seguridad**

- Implementar rate limiting para transacciones
- Validar todas las transacciones con firmas digitales
- Crear sistema de backup y recovery para wallets
- Implementar 2FA para transacciones grandes

### **2. Escalabilidad**

- Usar índices de base de datos optimizados
- Implementar cache para consultas frecuentes
- Considerar sharding para usuarios activos
- Usar CDC (Change Data Capture) para analytics

### **3. Experiencia de Usuario**

- Crear onboarding específico para LETS
- Implementar tooltips y ayuda contextual
- Crear notificaciones push para eventos importantes
- Optimizar para dispositivos móviles

### **4. Cumplimiento Legal**

- Verificar regulaciones locales sobre monedas alternativas
- Implementar reporting para auditorías
- Crear términos y condiciones específicos para LETS
- Considerar aspectos fiscales de las transacciones

---

## 📖 Recursos y Referencias

### **Documentación Técnica**

- [Sistema LETS Original - Michael Linton](https://www.lets.net/)
- [Filosofía CoomÜnity - Documento LETS.md](./LETS.md)
- [Arquitectura Backend NestJS](./src/README.md)
- [Guía de Frontend React](./Demo/apps/superapp-unified/README.md)

### **Ejemplos de Implementación**

- [Community Exchange System](https://www.community-exchange.org/)
- [Time Banking](https://timebanking.org/)
- [Barter Network](https://www.barternetwork.com/)

### **Herramientas Recomendadas**

- Base de datos: PostgreSQL con extensiones UUID
- Cache: Redis para sesiones y cache de queries
- Queue: Bull/BullMQ para procesamiento asíncrono
- Monitoring: Grafana + Prometheus
- Analytics: Custom dashboard con Chart.js/D3

---

## 🎉 Conclusión

Esta guía proporciona un roadmap completo para implementar el sistema LETS en CoomÜnity, integrando perfectamente con la arquitectura existente y respetando la filosofía de Ayni, Bien Común y economía colaborativa. La implementación por fases asegura un desarrollo controlado y permite iteración basada en feedback de usuarios.

El sistema LETS en CoomÜnity no es solo una funcionalidad adicional, sino una transformación fundamental hacia una economía más justa, colaborativa y sustentable, donde el valor se mide en términos de contribución comunitaria y reciprocidad, no solo en acumulación monetaria.

**¡Que comience la revolución de la economía colaborativa en CoomÜnity! 🌟**
