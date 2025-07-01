import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Challenge } from '@prisma/client';

@Injectable()
export class ChallengesPublicService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('[ChallengesPublicService] Constructor called - full Prisma version');
    console.log('[ChallengesPublicService] PrismaService injected:', !!this.prisma);
    console.log('[ChallengesPublicService] PrismaService type:', typeof this.prisma);
    if (this.prisma) {
      console.log('[ChallengesPublicService] PrismaService challenge property:', !!this.prisma.challenge);
    }
  }

  async testConnection(): Promise<any> {
    console.log('[ChallengesPublicService] Testing connection...');
    console.log('[ChallengesPublicService] this.prisma:', !!this.prisma);
    console.log('[ChallengesPublicService] this.prisma.challenge:', !!this.prisma?.challenge);
    
    if (!this.prisma) {
      return { error: 'PrismaService not injected' };
    }
    
    try {
      const count = await this.prisma.challenge.count();
      return { success: true, challengeCount: count };
    } catch (error) {
      return { error: error.message };
    }
  }

  async findAllActive(): Promise<Challenge[]> {
    try {
      console.log('[ChallengesPublicService] Starting findAllActive with Prisma...');
      console.log('[ChallengesPublicService] Current date:', new Date());
      console.log('[ChallengesPublicService] this.prisma exists:', !!this.prisma);
      console.log('[ChallengesPublicService] this.prisma.challenge exists:', !!this.prisma?.challenge);
      
      const activeChallenges = await this.prisma.challenge.findMany({
        where: {
          status: 'ACTIVE',
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
        include: { rewards: true },
      });
      
      console.log('[ChallengesPublicService] Found active challenges:', activeChallenges.length);
      console.log('[ChallengesPublicService] Challenges data:', JSON.stringify(activeChallenges, null, 2));
      return activeChallenges;
    } catch (error) {
      console.error('[ChallengesPublicService] Error in findAllActive:', error);
      console.error('[ChallengesPublicService] Error details:', error.message);
      console.error('[ChallengesPublicService] Error stack:', error.stack);
      // Return empty array to prevent 500 error while debugging
      console.log('[ChallengesPublicService] Returning empty array due to error');
      return [];
    }
  }
} 