import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
  Req,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { MarketplaceService } from './marketplace.service';
import {
  CreateMarketplaceItemDto,
  UpdateMarketplaceItemDto,
  MarketplaceSearchDto,
  MarketplaceItemType,
} from './dto/marketplace.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@Controller('marketplace')
export class MarketplaceController {
  private readonly logger = new Logger(MarketplaceController.name);

  constructor(
    @Inject(MarketplaceService)
    private readonly marketplaceService: MarketplaceService
  ) {
    this.logger.log('MarketplaceController initialized');
  }

  /**
   * Crear un nuevo item en el marketplace
   */
  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async createItem(
    @Body() dto: CreateMarketplaceItemDto,
    @Req() req: AuthenticatedRequest
  ) {
    try {
      this.logger.log('Creating marketplace item');

      // Obtener el userId del token JWT
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(
          'Usuario no autenticado',
          HttpStatus.UNAUTHORIZED
        );
      }

      // Usar el userId del token en lugar del DTO
      const createDto = { ...dto, sellerId: userId };
      return await this.marketplaceService.createItem(createDto);
    } catch (error) {
      this.logger.error(
        `Error creating marketplace item: ${error.message}`,
        error.stack
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error interno del servidor al crear el item',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Buscar items en el marketplace
   */
  @Get('items/search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async searchItems(
    @Query('query') query?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('location') location?: string,
    @Query('tags') tags?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    try {
      this.logger.log('Searching marketplace items');

      const searchDto: MarketplaceSearchDto = {
        query,
        type: type as MarketplaceItemType,
        minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
        location,
        tags: tags ? tags.split(',') : undefined,
        limit,
        offset,
      };

      return await this.marketplaceService.searchItems(searchDto);
    } catch (error) {
      this.logger.error(
        `Error searching marketplace items: ${error.message}`,
        error.stack
      );

      throw new HttpException(
        'Error interno del servidor al buscar items',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtener todos los items del marketplace (sin filtros) - ENDPOINT PÚBLICO
   */
  @Get('items')
  async getAllItems(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('page') page?: string,
    @Query('category') category?: string,
    @Query('search') search?: string
  ) {
    try {
      this.logger.log('Getting all marketplace items (PUBLIC endpoint)');

      // Convertir page a offset si se proporciona
      let calculatedOffset = offset ? parseInt(offset, 10) : 0;
      const limitNum = limit ? parseInt(limit, 10) : 20;

      if (page && !offset) {
        const pageNum = parseInt(page, 10);
        calculatedOffset = (pageNum - 1) * limitNum;
      }

      const searchDto: MarketplaceSearchDto = {
        limit: limitNum.toString(),
        offset: calculatedOffset.toString(),
        query: search,
      };

      // Si hay categoría, agregarla como filtro de búsqueda
      if (category) {
        searchDto.query = category;
      }

      const result =
        await this.marketplaceService.findAllActiveItems(searchDto);

      this.logger.log(
        `Successfully retrieved ${result.items?.length || 0} marketplace items`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error getting all marketplace items: ${error.message}`,
        error.stack
      );

      // Retornar estructura mínima en caso de error para evitar romper la UI
      return {
        items: [],
        total: 0,
        limit: parseInt(limit || '20', 10),
        offset: parseInt(offset || '0', 10),
        hasMore: false,
        error: 'Error interno del servidor al obtener items del marketplace',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Obtener un item específico del marketplace
   */
  @Get('items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async getItem(@Param('itemId') itemId: string) {
    try {
      this.logger.log(`Getting marketplace item: ${itemId}`);

      if (!itemId || itemId.trim() === '') {
        throw new HttpException('ID de item inválido', HttpStatus.BAD_REQUEST);
      }

      return await this.marketplaceService.getItem(itemId);
    } catch (error) {
      this.logger.error(
        `Error getting marketplace item ${itemId}: ${error.message}`,
        error.stack
      );

      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error.message.includes('not found') ||
        error.message.includes('no encontrado')
      ) {
        throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Error interno del servidor al obtener el item',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Actualizar un item del marketplace
   */
  @Put('items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateMarketplaceItemDto,
    @Req() req: AuthenticatedRequest
  ) {
    try {
      this.logger.log(`Updating marketplace item: ${itemId}`);

      // Obtener el userId del token JWT
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(
          'Usuario no autenticado',
          HttpStatus.UNAUTHORIZED
        );
      }

      return await this.marketplaceService.updateItem(itemId, dto, userId);
    } catch (error) {
      this.logger.error(
        `Error updating marketplace item ${itemId}: ${error.message}`,
        error.stack
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error interno del servidor al actualizar el item',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Eliminar un item del marketplace
   */
  @Delete('items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async deleteItem(
    @Param('itemId') itemId: string,
    @Req() req: AuthenticatedRequest
  ) {
    try {
      this.logger.log(`Deleting marketplace item: ${itemId}`);

      // Obtener el userId del token JWT
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(
          'Usuario no autenticado',
          HttpStatus.UNAUTHORIZED
        );
      }

      return await this.marketplaceService.deleteItem(itemId, userId);
    } catch (error) {
      this.logger.error(
        `Error deleting marketplace item ${itemId}: ${error.message}`,
        error.stack
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error interno del servidor al eliminar el item',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtener items de un vendedor específico
   */
  @Get('sellers/:sellerId/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async getSellerItems(@Param('sellerId') sellerId: string) {
    try {
      this.logger.log(`Getting items for seller: ${sellerId}`);
      return await this.marketplaceService.getSellerItems(sellerId);
    } catch (error) {
      this.logger.error(
        `Error getting seller items for ${sellerId}: ${error.message}`,
        error.stack
      );

      throw new HttpException(
        'Error interno del servidor al obtener items del vendedor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtener items favoritos del usuario autenticado
   */
  @Get('favorites')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async getUserFavorites(@Req() req: AuthenticatedRequest) {
    try {
      this.logger.log('Getting favorite items for authenticated user');

      // Obtener el userId del token JWT
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(
          'Usuario no autenticado',
          HttpStatus.UNAUTHORIZED
        );
      }

      return await this.marketplaceService.getUserFavorites(userId);
    } catch (error) {
      this.logger.error(
        `Error getting user favorites: ${error.message}`,
        error.stack
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error interno del servidor al obtener favoritos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtener items del usuario autenticado (mis items)
   */
  @Get('my-items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async getMyItems(@Req() req: AuthenticatedRequest) {
    try {
      this.logger.log('Getting items for authenticated user');

      // Obtener el userId del token JWT
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(
          'Usuario no autenticado',
          HttpStatus.UNAUTHORIZED
        );
      }

      return await this.marketplaceService.getSellerItems(userId);
    } catch (error) {
      this.logger.error(
        `Error getting user items: ${error.message}`,
        error.stack
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error interno del servidor al obtener tus items',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtener estadísticas del marketplace
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getMarketplaceStats() {
    try {
      this.logger.log('Getting marketplace statistics');
      return await this.marketplaceService.getMarketplaceStats();
    } catch (error) {
      this.logger.error(
        `Error getting marketplace stats: ${error.message}`,
        error.stack
      );

      throw new HttpException(
        'Error interno del servidor al obtener estadísticas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Endpoint de prueba para verificar conectividad
   */
  @Get('ping')
  async ping() {
    try {
      this.logger.log('Marketplace ping endpoint called');
      return {
        message: 'Marketplace module is working',
        timestamp: new Date().toISOString(),
        module: 'Marketplace System',
        version: '2.0.0',
        features: [
          'Authentication',
          'RBAC',
          'MarketplaceItem Model',
          'Error Handling',
        ],
        status: 'healthy',
      };
    } catch (error) {
      this.logger.error(
        `Error in ping endpoint: ${error.message}`,
        error.stack
      );

      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
