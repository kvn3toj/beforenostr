import { Controller, Get, UseGuards, Post, Req } from '@nestjs/common';
import { SystemService } from './system.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../rbac/guards/roles.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';
import { AuthenticatedUser } from '../../types/auth.types';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@ApiTags('admin/system')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get system status (Admin only)' })
  @ApiResponse({ status: 200, description: 'System status information.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  getSystemStatus() {
    return this.systemService.getSystemStatus();
  }

  @Post('backup')
  @ApiOperation({ summary: 'Initiate system backup (Admin only)' })
  @ApiResponse({ status: 200, description: 'Backup initiation logged.' })
  @ApiResponse({ status: 500, description: 'Backup initiation failed.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  async initiateBackup(@Req() req: AuthenticatedRequest) {
    return this.systemService.initiateBackup(req.user);
  }

  // Endpoint for getting latest backup logs can be added here, potentially calling AuditLogsService
  // For now, you can get backup logs by filtering the general audit logs endpoint.
}
