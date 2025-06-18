// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private isMockMode = true; // 🚨 TEMPORAL: Modo mock para testing sin DB

  constructor() {
    super();
    console.log('>>> PrismaService Constructor Executed (MOCK MODE)');
    console.log('>>> PrismaService Constructor - MOCK_MODE:', this.isMockMode);
  }

  async onModuleInit() {
    if (this.isMockMode) {
      console.log('>>> PrismaService onModuleInit - MOCK MODE: Skipping database connection');
      console.log('>>> PrismaService onModuleInit - Backend will use mock data');
      return;
    }
    
    console.log('>>> PrismaService onModuleInit - Connecting to database...');
    try {
      await this.$connect();
      console.log('>>> PrismaService onModuleInit - Database connection established');
    } catch (error) {
      console.error('>>> PrismaService onModuleInit - Database connection failed:', error.message);
      console.log('>>> PrismaService onModuleInit - Falling back to MOCK MODE');
      this.isMockMode = true;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    // Note: beforeExit event is not available in the current Prisma version
    // This method is kept for compatibility but doesn't do anything
    // The connection will be closed when the app shuts down
  }
} 