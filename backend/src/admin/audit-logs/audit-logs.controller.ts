import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service.js.js';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js.js'; // Temporarily commented
// import { RolesGuard } from '@/rbac/guards/roles.guard'; // Temporarily commented
// import { Roles } from '@/rbac/decorators/roles.decorator'; // Temporarily commented
import { GetAuditLogsDto } from './dto/get-audit-logs.dto.js.js';

@ApiTags('admin/audit-logs')
// @ApiBearerAuth() // Temporarily commented
// @UseGuards(JwtAuthGuard, RolesGuard) // Temporarily commented
// @Roles('admin') // Temporarily commented
@Controller('admin/audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit logs (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of audit logs.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'actionType', required: false, type: String })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'ISO 8601 date string',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'ISO 8601 date string',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() filterDto: GetAuditLogsDto) {
    return this.auditLogsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific audit log by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Audit log details.' })
  @ApiResponse({ status: 404, description: 'Audit log not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  findOne(@Param('id') id: string) {
    return this.auditLogsService.findOne(id);
  }
}
