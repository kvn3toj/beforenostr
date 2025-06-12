import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketplaceItemDto, UpdateMarketplaceItemDto, MarketplaceSearchDto, CreateMarketplaceOfferDto, MarketplaceItemStatus, MarketplaceItemType } from './dto/marketplace.dto';

@Injectable()
export class MarketplaceService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> MarketplaceService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Crear un nuevo item en el marketplace
   */
  async createItem(dto: CreateMarketplaceItemDto) {
    console.log('>>> MarketplaceService.createItem: Creating marketplace item', dto);

    // Verificar que el vendedor existe
    const seller = await this.prisma.user.findUnique({
      where: { id: dto.sellerId }
    });

    if (!seller) {
      throw new NotFoundException('Vendedor no encontrado');
    }

    // Crear el item usando el modelo MarketplaceItem correcto
    const item = await this.prisma.marketplaceItem.create({
      data: {
        name: dto.title,
        description: dto.description,
        itemType: dto.type as any, // Convert from DTO enum to Prisma enum
        price: dto.priceUnits,
        priceToins: dto.priceToins || 0,
        currency: 'LUKAS', // Default currency
        tags: dto.tags || [],
        images: dto.imageUrl ? [dto.imageUrl] : [],
        location: dto.location,
        sellerId: dto.sellerId,
        status: 'ACTIVE', // Default status for new items
        metadata: dto.metadata ? JSON.stringify(dto.metadata) : null,
        isActive: true,
        isDeleted: false
      },
      include: {
        seller: { 
          select: { 
            id: true, 
            email: true, 
            firstName: true, 
            lastName: true,
            username: true,
            avatarUrl: true
          } 
        }
      }
    });

    return {
      id: item.id,
      title: item.name,
      description: item.description,
      type: item.itemType,
      priceUnits: item.price,
      priceToins: item.priceToins,
      currency: item.currency,
      tags: item.tags,
      images: item.images,
      imageUrl: item.images[0] || null,
      location: item.location,
      status: item.status,
      metadata: item.metadata ? JSON.parse(item.metadata) : null,
      seller: item.seller,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      viewCount: item.viewCount,
      favoriteCount: item.favoriteCount
    };
  }

  /**
   * Obtener todos los items activos del marketplace (endpoint público)
   */
  async findAllActiveItems(dto?: MarketplaceSearchDto) {
    console.log('>>> MarketplaceService.findAllActiveItems: Getting all active marketplace items (PUBLIC)');

    const limit = dto?.limit ? parseInt(dto.limit, 10) : 20;
    const offset = dto?.offset ? parseInt(dto.offset, 10) : 0;

    // Solo items activos para el endpoint público
    const where = {
      isActive: true,
      isDeleted: false,
      status: 'ACTIVE'
    };

    const [items, total] = await Promise.all([
      this.prisma.marketplaceItem.findMany({
        where,
        include: {
          seller: { 
            select: { 
              id: true, 
              firstName: true, 
              lastName: true,
              username: true,
              avatarUrl: true
            } 
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      this.prisma.marketplaceItem.count({ where })
    ]);

    const processedItems = items.map(item => ({
      id: item.id,
      title: item.name,
      description: item.description,
      type: item.itemType,
      priceUnits: item.price,
      priceToins: item.priceToins,
      currency: item.currency,
      tags: item.tags,
      images: item.images,
      imageUrl: item.images[0] || null,
      location: item.location,
      status: item.status,
      metadata: item.metadata ? JSON.parse(item.metadata) : null,
      seller: item.seller,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      viewCount: item.viewCount,
      favoriteCount: item.favoriteCount
    }));

    return {
      items: processedItems,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    };
  }

  /**
   * Buscar items en el marketplace
   */
  async searchItems(dto: MarketplaceSearchDto) {
    console.log('>>> MarketplaceService.searchItems: Searching marketplace items', dto);

    const limit = dto.limit ? parseInt(dto.limit, 10) : 20;
    const offset = dto.offset ? parseInt(dto.offset, 10) : 0;

    const where: any = {
      isActive: true,
      isDeleted: false,
      status: 'ACTIVE'
    };

    // Aplicar filtros
    if (dto.type) {
      where.itemType = dto.type;
    }

    if (dto.minPrice || dto.maxPrice) {
      where.price = {};
      if (dto.minPrice) where.price.gte = dto.minPrice;
      if (dto.maxPrice) where.price.lte = dto.maxPrice;
    }

    if (dto.location) {
      where.location = {
        contains: dto.location,
        mode: 'insensitive'
      };
    }

    if (dto.query) {
      where.OR = [
        {
          name: {
            contains: dto.query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: dto.query,
            mode: 'insensitive'
          }
        },
        {
          tags: {
            has: dto.query
          }
        }
      ];
    }

    if (dto.tags && dto.tags.length > 0) {
      where.tags = {
        hasEvery: dto.tags
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.marketplaceItem.findMany({
        where,
        include: {
          seller: { 
            select: { 
              id: true, 
              email: true, 
              firstName: true, 
              lastName: true,
              username: true,
              avatarUrl: true
            } 
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      this.prisma.marketplaceItem.count({ where })
    ]);

    const processedItems = items.map(item => ({
      id: item.id,
      title: item.name,
      description: item.description,
      type: item.itemType,
      priceUnits: item.price,
      priceToins: item.priceToins,
      currency: item.currency,
      tags: item.tags,
      images: item.images,
      imageUrl: item.images[0] || null,
      location: item.location,
      status: item.status,
      metadata: item.metadata ? JSON.parse(item.metadata) : null,
      seller: item.seller,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      viewCount: item.viewCount,
      favoriteCount: item.favoriteCount
    }));

    return {
      items: processedItems,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    };
  }

  /**
   * Obtener un item específico del marketplace
   */
  async getItem(itemId: string) {
    console.log('>>> MarketplaceService.getItem: Getting marketplace item', itemId);

    const item = await this.prisma.marketplaceItem.findFirst({
      where: { 
        id: itemId,
        isActive: true,
        isDeleted: false
      },
      include: {
        seller: { 
          select: { 
            id: true, 
            email: true, 
            firstName: true, 
            lastName: true,
            username: true,
            avatarUrl: true
          } 
        }
      }
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado');
    }

    // Incrementar contador de visualizaciones
    await this.prisma.marketplaceItem.update({
      where: { id: itemId },
      data: { viewCount: { increment: 1 } }
    });

    return {
      id: item.id,
      title: item.name,
      description: item.description,
      type: item.itemType,
      priceUnits: item.price,
      priceToins: item.priceToins,
      currency: item.currency,
      tags: item.tags,
      images: item.images,
      imageUrl: item.images[0] || null,
      location: item.location,
      status: item.status,
      metadata: item.metadata ? JSON.parse(item.metadata) : null,
      seller: item.seller,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      viewCount: item.viewCount + 1, // Reflejar el incremento
      favoriteCount: item.favoriteCount
    };
  }

  /**
   * Actualizar un item del marketplace
   */
  async updateItem(itemId: string, dto: UpdateMarketplaceItemDto, userId: string) {
    console.log('>>> MarketplaceService.updateItem: Updating marketplace item', itemId);

    const item = await this.prisma.marketplaceItem.findFirst({
      where: { 
        id: itemId,
        sellerId: userId, // Solo el propietario puede actualizar
        isDeleted: false
      }
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado o no tienes permisos para actualizarlo');
    }

    const updateData: any = {};

    if (dto.title) updateData.name = dto.title;
    if (dto.description) updateData.description = dto.description;
    if (dto.priceUnits !== undefined) updateData.price = dto.priceUnits;
    if (dto.priceToins !== undefined) updateData.priceToins = dto.priceToins;
    if (dto.tags) updateData.tags = dto.tags;
    if (dto.imageUrl) updateData.images = [dto.imageUrl];
    if (dto.location) updateData.location = dto.location;
    if (dto.status) updateData.status = dto.status;
    if (dto.metadata) updateData.metadata = JSON.stringify(dto.metadata);

    const updatedItem = await this.prisma.marketplaceItem.update({
      where: { id: itemId },
      data: updateData,
      include: {
        seller: { 
          select: { 
            id: true, 
            email: true, 
            firstName: true, 
            lastName: true,
            username: true,
            avatarUrl: true
          } 
        }
      }
    });

    return {
      id: updatedItem.id,
      title: updatedItem.name,
      description: updatedItem.description,
      type: updatedItem.itemType,
      priceUnits: updatedItem.price,
      priceToins: updatedItem.priceToins,
      currency: updatedItem.currency,
      tags: updatedItem.tags,
      images: updatedItem.images,
      imageUrl: updatedItem.images[0] || null,
      location: updatedItem.location,
      status: updatedItem.status,
      metadata: updatedItem.metadata ? JSON.parse(updatedItem.metadata) : null,
      seller: updatedItem.seller,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt,
      viewCount: updatedItem.viewCount,
      favoriteCount: updatedItem.favoriteCount
    };
  }

  /**
   * Eliminar un item del marketplace
   */
  async deleteItem(itemId: string, userId: string) {
    console.log('>>> MarketplaceService.deleteItem: Deleting marketplace item', itemId);

    const item = await this.prisma.marketplaceItem.findFirst({
      where: { 
        id: itemId,
        sellerId: userId, // Solo el propietario puede eliminar
        isDeleted: false
      }
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado o no tienes permisos para eliminarlo');
    }

    // Soft delete
    await this.prisma.marketplaceItem.update({
      where: { id: itemId },
      data: { 
        isDeleted: true,
        deletedAt: new Date(),
        status: 'INACTIVE'
      }
    });

    return { message: 'Item eliminado correctamente' };
  }

  /**
   * Obtener items de un vendedor específico
   */
  async getSellerItems(sellerId: string) {
    console.log('>>> MarketplaceService.getSellerItems: Getting items for seller', sellerId);

    const items = await this.prisma.marketplaceItem.findMany({
      where: { 
        sellerId,
        isActive: true,
        isDeleted: false
      },
      include: {
        seller: { 
          select: { 
            id: true, 
            email: true, 
            firstName: true, 
            lastName: true,
            username: true,
            avatarUrl: true
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const processedItems = items.map(item => ({
      id: item.id,
      title: item.name,
      description: item.description,
      type: item.itemType,
      priceUnits: item.price,
      priceToins: item.priceToins,
      currency: item.currency,
      tags: item.tags,
      images: item.images,
      imageUrl: item.images[0] || null,
      location: item.location,
      status: item.status,
      metadata: item.metadata ? JSON.parse(item.metadata) : null,
      seller: item.seller,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      viewCount: item.viewCount,
      favoriteCount: item.favoriteCount
    }));

    return {
      items: processedItems,
      total: processedItems.length,
      sellerId
    };
  }

  /**
   * Obtener estadísticas del marketplace
   */
  async getMarketplaceStats() {
    console.log('>>> MarketplaceService.getMarketplaceStats: Getting marketplace statistics');

    const [
      totalItems,
      activeItems,
      totalSellers,
      itemsByType,
      itemsByStatus
    ] = await Promise.all([
      this.prisma.marketplaceItem.count({ 
        where: { isDeleted: false } 
      }),
      this.prisma.marketplaceItem.count({ 
        where: { 
          isDeleted: false, 
          isActive: true, 
          status: 'ACTIVE' 
        } 
      }),
      this.prisma.marketplaceItem.groupBy({
        by: ['sellerId'],
        where: { isDeleted: false },
        _count: { sellerId: true }
      }).then(result => result.length),
      this.prisma.marketplaceItem.groupBy({
        by: ['itemType'],
        where: { isDeleted: false },
        _count: { itemType: true }
      }),
      this.prisma.marketplaceItem.groupBy({
        by: ['status'],
        where: { isDeleted: false },
        _count: { status: true }
      })
    ]);

    return {
      totalItems,
      activeItems,
      totalSellers,
      itemsByType: itemsByType.reduce((acc, item) => {
        acc[item.itemType] = item._count.itemType;
        return acc;
      }, {}),
      itemsByStatus: itemsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
      generatedAt: new Date().toISOString()
    };
  }
} 