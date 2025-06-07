import { Module } from '@nestjs/common';
import { MeritsService } from './merits/merits.service';
import { MeritsController } from './merits/merits.controller';
// import { TransactionsService } from './transactions/transactions.service'; // TEMPORAL - COMMENTED TO FIX 500 ERROR
// import { TransactionsController } from './transactions/transactions.controller'; // TEMPORAL - COMMENTED TO FIX 500 ERROR
import { WalletsService } from './wallets/wallets.service';
import { WalletsController } from './wallets/wallets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [PrismaModule, AuthModule, RbacModule],
  controllers: [MeritsController, /* TransactionsController, */ WalletsController], // TEMPORAL - COMMENTED TO FIX 500 ERROR
  providers: [MeritsService, /* TransactionsService, */ WalletsService], // TEMPORAL - COMMENTED TO FIX 500 ERROR
  exports: [MeritsService, /* TransactionsService, */ WalletsService], // TEMPORAL - COMMENTED TO FIX 500 ERROR
})
export class MeritsAndWalletModule {
  constructor() {
    console.log('>>> MeritsAndWalletModule CONSTRUCTOR: Initializing merits and wallet system with Auth/RBAC...');
  }
} 