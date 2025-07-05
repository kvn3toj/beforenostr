import { Module } from '@nestjs/common';
import { MeritsService } from './merits/merits.service.js.js';
import { MeritsController } from './merits/merits.controller.js.js';
import { TransactionsService } from './transactions/transactions.service.js.js';
import { TransactionsController } from './transactions/transactions.controller.js.js';
import { WalletsService } from './wallets/wallets.service.js.js';
import { WalletsController } from './wallets/wallets.controller.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js'; // Assuming PrismaModule is in ../prisma
import { AuthModule } from '../auth/auth.module.js.js'; // Assuming AuthModule is in ../auth
import { RbacModule } from '@/rbac/rbac.module'; // Assuming RbacModule is in ../rbac

@Module({
  imports: [PrismaModule, AuthModule, RbacModule], // Import necessary modules
  controllers: [MeritsController, TransactionsController, WalletsController],
  providers: [MeritsService, TransactionsService, WalletsService],
  exports: [MeritsService, TransactionsService, WalletsService], // Export services that might be used by other modules
})
export class MeritsAndWalletModule {}
