import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';
import { Request } from 'express';
import { SendTransactionDto, TransactionResponseDto, TransactionStatsDto } from './dto/send-transaction.dto';

// Define a basic type for the authenticated user
interface AuthenticatedRequest extends Request {
  user: { id: string; roles: string[] /* other user properties */ };
}

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/user/:userId')
  @ApiOperation({
    summary: 'Get all transactions for a specific user (Owner or Admin only)',
  })
  @ApiResponse({ status: 200, description: 'List of transactions.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  // Apply RolesGuard conditionally based on the requested userId
  // Note: Conditional guards are complex in NestJS decorators. A common pattern is to check inside the method.
  // Alternatively, use separate admin routes or a custom guard.
  async findAllForUser(
    @Req() req: AuthenticatedRequest,
    @Param('userId') userId: string
  ) {
    // Check if the authenticated user is requesting their own data OR is an admin
    if (req.user.id !== userId && !req.user.roles.includes('admin')) {
      throw new ForbiddenException(
        'You do not have permission to view transactions for this user.'
      );
    }
    const transactions = await this.transactionsService.findAllForUser(userId);
    if (!transactions || transactions.length === 0) {
      // Consider if this should be NotFound or just return []
      // throw new NotFoundException(`No transactions found for user ${userId}`);
      return []; // Return empty array if no transactions
    }
    return transactions;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific transaction by ID (Owner or Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Transaction details.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'id', description: 'ID of the transaction' })
  async findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    // Ownership check is handled within the service method now
    const transaction = await this.transactionsService.findTransaction(
      id,
      req.user
    );
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  // Admin Endpoints (Optional - can use existing with in-method checks or add dedicated routes)
  // Example: Dedicated admin route to get any transaction by ID without ownership check
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/:id')
  @ApiOperation({ summary: '[ADMIN] Get any transaction by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details (Admin only).',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'id', description: 'ID of the transaction' })
  findOneAdmin(@Param('id') id: string) {
    return this.transactionsService.findTransactionAdmin(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/all')
  @ApiOperation({ summary: '[ADMIN] Get all transactions (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all transactions (Admin only).',
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  findAllAdmin() {
    return this.transactionsService.findAllTransactionsAdmin();
  }

  @Post('/send')
  @ApiOperation({
    summary: 'Send Ünits or Mëritos to another user',
    description:
      'Creates a transaction between the authenticated user and a recipient, ensuring Reciprocity and atomic balance updates.',
  })
  @ApiBody({ type: SendTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient balance.' })
  @ApiResponse({ status: 404, description: 'Recipient or sender not found.' })
  async sendTransaction(
    @Req() req: AuthenticatedRequest,
    @Body() sendTransactionDto: SendTransactionDto
  ) {
    // El senderId se obtiene del usuario autenticado a través del token JWT
    const senderId = req.user.id;
    const tx = await this.transactionsService.sendTransaction(
      senderId,
      sendTransactionDto
    );
    // Deserializar metadata si es string
    return {
      ...tx,
      metadata: tx.metadata && typeof tx.metadata === 'string' ? JSON.parse(tx.metadata) : tx.metadata,
    };
  }

  @Get('/user/:userId/stats')
  @ApiOperation({
    summary: 'Get transaction statistics for a user (Owner or Admin only)',
    description: 'Retorna estadísticas detalladas de las transacciones del usuario, proporcionando insights sobre su participación en el ecosistema CoomÜnity.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de transacciones del usuario.',
    type: TransactionStatsDto
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  async getUserTransactionStats(
    @Req() req: AuthenticatedRequest,
    @Param('userId') userId: string
  ): Promise<TransactionStatsDto> {
    if (req.user.id !== userId && !req.user.roles.includes('admin')) {
      throw new ForbiddenException(
        'You do not have permission to view transaction stats for this user.'
      );
    }
    return this.transactionsService.getUserTransactionStats(userId);
  }

  // Create transaction endpoint would typically be internal or triggered by other modules (e.g., challenges)
  // Keeping it simple for now, but if exposed, it would need appropriate guards/permissions.
}
