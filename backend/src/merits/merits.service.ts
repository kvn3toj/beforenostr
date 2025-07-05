import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeritDto } from './dto/create-merit.dto';
import type { Merit } from '../generated/prisma';

@Injectable()
export class MeritsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    // //     console.log('>>> MeritsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async create(createMeritDto: CreateMeritDto): Promise<Merit> {
    // Validar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: createMeritDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createMeritDto.userId} not found`
      );
    }

    // Validar tipos de merit válidos
    const validMeritTypes = ['MERITO', 'ONDA', 'VIBRA'];
    if (!validMeritTypes.includes(createMeritDto.type)) {
      throw new BadRequestException(
        `Invalid merit type: ${createMeritDto.type}`
      );
    }

    // Validar fuentes válidas
    const validSources = [
      'INTERACTION',
      'CONTRIBUTION',
      'INVITATION_PERFORMANCE',
      'CHALLENGE_COMPLETION',
      'COMMUNITY_PARTICIPATION',
      'CONTENT_CREATION',
    ];
    if (!validSources.includes(createMeritDto.source)) {
      throw new BadRequestException(
        `Invalid merit source: ${createMeritDto.source}`
      );
    }

    const merit = await this.prisma.merit.create({
      data: {
        userId: createMeritDto.userId,
        amount: createMeritDto.amount,
        type: createMeritDto.type,
        source: createMeritDto.source,
        relatedEntityId: createMeritDto.relatedEntityId,
      },
    });

    //       console.log(`>>> MeritsService: Created merit ${merit.id} for user ${createMeritDto.userId}`);
    return merit;
  }

  async findAll(): Promise<Merit[]> {
    return this.prisma.merit.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUserId(userId: string): Promise<Merit[]> {
    return this.prisma.merit.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Merit> {
    const merit = await this.prisma.merit.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!merit) {
      throw new NotFoundException(`Merit with ID ${id} not found`);
    }

    return merit;
  }

  // Métodos específicos de negocio para merits

  async getUserMeritBalance(
    userId: string,
    meritType?: string
  ): Promise<{ type: string; totalAmount: number }[]> {
    const whereClause: { userId: string; type?: string } = {
      userId,
    };

    if (meritType) {
      whereClause.type = meritType;
    }

    const merits = await this.prisma.merit.findMany({
      where: whereClause,
    });

    // Agrupar por tipo y sumar cantidades
    const balanceMap = new Map<string, number>();

    merits.forEach((merit) => {
      const currentBalance = balanceMap.get(merit.type) || 0;
      balanceMap.set(merit.type, currentBalance + merit.amount);
    });

    return Array.from(balanceMap.entries()).map(([type, totalAmount]) => ({
      type,
      totalAmount,
    }));
  }

  async awardMerit(
    userId: string,
    type: string,
    amount: number,
    source: string,
    relatedEntityId?: string
  ): Promise<Merit> {
    const createMeritDto: CreateMeritDto = {
      userId,
      amount,
      type,
      source,
      relatedEntityId,
    };

    return this.create(createMeritDto);
  }

  async getMeritLeaderboard(
    meritType?: string,
    limit: number = 10
  ): Promise<
    {
      userId: string;
      user: { id: string; email: string; name: string; username: string };
      totalMerits: number;
    }[]
  > {
    const whereClause: { type?: string } = {};

    if (meritType) {
      whereClause.type = meritType;
    }

    const merits = await this.prisma.merit.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          },
        },
      },
    });

    // Agrupar por usuario y sumar merits
    const userMeritsMap = new Map<
      string,
      {
        user: { id: string; email: string; name: string; username: string };
        totalMerits: number;
      }
    >();

    merits.forEach((merit) => {
      const current = userMeritsMap.get(merit.userId) || {
        user: merit.user,
        totalMerits: 0,
      };
      current.totalMerits += merit.amount;
      userMeritsMap.set(merit.userId, current);
    });

    // Convertir a array y ordenar por total de merits
    const leaderboard = Array.from(userMeritsMap.entries())
      .map(([userId, data]) => ({
        userId,
        user: data.user,
        totalMerits: data.totalMerits,
      }))
      .sort((a, b) => b.totalMerits - a.totalMerits)
      .slice(0, limit);

    return leaderboard;
  }
}
