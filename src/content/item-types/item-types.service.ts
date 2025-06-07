import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import type { ItemType } from '../../generated/prisma';

@Injectable()
export class ItemTypesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateItemTypeDto): Promise<ItemType> {
    return this.prisma.itemType.create({ data: dto });
  }

  async findAll(): Promise<ItemType[]> {
    // Item types are generally lookup data, so return all non-deleted ones
    return this.prisma.itemType.findMany({ where: { isDeleted: false } });
  }

  async findOne(id: string): Promise<ItemType | null> {
    return this.prisma.itemType.findUnique({ where: { id, isDeleted: false } });
  }

  async update(id: string, dto: UpdateItemTypeDto): Promise<ItemType> {
    const itemType = await this.prisma.itemType.findUnique({ where: { id, isDeleted: false } });
    if (!itemType) {
      throw new NotFoundException(`ItemType with ID ${id} not found or is deleted`);
    }
    return this.prisma.itemType.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<ItemType> {
    const itemType = await this.prisma.itemType.findUnique({ where: { id, isDeleted: false } });
    if (!itemType) {
      throw new NotFoundException(`ItemType with ID ${id} not found or is deleted`);
    }
    // Soft delete
    return this.prisma.itemType.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
} 