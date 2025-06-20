import { Injectable, ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsService } from '../../merits-and-wallet/transactions/transactions.service';
import { User, Challenge, ChallengeReward, UserChallenge } from '../../generated/prisma';
import { UpdateUserChallengeDto } from './dto/update-user-challenge.dto';
import { ChallengeConfig } from '../types/challenge-config.interface';
import { AuditLogsService } from '../../admin/audit-logs/audit-logs.service';
import { AuthenticatedUser } from '../../types/auth.types';

// Define a basic type for the authenticated user passed from the controller
type AuthenticatedUserInternal = { id: string; roles: string[]; /* other properties */ };

@Injectable()
export class UserChallengesService {
  constructor(
    private prisma: PrismaService,
    private transactionsService: TransactionsService, // Inject TransactionsService
    private readonly auditLogsService: AuditLogsService, // Inject AuditLogsService
  ) {}

  async startChallenge(userId: string, challengeId: string, user: AuthenticatedUser): Promise<UserChallenge> {
    const existingUserChallenge = await this.prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: userId,
          challengeId: challengeId,
        },
      },
    });

    if (existingUserChallenge) {
      throw new ConflictException('User has already started this challenge.');
    }

    // Optional: Check if challenge exists and is active
    const challenge = await this.prisma.challenge.findUnique({
        where: { id: challengeId }
    });

    if (!challenge) {
        throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
    }

    // Consider challenge status and dates if not handled by findAllActive in ChallengesService

    const newUserChallenge = await this.prisma.userChallenge.create({
      data: {
        userId: userId,
        challengeId: challengeId,
        status: 'STARTED',
        progress: 0,
      },
    });

    // Log user starting a challenge
    await this.auditLogsService.createLog({
        userId: user.id, // User performing the action
        actionType: 'user_challenge:started',
        entityType: 'UserChallenge',
        entityId: newUserChallenge.id,
        newValue: { userId: newUserChallenge.userId, challengeId: newUserChallenge.challengeId, status: newUserChallenge.status },
        // TODO: Add ipAddress, userAgent if available from request context
    });

    return newUserChallenge;
  }

  async updateProgress(
    user: AuthenticatedUser,
    userChallengeId: string,
    updateData: UpdateUserChallengeDto,
  ): Promise<UserChallenge> {
    const userChallenge = await this.prisma.userChallenge.findUnique({
        where: { id: userChallengeId }
    });

    if (!userChallenge) {
        throw new NotFoundException(`User Challenge with ID ${userChallengeId} not found`);
    }

    // Ownership check: User must be the owner OR have the 'admin' role
    if (userChallenge.userId !== user.id && !user.roles.includes('admin')) {
        throw new ForbiddenException('You do not have permission to update this user challenge.');
    }

    // Capture old progress before update
    const oldProgress: number = userChallenge.progress;

    // Ensure the updated progress conforms to the type if possible, or add validation here
    if (updateData.progress && typeof updateData.progress !== 'number') {
        throw new BadRequestException('Progress data must be a valid number.');
    }

    const updatedUserChallenge = await this.prisma.userChallenge.update({
      where: { id: userChallengeId },
      data: {
        ...updateData,
        progress: updateData.progress ?? userChallenge.progress,
      },
    });

    // Capture new progress after update
    const newProgress: number = updatedUserChallenge.progress;

    // Log user updating challenge progress
    await this.auditLogsService.createLog({
        userId: user.id, // User performing the action
        actionType: 'user_challenge:progress_updated',
        entityType: 'UserChallenge',
        entityId: updatedUserChallenge.id,
        oldValue: oldProgress,
        newValue: newProgress,
        // TODO: Add ipAddress, userAgent if available from request context
    });

    return updatedUserChallenge;
  }

  async completeChallenge(
    user: AuthenticatedUser,
    userChallengeId: string,
  ): Promise<UserChallenge & { challenge: Challenge & { rewards: ChallengeReward[] } }> {
    const userChallenge = await this.prisma.userChallenge.findUnique({
      where: { id: userChallengeId },
      include: {
        challenge: {
          include: { rewards: true },
        },
      },
    });

    if (!userChallenge) {
      throw new NotFoundException(`User Challenge with ID ${userChallengeId} not found`);
    }

     // Ownership check: User must be the owner OR have the 'admin' role
    if (userChallenge.userId !== user.id && !user.roles.includes('admin')) {
        throw new ForbiddenException('You do not have permission to complete this user challenge.');
    }

    if (userChallenge.status === 'COMPLETED') {
        throw new ConflictException('Challenge is already completed.');
    }

    // --- Refactored Completion Logic ---
    const challenge = userChallenge.challenge;
    const progress = userChallenge.progress;
    const config: ChallengeConfig = challenge.config as any;

    let isCompleted = false;
    const requiredCompletions = config.requiredCompletions || 100;

    // Implement completion logic based on challenge type
    switch (challenge.type) {
        case 'AUTOMATED':
            if (progress >= requiredCompletions) {
                isCompleted = true;
            }
            break;
        case 'CUSTOM':
            if (user.roles.includes('admin')) {
                isCompleted = true;
            }
            break;
        default:
            isCompleted = false;
    }

    if (!isCompleted && !user.roles.includes('admin')) { // Only allow completion if criteria met OR user is admin
        throw new ConflictException('Challenge requirements not met.');
    }
    // --- End Refactored Completion Logic ---

    // Award rewards
    if (challenge.rewards && challenge.rewards.length > 0) {
        for (const reward of challenge.rewards) {
            // Assuming TransactionsService.createTransaction exists and handles merit awarding
            await this.transactionsService.createTransaction({
                userId: userChallenge.userId,
                meritId: 'placeholder_merit_id', // FIXME: This needs a real meritId
                amount: reward.amount,
                type: 'MERIT',
                source: 'CHALLENGE',
                notes: `Reward for completing challenge "${challenge.title}": ${reward.description || ''}`,
                sourceId: challenge.id,
            });
        }
    }

    // Update user challenge status
    const completedUserChallenge = await this.prisma.userChallenge.update({
      where: { id: userChallengeId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        progress: progress,
      },
      include: {
        challenge: {
          include: { rewards: true },
        },
      },
    });

    // Log user completing a challenge
    await this.auditLogsService.createLog({
        userId: user.id, // User performing the action
        actionType: 'user_challenge:completed',
        entityType: 'UserChallenge',
        entityId: completedUserChallenge.id,
        newValue: { id: completedUserChallenge.id, status: completedUserChallenge.status, completedAt: completedUserChallenge.completedAt },
        // TODO: Add ipAddress, userAgent if available from request context
    });

    return completedUserChallenge;
  }

  async findUserChallenges(userId: string, status?: string): Promise<UserChallenge[]> {
    // This method already filters by userId, so it's safe for non-admin users
    return this.prisma.userChallenge.findMany({
      where: {
        userId: userId,
        status: status,
      },
      include: { challenge: true },
    });
  }

  async findOneUserChallenge(
      user: AuthenticatedUser,
      userChallengeId: string
    ): Promise<UserChallenge | null> {
    const userChallenge = await this.prisma.userChallenge.findUnique({
      where: { id: userChallengeId },
      include: { challenge: true },
    });

    if (!userChallenge) {
        throw new NotFoundException(`User Challenge with ID ${userChallengeId} not found`);
    }

    // Ownership check: User must be the owner OR have the 'admin' role
    if (userChallenge.userId !== user.id && !user.roles.includes('admin')) {
        throw new ForbiddenException('You do not have permission to view this user challenge.');
    }

    return userChallenge;
  }

  // Admin method to find any user challenges (no ownership check)
  async findAllUserChallengesAdmin(status?: string): Promise<UserChallenge[]> {
      return this.prisma.userChallenge.findMany({
          where: {
              status: status
          },
          include: { challenge: true, user: true }
      });
  }

    // Admin method to find a specific user challenge (no ownership check)
    async findOneUserChallengeAdmin(userChallengeId: string) : Promise<UserChallenge | null> {
         const userChallenge = await this.prisma.userChallenge.findUnique({
             where: { id: userChallengeId },
             include: { challenge: true, user: true }
         });

         if (!userChallenge) {
             throw new NotFoundException(`User Challenge with ID ${userChallengeId} not found`);
         }
         return userChallenge;
    }

    // Keep the helper if still needed elsewhere, but main logic is in the methods above
  async isUserChallengeOwner(userId: string, userChallengeId: string): Promise<boolean> {
      const userChallenge = await this.prisma.userChallenge.findUnique({
          where: { id: userChallengeId },
          select: { userId: true }
      });
      return userChallenge?.userId === userId;
  }
}
