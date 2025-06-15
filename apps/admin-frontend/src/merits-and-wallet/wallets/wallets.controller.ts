import { Controller, Get, Param, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../rbac/guards/roles.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';
import { Request } from 'express';

// Define a basic type for the authenticated user
interface AuthenticatedRequest extends Request {
    user: { id: string; roles: string[]; /* other user properties */ };
}

@ApiTags('wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get all wallet balances for a specific user (Owner or Admin only)' })
  @ApiResponse({ status: 200, description: 'List of wallet balances.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async getAllBalancesForUser(@Req() req: AuthenticatedRequest, @Param('userId') userId: string) {
     // Check if the authenticated user is requesting their own data OR is an admin
      if (req.user.id !== userId && !req.user.roles.includes('admin')) {
          throw new ForbiddenException('You do not have permission to view wallet balances for this user.');
      }
      return this.walletsService.getAllBalancesForUser(userId, req.user);
  }

  @Get('/user/:userId/:meritSlug')
  @ApiOperation({ summary: 'Get balance for a specific merit for a user (Owner or Admin only)' })
  @ApiResponse({ status: 200, description: 'Wallet balance for the merit.' })
  @ApiResponse({ status: 404, description: 'Wallet or Merit not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({ name: 'meritSlug', description: 'Slug of the merit' })
  async getBalanceForUser(
    @Req() req: AuthenticatedRequest,
    @Param('userId') userId: string,
    @Param('meritSlug') meritSlug: string,
  ) {
      // Check if the authenticated user is requesting their own data OR is an admin
      if (req.user.id !== userId && !req.user.roles.includes('admin')) {
          throw new ForbiddenException('You do not have permission to view this wallet balance.');
      }
      const wallet = await this.walletsService.getBalanceForUser(userId, meritSlug, req.user);
      if (!wallet) {
          throw new NotFoundException(`Wallet balance for merit ${meritSlug} not found for user ${userId}`);
      }
      return wallet;
  }

   // Admin Endpoints
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   @Get('/admin/user/:userId')
   @ApiOperation({ summary: '[ADMIN] Get all wallet balances for any user (Admin only)' })
   @ApiResponse({ status: 200, description: 'List of wallet balances (Admin only).' })
   @ApiResponse({ status: 403, description: 'Forbidden resource.' })
   @ApiParam({ name: 'userId', description: 'ID of the user' })
   getAllBalancesForUserAdmin(@Param('userId') userId: string) {
       return this.walletsService.getAllBalancesForUserAdmin(userId);
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   @Get('/admin/user/:userId/:meritSlug')
   @ApiOperation({ summary: '[ADMIN] Get balance for a specific merit for any user (Admin only)' })
   @ApiResponse({ status: 200, description: 'Wallet balance for the merit (Admin only).' })
   @ApiResponse({ status: 404, description: 'Wallet or Merit not found.' })
   @ApiResponse({ status: 403, description: 'Forbidden resource.' })
   @ApiParam({ name: 'userId', description: 'ID of the user' })
   @ApiParam({ name: 'meritSlug', description: 'Slug of the merit' })
   async getBalanceForUserAdmin(
       @Param('userId') userId: string,
       @Param('meritSlug') meritSlug: string,
   ) {
       const wallet = await this.walletsService.getBalanceForUserAdmin(userId, meritSlug);
        if (!wallet) {
          throw new NotFoundException(`Wallet balance for merit ${meritSlug} not found for user ${userId}`);
      }
       return wallet;
   }

    // Update balance endpoint would typically be internal or admin-only
    // Keeping it internal for now.
} 