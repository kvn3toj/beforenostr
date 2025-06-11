import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from '../generated/prisma'; // Import Challenge type
import { ChallengeConfig } from './types/challenge-config.interface'; // Import the interface
import { AuditLogsService } from '../admin/audit-logs/audit-logs.service'; // Import AuditLogsService
import { AuthenticatedUser } from '../types/auth.types'; // Import AuthenticatedUser type

// Define ChallengeType enum to match the database schema
enum ChallengeType {
  CUSTOM = 'CUSTOM',
  AUTOMATED = 'AUTOMATED',
}

@Injectable()
export class ChallengesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService, // Inject AuditLogsService
  ) {
    console.log('[ChallengesService] Constructor called - service initialized');
  }

  async create(createChallengeDto: CreateChallengeDto, user: AuthenticatedUser): Promise<Challenge> {
    const { rewards, config, type, ...challengeData } = createChallengeDto; // Destructure config and type

    // Basic validation for automated challenge config
    if (type === 'AUTOMATED' && config) {
        // Perform basic checks for required fields based on expected automated types
        // This is a simple example, more complex validation might be needed
        if (typeof config !== 'object' || config === null) {
            throw new BadRequestException('Automated challenge config must be a valid object.');
        }
        // Add more specific checks here based on the automated challenge types you define
        // e.g., if config.targetContentItemId is required for a certain type
    }

    const newChallenge = await this.prisma.challenge.create({
      data: {
        ...challengeData,
        type,
        config: JSON.stringify(config ?? {}),
        rewards: rewards ? {
          createMany: {
            data: rewards.map(reward => ({
              type: reward.type || 'MERITS',
              amount: reward.amount,
              description: reward.description,
              metadata: reward.metadata ? JSON.stringify(reward.metadata) : null,
            }))
          }
        } : undefined,
      },
      include: { rewards: true },
    });

    // Log challenge creation
    await this.auditLogsService.createLog({
        userId: user.id, // User performing the action
        actionType: 'challenge:created',
        entityType: 'Challenge',
        entityId: newChallenge.id,
        newValue: newChallenge,
        // TODO: Add ipAddress, userAgent if available from request context
    });

    return newChallenge;
  }

  async findAllActive(): Promise<Challenge[]> {
    try {
      console.log('[ChallengesService] Starting findAllActive...');
      
      const activeChallenges = await this.prisma.challenge.findMany({
        where: {
          status: 'ACTIVE',
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
        include: { rewards: true },
      });
      
      console.log('[ChallengesService] Found active challenges:', activeChallenges.length);
      return activeChallenges;
    } catch (error) {
      console.error('[ChallengesService] Error in findAllActive:', error);
      throw error;
    }
  }

  async findAllAdmin(): Promise<Challenge[]> {
    return this.prisma.challenge.findMany({
      include: { rewards: true },
    });
  }

  async findOne(id: string): Promise<Challenge | null> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: { rewards: true },
    });
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }
    return challenge;
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto, user: AuthenticatedUser): Promise<Challenge> {
    const { rewards, config, type, ...challengeData } = updateChallengeDto; // Destructure config and type

    const existingChallenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!existingChallenge) throw new NotFoundException(`Challenge with ID ${id} not found`);

    // Capture old value before update
    const oldValue = existingChallenge;

    // Basic validation for automated challenge config if type or config is being updated
    if ((type && type === ChallengeType.AUTOMATED) || (!type && updateChallengeDto.hasOwnProperty('config') && config !== undefined)) {
        // If type is being updated to AUTOMATED, or if type is not being updated but config is provided
        const finalType = type || existingChallenge.type; // Determine the final type
        if (finalType === 'AUTOMATED' && config) {
            if (typeof config !== 'object' || config === null) {
                throw new BadRequestException('Automated challenge config must be a valid object.');
            }
            // Add more specific checks here
        }
    }

    // Handle nested reward updates/creations/deletions if needed.
    // For simplicity here, we'll just update the challenge data and potentially re-create rewards.
    // A more robust solution would require comparing existing rewards with the input.

    const updatedChallenge = await this.prisma.challenge.update({
      where: { id },
      data: {
        ...challengeData,
        ...(type !== undefined && { type }), // Include type in update data only if provided
        ...(updateChallengeDto.hasOwnProperty('config') && { config: JSON.stringify(config ?? {}) }), // Include config in update data only if provided
        rewards: rewards ? {
           // This will delete existing and create new ones. Adjust based on desired behavior.
           deleteMany: {},
           createMany: { 
             data: rewards.map(reward => ({
               type: reward.type || 'MERITS',
               amount: reward.amount,
               description: reward.description,
               metadata: reward.metadata ? JSON.stringify(reward.metadata) : null,
             }))
           },
        } : undefined,
      },
      include: { rewards: true },
    });

    // Capture new value after update
    const newValue = updatedChallenge;

    // Log challenge update
    // await this.auditLogsService.createLog({
    //     userId: user.id, // User performing the action
    //     actionType: 'challenge:updated',
    //     entityType: 'Challenge',
    //     entityId: updatedChallenge.id,
    //     oldValue: oldValue,
    //     newValue: newValue,
    //     // TODO: Add ipAddress, userAgent if available from request context
    // });

    return updatedChallenge;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<Challenge> {
    const existingChallenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!existingChallenge) throw new NotFoundException(`Challenge with ID ${id} not found`);

    // Capture old value before deletion
    const oldValue = existingChallenge;

    // Need to consider deleting associated UserChallenges and ChallengeRewards first
    await this.prisma.challengeReward.deleteMany({
        where: { challengeId: id }
    });
    await this.prisma.userChallenge.deleteMany({
        where: { challengeId: id }
    });
    const deletedChallenge = await this.prisma.challenge.delete({
      where: { id },
    });

    // Log challenge deletion
    // await this.auditLogsService.createLog({
    //     userId: user.id, // User performing the action
    //     actionType: 'challenge:deleted',
    //     entityType: 'Challenge',
    //     entityId: deletedChallenge.id,
    //     oldValue: oldValue, // Show the state before deletion
    //     // TODO: Add ipAddress, userAgent if available from request context
    // });

    return deletedChallenge;
  }

  async addRewardToChallenge(challengeId: string, createChallengeRewardDto) {
      return this.prisma.challengeReward.create({
          data: {
              ...createChallengeRewardDto,
              challengeId: challengeId,
          }
      });
  }

  async removeReward(rewardId: string) {
      return this.prisma.challengeReward.delete({
          where: { id: rewardId }
      });
  }
} 