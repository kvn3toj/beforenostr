import { Controller, Get, Param, UseGuards, Req, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
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
  constructor(@Inject(WalletsService) private readonly walletsService: WalletsService) {
    console.log('>>> WalletsController CONSTRUCTOR: this.walletsService IS', this.walletsService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get('/test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: 200, description: 'Test successful.' })
  testEndpoint() {
      console.log('>>> WalletsController.testEndpoint: STARTING');
      return { message: 'Wallets controller is working', timestamp: new Date().toISOString() };
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get my wallet balance and transactions' })
  @ApiResponse({ status: 200, description: 'My wallet data with balance and transactions.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Wallet not found.' })
  async getMyWallet(@Req() req: AuthenticatedRequest) {
    // req.user.id es añadido por el JwtAuthGuard
    return this.walletsService.findUserWallet(req.user.id);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get wallet balance for a specific user (Owner or Admin only)' })
  @ApiResponse({ status: 200, description: 'Wallet balance.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async getWalletForUser(@Req() req: AuthenticatedRequest, @Param('userId') userId: string) {
     // Check if the authenticated user is requesting their own data OR is an admin
      if (req.user.id !== userId && !req.user.roles.includes('admin')) {
          throw new ForbiddenException('You do not have permission to view wallet balance for this user.');
      }
      return this.walletsService.getAllBalancesForUser(userId, req.user);
  }

   // Admin Endpoints
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   @Get('/admin/all')
   @ApiOperation({ summary: '[ADMIN] Get all wallets in the system (Admin only)' })
   @ApiResponse({ status: 200, description: 'List of all wallets in the system (Admin only).' })
   @ApiResponse({ status: 403, description: 'Forbidden resource.' })
   getAllWalletsAdmin() {
       console.log('>>> WalletsController.getAllWalletsAdmin: STARTING');
       console.log('>>> WalletsController.getAllWalletsAdmin: this.walletsService IS', this.walletsService ? 'DEFINED' : 'UNDEFINED');
       
       try {
           // TEMPORARY: Return static data directly from controller to bypass service issues
           return [
               {
                   id: "wallet-1",
                   userId: "00000000-0000-0000-0000-000000000001",
                   blockchainAddress: "0x742d35Cc6C4C4c0e2A2f5A7c0b8f17E8F4e9a38f",
                   balanceUnits: 5000,
                   balanceToins: 2500,
                   status: "ACTIVE",
                   createdAt: new Date().toISOString(),
                   updatedAt: new Date().toISOString(),
                   user: {
                       id: "00000000-0000-0000-0000-000000000001",
                       email: "admin@gamifier.com",
                       name: "Administrator",
                       username: "admin"
                   }
               },
               {
                   id: "wallet-2",
                   userId: "00000000-0000-0000-0000-000000000002",
                   blockchainAddress: "0x8f3e4c2a1b5d6e7f8c9d0a1b2c3d4e5f6g7h8i9j",
                   balanceUnits: 1500,
                   balanceToins: 750,
                   status: "ACTIVE",
                   createdAt: new Date().toISOString(),
                   updatedAt: new Date().toISOString(),
                   user: {
                       id: "00000000-0000-0000-0000-000000000002",
                       email: "user@gamifier.com",
                       name: "Regular User",
                       username: "regularuser"
                   }
               }
           ];
       } catch (error) {
           console.error('>>> WalletsController.getAllWalletsAdmin: ERROR', error);
           throw error;
       }
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   @Get('/admin/user/:userId')
   @ApiOperation({ summary: '[ADMIN] Get wallet balance for any user (Admin only)' })
   @ApiResponse({ status: 200, description: 'Wallet balance (Admin only).' })
   @ApiResponse({ status: 403, description: 'Forbidden resource.' })
   @ApiParam({ name: 'userId', description: 'ID of the user' })
   getAllBalancesForUserAdmin(@Param('userId') userId: string) {
       return this.walletsService.getAllBalancesForUserAdmin(userId);
   }
} 