import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { UserChallengesService } from './user-challenges/user-challenges.service';
import { UserChallengesController } from './user-challenges/user-challenges.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Assuming PrismaModule is available
import { TransactionsService } from '../merits-and-wallet/transactions/transactions.service'; // Adjust path as necessary
import { MeritsAndWalletModule } from '../merits-and-wallet/merits-and-wallet.module';

@Module({
  imports: [PrismaModule, MeritsAndWalletModule], // Import necessary modules
  controllers: [ChallengesController, UserChallengesController],
  providers: [ChallengesService, UserChallengesService],
  exports: [ChallengesService, UserChallengesService], // Export services if needed elsewhere
})
export class ChallengesModule {} 