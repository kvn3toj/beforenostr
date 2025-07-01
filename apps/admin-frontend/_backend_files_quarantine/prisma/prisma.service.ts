// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    console.log('>>> PrismaService Constructor Executed');
    console.log('>>> PrismaService Constructor - this.user available:', !!this.user);
    console.log('>>> PrismaService Constructor - available models:', Object.keys(this).filter(key => typeof this[key] === 'object' && this[key] !== null));
  }

  async onModuleInit() {
    console.log('>>> PrismaService onModuleInit - Connecting to database...');
    await this.$connect();
    console.log('>>> PrismaService onModuleInit - Database connection established');
  }

  async enableShutdownHooks(app: INestApplication) {
    // Note: beforeExit event is not available in the current Prisma version
    // This method is kept for compatibility but doesn't do anything
    // The connection will be closed when the app shuts down
  }
} 