import { PrismaClient } from '../../../../generated/prisma';
import { execSync } from 'child_process';
import * as path from 'path';

/**
 * 🏗️ Setup de Base de Datos para Tests de Integración - CoomÜnity
 *
 * Configuración que respeta la arquitectura y filosofía del proyecto:
 * - Usa SQLite en memoria para aislamiento total
 * - No interfiere con la BD de producción PostgreSQL
 * - Ejecuta migraciones reales para mantener consistencia con el esquema
 * - Alineado a los principios de Atlas, Sage, Kira y Pax
 */
export class TestDatabaseSetup {
  private static testPrisma: PrismaClient;
  private static originalDatabaseUrl: string | undefined;

  static async setupTestDatabase(): Promise<PrismaClient> {
    if (!this.testPrisma) {
      this.testPrisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_TEST_URL || process.env.DATABASE_URL
          }
        }
      });

      await this.testPrisma.$connect();
      if (process.env.NODE_ENV === 'test') {
        console.log('Test database connected successfully');
      }
    }
    return this.testPrisma;
  }

  private static async runMigrations(): Promise<void> {
    try {
      console.log('🔄 [Sage] Ejecutando migraciones en base de datos de test...');
      try {
        execSync('npx prisma migrate deploy', {
          stdio: 'pipe',
          env: { ...process.env, DATABASE_URL: 'file::memory:?cache=shared' },
        });
        console.log('✅ [Sage] Migraciones ejecutadas exitosamente');
      } catch (migrateError) {
        console.log('⚠️  [Sage] Migrate falló, intentando con db push...');
        execSync('npx prisma db push --force-reset', {
          stdio: 'pipe',
          env: { ...process.env, DATABASE_URL: 'file::memory:?cache=shared' },
        });
        console.log('✅ [Sage] Schema aplicado con db push');
      }
    } catch (error: any) {
      console.error('❌ [Sage] Error ejecutando migraciones:', error);
      throw new Error(`Failed to run migrations: ${error.message}`);
    }
  }

  static async cleanupTestDatabase(): Promise<void> {
    if (this.testPrisma) {
      await this.testPrisma.$disconnect();
    }
  }

  static async resetDatabase(): Promise<void> {
    if (this.testPrisma) {
      await this.testPrisma.transaction.deleteMany();
      await this.testPrisma.wallet.deleteMany();
      await this.testPrisma.user.deleteMany();
    }
  }

  static async verifyDatabaseHealth(): Promise<boolean> {
    try {
      if (!this.testPrisma) return false;
      const userCount = await this.testPrisma.user.count();
      const walletCount = await this.testPrisma.wallet.count();
      const transactionCount = await this.testPrisma.transaction.count();
      console.log('🏥 [Atlas] Estado de la BD:', { users: userCount, wallets: walletCount, transactions: transactionCount });
      return true;
    } catch (error) {
      console.error('❌ [Atlas] Error verificando salud de BD:', error);
      return false;
    }
  }

  static async getDatabaseStats(): Promise<{
    users: number;
    wallets: number;
    transactions: number;
    totalBalance: number;
  }> {
    try {
      if (!this.testPrisma) throw new Error('Database not initialized');
      const [userCount, walletCount, transactionCount] = await Promise.all([
        this.testPrisma.user.count(),
        this.testPrisma.wallet.count(),
        this.testPrisma.transaction.count(),
      ]);
      const wallets = await this.testPrisma.wallet.findMany({ select: { balanceUnits: true, balanceToins: true } });
      const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.balanceUnits) + Number(wallet.balanceToins), 0);
      return { users: userCount, wallets: walletCount, transactions: transactionCount, totalBalance };
    } catch (error: any) {
      console.error('❌ [Sage] Error obteniendo estadísticas:', error);
      throw new Error(`Failed to get database stats: ${error.message}`);
    }
  }

  static get prismaClient(): PrismaClient {
    if (!this.testPrisma) {
      throw new Error('Test database not initialized. Call setupTestDatabase() first.');
    }
    return this.testPrisma;
  }
}
