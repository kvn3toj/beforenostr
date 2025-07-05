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
} from '@nestjs/common';
import { Request } from 'express';
import { MarketplaceService } from './marketplace.service.js.js';
import {
  CreateMarketplaceItemDto,
  UpdateMarketplaceItemDto,
  MarketplaceSearchDto,
  MarketplaceItemType,
} from './dto/marketplace.dto.js.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js.js';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@Controller('marketplace')
export class MarketplaceController {
  constructor(
    @Inject(MarketplaceService)
    private readonly marketplaceService: MarketplaceService
  ) {
    // //     console.log('>>> MarketplaceController CONSTRUCTOR: this.marketplaceService IS', this.marketplaceService ? 'DEFINED' : 'UNDEFINED');
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
    //     console.log('>>> MarketplaceController.createItem: Creating marketplace item', dto);

    // Obtener el userId del token JWT
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    // Usar el userId del token en lugar del DTO
    const createDto = { ...dto, sellerId: userId };
    return await this.marketplaceService.createItem(createDto);
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
    //     console.log('>>> MarketplaceController.searchItems: Searching marketplace items');

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
  }

  /**
   * Obtener todos los items del marketplace (sin filtros) - ENDPOINT PÚBLICO
   */
  @Get('items')
  async getAllItems(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    //     console.log('>>> MarketplaceController.getAllItems: Getting all marketplace items (PUBLIC)');

    const searchDto: MarketplaceSearchDto = { limit, offset };
    return await this.marketplaceService.findAllActiveItems(searchDto);
  }

  /**
   * Obtener un item específico del marketplace
   */
  @Get('items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async getItem(@Param('itemId') itemId: string) {
    //     console.log('>>> MarketplaceController.getItem: Getting marketplace item', itemId);
    return await this.marketplaceService.getItem(itemId);
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
    //     console.log('>>> MarketplaceController.updateItem: Updating marketplace item', itemId);

    // Obtener el userId del token JWT
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    return await this.marketplaceService.updateItem(itemId, dto, userId);
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
    //     console.log('>>> MarketplaceController.deleteItem: Deleting marketplace item', itemId);

    // Obtener el userId del token JWT
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    return await this.marketplaceService.deleteItem(itemId, userId);
  }

  /**
   * Obtener items de un vendedor específico
   */
  @Get('sellers/:sellerId/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async getSellerItems(@Param('sellerId') sellerId: string) {
    //     console.log('>>> MarketplaceController.getSellerItems: Getting items for seller', sellerId);
    return await this.marketplaceService.getSellerItems(sellerId);
  }

  /**
   * Obtener items favoritos del usuario autenticado
   */
  @Get('favorites')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async getUserFavorites(@Req() req: AuthenticatedRequest) {
    //     console.log('>>> MarketplaceController.getUserFavorites: Getting favorite items for authenticated user');

    // Obtener el userId del token JWT
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    return await this.marketplaceService.getUserFavorites(userId);
  }

  /**
   * Obtener items del usuario autenticado (mis items)
   */
  @Get('my-items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'USER')
  async getMyItems(@Req() req: AuthenticatedRequest) {
    //     console.log('>>> MarketplaceController.getMyItems: Getting items for authenticated user');

    // Obtener el userId del token JWT
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    return await this.marketplaceService.getSellerItems(userId);
  }

  /**
   * Obtener estadísticas del marketplace
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getMarketplaceStats() {
    //     console.log('>>> MarketplaceController.getMarketplaceStats: Getting marketplace statistics');
    return await this.marketplaceService.getMarketplaceStats();
  }

  /**
   * Endpoint de prueba para verificar conectividad
   */
  @Get('ping')
  async ping() {
    //     console.log('>>> MarketplaceController.ping: Marketplace module is working');
    return {
      message: 'Marketplace module is working',
      timestamp: new Date().toISOString(),
      module: 'Marketplace System',
      version: '2.0.0',
      features: ['Authentication', 'RBAC', 'MarketplaceItem Model'],
    };
  }
}
