import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOctalysisElementDto } from './dto/update-octalysis-element.dto';

@Injectable()
export class OctalysisService {
  constructor(private readonly prisma: PrismaService) {}

  async getOctalysisConfig() {
    return {
      elements: [
        {
          id: 'epic_meaning',
          type: 'epic',
          name: 'Epic Meaning & Calling',
          description: 'Users believe they are chosen to do something',
          intensity: 8,
          isActive: true,
        },
        {
          id: 'accomplishment',
          type: 'accomplishment',
          name: 'Development & Accomplishment',
          description: 'Internal drive of making progress',
          intensity: 7,
          isActive: true,
        },
      ],
    };
  }

  async updateOctalysisElement(
    elementId: string,
    element: UpdateOctalysisElementDto
  ) {
    return { id: elementId, ...element, updated: true };
  }

  async getOctalysisAnalytics() {
    return {
      totalElements: 8,
      activeElements: 6,
      averageIntensity: 7.2,
      userEngagement: 84,
    };
  }
}
