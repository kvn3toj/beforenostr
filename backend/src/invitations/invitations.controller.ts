import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { 
  CreateGiftCardDto, 
  RedeemGiftCardDto, 
  UpdateGiftCardDto,
  InvitationStatsDto
} from './dto/invitations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@Controller('invitations')
export class InvitationsController {
  constructor(@Inject(InvitationsService) private readonly invitationsService: InvitationsService) {
// //     console.log('>>> InvitationsController CONSTRUCTOR: this.invitationsService IS', this.invitationsService ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Endpoint de prueba para verificar conectividad
   */
  @Get('ping')
  async ping() {
//     console.log('>>> InvitationsController.ping: Invitations module is working');
    return { 
      message: 'Invitations module is working', 
      timestamp: new Date().toISOString(),
      module: 'Invitations & Gift Cards System'
    };
  }

  /**
   * Canjear una gift card (endpoint público)
   */
  @Post('gift-cards/redeem')
  async redeemGiftCard(@Body() dto: RedeemGiftCardDto) {
//     console.log('>>> InvitationsController.redeemGiftCard: Redeeming gift card');
    return await this.invitationsService.redeemGiftCard(dto);
  }

  // Endpoints protegidos con autenticación
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('gift-cards')
  @Roles('admin', 'user')
  async createGiftCard(@Body() dto: CreateGiftCardDto) {
//     console.log('>>> InvitationsController.createGiftCard: Creating gift card', dto);
    return await this.invitationsService.createGiftCard(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('gift-cards/user/:userId')
  @Roles('admin', 'user')
  async getUserGiftCards(@Param('userId') userId: string) {
//     console.log('>>> InvitationsController.getUserGiftCards: Getting gift cards for user', userId);
    return await this.invitationsService.getUserGiftCards(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('gift-cards/:giftCardId')
  @Roles('admin', 'user')
  async updateGiftCard(
    @Param('giftCardId') giftCardId: string,
    @Body() dto: UpdateGiftCardDto,
    @Query('userId') userId: string
  ) {
//     console.log('>>> InvitationsController.updateGiftCard: Updating gift card', giftCardId);
    return await this.invitationsService.updateGiftCard(giftCardId, dto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('gift-cards/:giftCardId')
  @Roles('admin', 'user')
  async cancelGiftCard(
    @Param('giftCardId') giftCardId: string,
    @Query('userId') userId: string
  ) {
//     console.log('>>> InvitationsController.cancelGiftCard: Cancelling gift card', giftCardId);
    return await this.invitationsService.cancelGiftCard(giftCardId, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('stats')
  @Roles('admin', 'user')
  async getInvitationStats(
    @Query('inviterId') inviterId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
//     console.log('>>> InvitationsController.getInvitationStats: Getting invitation statistics');
    
    const dto: InvitationStatsDto = { inviterId, startDate, endDate };
    return await this.invitationsService.getInvitationStats(dto);
  }
} 