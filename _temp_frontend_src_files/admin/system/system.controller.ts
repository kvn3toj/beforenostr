import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { SystemService } from './system.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Adjust path
import { RolesGuard } from '../../rbac/guards/roles.guard'; // Adjust path
import { Roles } from '../../rbac/decorators/roles.decorator'; // Adjust path
import { AuthenticatedUser } from '../../../types/auth.types'; // Adjust path

@ApiTags('admin/system')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get system status (Admin only)' })
  @ApiResponse({ status: 200, description: 'System status metrics.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  getSystemStatus() {
    return this.systemService.getSystemStatus();
  }

  @Post('backup/initiate')
  @ApiOperation({ summary: 'Initiate a database backup (Admin only)' })
  @ApiResponse({ status: 200, description: 'Backup initiation command proposed.' })
  @ApiResponse({ status: 500, description: 'Backup initiation failed.' })
   @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  async initiateBackup(@Req() req: any) {
    // Assuming req.user is populated by JwtAuthGuard with the AuthenticatedUser object
    const user = req.user as AuthenticatedUser;
    return this.systemService.initiateBackup(user);
  }

   // Endpoint for getting latest backup logs can be added here, potentially calling AuditLogsService
   // For now, you can get backup logs by filtering the general audit logs endpoint.

} 