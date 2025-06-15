// 🎯 Tipos para la respuesta del backend /wallets/me
export interface BackendWalletResponse {
  id: string;
  userId: string;
  blockchainAddress: string;
  balanceUnits: number;
  balanceToins: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  transactionsTo: BackendTransaction[];
  transactionsFrom: BackendTransaction[];
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
  };
}

export interface BackendTransaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  tokenType: 'CIRCULATING_UNIT' | 'TOIN';
  type: 'PAY' | 'TRANSFER' | 'REWARD' | 'EXCHANGE';
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
  description: string;
  createdAt: string;
  fromUser?: {
    id: string;
    email: string;
    name: string;
    username: string;
  };
  toUser?: {
    id: string;
    email: string;
    name: string;
    username: string;
  };
}

// 🎯 Tipos para la interfaz de la SuperApp (adaptados)
export interface WalletData {
  balance: number;
  currency: string;
  ucoins: number;
  meritos: number;
  ondas: number;
  pendingBalance: number;
  monthlyChange: number;
  ayniLevel: number;
  collaborationScore: number;
  communityRank: string;
  accounts: WalletAccount[];
  recentTransactions: Transaction[];
  paymentMethods: PaymentMethod[];
}

export interface WalletAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'crypto';
  balance: number;
  currency: string;
  primary: boolean;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'exchange' | 'reward' | 'ayni';
  amount: number;
  currency: 'COP' | 'UC' | 'MERITOS' | 'ONDAS';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  from?: string;
  to?: string;
  ayniScore?: number;
  bienComunContribution?: boolean;
  category?: string;
  metadata?: {
    exchangeRate?: number;
    originalAmount?: number;
    originalCurrency?: string;
    fees?: number;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit' | 'debit' | 'digital';
  lastFour: string;
  primary: boolean;
}

// 🔄 Función para mapear la respuesta del backend a la interfaz de la SuperApp
export const mapBackendWalletToWalletData = (backendWallet: BackendWalletResponse): WalletData => {
  // Combinar transacciones de entrada y salida
  const allTransactions = [
    ...backendWallet.transactionsTo,
    ...backendWallet.transactionsFrom
  ];

  // Mapear transacciones del backend al formato de la SuperApp
  const mappedTransactions: Transaction[] = allTransactions.map(tx => ({
    id: tx.id,
    type: tx.fromUserId === backendWallet.userId ? 'expense' : 'income',
    amount: tx.amount,
    currency: tx.tokenType === 'CIRCULATING_UNIT' ? 'UC' : 'ONDAS',
    description: tx.description,
    date: tx.createdAt,
    status: tx.status.toLowerCase() as Transaction['status'],
    from: tx.fromUser?.name || tx.fromUserId,
    to: tx.toUser?.name || tx.toUserId,
    ayniScore: Math.floor(Math.random() * 10) + 1, // Simulado por ahora
    bienComunContribution: tx.type === 'REWARD',
    category: tx.type.toLowerCase(),
  }));

  // Crear cuentas basadas en los balances del backend
  const accounts: WalletAccount[] = [
    {
      id: 'principal',
      name: 'Cuenta Principal CoomÜnity',
      type: 'checking',
      balance: backendWallet.balanceUnits,
      currency: 'UC',
      primary: true,
    },
    {
      id: 'toins',
      name: 'Töins Wallet',
      type: 'crypto',
      balance: backendWallet.balanceToins,
      currency: 'ONDAS',
      primary: false,
    },
  ];

  return {
    balance: backendWallet.balanceUnits,
    currency: 'UC',
    ucoins: backendWallet.balanceUnits,
    meritos: Math.floor(backendWallet.balanceUnits * 0.1), // Simulado
    ondas: backendWallet.balanceToins,
    pendingBalance: 0, // Por ahora no hay datos de balance pendiente
    monthlyChange: Math.random() * 20 - 10, // Simulado
    ayniLevel: Math.floor((backendWallet.balanceUnits / 100) * 10), // Basado en balance
    collaborationScore: Math.random() * 10, // Simulado
    communityRank: `#${Math.floor(Math.random() * 10000) + 1}`, // Simulado
    accounts,
    recentTransactions: mappedTransactions.slice(0, 5), // Solo las 5 más recientes
    paymentMethods: [
      {
        id: '1',
        name: 'CoomÜnity Card',
        type: 'credit',
        lastFour: '4721',
        primary: true,
      },
    ],
  };
}; 