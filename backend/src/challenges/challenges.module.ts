import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service.js.js';
import { ChallengesController } from './challenges.controller.js.js';
import { UserChallengesService } from './user-challenges/user-challenges.service.js.js';
import { UserChallengesController } from './user-challenges/user-challenges.controller.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js'; // Assuming PrismaModule is available
import { MeritsAndWalletModule } from '../merits-and-wallet/merits-and-wallet.module.js.js';
import { AdminModule } from '../admin/admin.module.js.js'; // Import AdminModule for AuditLogsService

@Module({
  imports: [PrismaModule, MeritsAndWalletModule, AdminModule], // Import AdminModule
  controllers: [ChallengesController, UserChallengesController],
  providers: [ChallengesService, UserChallengesService],
  exports: [ChallengesService, UserChallengesService], // Export services if needed elsewhere
})
export class ChallengesModule {}
