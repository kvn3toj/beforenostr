import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateLetsTransactionDto,
  LetsBalanceDto,
  LetsExpiryCheckDto,
  LetsTransactionType,
  LetsTransactionStatus,
} from './dto/lets.dto';
import type { Token, Transaction, User, Wallet } from '../generated/prisma';
import { Currency } from '../generated/prisma';

@Injectable()
export class LetsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    // //     console.log('>>> LetsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Obtener balance de Ünits de un usuario con información de caducidad
   */
  async getUserBalance(dto: LetsBalanceDto) {
    //     console.log('>>> LetsService.getUserBalance: Getting balance for user', dto.userId);

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      include: {
        wallet: true,
        tokens: {
          where: {
            status: 'ACTIVE',
            ...(dto.tokenType && { type: dto.tokenType }),
          },
          orderBy: { caducityDate: 'asc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Calcular balance total y por tipo
    const balanceByType = user.tokens.reduce(
      (acc, token) => {
        if (!acc[token.type]) {
          acc[token.type] = {
            total: 0,
            expiring: 0,
            expired: 0,
          };
        }

        acc[token.type].total += token.amount;

        // Verificar si está próximo a caducar (30 días)
        if (token.caducityDate) {
          const daysToExpiry = Math.ceil(
            (token.caducityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          if (daysToExpiry <= 30 && daysToExpiry > 0) {
            acc[token.type].expiring += token.amount;
          } else if (daysToExpiry <= 0) {
            acc[token.type].expired += token.amount;
          }
        }

        return acc;
      },
      {} as Record<string, { total: number; expiring: number; expired: number }>
    );

    return {
      userId: dto.userId,
      walletBalance: {
        units: user.wallet?.balanceUnits || 0,
        toins: user.wallet?.balanceToins || 0,
      },
      tokenBalance: balanceByType,
      totalActiveTokens: user.tokens.reduce(
        (sum, token) => sum + token.amount,
        0
      ),
    };
  }

  /**
   * Realizar intercambio de Ünits entre usuarios
   */
  async exchangeUnits(dto: CreateLetsTransactionDto) {
    //     console.log('>>> LetsService.exchangeUnits: Processing exchange', dto);

    // Verificar que los usuarios existen y tienen wallets
    const [fromUser, toUser] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: dto.fromUserId },
        include: { wallet: true, tokens: { where: { status: 'ACTIVE' } } },
      }),
      this.prisma.user.findUnique({
        where: { id: dto.toUserId },
        include: { wallet: true },
      }),
    ]);

    if (!fromUser || !toUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!fromUser.wallet || !toUser.wallet) {
      throw new BadRequestException(
        'Ambos usuarios deben tener wallets activas'
      );
    }

    // Verificar balance suficiente
    const availableBalance = fromUser.tokens.reduce(
      (sum, token) => sum + token.amount,
      0
    );
    if (availableBalance < dto.amount) {
      throw new BadRequestException(
        'Balance insuficiente para realizar el intercambio'
      );
    }

    // Realizar transacción en una transacción de base de datos
    return await this.prisma.$transaction(async (tx) => {
      // 1. Crear registro de transacción
      const transaction = await tx.transaction.create({
        data: {
          fromUser: { connect: { id: fromUser.id } },
          toUser: { connect: { id: toUser.id } },
          fromWallet: { connect: { id: fromUser.wallet.id } },
          toWallet: { connect: { id: toUser.wallet.id } },
          amount: dto.amount,
          currency: Currency.UNITS,
          description:
            dto.description || `Intercambio LETS de ${dto.amount} Ünits`,
          metadata: {
            type: 'LETS_EXCHANGE',
            source: 'user_initiated',
            timestamp: new Date().toISOString(),
          },
        },
      });

      // 2. Actualizar balances en wallets
      await tx.wallet.update({
        where: { userId: dto.fromUserId },
        data: { balanceUnits: { decrement: dto.amount } },
      });

      await tx.wallet.update({
        where: { userId: dto.toUserId },
        data: { balanceUnits: { increment: dto.amount } },
      });

      // 3. Manejar tokens del remitente (usar FIFO - primero los que caducan antes)
      let remainingAmount = dto.amount;
      const tokensToUpdate = fromUser.tokens.sort((a, b) => {
        if (!a.caducityDate && !b.caducityDate) return 0;
        if (!a.caducityDate) return 1;
        if (!b.caducityDate) return -1;
        return a.caducityDate.getTime() - b.caducityDate.getTime();
      });

      for (const token of tokensToUpdate) {
        if (remainingAmount <= 0) break;

        const amountToDeduct = Math.min(token.amount, remainingAmount);

        if (amountToDeduct === token.amount) {
          // Marcar token como usado
          await tx.token.update({
            where: { id: token.id },
            data: { status: 'USED' },
          });
        } else {
          // Reducir cantidad del token
          await tx.token.update({
            where: { id: token.id },
            data: { amount: token.amount - amountToDeduct },
          });
        }

        remainingAmount -= amountToDeduct;
      }

      // 4. Crear nuevo token para el receptor
      await tx.token.create({
        data: {
          userId: dto.toUserId,
          amount: dto.amount,
          type: 'CIRCULATING_UNIT',
          status: 'ACTIVE',
          source: 'CONVERSION',
          caducityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año de caducidad
        },
      });

      return transaction;
    });
  }

  /**
   * Verificar y procesar tokens caducados
   */
  async processExpiredTokens(dto: LetsExpiryCheckDto) {
    //     console.log('>>> LetsService.processExpiredTokens: Processing expired tokens for user', dto.userId);

    const expiredTokens = await this.prisma.token.findMany({
      where: {
        userId: dto.userId,
        status: 'ACTIVE',
        caducityDate: {
          lte: new Date(),
        },
        ...(dto.tokenType && { type: dto.tokenType }),
      },
    });

    if (expiredTokens.length === 0) {
      return {
        message: 'No hay tokens caducados',
        expiredCount: 0,
        totalExpiredAmount: 0,
      };
    }

    const totalExpiredAmount = expiredTokens.reduce(
      (sum, token) => sum + token.amount,
      0
    );

    // Marcar tokens como expirados y actualizar wallet
    await this.prisma.$transaction(async (tx) => {
      // Marcar tokens como expirados
      await tx.token.updateMany({
        where: {
          id: { in: expiredTokens.map((t) => t.id) },
        },
        data: { status: 'EXPIRED' },
      });

      // Actualizar balance en wallet
      await tx.wallet.update({
        where: { userId: dto.userId },
        data: { balanceUnits: { decrement: totalExpiredAmount } },
      });

      // Obtener usuario y wallet para relaciones
      const user = await tx.user.findUnique({
        where: { id: dto.userId },
        include: { wallet: true },
      });
      if (!user || !user.wallet) throw new Error('Usuario o wallet no encontrado');

      // Crear registro de transacción para auditoría
      await tx.transaction.create({
        data: {
          fromUser: { connect: { id: user.id } },
          toUser: { connect: { id: user.id } },
          fromWallet: { connect: { id: user.wallet.id } },
          toWallet: { connect: { id: user.wallet.id } },
          amount: totalExpiredAmount,
          currency: Currency.UNITS,
          description: `Caducidad automática de ${expiredTokens.length} tokens`,
          metadata: {
            type: 'EXPIRE',
            timestamp: new Date().toISOString(),
          },
        },
      });
    });

    return {
      message: `Se procesaron ${expiredTokens.length} tokens caducados`,
      expiredCount: expiredTokens.length,
      totalExpiredAmount,
    };
  }

  /**
   * Obtener historial de transacciones LETS de un usuario
   */
  async getUserLetsHistory(userId: string, limit: number = 50) {
    //     console.log('>>> LetsService.getUserLetsHistory: Getting LETS history for user', userId);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      include: {
        fromUser: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        toUser: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return transactions.map((tx) => ({
      ...tx,
      direction: tx.fromUserId === userId ? 'OUTGOING' : 'INCOMING',
    }));
  }

  /**
   * Verificar si un usuario puede realizar saldos negativos (según reglas LETS)
   */
  async checkNegativeBalanceEligibility(userId: string) {
    //     console.log('>>> LetsService.checkNegativeBalanceEligibility: Checking eligibility for user', userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Reglas básicas para saldo negativo:
    // 1. Usuario debe tener al menos 30 días de antigüedad
    // 2. Debe haber realizado al menos 5 transacciones exitosas
    // 3. No debe tener historial de transacciones fallidas recientes

    const accountAge = Math.ceil(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const allTransactions = [];
    const successfulTransactions = allTransactions.length;

    const isEligible = accountAge >= 30 && successfulTransactions >= 5;
    const maxNegativeBalance = isEligible ? -100 : 0; // Máximo -100 Ünits

    return {
      isEligible,
      accountAge,
      successfulTransactions,
      maxNegativeBalance,
      currentBalance: user.wallet?.balanceUnits || 0,
    };
  }

  // Nuevos métodos requeridos por el reporte de integración

  /**
   * Obtener calificaciones de confianza de un usuario
   */
  async getTrustRatings(userId: string) {
    //     console.log('>>> LetsService.getTrustRatings: Getting trust ratings for user', userId);

    try {
      // Por ahora devolvemos datos simulados hasta implementar el modelo TrustRating en Prisma
      const mockRatings = [
        {
          id: '1',
          raterId: 'user1',
          ratedId: userId,
          rating: 4.5,
          communicationRating: 4.8,
          deliveryRating: 4.2,
          qualityRating: 4.6,
          comments: 'Excelente intercambio, muy confiable',
          createdAt: new Date('2024-01-15').toISOString(),
        },
        {
          id: '2',
          raterId: 'user2',
          ratedId: userId,
          rating: 4.8,
          communicationRating: 5.0,
          deliveryRating: 4.5,
          qualityRating: 4.9,
          comments: 'Comunicación clara y entrega puntual',
          createdAt: new Date('2024-01-10').toISOString(),
        },
      ];

      const averageRating =
        mockRatings.reduce((sum, rating) => sum + rating.rating, 0) /
        mockRatings.length;
      const trustScore = Math.min(averageRating / 5.0 + 0.1, 1.0); // Factor adicional por experiencia

      return {
        userId,
        trustScore: parseFloat(trustScore.toFixed(2)),
        ratingsCount: mockRatings.length,
        averageRating: parseFloat(averageRating.toFixed(2)),
        ratings: mockRatings,
        breakdown: {
          communication:
            mockRatings.reduce((sum, r) => sum + r.communicationRating, 0) /
            mockRatings.length,
          delivery:
            mockRatings.reduce((sum, r) => sum + r.deliveryRating, 0) /
            mockRatings.length,
          quality:
            mockRatings.reduce((sum, r) => sum + r.qualityRating, 0) /
            mockRatings.length,
        },
      };
    } catch (error) {
      console.error('[LetsService] Error getting trust ratings:', error);
      return {
        userId,
        trustScore: 0.5,
        ratingsCount: 0,
        averageRating: 0,
        ratings: [],
        breakdown: { communication: 0, delivery: 0, quality: 0 },
      };
    }
  }

  /**
   * Crear calificación de confianza
   */
  async createTrustRating(ratingData: {
    ratedId: string;
    transactionId?: string;
    rating: number;
    communicationRating?: number;
    deliveryRating?: number;
    qualityRating?: number;
    comments?: string;
  }) {
    //     console.log('>>> LetsService.createTrustRating: Creating trust rating', ratingData);

    try {
      // Validaciones básicas
      if (ratingData.rating < 1 || ratingData.rating > 5) {
        throw new BadRequestException('La calificación debe estar entre 1 y 5');
      }

      // Verificar que el usuario calificado existe
      const ratedUser = await this.prisma.user.findUnique({
        where: { id: ratingData.ratedId },
      });

      if (!ratedUser) {
        throw new NotFoundException('Usuario calificado no encontrado');
      }

      // Por ahora devolvemos datos simulados hasta implementar el modelo TrustRating
      const mockRating = {
        id: `rating_${Date.now()}`,
        ratedId: ratingData.ratedId,
        rating: ratingData.rating,
        communicationRating:
          ratingData.communicationRating || ratingData.rating,
        deliveryRating: ratingData.deliveryRating || ratingData.rating,
        qualityRating: ratingData.qualityRating || ratingData.rating,
        comments: ratingData.comments || '',
        transactionId: ratingData.transactionId,
        createdAt: new Date().toISOString(),
      };

      return mockRating;
    } catch (error) {
      console.error('[LetsService] Error creating trust rating:', error);
      throw error;
    }
  }

  /**
   * Obtener intercambios de conocimiento disponibles
   */
  async getKnowledgeExchanges(
    filters: { copId?: string; category?: string } = {}
  ) {
    //     console.log('>>> LetsService.getKnowledgeExchanges: Getting knowledge exchanges', filters);

    try {
      // Por ahora devolvemos datos simulados hasta implementar el modelo KnowledgeExchange
      const mockExchanges = [
        {
          id: 'ke1',
          title: 'Principios de Reciprocidad en la Práctica',
          description:
            'Sesión práctica sobre cómo aplicar los principios de reciprocidad en intercambios comerciales',
          teacherId: 'teacher1',
          teacherName: 'María González',
          copId: filters.copId || 'cop1',
          sessionType: 'workshop',
          knowledgeAreas: [
            'reciprocidad',
            'economia_colaborativa',
            'intercambios',
          ],
          unitsCost: 25,
          durationHours: 2,
          maxParticipants: 10,
          currentParticipants: 3,
          scheduledAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // En 7 días
          status: 'scheduled',
        },
        {
          id: 'ke2',
          title: 'Gestión de Mëritos y Reconocimientos',
          description:
            'Cómo administrar y reconocer contribuciones al Bien Común de manera efectiva',
          teacherId: 'teacher2',
          teacherName: 'Carlos Mendoza',
          copId: filters.copId || 'cop1',
          sessionType: 'mentoring',
          knowledgeAreas: ['meritos', 'bien_comun', 'liderazgo'],
          unitsCost: 40,
          durationHours: 1.5,
          maxParticipants: 5,
          currentParticipants: 1,
          scheduledAt: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // En 3 días
          status: 'scheduled',
        },
        {
          id: 'ke3',
          title: 'Introducción al Sistema LETS',
          description:
            'Fundamentos del Local Exchange Trading System y su aplicación en CoomÜnity',
          teacherId: 'teacher3',
          teacherName: 'Ana Ruiz',
          copId: filters.copId || 'cop2',
          sessionType: 'group_session',
          knowledgeAreas: ['lets', 'unites', 'intercambios_locales'],
          unitsCost: 15,
          durationHours: 3,
          maxParticipants: 15,
          currentParticipants: 8,
          scheduledAt: new Date(
            Date.now() + 10 * 24 * 60 * 60 * 1000
          ).toISOString(), // En 10 días
          status: 'scheduled',
        },
      ];

      // Filtrar por categoría si se especifica
      let filteredExchanges = mockExchanges;
      if (filters.category) {
        filteredExchanges = mockExchanges.filter((exchange) =>
          exchange.knowledgeAreas.some((area) =>
            area.toLowerCase().includes(filters.category.toLowerCase())
          )
        );
      }

      return filteredExchanges;
    } catch (error) {
      console.error('[LetsService] Error getting knowledge exchanges:', error);
      return [];
    }
  }

  /**
   * Crear intercambio de conocimiento
   */
  async createKnowledgeExchange(exchangeData: {
    copId: string;
    teacherId: string;
    sessionType: string;
    title: string;
    description: string;
    knowledgeAreas: string[];
    unitsCost: number;
    durationHours: number;
    maxParticipants: number;
    scheduledAt: string;
  }) {
    //     console.log('>>> LetsService.createKnowledgeExchange: Creating knowledge exchange', exchangeData);

    try {
      // Validaciones básicas
      if (exchangeData.unitsCost < 0) {
        throw new BadRequestException(
          'El costo en Ünits no puede ser negativo'
        );
      }

      if (exchangeData.maxParticipants < 1) {
        throw new BadRequestException('Debe permitir al menos 1 participante');
      }

      // Verificar que el profesor existe
      const teacher = await this.prisma.user.findUnique({
        where: { id: exchangeData.teacherId },
      });

      if (!teacher) {
        throw new NotFoundException('Profesor no encontrado');
      }

      // Por ahora devolvemos datos simulados hasta implementar el modelo KnowledgeExchange
      const newExchange = {
        id: `ke_${Date.now()}`,
        ...exchangeData,
        teacherName: teacher.firstName
          ? `${teacher.firstName} ${teacher.lastName || ''}`.trim()
          : teacher.email,
        currentParticipants: 0,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };

      return newExchange;
    } catch (error) {
      console.error('[LetsService] Error creating knowledge exchange:', error);
      throw error;
    }
  }

  /**
   * Obtener recomendaciones personalizadas para un usuario
   */
  async getRecommendations(userId: string) {
    //     console.log('>>> LetsService.getRecommendations: Getting recommendations for user', userId);

    try {
      // Obtener datos del usuario para personalizar recomendaciones
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { wallet: true },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Generar recomendaciones basadas en el perfil del usuario
      const recommendations = [
        {
          id: 'rec1',
          type: 'knowledge_exchange',
          title: 'Sesiones de Intercambio de Conocimiento Recomendadas',
          description: 'Basado en tu actividad reciente',
          items: [
            {
              id: 'ke1',
              title: 'Principios de Reciprocidad en la Práctica',
              reason: 'Te interesa la economía colaborativa',
              unitsCost: 25,
              confidence: 0.85,
            },
            {
              id: 'ke3',
              title: 'Introducción al Sistema LETS',
              reason: 'Nuevo en intercambios LETS',
              unitsCost: 15,
              confidence: 0.75,
            },
          ],
        },
        {
          id: 'rec2',
          type: 'trust_building',
          title: 'Construye tu Reputación',
          description: 'Usuarios con alta confianza para intercambios seguros',
          items: [
            {
              id: 'user1',
              name: 'María González',
              trustScore: 0.92,
              reason: 'Alta calificación y muchas transacciones exitosas',
              recentActivity: 'Activa esta semana',
            },
            {
              id: 'user2',
              name: 'Carlos Mendoza',
              trustScore: 0.88,
              reason: 'Especialista en Mëritos y gestión comunitaria',
              recentActivity: 'Disponible para mentoría',
            },
          ],
        },
        {
          id: 'rec3',
          type: 'marketplace',
          title: 'Intercambios Sugeridos',
          description: 'Productos y servicios que podrían interesarte',
          items: [
            {
              id: 'listing1',
              title: 'Consultoría en Sostenibilidad',
              provider: 'Ana Ruiz',
              unitsCost: 50,
              reason: 'Coincide con tus intereses ambientales',
              category: 'servicios',
            },
            {
              id: 'listing2',
              title: 'Productos Orgánicos Locales',
              provider: 'Cooperativa Verde',
              unitsCost: 30,
              reason: 'Producto popular en tu área',
              category: 'productos',
            },
          ],
        },
      ];

      return {
        userId,
        generatedAt: new Date().toISOString(),
        recommendations,
        categories: ['knowledge_exchange', 'trust_building', 'marketplace'],
        trustBasedSuggestions: recommendations[1].items,
        personalizedScore: 0.82, // Basado en actividad y perfil del usuario
      };
    } catch (error) {
      console.error('[LetsService] Error getting recommendations:', error);
      return {
        userId,
        generatedAt: new Date().toISOString(),
        recommendations: [],
        categories: [],
        trustBasedSuggestions: [],
        personalizedScore: 0,
      };
    }
  }

  /**
   * Obtener notificaciones LETS para un usuario
   */
  async getNotifications(_userId: string) {
    //     console.log('>>> LetsService.getNotifications: Getting notifications for user', userId);

    try {
      // Por ahora devolvemos notificaciones simuladas hasta implementar el modelo Notification
      const mockNotifications = [
        {
          id: 'notif1',
          type: 'transaction',
          title: 'Intercambio Completado',
          message:
            'Has recibido 25 Ünits de María González por la sesión de Reciprocidad',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Hace 2 horas
          read: false,
          metadata: {
            transactionId: 'tx123',
            amount: 25,
            fromUser: 'María González',
          },
        },
        {
          id: 'notif2',
          type: 'trust_rating',
          title: 'Nueva Calificación de Confianza',
          message: 'Carlos Mendoza te ha calificado con 5 estrellas',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // Hace 6 horas
          read: false,
          metadata: {
            raterId: 'user2',
            raterName: 'Carlos Mendoza',
            rating: 5,
          },
        },
        {
          id: 'notif3',
          type: 'knowledge_exchange',
          title: 'Recordatorio de Sesión',
          message:
            'Tu sesión "Principios de Reciprocidad" comienza en 24 horas',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // Hace 12 horas
          read: true,
          metadata: {
            exchangeId: 'ke1',
            exchangeTitle: 'Principios de Reciprocidad en la Práctica',
            scheduledAt: new Date(
              Date.now() + 12 * 60 * 60 * 1000
            ).toISOString(),
          },
        },
        {
          id: 'notif4',
          type: 'system',
          title: 'Tokens Próximos a Caducar',
          message: 'Tienes 50 Ünits que caducan en 5 días. ¡Úsalos pronto!',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
          read: true,
          metadata: {
            expiringAmount: 50,
            daysToExpiry: 5,
          },
        },
        {
          id: 'notif5',
          type: 'recommendation',
          title: 'Nueva Recomendación',
          message:
            'Tienes nuevos intercambios recomendados basados en tu actividad',
          timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // Hace 1.5 días
          read: true,
          metadata: {
            recommendationCount: 3,
            topRecommendation: 'Introducción al Sistema LETS',
          },
        },
      ];

      // Ordenar por timestamp descendente (más recientes primero)
      mockNotifications.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return mockNotifications;
    } catch (error) {
      console.error('[LetsService] Error getting notifications:', error);
      return [];
    }
  }
}
