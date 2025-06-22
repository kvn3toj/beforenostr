import { Module } from '@nestjs/common';
import { MeritsService } from './merits/merits.service';
import { MeritsController } from './merits/merits.controller';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionsController } from './transactions/transactions.controller';
import { WalletsService } from './wallets/wallets.service';
import { WalletsController } from './wallets/wallets.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Assuming PrismaModule is in ../prisma
import { AuthModule } from '../auth/auth.module'; // Assuming AuthModule is in ../auth
import { RbacModule } from '@/rbac/rbac.module'; // Assuming RbacModule is in ../rbac

@Module({
  imports: [PrismaModule, AuthModule, RbacModule], // Import necessary modules
  controllers: [MeritsController, TransactionsController, WalletsController],
  providers: [MeritsService, TransactionsService, WalletsService],
  exports: [MeritsService, TransactionsService, WalletsService], // Export services that might be used by other modules
})
export class MeritsAndWalletModule {}
