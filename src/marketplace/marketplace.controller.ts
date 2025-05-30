import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { CreateMarketplaceItemDto, UpdateMarketplaceItemDto, MarketplaceSearchDto } from './dto/marketplace.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@Controller('marketplace')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketplaceController {
  constructor(@Inject(MarketplaceService) private readonly marketplaceService: MarketplaceService) {
    console.log('>>> MarketplaceController CONSTRUCTOR: this.marketplaceService IS', this.marketplaceService ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Crear un nuevo item en el marketplace
   */
  @Post('items')
  @Roles('admin', 'user')
  async createItem(@Body() dto: CreateMarketplaceItemDto) {
    console.log('>>> MarketplaceController.createItem: Creating marketplace item', dto);
    return await this.marketplaceService.createItem(dto);
  }

  /**
   * Buscar items en el marketplace
   */
  @Get('items/search')
  @Roles('admin', 'user')
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
    console.log('>>> MarketplaceController.searchItems: Searching marketplace items');
    
    const searchDto: MarketplaceSearchDto = {
      query,
      type: type as any,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
      location,
      tags: tags ? tags.split(',') : undefined,
      limit,
      offset
    };
    
    return await this.marketplaceService.searchItems(searchDto);
  }

  /**
   * Obtener todos los items del marketplace (sin filtros)
   */
  @Get('items')
  @Roles('admin', 'user')
  async getAllItems(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    console.log('>>> MarketplaceController.getAllItems: Getting all marketplace items');
    
    const searchDto: MarketplaceSearchDto = { limit, offset };
    return await this.marketplaceService.searchItems(searchDto);
  }

  /**
   * Obtener un item específico del marketplace
   */
  @Get('items/:itemId')
  @Roles('admin', 'user')
  async getItem(@Param('itemId') itemId: string) {
    console.log('>>> MarketplaceController.getItem: Getting marketplace item', itemId);
    return await this.marketplaceService.getItem(itemId);
  }

  /**
   * Actualizar un item del marketplace
   */
  @Put('items/:itemId')
  @Roles('admin', 'user')
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateMarketplaceItemDto,
    @Query('userId') userId: string
  ) {
    console.log('>>> MarketplaceController.updateItem: Updating marketplace item', itemId);
    return await this.marketplaceService.updateItem(itemId, dto, userId);
  }

  /**
   * Eliminar un item del marketplace
   */
  @Delete('items/:itemId')
  @Roles('admin', 'user')
  async deleteItem(
    @Param('itemId') itemId: string,
    @Query('userId') userId: string
  ) {
    console.log('>>> MarketplaceController.deleteItem: Deleting marketplace item', itemId);
    return await this.marketplaceService.deleteItem(itemId, userId);
  }

  /**
   * Obtener items de un vendedor específico
   */
  @Get('sellers/:sellerId/items')
  @Roles('admin', 'user')
  async getSellerItems(@Param('sellerId') sellerId: string) {
    console.log('>>> MarketplaceController.getSellerItems: Getting items for seller', sellerId);
    return await this.marketplaceService.getSellerItems(sellerId);
  }

  /**
   * Obtener estadísticas del marketplace
   */
  @Get('stats')
  @Roles('admin')
  async getMarketplaceStats() {
    console.log('>>> MarketplaceController.getMarketplaceStats: Getting marketplace statistics');
    return await this.marketplaceService.getMarketplaceStats();
  }

  /**
   * Endpoint de prueba para verificar conectividad
   */
  @Get('ping')
  async ping() {
    console.log('>>> MarketplaceController.ping: Marketplace module is working');
    return { 
      message: 'Marketplace module is working', 
      timestamp: new Date().toISOString(),
      module: 'Marketplace System'
    };
  }
} 