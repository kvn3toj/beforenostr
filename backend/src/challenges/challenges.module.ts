import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { UserChallengesService } from './user-challenges/user-challenges.service';
import { UserChallengesController } from './user-challenges/user-challenges.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Assuming PrismaModule is available
import { MeritsAndWalletModule } from '../merits-and-wallet/merits-and-wallet.module';
import { AdminModule } from '../admin/admin.module'; // Import AdminModule for AuditLogsService

@Module({
  imports: [PrismaModule, MeritsAndWalletModule, AdminModule], // Import AdminModule
  controllers: [ChallengesController, UserChallengesController],
  providers: [ChallengesService, UserChallengesService],
  exports: [ChallengesService, UserChallengesService], // Export services if needed elsewhere
})
export class ChallengesModule {}
