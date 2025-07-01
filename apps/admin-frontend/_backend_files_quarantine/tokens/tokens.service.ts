import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import type { Token } from '../generated/prisma';

@Injectable()
export class TokensService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> TokensService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async create(createTokenDto: CreateTokenDto): Promise<Token> {
    try {
      // Validar que el usuario existe
      const user = await this.prisma.user.findUnique({
        where: { id: createTokenDto.userId }
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${createTokenDto.userId} not found`);
      }

      // Validar tipos de token válidos
      const validTokenTypes = ['PROMOTIONAL_UNIT', 'SUBSCRIPTION_UNIT', 'CIRCULATING_UNIT', 'TEST_UNIT', 'TOIN'];
      if (!validTokenTypes.includes(createTokenDto.type)) {
        throw new BadRequestException(`Invalid token type: ${createTokenDto.type}`);
      }

      // Validar fuentes válidas
      const validSources = ['GIFT_CARD', 'PURCHASE', 'CONVERSION', 'REWARD', 'INITIAL_GRANT'];
      if (!validSources.includes(createTokenDto.source)) {
        throw new BadRequestException(`Invalid token source: ${createTokenDto.source}`);
      }

      const token = await this.prisma.token.create({
        data: {
          userId: createTokenDto.userId,
          amount: createTokenDto.amount,
          type: createTokenDto.type,
          status: createTokenDto.status || 'ACTIVE',
          caducityDate: createTokenDto.caducityDate ? new Date(createTokenDto.caducityDate) : null,
          source: createTokenDto.source,
        },
      });

      console.log(`>>> TokensService: Created token ${token.id} for user ${createTokenDto.userId}`);
      return token;
    } catch (error) {
      console.error('>>> TokensService create error:', error);
      throw error;
    }
  }

  async findAll(): Promise<Token[]> {
    try {
      return await this.prisma.token.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('>>> TokensService findAll error:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Token[]> {
    try {
      return await this.prisma.token.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('>>> TokensService findByUserId error:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Token> {
    try {
      const token = await this.prisma.token.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          }
        }
      });

      if (!token) {
        throw new NotFoundException(`Token with ID ${id} not found`);
      }

      return token;
    } catch (error) {
      console.error('>>> TokensService findOne error:', error);
      throw error;
    }
  }

  async update(id: string, updateTokenDto: UpdateTokenDto): Promise<Token> {
    try {
      // Verificar que el token existe
      await this.findOne(id);

      const token = await this.prisma.token.update({
        where: { id },
        data: {
          ...updateTokenDto,
          caducityDate: updateTokenDto.caducityDate ? new Date(updateTokenDto.caducityDate) : undefined,
        },
      });

      console.log(`>>> TokensService: Updated token ${id}`);
      return token;
    } catch (error) {
      console.error('>>> TokensService update error:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<Token> {
    try {
      // Verificar que el token existe
      await this.findOne(id);

      const token = await this.prisma.token.delete({
        where: { id },
      });

      console.log(`>>> TokensService: Deleted token ${id}`);
      return token;
    } catch (error) {
      console.error('>>> TokensService remove error:', error);
      throw error;
    }
  }

  // Métodos específicos de negocio para tokens

  async getUserTokenBalance(userId: string, tokenType?: string): Promise<{ type: string; totalAmount: number }[]> {
    try {
      const whereClause: any = {
        userId,
        status: 'ACTIVE',
      };

      if (tokenType) {
        whereClause.type = tokenType;
      }

      const tokens = await this.prisma.token.findMany({
        where: whereClause,
      });

      // Agrupar por tipo y sumar cantidades
      const balanceMap = new Map<string, number>();
      
      tokens.forEach(token => {
        const currentBalance = balanceMap.get(token.type) || 0;
        balanceMap.set(token.type, currentBalance + token.amount);
      });

      return Array.from(balanceMap.entries()).map(([type, totalAmount]) => ({
        type,
        totalAmount
      }));
    } catch (error) {
      console.error('>>> TokensService getUserTokenBalance error:', error);
      throw error;
    }
  }

  async expireTokens(): Promise<number> {
    try {
      const now = new Date();
      
      const result = await this.prisma.token.updateMany({
        where: {
          caducityDate: {
            lte: now
          },
          status: 'ACTIVE'
        },
        data: {
          status: 'EXPIRED'
        }
      });

      console.log(`>>> TokensService: Expired ${result.count} tokens`);
      return result.count;
    } catch (error) {
      console.error('>>> TokensService expireTokens error:', error);
      throw error;
    }
  }
} 