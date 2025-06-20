import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMundoDto } from './dto/create-mundo.dto';
import { UpdateMundoDto } from './dto/update-mundo.dto';
import { Mundo } from '../../generated/prisma';

@Injectable()
export class MundosService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {
// // //     console.log('>>> MundosService CONSTRUCTOR: Initializing...');
// //     console.log('>>> MundosService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async testConnection() {
    try {
      console.log('MundosService.testConnection - prisma check:', !!this.prisma);
      if (!this.prisma) {
        throw new Error('Prisma service is not available');
      }
      
      // Test basic connection
      const result = await this.prisma.$queryRaw`SELECT 1 as test`;
      return result;
    } catch (error) {
      console.error('Database connection test failed:', error);
      throw error;
    }
  }

  async create(dto: CreateMundoDto): Promise<Mundo> {
    console.log('MundosService.create - prisma check:', !!this.prisma);
    if (!this.prisma) {
      throw new Error('Prisma service is not available');
    }
    return this.prisma.mundo.create({ data: dto });
  }

  async findAllActive(): Promise<Mundo[]> {
    try {
      console.log('MundosService.findAllActive - Finding all active mundos...');
      console.log('MundosService.findAllActive - prisma check:', !!this.prisma);
      
      if (!this.prisma) {
        throw new Error('Prisma service is not available');
      }
      
      const result = await this.prisma.mundo.findMany();
      console.log('MundosService.findAllActive - Found mundos:', result);
      return result;
    } catch (error) {
      console.error('Error in findAllActive service:', error);
      throw error;
    }
  }

  async findAll(includeInactive = false): Promise<Mundo[]> {
    console.log('MundosService.findAll - prisma check:', !!this.prisma);
    if (!this.prisma) {
      throw new Error('Prisma service is not available');
    }
    
    const whereCondition = includeInactive ? {} : { isActive: true };
    return this.prisma.mundo.findMany({ where: whereCondition });
  }

  async findOne(id: string): Promise<Mundo | null> {
    console.log('MundosService.findOne - id:', id);
    console.log('MundosService.findOne - prisma check:', !!this.prisma);
    
    if (!this.prisma) {
      throw new Error('Prisma service is not available');
    }
    
    return this.prisma.mundo.findUnique({ where: { id } });
  }

  async findOneBySlug(slug: string): Promise<Mundo | null> {
    console.log('MundosService.findOneBySlug - slug:', slug);
    console.log('MundosService.findOneBySlug - prisma check:', !!this.prisma);
    
    if (!this.prisma) {
      throw new Error('Prisma service is not available');
    }
    
    // Since slug field doesn't exist in schema, we'll search by name for now
    return this.prisma.mundo.findFirst({ where: { name: { contains: slug } } });
  }

  async update(id: string, dto: UpdateMundoDto): Promise<Mundo> {
    console.log('MundosService.update - id:', id);
    console.log('MundosService.update - prisma check:', !!this.prisma);
    
    if (!this.prisma) {
      throw new Error('Prisma service is not available');
    }
    
    const mundo = await this.prisma.mundo.findUnique({ where: { id } });
    if (!mundo) {
      throw new NotFoundException(`Mundo with ID ${id} not found`);
    }
    return this.prisma.mundo.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<Mundo> {
    console.log('MundosService.remove - id:', id);
    console.log('MundosService.remove - prisma check:', !!this.prisma);
    
    if (!this.prisma) {
      throw new Error('Prisma service is not available');
    }
    
    const mundo = await this.prisma.mundo.findUnique({ where: { id } });
    if (!mundo) {
      throw new NotFoundException(`Mundo with ID ${id} not found`);
    }
    // Soft delete by marking as inactive
    return this.prisma.mundo.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findPlaylistsByMundoId(mundoId: string, isAdmin = false) {
    console.log('MundosService.findPlaylistsByMundoId - mundoId:', mundoId);
    console.log('MundosService.findPlaylistsByMundoId - prisma check:', !!this.prisma);
    
    if (!this.prisma) {
      throw new Error('Prisma service is not available');
    }
    
    return this.prisma.playlist.findMany({
      where: { mundoId, ...(isAdmin ? {} : { isActive: true }) },
    });
  }
} 