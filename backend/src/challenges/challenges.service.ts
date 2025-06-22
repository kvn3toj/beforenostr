import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from '../generated/prisma';
import { AuthenticatedUser } from '../types/auth.types';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createChallengeDto: CreateChallengeDto,
    user: AuthenticatedUser
  ): Promise<Challenge> {
    const { rewards, config, type, startDate, endDate, ...challengeData } =
      createChallengeDto;

    if (type === 'AUTOMATED' && config) {
      if (typeof config !== 'object' || config === null) {
        throw new BadRequestException(
          'Automated challenge config must be a valid object.'
        );
      }
    }

    const newChallenge = await this.prisma.challenge.create({
      data: {
        ...challengeData,
        type,
        startDate: startDate || new Date(),
        endDate: endDate || null,
        config: config ? JSON.stringify(config) : '{}',
        rewards: rewards
          ? {
              createMany: {
                data: rewards.map((reward) => ({ ...reward, type: 'default' })),
              },
            }
          : undefined,
      },
      include: { rewards: true },
    });

    return newChallenge;
  }

  async findAllActive(): Promise<Challenge[]> {
    return this.prisma.challenge.findMany({
      where: {
        status: 'ACTIVE',
        startDate: { lte: new Date() },
        // Ensure endDate is either null (ongoing) or in the future
        OR: [{ endDate: { gte: new Date() } }, { endDate: null }],
      },
      include: { rewards: true },
    });
  }

  async findAllAdmin(): Promise<Challenge[]> {
    return this.prisma.challenge.findMany({
      include: { rewards: true },
    });
  }

  async findOne(id: string): Promise<Challenge> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: { rewards: true },
    });
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }
    return challenge;
  }

  async update(
    id: string,
    updateChallengeDto: UpdateChallengeDto,
    user: AuthenticatedUser
  ): Promise<Challenge> {
    const { rewards, config, type, ...challengeData } = updateChallengeDto;

    const existingChallenge = await this.prisma.challenge.findUnique({
      where: { id },
    });
    if (!existingChallenge)
      throw new NotFoundException(`Challenge with ID ${id} not found`);

    const finalType = type || existingChallenge.type;
    if (finalType === 'AUTOMATED' && config) {
      if (typeof config !== 'object' || config === null) {
        throw new BadRequestException(
          'Automated challenge config must be a valid object.'
        );
      }
    }

    const updatedChallenge = await this.prisma.challenge.update({
      where: { id },
      data: {
        ...challengeData,
        ...(type !== undefined && { type }),
        ...(updateChallengeDto.hasOwnProperty('config') && {
          config: config ? JSON.stringify(config) : '{}',
        }),
        rewards: rewards
          ? {
              deleteMany: {},
              createMany: {
                data: rewards.map((reward) => ({ ...reward, type: 'default' })),
              },
            }
          : undefined,
      },
      include: { rewards: true },
    });

    return updatedChallenge;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<Challenge> {
    const existingChallenge = await this.prisma.challenge.findUnique({
      where: { id },
    });
    if (!existingChallenge)
      throw new NotFoundException(`Challenge with ID ${id} not found`);

    // Capture old value before deletion
    const oldValue = existingChallenge;

    // Need to consider deleting associated UserChallenges and ChallengeRewards first
    await this.prisma.challengeReward.deleteMany({
      where: { challengeId: id },
    });
    await this.prisma.userChallenge.deleteMany({
      where: { challengeId: id },
    });
    const deletedChallenge = await this.prisma.challenge.delete({
      where: { id },
    });

    // Log challenge deletion - temporarily disabled
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
        challengeId,
      },
    });
  }

  async removeReward(rewardId: string) {
    return this.prisma.challengeReward.delete({
      where: { id: rewardId },
    });
  }
}
