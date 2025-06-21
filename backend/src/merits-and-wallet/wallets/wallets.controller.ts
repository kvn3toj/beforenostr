import { Controller, Get, Param, UseGuards, Req, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';
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
  constructor(@Inject(WalletsService) private readonly walletsService: WalletsService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get all wallet balances for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of wallet balances for the authenticated user.' })
  async getMyWalletBalances(@Req() req: AuthenticatedRequest) {
    return this.walletsService.getAllBalancesForUser(req.user.id, req.user);
  }

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

  @Get('/user/:userId/wallet')
  @ApiOperation({ summary: 'Get wallet details for a specific user (Owner or Admin only)' })
  @ApiResponse({ status: 200, description: 'Wallet details for the user.' })
  @ApiResponse({ status: 404, description: 'Wallet not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async getWalletForUser(
    @Req() req: AuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
      // Check if the authenticated user is requesting their own data OR is an admin
      if (req.user.id !== userId && !req.user.roles.includes('admin')) {
          throw new ForbiddenException('You do not have permission to view this wallet.');
      }
      const wallet = await this.walletsService.getWalletForUser(userId, req.user);
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
   @Get('/admin/user/:userId/wallet')
   @ApiOperation({ summary: '[ADMIN] Get wallet details for any user (Admin only)' })
   @ApiResponse({ status: 200, description: 'Wallet details (Admin only).' })
   @ApiResponse({ status: 404, description: 'Wallet not found.' })
   @ApiResponse({ status: 403, description: 'Forbidden resource.' })
   @ApiParam({ name: 'userId', description: 'ID of the user' })
   async getWalletForUserAdmin(
       @Param('userId') userId: string,
   ) {
       const wallet = await this.walletsService.getWalletForUserAdmin(userId);
       return wallet;
   }

    // Update balance endpoint would typically be internal or admin-only
    // Keeping it internal for now.
} 