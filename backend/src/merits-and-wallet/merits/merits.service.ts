import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js.js';
import { CreateMeritDto } from './dto/create-merit.dto.js.js';
import { UpdateMeritDto } from './dto/update-merit.dto.js.js';
import { Merit } from '../../generated/prisma.js.js';

@Injectable()
export class MeritsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMeritDto: CreateMeritDto): Promise<Merit> {
    return this.prisma.merit.create({
      data: {
        userId: createMeritDto.userId,
        amount: createMeritDto.amount,
        type: createMeritDto.type,
        source: createMeritDto.source,
        relatedEntityId: createMeritDto.relatedEntityId,
      },
    });
  }

  async findAll(): Promise<Merit[]> {
    return this.prisma.merit.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Merit> {
    const merit = await this.prisma.merit.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!merit) {
      throw new NotFoundException(`Merit with ID ${id} not found`);
    }
    return merit;
  }

  async findByType(type: string): Promise<Merit[]> {
    return this.prisma.merit.findMany({
      where: { type },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, updateMeritDto: UpdateMeritDto): Promise<Merit> {
    const merit = await this.findOne(id);
    return this.prisma.merit.update({
      where: { id },
      data: updateMeritDto,
    });
  }

  async remove(id: string): Promise<Merit> {
    const merit = await this.findOne(id);
    return this.prisma.merit.delete({ where: { id } });
  }
}
