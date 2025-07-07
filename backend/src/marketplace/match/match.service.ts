import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { MatchStatus } from '../../generated/prisma';

interface ReviewData {
  rating: number;
  comment?: string;
  helpful?: boolean;
}

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertParticipant(matchId: string, userId: string) {
    const match = await this.prisma.marketplaceMatch.findUnique({
      where: { id: matchId },
    });
    if (!match) throw new NotFoundException('Match not found');
    if (match.buyerId !== userId && match.sellerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return match;
  }

  async getMatch(matchId: string, userId: string) {
    return this.assertParticipant(matchId, userId);
  }

  async confirmMatch(
    matchId: string,
    userId: string,
    role: 'buyer' | 'seller'
  ) {
    await this.assertParticipant(matchId, userId);
    const data =
      role === 'buyer' ? { buyerConfirmed: true } : { sellerConfirmed: true };
    const updated = await this.prisma.marketplaceMatch.update({
      where: { id: matchId },
      data,
    });
    if (
      updated.buyerConfirmed &&
      updated.sellerConfirmed &&
      updated.status !== MatchStatus.CONFIRMED
    ) {
      return this.prisma.marketplaceMatch.update({
        where: { id: matchId },
        data: { status: MatchStatus.CONFIRMED },
      });
    }
    return updated;
  }

  async getMessages(matchId: string, userId: string) {
    await this.assertParticipant(matchId, userId);
    return this.prisma.matchMessage.findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(matchId: string, userId: string, content: string) {
    await this.assertParticipant(matchId, userId);
    return this.prisma.matchMessage.create({
      data: { matchId, senderId: userId, content },
    });
  }

  async getReview(matchId: string, userId: string) {
    const match = await this.assertParticipant(matchId, userId);
    return this.prisma.review.findFirst({
      where: { marketplaceItemId: match.marketplaceItemId, userId },
    });
  }

  async submitReview(matchId: string, userId: string, reviewDto: ReviewData) {
    const match = await this.assertParticipant(matchId, userId);
    const existing = await this.prisma.review.findFirst({
      where: { marketplaceItemId: match.marketplaceItemId, userId },
    });
    if (existing) {
      return this.prisma.review.update({
        where: { id: existing.id },
        data: reviewDto,
      });
    }
    return this.prisma.review.create({
      data: {
        ...reviewDto,
        marketplaceItemId: match.marketplaceItemId,
        userId,
      },
    });
  }
}
