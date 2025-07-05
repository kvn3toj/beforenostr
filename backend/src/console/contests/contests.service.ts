/**
 * 🏆 Contests Service - Merit Contests Management
 *
 * Servicio para gestión de concursos de Mëritos y Öndas
 */

import { Injectable } from '@nestjs/common';
import { CreateContestDto } from './dto/create-contest.dto.js.js';
import { UpdateContestDto } from './dto/update-contest.dto.js.js';

@Injectable()
export class ContestsService {
  constructor() {}

  async getAllContests() {
    // Mock contest data based on Miro board
    return [
      {
        id: 'weekly_meritos_1',
        name: 'Concurso Semanal de Mëritos #47',
        startDate: new Date('2025-06-16'),
        endDate: new Date('2025-06-22T23:59:59'),
        type: 'weekly',
        isActive: true,
        participants: 247,
        totalPrize: 500,
        leaderboard: [
          {
            userId: '1',
            userName: 'Ana Valdez',
            position: 1,
            meritos: 245,
            ondas: 89,
            isEligible: true,
          },
          {
            userId: '2',
            userName: 'Carlos Mendoza',
            position: 2,
            meritos: 232,
            ondas: 76,
            isEligible: true,
          },
        ],
      },
    ];
  }

  async getContestById(contestId: string) {
    const contests = await this.getAllContests();
    return contests.find((contest) => contest.id === contestId);
  }

  async createContest(createContestDto: CreateContestDto) {
    return {
      id: `contest_${Date.now()}`,
      ...createContestDto,
      created: true,
    };
  }

  async updateContest(contestId: string, updateContestDto: UpdateContestDto) {
    return {
      id: contestId,
      ...updateContestDto,
      updated: true,
    };
  }

  async getContestLeaderboard(contestId: string) {
    const contest = await this.getContestById(contestId);
    return contest?.leaderboard || [];
  }

  async getContestAnalytics(contestId: string) {
    return {
      contestId,
      totalParticipants: 247,
      engagementRate: 84,
      averageScore: 156,
      completionRate: 92,
    };
  }
}
