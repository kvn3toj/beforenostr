import { TransactionCurrency } from '../../dto/send-transaction.dto';

export const TRANSACTION_FIXTURES = {
  valid: {
    basic: {
      fromWalletId: 'wallet-atlas',
      toWalletId: 'wallet-sage',
      amount: 100,
      description: 'Test transaction',
      currency: TransactionCurrency.UNITS
    }
  },
  error: {
    insufficientFunds: {
      fromWalletId: 'wallet-empty',
      toWalletId: 'wallet-sage',
      amount: 100,
      description: 'Insufficient funds',
      currency: TransactionCurrency.UNITS
    },
    nonExistentWallet: {
      fromWalletId: 'wallet-nonexistent',
      toWalletId: 'wallet-sage',
      amount: 50,
      description: 'Non-existent wallet',
      currency: TransactionCurrency.UNITS
    }
  }
};
