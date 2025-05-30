import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMeritDto } from './dto/create-merit.dto';
import { UpdateMeritDto } from './dto/update-merit.dto';
import type { Merit } from '../../generated/prisma';

@Injectable()
export class MeritsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> MeritsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  create(createMeritDto: CreateMeritDto): Promise<Merit> {
    return this.prisma.merit.create({ data: createMeritDto });
  }

  findAll(): Promise<Merit[]> {
    return this.prisma.merit.findMany();
  }

  findOne(id: string): Promise<Merit | null> {
    return this.prisma.merit.findUnique({ where: { id } });
  }

  update(id: string, updateMeritDto: UpdateMeritDto): Promise<Merit> {
    return this.prisma.merit.update({
      where: { id },
      data: updateMeritDto,
    });
  }

  remove(id: string): Promise<Merit> {
    return this.prisma.merit.delete({ where: { id } });
  }

  findOneBySlug(slug: string): Promise<Merit | null> {
    return this.prisma.merit.findUnique({ where: { slug } });
  }
} 