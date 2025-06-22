import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/dto/notifications.dto';
import {
  CreateInvitationTemplateDto,
  CreateGiftCardDto,
  RedeemGiftCardDto,
  UpdateGiftCardDto,
  InvitationChallengeDto,
  InvitationStatsDto,
  InvitationStatus,
  UserInvitationStatus,
} from './dto/invitations.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class InvitationsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService
  ) {
    // //     console.log('>>> InvitationsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    // //     console.log('>>> InvitationsService CONSTRUCTOR: this.notificationsService IS', this.notificationsService ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Crear una gift card de invitación
   */
  async createGiftCard(dto: CreateGiftCardDto) {
    //     console.log('>>> InvitationsService.createGiftCard: Creating gift card', dto);

    // Verificar que el invitador existe y tiene suficientes Ünits
    const inviter = await this.prisma.user.findUnique({
      where: { id: dto.inviterId },
      include: { wallet: true },
    });

    if (!inviter) {
      throw new NotFoundException('Usuario invitador no encontrado');
    }

    if (!inviter.wallet || inviter.wallet.balanceUnits < dto.unitsAmount) {
      throw new BadRequestException(
        'Balance insuficiente para crear la gift card'
      );
    }

    // Generar token único para la gift card
    const token = crypto.randomBytes(32).toString('hex');

    // Crear la gift card usando el modelo Publication (temporal)
    const giftCard = await this.prisma.$transaction(async (tx) => {
      // 1. Crear la gift card
      const card = await tx.publication.create({
        data: {
          userId: dto.inviterId,
          content: JSON.stringify({
            type: 'GIFT_CARD',
            invitedName: dto.invitedName,
            invitedEmail: dto.invitedEmail,
            unitsAmount: dto.unitsAmount,
            suggestions: dto.suggestions || [],
            token,
            status: InvitationStatus.SENT,
            templateId: dto.templateId,
          }),
          type: 'GIFT_CARD',
        },
      });

      // 2. Descontar Ünits del invitador
      await tx.wallet.update({
        where: { userId: dto.inviterId },
        data: { balanceUnits: { decrement: dto.unitsAmount } },
      });

      // 3. Crear transacción de registro
      await tx.transaction.create({
        data: {
          fromUserId: dto.inviterId,
          toUserId: dto.inviterId, // Temporal, será actualizado cuando se canjee
          amount: dto.unitsAmount,
          tokenType: 'CIRCULATING_UNIT',
          type: 'SEND',
          status: 'COMPLETED',
          description: `Gift card creada para ${dto.invitedName} (${dto.invitedEmail})`,
        },
      });

      return card;
    });

    // Enviar notificación al invitador
    await this.notificationsService.createNotification({
      userId: dto.inviterId,
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      message: `Gift card de ${dto.unitsAmount} Ünits creada para ${dto.invitedName}`,
      metadata: { giftCardId: giftCard.id, token },
    });

    const content = JSON.parse(giftCard.content);
    return {
      id: giftCard.id,
      ...content,
      createdAt: giftCard.createdAt,
    };
  }

  /**
   * Canjear una gift card
   */
  async redeemGiftCard(dto: RedeemGiftCardDto) {
    //     console.log('>>> InvitationsService.redeemGiftCard: Redeeming gift card', { token: dto.token, email: dto.invitedEmail });

    // Buscar la gift card por token
    const giftCardPublication = await this.prisma.publication.findFirst({
      where: {
        type: 'GIFT_CARD',
      },
    });

    if (!giftCardPublication) {
      throw new NotFoundException('Gift card no encontrada');
    }

    const giftCardContent = JSON.parse(giftCardPublication.content);

    if (giftCardContent.token !== dto.token) {
      throw new BadRequestException('Token de gift card inválido');
    }

    if (giftCardContent.status !== InvitationStatus.SENT) {
      throw new BadRequestException(
        'Gift card ya ha sido canjeada o está expirada'
      );
    }

    if (giftCardContent.invitedEmail !== dto.invitedEmail) {
      throw new BadRequestException('Email no coincide con la invitación');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.invitedEmail },
    });

    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario con este email');
    }

    // Crear nuevo usuario y canjear gift card
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Crear nuevo usuario
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const newUser = await tx.user.create({
        data: {
          email: dto.invitedEmail,
          password: hashedPassword,
          firstName: dto.firstName || dto.invitedName.split(' ')[0],
          lastName:
            dto.lastName || dto.invitedName.split(' ').slice(1).join(' '),
          isActive: true,
        },
      });

      // 2. Crear wallet para el nuevo usuario
      const wallet = await tx.wallet.create({
        data: {
          userId: newUser.id,
          balanceUnits: giftCardContent.unitsAmount,
          balanceToins: 0,
        },
      });

      // 3. Crear token inicial para el nuevo usuario
      await tx.token.create({
        data: {
          userId: newUser.id,
          amount: giftCardContent.unitsAmount,
          type: 'PROMOTIONAL_UNIT',
          status: 'ACTIVE',
          source: 'GIFT_CARD',
          caducityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        },
      });

      // 4. Marcar gift card como canjeada
      await tx.publication.update({
        where: { id: giftCardPublication.id },
        data: {
          content: JSON.stringify({
            ...giftCardContent,
            status: InvitationStatus.REDEEMED,
            redeemedAt: new Date(),
            redeemedByUserId: newUser.id,
          }),
        },
      });

      // 5. Crear transacción de canje
      await tx.transaction.create({
        data: {
          toUserId: newUser.id,
          amount: giftCardContent.unitsAmount,
          tokenType: 'PROMOTIONAL_UNIT',
          type: 'RECEIVE',
          status: 'COMPLETED',
          description: `Canje de gift card de bienvenida`,
        },
      });

      return { newUser, wallet };
    });

    // Notificar al invitador
    await this.notificationsService.createNotification({
      userId: giftCardPublication.userId,
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      message: `${dto.invitedName} ha canjeado tu gift card de ${giftCardContent.unitsAmount} Ünits`,
      metadata: {
        giftCardId: giftCardPublication.id,
        newUserId: result.newUser.id,
      },
    });

    return {
      message: 'Gift card canjeada exitosamente',
      user: {
        id: result.newUser.id,
        email: result.newUser.email,
        firstName: result.newUser.firstName,
        lastName: result.newUser.lastName,
      },
      wallet: {
        balanceUnits: result.wallet.balanceUnits,
        balanceToins: result.wallet.balanceToins,
      },
      giftCardAmount: giftCardContent.unitsAmount,
    };
  }

  /**
   * Obtener gift cards de un usuario
   */
  async getUserGiftCards(userId: string) {
    //     console.log('>>> InvitationsService.getUserGiftCards: Getting gift cards for user', userId);

    const giftCards = await this.prisma.publication.findMany({
      where: {
        userId,
        type: 'GIFT_CARD',
      },
      orderBy: { createdAt: 'desc' },
    });

    return giftCards.map((card) => {
      const content = JSON.parse(card.content);
      return {
        id: card.id,
        ...content,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      };
    });
  }

  /**
   * Actualizar gift card
   */
  async updateGiftCard(
    giftCardId: string,
    dto: UpdateGiftCardDto,
    userId: string
  ) {
    //     console.log('>>> InvitationsService.updateGiftCard: Updating gift card', giftCardId);

    const giftCard = await this.prisma.publication.findFirst({
      where: {
        id: giftCardId,
        userId,
        type: 'GIFT_CARD',
      },
    });

    if (!giftCard) {
      throw new NotFoundException('Gift card no encontrada');
    }

    const currentContent = JSON.parse(giftCard.content);
    const updatedContent = { ...currentContent, ...dto };

    const updatedGiftCard = await this.prisma.publication.update({
      where: { id: giftCardId },
      data: {
        content: JSON.stringify(updatedContent),
      },
    });

    return {
      id: updatedGiftCard.id,
      ...JSON.parse(updatedGiftCard.content),
      createdAt: updatedGiftCard.createdAt,
      updatedAt: updatedGiftCard.updatedAt,
    };
  }

  /**
   * Obtener estadísticas de invitaciones
   */
  async getInvitationStats(dto: InvitationStatsDto) {
    //     console.log('>>> InvitationsService.getInvitationStats: Getting invitation statistics', dto);

    const where: any = { type: 'GIFT_CARD' };

    if (dto.userId) {
      where.userId = dto.userId;
    }

    if (dto.startDate || dto.endDate) {
      where.createdAt = {};
      if (dto.startDate) {
        where.createdAt.gte = new Date(dto.startDate);
      }
      if (dto.endDate) {
        where.createdAt.lte = new Date(dto.endDate);
      }
    }

    const giftCards = await this.prisma.publication.findMany({ where });

    const stats = giftCards.reduce(
      (acc, card) => {
        const content = JSON.parse(card.content);

        acc.total++;
        acc.totalUnitsDistributed += content.unitsAmount;

        switch (content.status) {
          case InvitationStatus.SENT:
            acc.pending++;
            break;
          case InvitationStatus.REDEEMED:
            acc.redeemed++;
            break;
          case InvitationStatus.EXPIRED:
            acc.expired++;
            break;
          case InvitationStatus.CANCELLED:
            acc.cancelled++;
            break;
        }

        return acc;
      },
      {
        total: 0,
        pending: 0,
        redeemed: 0,
        expired: 0,
        cancelled: 0,
        totalUnitsDistributed: 0,
      }
    );

    return {
      ...stats,
      conversionRate:
        stats.total > 0 ? (stats.redeemed / stats.total) * 100 : 0,
    };
  }

  /**
   * Cancelar gift card
   */
  async cancelGiftCard(giftCardId: string, userId: string) {
    //     console.log('>>> InvitationsService.cancelGiftCard: Cancelling gift card', giftCardId);

    const giftCard = await this.prisma.publication.findFirst({
      where: {
        id: giftCardId,
        userId,
        type: 'GIFT_CARD',
      },
    });

    if (!giftCard) {
      throw new NotFoundException('Gift card no encontrada');
    }

    const content = JSON.parse(giftCard.content);

    if (content.status !== InvitationStatus.SENT) {
      throw new BadRequestException(
        'Solo se pueden cancelar gift cards pendientes'
      );
    }

    // Cancelar gift card y devolver Ünits
    await this.prisma.$transaction(async (tx) => {
      // 1. Marcar como cancelada
      await tx.publication.update({
        where: { id: giftCardId },
        data: {
          content: JSON.stringify({
            ...content,
            status: InvitationStatus.CANCELLED,
            cancelledAt: new Date(),
          }),
        },
      });

      // 2. Devolver Ünits al invitador
      await tx.wallet.update({
        where: { userId },
        data: { balanceUnits: { increment: content.unitsAmount } },
      });

      // 3. Crear transacción de devolución
      await tx.transaction.create({
        data: {
          toUserId: userId,
          amount: content.unitsAmount,
          tokenType: 'CIRCULATING_UNIT',
          type: 'RECEIVE',
          status: 'COMPLETED',
          description: `Devolución por cancelación de gift card`,
        },
      });
    });

    return { message: 'Gift card cancelada y Ünits devueltos exitosamente' };
  }
}
