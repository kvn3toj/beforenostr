import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuthenticatedUser } from '../../types/auth.types';

const execAsync = promisify(exec);

@Injectable()
export class SystemService {
  constructor(
    private prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService
  ) {}

  async getSystemStatus() {
    let dbStatus = 'Unknown'; // Initialize dbStatus
    try {
      // Check DB connection by executing a simple query
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'Connected';
    } catch (error) {
      dbStatus = 'Disconnected';
      console.error('Database connection check failed:', error);
    }

    // Use os and process for metrics
    const osUptime = os.uptime(); // System uptime
    const processUptime = process.uptime(); // Node.js process uptime

    const totalMemory = os.totalmem(); // Total system memory
    const freeMemory = os.freemem(); // Free system memory
    const usedMemory = totalMemory - freeMemory; // Calculated used memory
    const processMemory = process.memoryUsage(); // Node.js process memory usage

    const cpuLoad = os.loadavg(); // [1m, 5m, 15m average]

    return {
      status: dbStatus === 'Connected' ? 'Operational' : 'Degraded', // Overall status based on DB connection
      database: {
        status: dbStatus,
      },
      system: {
        osUptime: this.formatUptime(osUptime),
        processUptime: this.formatUptime(processUptime),
        memory: {
          total: this.formatBytes(totalMemory),
          free: this.formatBytes(freeMemory),
          used: this.formatBytes(usedMemory),
          processUsage: processMemory, // Provide detailed process memory usage
        },
        cpuLoad,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async initiateBackup(user: AuthenticatedUser) {
    // Option A (Simulation): Log the intent to back up.
    // The actual backup process is assumed to run externally or by a separate worker.
    // WARNING: This is a simulation for demonstration purposes. A production system
    // requires a secure and robust backup mechanism, likely involving separate
    // processes, dedicated services, or managed cloud solutions.

    console.log(`User ${user.id} initiated a simulated backup.`);

    // Log the backup initiation action
    await this.auditLogsService.createLog({
      userId: user.id,
      actionType: 'system:initiate_backup', // Correct action type
      entityType: 'System',
      entityId: 'backup', // Identifier for the system backup entity
      newValue: { message: 'Simulated backup initiated' }, // Log details of the action
      // You might add more context here, like requested type of backup (e.g., 'db')
    });

    // Simulate a delay or asynchronous process start if desired, but for now just return success.
    return {
      status: 'Backup initiation logged and simulated.',
      userId: user.id,
    };
  }

  private formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  private formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EZ', 'ZT', 'YT'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
