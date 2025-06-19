import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtitleDto } from './dto/create-subtitle.dto';
import { UpdateSubtitleDto } from './dto/update-subtitle.dto';
import { FindAllSubtitlesDto } from './dto/find-all-subtitles.dto';
import type { Subtitle } from '../generated/prisma';

@Injectable()
export class SubtitleService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
// //     console.log('>>> SubtitleService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  // Helper method for validating content or contentUrl
  private validateContentOrUrl(dto: { content?: string; contentUrl?: string }, isUpdate = false): void {
    const hasContent = dto.content && dto.content.trim().length > 0;
    const hasContentUrl = dto.contentUrl && dto.contentUrl.trim().length > 0;

    if (!hasContent && !hasContentUrl) {
      throw new BadRequestException('Either content or contentUrl must be provided.');
    }

    if (hasContent && hasContentUrl) {
      throw new BadRequestException('Only one of content or contentUrl should be provided, not both.');
    }
  }

  async create(createSubtitleDto: CreateSubtitleDto): Promise<Subtitle> {
//     console.log('>>> SubtitleService.create: Starting with data:', createSubtitleDto);
//     console.log('>>> SubtitleService.create: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      this.validateContentOrUrl(createSubtitleDto);
      
//       console.log('>>> SubtitleService.create: About to call prisma.subtitle.create');
      const result = await this.prisma.subtitle.create({ 
        data: createSubtitleDto 
      });
//       console.log('>>> SubtitleService.create: SUCCESS, result:', result);
      return result;
    } catch (error) {
//       console.error('>>> SubtitleService.create: ERROR:', error);
      throw error;
    }
  }

  async findAll(findAllDto: FindAllSubtitlesDto): Promise<Subtitle[]> {
//     console.log('>>> SubtitleService.findAll: Starting with params:', findAllDto);
//     console.log('>>> SubtitleService.findAll: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      if (!findAllDto.videoItemId) {
        throw new BadRequestException('videoItemId is required to find subtitles.');
      }

      // Convert videoItemId to number if it's a string
      const videoItemId = typeof findAllDto.videoItemId === 'string' 
        ? parseInt(findAllDto.videoItemId, 10) 
        : findAllDto.videoItemId;

      if (isNaN(videoItemId)) {
        throw new BadRequestException('videoItemId must be a valid number.');
      }

//       console.log('>>> SubtitleService.findAll: About to call prisma.subtitle.findMany with videoItemId:', videoItemId);
      const result = await this.prisma.subtitle.findMany({
        where: {
          videoItemId: videoItemId,
          ...(findAllDto.languageCode && { languageCode: findAllDto.languageCode }),
          ...(findAllDto.format && { format: findAllDto.format }),
          ...(findAllDto.isActive !== undefined && { isActive: findAllDto.isActive }),
        },
        orderBy: { createdAt: 'asc' },
      });
//       console.log('>>> SubtitleService.findAll: SUCCESS, found', result.length, 'subtitles');
      return result;
    } catch (error) {
//       console.error('>>> SubtitleService.findAll: ERROR:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Subtitle> {
//     console.log('>>> SubtitleService.findOne: Starting with id:', id);
//     console.log('>>> SubtitleService.findOne: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
//       console.log('>>> SubtitleService.findOne: About to call prisma.subtitle.findUnique');
      const subtitle = await this.prisma.subtitle.findUnique({ where: { id } });
      
      if (!subtitle) {
//         console.log('>>> SubtitleService.findOne: Subtitle not found');
        throw new NotFoundException(`Subtitle with ID ${id} not found.`);
      }
      
//       console.log('>>> SubtitleService.findOne: SUCCESS, found subtitle:', subtitle);
      return subtitle;
    } catch (error) {
//       console.error('>>> SubtitleService.findOne: ERROR:', error);
      throw error;
    }
  }

  async update(id: number, updateSubtitleDto: UpdateSubtitleDto): Promise<Subtitle> {
//     console.log('>>> SubtitleService.update: Starting with id:', id, 'data:', updateSubtitleDto);
//     console.log('>>> SubtitleService.update: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
//       console.log('>>> SubtitleService.update: About to check if subtitle exists');
      const existingSubtitle = await this.prisma.subtitle.findUnique({ where: { id } });
      if (!existingSubtitle) {
        throw new NotFoundException(`Subtitle with ID ${id} not found.`);
      }

      // Validate content/contentUrl combination
      const combinedDto = {
        content: updateSubtitleDto.content !== undefined ? updateSubtitleDto.content : existingSubtitle.content,
        contentUrl: updateSubtitleDto.contentUrl !== undefined ? updateSubtitleDto.contentUrl : existingSubtitle.contentUrl,
      };
      this.validateContentOrUrl(combinedDto, true);

//       console.log('>>> SubtitleService.update: About to call prisma.subtitle.update');
      const result = await this.prisma.subtitle.update({
        where: { id },
        data: updateSubtitleDto,
      });
//       console.log('>>> SubtitleService.update: SUCCESS, result:', result);
      return result;
    } catch (error) {
//       console.error('>>> SubtitleService.update: ERROR:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
//     console.log('>>> SubtitleService.remove: Starting with id:', id);
//     console.log('>>> SubtitleService.remove: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
//       console.log('>>> SubtitleService.remove: About to check if subtitle exists');
      const existingSubtitle = await this.prisma.subtitle.findUnique({ where: { id } });
      if (!existingSubtitle) {
        throw new NotFoundException(`Subtitle with ID ${id} not found.`);
      }

//       console.log('>>> SubtitleService.remove: About to call prisma.subtitle.delete');
      await this.prisma.subtitle.delete({ where: { id } });
//       console.log('>>> SubtitleService.remove: SUCCESS');
    } catch (error) {
//       console.error('>>> SubtitleService.remove: ERROR:', error);
      throw error;
    }
  }
} 