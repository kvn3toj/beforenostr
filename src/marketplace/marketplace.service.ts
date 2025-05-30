import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketplaceItemDto, UpdateMarketplaceItemDto, MarketplaceSearchDto, CreateMarketplaceOfferDto, MarketplaceItemStatus } from './dto/marketplace.dto';

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

    // Por ahora, simulamos la creación del item usando el modelo Publication
    // En una implementación completa, se crearía un modelo MarketplaceItem específico
    const item = await this.prisma.publication.create({
      data: {
        userId: dto.sellerId,
        content: JSON.stringify({
          title: dto.title,
          description: dto.description,
          type: dto.type,
          priceUnits: dto.priceUnits,
          priceToins: dto.priceToins,
          tags: dto.tags,
          imageUrl: dto.imageUrl,
          location: dto.location,
          status: MarketplaceItemStatus.PUBLISHED,
          metadata: dto.metadata
        }),
        type: 'MARKETPLACE_ITEM'
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } }
      }
    });

    return {
      id: item.id,
      ...JSON.parse(item.content),
      seller: item.user,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
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
      type: 'MARKETPLACE_ITEM'
    };

    // Filtros básicos usando el contenido JSON
    // En una implementación real, se usarían campos específicos de la tabla
    const items = await this.prisma.publication.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await this.prisma.publication.count({ where });

    const processedItems = items.map(item => {
      const content = JSON.parse(item.content);
      
      // Aplicar filtros en memoria (en producción se haría en la query)
      if (dto.type && content.type !== dto.type) return null;
      if (dto.minPrice && content.priceUnits < dto.minPrice) return null;
      if (dto.maxPrice && content.priceUnits > dto.maxPrice) return null;
      if (dto.query && !content.title.toLowerCase().includes(dto.query.toLowerCase()) && 
          !content.description.toLowerCase().includes(dto.query.toLowerCase())) return null;
      if (dto.location && content.location !== dto.location) return null;

      return {
        id: item.id,
        ...content,
        seller: item.user,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    }).filter(item => item !== null);

    return {
      items: processedItems,
      total: processedItems.length,
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

    const item = await this.prisma.publication.findFirst({
      where: { 
        id: itemId,
        type: 'MARKETPLACE_ITEM'
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } }
      }
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado');
    }

    const content = JSON.parse(item.content);
    
    return {
      id: item.id,
      ...content,
      seller: item.user,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }

  /**
   * Actualizar un item del marketplace
   */
  async updateItem(itemId: string, dto: UpdateMarketplaceItemDto, userId: string) {
    console.log('>>> MarketplaceService.updateItem: Updating marketplace item', itemId);

    const item = await this.prisma.publication.findFirst({
      where: { 
        id: itemId,
        type: 'MARKETPLACE_ITEM',
        userId // Solo el propietario puede actualizar
      }
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado o no tienes permisos para actualizarlo');
    }

    const currentContent = JSON.parse(item.content);
    const updatedContent = { ...currentContent, ...dto };

    const updatedItem = await this.prisma.publication.update({
      where: { id: itemId },
      data: {
        content: JSON.stringify(updatedContent)
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } }
      }
    });

    return {
      id: updatedItem.id,
      ...JSON.parse(updatedItem.content),
      seller: updatedItem.user,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt
    };
  }

  /**
   * Eliminar un item del marketplace
   */
  async deleteItem(itemId: string, userId: string) {
    console.log('>>> MarketplaceService.deleteItem: Deleting marketplace item', itemId);

    const item = await this.prisma.publication.findFirst({
      where: { 
        id: itemId,
        type: 'MARKETPLACE_ITEM',
        userId // Solo el propietario puede eliminar
      }
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado o no tienes permisos para eliminarlo');
    }

    await this.prisma.publication.delete({
      where: { id: itemId }
    });

    return { message: 'Item eliminado exitosamente' };
  }

  /**
   * Obtener items de un vendedor específico
   */
  async getSellerItems(sellerId: string) {
    console.log('>>> MarketplaceService.getSellerItems: Getting items for seller', sellerId);

    const items = await this.prisma.publication.findMany({
      where: {
        userId: sellerId,
        type: 'MARKETPLACE_ITEM'
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return items.map(item => ({
      id: item.id,
      ...JSON.parse(item.content),
      seller: item.user,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  }

  /**
   * Obtener estadísticas del marketplace
   */
  async getMarketplaceStats() {
    console.log('>>> MarketplaceService.getMarketplaceStats: Getting marketplace statistics');

    const totalItems = await this.prisma.publication.count({
      where: { type: 'MARKETPLACE_ITEM' }
    });

    const totalSellers = await this.prisma.publication.groupBy({
      by: ['userId'],
      where: { type: 'MARKETPLACE_ITEM' }
    });

    // Estadísticas básicas
    return {
      totalItems,
      totalSellers: totalSellers.length,
      averageItemsPerSeller: totalSellers.length > 0 ? totalItems / totalSellers.length : 0,
      lastUpdated: new Date().toISOString()
    };
  }
} 