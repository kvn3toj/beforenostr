import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMeritDto } from './dto/create-merit.dto';
import { UpdateMeritDto } from './dto/update-merit.dto';
import { Merit, Prisma } from '@prisma/client';

@Injectable()
export class MeritsService {
  constructor(private prisma: PrismaService) {}

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