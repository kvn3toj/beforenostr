import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesTestService } from './challenges-test.service';
import { ChallengesController } from './challenges.controller';
// import { UserChallengesService } from './user-challenges/user-challenges.service';
// import { UserChallengesController } from './user-challenges/user-challenges.controller';
// import { PrismaModule } from '../prisma/prisma.module'; // Assuming PrismaModule is available
// import { TransactionsService } from '../merits-and-wallet/transactions/transactions.service'; // Adjust path as necessary
// import { MeritsAndWalletModule } from '../merits-and-wallet/merits-and-wallet.module';
// import { AdminModule } from '../admin/admin.module'; // For AuditLogsService

@Module({
  imports: [], // Remove all imports to isolate the issue
  controllers: [ChallengesController], // Only keep ChallengesController
  providers: [ChallengesTestService, ChallengesService], // Add test service first
  exports: [ChallengesTestService, ChallengesService], // Export both
})
export class ChallengesModule {
  constructor() {
    console.log('[ChallengesModule] Module initialized');
  }
} 