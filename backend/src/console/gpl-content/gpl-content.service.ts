import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateGplContentDto } from './dto/update-gpl-content.dto';

@Injectable()
export class GplContentService {
  constructor(private readonly _prisma: PrismaService) {}

  async getAllGPLContent() {
    return [
      {
        id: 'gpl_buyer',
        name: 'GPL BUYER - Consumo Consciente',
        type: 'buyer',
        isActive: true,
        videos: [
          {
            id: 'intro_coomunity',
            title: 'Introducción a CoomÜnity',
            duration: 240,
            category: 'Fundamentos',
            philosophyAlignment: 'reciprocidad',
            isEpicContent: false,
          },
        ],
      },
    ];
  }

  async getGPLContentById(contentId: string) {
    const content = await this.getAllGPLContent();
    return content.find((item) => item.id === contentId);
  }

  async updateGPLContent(contentId: string, data: UpdateGplContentDto) {
    return { id: contentId, ...data, updated: true };
  }

  async getGPLContentAnalytics(contentId: string) {
    return {
      contentId,
      views: 1247,
      engagement: 84,
      completionRate: 92,
    };
  }
}
