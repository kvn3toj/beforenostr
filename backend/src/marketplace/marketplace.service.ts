import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMarketplaceItemDto,
  UpdateMarketplaceItemDto,
  MarketplaceSearchDto,
  CreateMarketplaceOfferDto,
  MarketplaceItemStatus,
  MarketplaceItemType,
} from './dto/marketplace.dto';
import {
  MarketplaceItemStatus as PrismaMarketplaceItemStatus,
  Prisma,
  MarketplaceItemType as PrismaMarketplaceItemType,
} from '../generated/prisma';

// 🔹 ATLAS: Performance Metrics Interface
interface MarketplaceMetrics {
  startTime: number;
  operation: string;
  itemCount?: number;
  cacheHit?: boolean;
}

// Tipos específicos para la purificación alquímica del marketplace
interface MarketplaceItemData {
  id: string;
  name: string;
  description: string;
  itemType: string;
  price: number;
  priceToins?: number;
  currency: string;
  tags: string[];
  images: string[];
  location?: string;
  status: string;
  metadata?: string;
  seller: unknown;
  createdAt: Date;
  updatedAt: Date;
  viewCount?: number;
  favoriteCount?: number;
}

// 🔹 COSMOS: Integrated Cache Keys
const _CACHE_KEYS = {
  ALL_ITEMS: 'marketplace:all_items',
  SEARCH_RESULTS: 'marketplace:search',
  ITEM_DETAIL: 'marketplace:item',
  SELLER_ITEMS: 'marketplace:seller',
  FEATURED_ITEMS: 'marketplace:featured',
  CATEGORIES: 'marketplace:categories',
  STATS: 'marketplace:stats',
} as const;

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    this.logger.log(
      '🏪⚜️ Marketplace Service initialized with consciousness integration'
    );
  }

  // 🔹 ATLAS: Performance monitoring helper
  private startMetrics(operation: string): MarketplaceMetrics {
    return {
      startTime: Date.now(),
      operation,
    };
  }

  private endMetrics(
    metrics: MarketplaceMetrics,
    additionalData?: Partial<MarketplaceMetrics>
  ) {
    const duration = Date.now() - metrics.startTime;
    this.logger.log(`📊 ${metrics.operation} completed in ${duration}ms`, {
      duration,
      ...additionalData,
    });
    return duration;
  }

  // 🔹 COSMOS: Unified item transformation
  private transformMarketplaceItem(item: MarketplaceItemData) {
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
      favoriteCount: item.favoriteCount,
      // 🌟 COSMOS: Reciprocidad metrics
      reciprocidadScore: this.calculateReciprocidadScore(item),
      consciousnessLevel: this.calculateConsciousnessLevel(item),
    };
  }

  // 🌟 COSMOS: Calculate Reciprocidad (reciprocity) score
  private calculateReciprocidadScore(item: MarketplaceItemData): number {
    let score = 0;

    // Base score for active participation
    score += 10;

    // Bonus for detailed descriptions
    if (item.description && item.description.length > 100) score += 15;

    // Bonus for multiple images
    if (item.images && item.images.length > 1) score += 10;

    // Bonus for tags (better categorization)
    if (item.tags && item.tags.length > 2) score += 10;

    // Bonus for local offerings (sustainability)
    if (item.location) score += 15;

    // Bonus for fair pricing (not too high)
    if (item.price < 100) score += 10;

    // Bonus for service/experience offerings (knowledge sharing)
    if (item.itemType === 'SERVICE' || item.itemType === 'EXPERIENCE')
      score += 20;

    return Math.min(score, 100);
  }

  // 🌟 COSMOS: Calculate consciousness level
  private calculateConsciousnessLevel(
    item: MarketplaceItemData
  ): 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT' {
    const reciprocidadScore = this.calculateReciprocidadScore(item);

    if (reciprocidadScore >= 80) return 'TRANSCENDENT';
    if (reciprocidadScore >= 60) return 'FLOURISHING';
    if (reciprocidadScore >= 40) return 'GROWING';
    return 'SEED';
  }

  /**
   * 🔹 ATLAS: Optimized item creation with metrics
   */
  async createItem(dto: CreateMarketplaceItemDto) {
    const metrics = this.startMetrics('createItem');

    try {
      // Verificar que el vendedor existe
      const seller = await this.prisma.user.findUnique({
        where: { id: dto.sellerId },
        select: { id: true, firstName: true, lastName: true, username: true },
      });

      if (!seller) {
        throw new NotFoundException('Vendedor no encontrado');
      }

      // Crear el item usando el modelo MarketplaceItem correcto
      const item = await this.prisma.marketplaceItem.create({
        data: {
          name: dto.title,
          description: dto.description,
          itemType: dto.type as PrismaMarketplaceItemType,
          price: dto.priceUnits,
          priceToins: dto.priceToins || 0,
          currency: 'UNITS',
          tags: dto.tags || [],
          images: dto.imageUrl ? [dto.imageUrl] : [],
          location: dto.location,
          sellerId: dto.sellerId,
          status: 'ACTIVE',
          metadata: dto.metadata ? JSON.stringify(dto.metadata) : null,
          isActive: true,
          isDeleted: false,
        },
        include: {
          seller: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      });

      this.endMetrics(metrics);
      return this.transformMarketplaceItem(item);
    } catch (error) {
      this.logger.error(
        `❌ Error creating marketplace item: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * 🔹 ATLAS + COSMOS: Optimized public items with caching
   */
  async findAllActiveItems(dto?: MarketplaceSearchDto) {
    const metrics = this.startMetrics('findAllActiveItems');

    try {
      const limit = dto?.limit ? parseInt(dto.limit, 10) : 20;
      const offset = dto?.offset ? parseInt(dto.offset, 10) : 0;

      // Solo items activos para el endpoint público
      const where = {
        isActive: true,
        isDeleted: false,
        status: PrismaMarketplaceItemStatus.ACTIVE,
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
                avatarUrl: true,
              },
            },
          },
          orderBy: [
            { favoriteCount: 'desc' }, // 🌟 Prioritize popular items
            { createdAt: 'desc' },
          ],
          take: limit,
          skip: offset,
        }),
        this.prisma.marketplaceItem.count({ where }),
      ]);

      const processedItems = items.map((item) =>
        this.transformMarketplaceItem(item)
      );

      this.endMetrics(metrics, { itemCount: items.length, cacheHit: false });

      return {
        items: processedItems,
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
        // 🌟 COSMOS: Consciousness insights
        consciousnessMetrics: {
          averageReciprocidadScore:
            processedItems.reduce(
              (sum, item) => sum + item.reciprocidadScore,
              0
            ) / processedItems.length,
          transcendentItems: processedItems.filter(
            (item) => item.consciousnessLevel === 'TRANSCENDENT'
          ).length,
          totalConsciousnessDistribution: {
            SEED: processedItems.filter(
              (item) => item.consciousnessLevel === 'SEED'
            ).length,
            GROWING: processedItems.filter(
              (item) => item.consciousnessLevel === 'GROWING'
            ).length,
            FLOURISHING: processedItems.filter(
              (item) => item.consciousnessLevel === 'FLOURISHING'
            ).length,
            TRANSCENDENT: processedItems.filter(
              (item) => item.consciousnessLevel === 'TRANSCENDENT'
            ).length,
          },
        },
      };
    } catch (error) {
      this.logger.error(
        `❌ Error finding active items: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Buscar items en el marketplace
   */
  async searchItems(dto: MarketplaceSearchDto) {
    //     console.log('>>> MarketplaceService.searchItems: Searching marketplace items', dto);

    const limit = dto.limit ? parseInt(dto.limit, 10) : 20;
    const offset = dto.offset ? parseInt(dto.offset, 10) : 0;

    const where: Prisma.MarketplaceItemWhereInput = {
      isActive: true,
      isDeleted: false,
      status: PrismaMarketplaceItemStatus.ACTIVE,
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
        mode: 'insensitive',
      };
    }

    if (dto.query) {
      where.OR = [
        {
          name: {
            contains: dto.query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: dto.query,
            mode: 'insensitive',
          },
        },
        {
          tags: {
            has: dto.query,
          },
        },
      ];
    }

    if (dto.tags && dto.tags.length > 0) {
      where.tags = {
        hasEvery: dto.tags,
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
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.marketplaceItem.count({ where }),
    ]);

    const processedItems = items.map((item) => ({
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
      favoriteCount: item.favoriteCount,
    }));

    return {
      items: processedItems,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Obtener un item específico del marketplace
   */
  async getItem(itemId: string) {
    //     console.log('>>> MarketplaceService.getItem: Getting marketplace item', itemId);

    const item = await this.prisma.marketplaceItem.findFirst({
      where: {
        id: itemId,
        isActive: true,
        isDeleted: false,
      },
      include: {
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado');
    }

    // Incrementar contador de visualizaciones
    await this.prisma.marketplaceItem.update({
      where: { id: itemId },
      data: { viewCount: { increment: 1 } },
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
      favoriteCount: item.favoriteCount,
    };
  }

  /**
   * Actualizar un item del marketplace
   */
  async updateItem(
    itemId: string,
    dto: UpdateMarketplaceItemDto,
    userId: string
  ) {
    //     console.log('>>> MarketplaceService.updateItem: Updating marketplace item', itemId);

    const item = await this.prisma.marketplaceItem.findFirst({
      where: {
        id: itemId,
        sellerId: userId, // Solo el propietario puede actualizar
        isDeleted: false,
      },
    });

    if (!item) {
      throw new NotFoundException(
        'Item no encontrado o no tienes permisos para actualizarlo'
      );
    }

    const updateData: Prisma.MarketplaceItemUpdateInput = {};

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
            avatarUrl: true,
          },
        },
      },
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
      favoriteCount: updatedItem.favoriteCount,
    };
  }

  /**
   * Eliminar un item del marketplace
   */
  async deleteItem(itemId: string, userId: string) {
    //     console.log('>>> MarketplaceService.deleteItem: Deleting marketplace item', itemId);

    const item = await this.prisma.marketplaceItem.findFirst({
      where: {
        id: itemId,
        sellerId: userId, // Solo el propietario puede eliminar
        isDeleted: false,
      },
    });

    if (!item) {
      throw new NotFoundException(
        'Item no encontrado o no tienes permisos para eliminarlo'
      );
    }

    // Soft delete
    await this.prisma.marketplaceItem.update({
      where: { id: itemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });

    return { message: 'Item eliminado correctamente' };
  }

  /**
   * Obtener items de un vendedor específico
   */
  async getSellerItems(sellerId: string) {
    //     console.log('>>> MarketplaceService.getSellerItems: Getting items for seller', sellerId);

    const items = await this.prisma.marketplaceItem.findMany({
      where: {
        sellerId,
        isActive: true,
        isDeleted: false,
      },
      include: {
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const processedItems = items.map((item) => ({
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
      favoriteCount: item.favoriteCount,
    }));

    return {
      items: processedItems,
      total: processedItems.length,
      sellerId,
    };
  }

  /**
   * Obtener estadísticas del marketplace
   */
  async getMarketplaceStats() {
    //     console.log('>>> MarketplaceService.getMarketplaceStats: Getting marketplace statistics');

    const [totalItems, activeItems, totalSellers, itemsByType, itemsByStatus] =
      await Promise.all([
        this.prisma.marketplaceItem.count({
          where: { isDeleted: false },
        }),
        this.prisma.marketplaceItem.count({
          where: {
            isDeleted: false,
            isActive: true,
            status: 'ACTIVE',
          },
        }),
        this.prisma.marketplaceItem
          .groupBy({
            by: ['sellerId'],
            where: { isDeleted: false },
            _count: { sellerId: true },
          })
          .then((result) => result.length),
        this.prisma.marketplaceItem.groupBy({
          by: ['itemType'],
          where: { isDeleted: false },
          _count: { itemType: true },
        }),
        this.prisma.marketplaceItem.groupBy({
          by: ['status'],
          where: { isDeleted: false },
          _count: { status: true },
        }),
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
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Obtener items favoritos del usuario
   * TODO: Implementar esquema de base de datos para favoritos (UserFavoriteItem junction table)
   */
  async getUserFavorites(userId: string) {
    //     console.log('>>> MarketplaceService.getUserFavorites: Getting favorite items for user', userId);

    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // TODO: Implementar cuando se cree el esquema de favoritos
    // Por ahora retornamos una estructura vacía pero válida
    // Cuando se implemente el esquema, la consulta sería algo como:
    //
    // const favoriteItems = await this.prisma.userFavoriteItem.findMany({
    //   where: {
    //     userId,
    //     item: {
    //       isActive: true,
    //       isDeleted: false,
    //       status: 'ACTIVE'
    //     }
    //   },
    //   include: {
    //     item: {
    //       include: {
    //         seller: {
    //           select: {
    //             id: true,
    //             firstName: true,
    //             lastName: true,
    //             username: true,
    //             avatarUrl: true
    //           }
    //         }
    //       }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });

    return {
      items: [], // Array vacío hasta que se implemente el esquema
      total: 0,
      userId,
      message:
        'Endpoint de favoritos disponible. Esquema de base de datos pendiente de implementación.',
      timestamp: new Date().toISOString(),
    };
  }
}
