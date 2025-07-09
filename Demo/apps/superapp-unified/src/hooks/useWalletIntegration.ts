import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, walletAPI } from '../lib/api-service';
import { useAuth } from '../contexts/AuthContext';
import { 
  BackendWalletResponse, 
  WalletData, 
  WalletAccount,
  Transaction,
  PaymentMethod,
  mapBackendWalletToWalletData 
} from '../types/wallet';

// 🎯 Tipos específicos para operaciones del wallet
export interface CreateTransactionData {
  toUserId: string;
  amount: number;
  currency: 'COP' | 'UC' | 'MERITOS' | 'ONDAS';
  description: string;
  type: 'transfer' | 'payment' | 'reward' | 'reciprocidad';
}

export interface ExchangeData {
  fromCurrency: 'COP' | 'UC' | 'MERITOS' | 'ONDAS';
  toCurrency: 'COP' | 'UC' | 'MERITOS' | 'ONDAS';
  amount: number;
}

// 🔑 Claves de query para React Query
const queryKeys = {
  walletData: (userId: string) => ['wallet', 'data', userId],
  walletTransactions: (userId: string) => ['wallet', 'transactions', userId],
  walletHistory: (userId: string, filters: any) => [
    'wallet',
    'history',
    userId,
    filters,
  ],
  exchangeRates: () => ['wallet', 'exchange-rates'],
  paymentMethods: (userId: string) => ['wallet', 'payment-methods', userId],
};

// 💰 Hook principal para datos del wallet
export const useWalletData = (enabled: boolean = true) => {
  const { user } = useAuth();

  const { user } = useAuth(); // user object from useAuth already contains id, email etc.

  // This hook should ideally return the UI-specific WalletData type.
  // The API call will return BackendWalletResponse or similar.
  // We'll use the `select` option to transform the data.
  return useQuery<BackendWalletResponse, Error, WalletData>({
    queryKey: queryKeys.walletData(user?.id!), // Ensure user.id is available or query is disabled
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is required to fetch wallet data.');
      }
      // Assuming walletAPI.getWallet() calls '/wallets/me' and returns BackendWalletResponse
      // The actual endpoint used by walletAPI.getWallet() is '/wallet/me' (singular)
      // Let's assume it returns BackendWalletResponse from 'types/wallet.ts'
      const backendResponse = await walletAPI.getWallet(); // This should implicitly use user's token
      return backendResponse; // This is of type BackendWalletResponse
    },
    enabled: enabled && !!user?.id, // Query is enabled only if userId exists and enabled prop is true
    staleTime: 1000 * 60 * 5, // 5 minutos
    select: (data: BackendWalletResponse): WalletData => {
      // Use the existing mapping function if it aligns, or create a new one.
      // mapBackendWalletToWalletData is available from '../types/wallet'
      return mapBackendWalletToWalletData(data);
    },
  });
};

// 📊 Hook para historial de transacciones con fallback inteligente
export const useWalletTransactions = (
  filters: {
    type?: string;
    status?: string;
    currency?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}
) => {
  const { user } = useAuth();

  // This hook should return Transaction[] (UI type)
  // fetchMyTransactions from transaction.service.ts returns TransactionModel[] (domain type)
  return useQuery<TransactionModel[], Error, Transaction[]>({
    queryKey: queryKeys.walletTransactions(user?.id!), // Using a simplified key for now
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is required to fetch transactions.');
      }
      // Assuming transaction.service.ts is updated to use apiService and TransactionModel
      // We need to import fetchMyTransactions from the correct service.
      // It was previously in src/services/transaction.service.ts
      // This hook is in src/hooks/useWalletIntegration.ts
      // Path: ../services/transaction.service
      // This part assumes the backend endpoint for transactions exists and works.
      // If not, the mock logic would be hit if EnvironmentHelpers.isMockEnabled('WALLET_TRANSACTIONS') was true
      // and transaction.service.ts implemented it.
      // For now, let's assume we want to call the real service.
      // The original mock was because "endpoint not implemented". If it IS implemented, call it.
      // If not, this will fail, and React Query's error state will be active.
      // This is preferable to returning mocks from within a hook trying to fetch real data.
      // The decision to mock should be at the service layer based on EnvironmentHelpers.

      // Forcing a mock here if endpoint is known to be missing, for demonstration of structure
      // In a real scenario, this would be a call to:
      // import { fetchMyTransactions } from '../services/transaction.service';
      // return fetchMyTransactions(user.id);
      
      // If transaction.service.ts itself handles mocking:
      // return fetchMyTransactions(user.id);

      // Simulating that the endpoint is still not ready, but the hook structure is prepared
      console.warn('🚧 Transactions endpoint not yet implemented in backend or service not fully integrated. Using mock data for useWalletTransactions.');
      const mockDomainTransactions: TransactionModel[] = generateMockDomainTransactions(user.id);
      return mockDomainTransactions;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 1, // 1 minute
    select: (data: TransactionModel[]): Transaction[] => {
      // Map TransactionModel[] to Transaction[] (UI type)
      return data.map(tm => ({
        id: tm.id,
        type: mapDomainTransactionTypeToUIType(tm.type, user?.id, tm.fromUserId, tm.toUserId),
        amount: tm.amount,
        // TODO: Need a robust way to get currency symbol/code from meritSlug/meritId
        currency: tm.meritSlug.toUpperCase() as Transaction['currency'],
        description: tm.description || 'N/A',
        date: tm.completedAt || tm.initiatedAt,
        status: mapDomainTransactionStatusToUIStatus(tm.status),
        from: tm.fromUserId, // Placeholder, ideally map to user name
        to: tm.toUserId,     // Placeholder, ideally map to user name
        category: tm.category,
        metadata: tm.metadata,
        // Fields like reciprocidadScore, bienComunContribution are not in TransactionModel
        // They would need to be added or handled differently.
      }));
    }
  });
};

// Helper para generar mocks de TransactionModel
const generateMockDomainTransactions = (userId: string): TransactionModel[] => {
  const types: TransactionModel['type'][] = ['TRANSFER', 'EARN', 'SPEND', 'REWARD', 'DEPOSIT', 'WITHDRAWAL'];
  const statuses: TransactionModel['status'][] = ['COMPLETED', 'PENDING', 'FAILED', 'PROCESSING', 'CANCELLED'];
  const meritSlugs = ['ondas', 'meritos', 'units'];

  return Array.from({ length: 10 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const meritSlug = meritSlugs[Math.floor(Math.random() * meritSlugs.length)];
    const amount = Math.floor(Math.random() * 1000) + 10;
    const now = Date.now();
    const initiatedAt = new Date(now - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(); // Randomly in last 30 days

    let fromUserId: string | undefined = undefined;
    let toUserId: string | undefined = undefined;
    let actualAmount = amount;

    if (type === 'TRANSFER' || type === 'SPEND' || type === 'WITHDRAWAL' || type === 'EXCHANGE_OUT') {
      fromUserId = userId;
      toUserId = `user-mock-${Math.floor(Math.random() * 100)}`;
      actualAmount = -amount; // Expenses are often negative
    } else if (type === 'EARN' || type === 'REWARD' || type === 'DEPOSIT' || type === 'EXCHANGE_IN') {
      fromUserId = `system-mock-${Math.floor(Math.random() * 10)}`;
      toUserId = userId;
    }

    return {
      id: `mock-domain-tx-${Date.now()}-${i + 1}`,
      userId: userId,
      meritId: `merit-${meritSlug}`,
      meritSlug: meritSlug,
      amount: actualAmount,
      type: type,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: `Mock transaction ${i + 1} for ${type} of ${meritSlug}`,
      initiatedAt: initiatedAt,
      completedAt: statuses.includes('COMPLETED') ? new Date(new Date(initiatedAt).getTime() + Math.random() * 1000 * 60 * 60).toISOString() : undefined,
      updatedAt: new Date().toISOString(),
      fromUserId,
      toUserId,
      sourceSystem: 'MOCK_SYSTEM'
    };
  });
};

// Helper para mapear tipo de transacción de dominio a UI
const mapDomainTransactionTypeToUIType = (
  domainType: TransactionModel['type'],
  currentUserId?: string,
  fromUserId?: string,
  toUserId?: string
): Transaction['type'] => {
  switch (domainType) {
    case 'TRANSFER':
      return currentUserId === fromUserId ? 'expense' : (currentUserId === toUserId ? 'income' : 'transfer');
    case 'SPEND':
    case 'WITHDRAWAL':
    case 'FEE':
    case 'EXCHANGE_OUT':
      return 'expense';
    case 'DEPOSIT':
    case 'EARN':
    case 'REWARD':
    case 'EXCHANGE_IN':
    case 'REFUND':
      return 'income';
    default:
      return 'transfer'; // Fallback
  }
};

// Helper para mapear estado de transacción de dominio a UI
const mapDomainTransactionStatusToUIStatus = (
  domainStatus: TransactionModel['status']
): Transaction['status'] => {
  const mapping: Partial<Record<TransactionModel['status'], Transaction['status']>> = {
    COMPLETED: 'completed',
    PENDING: 'pending',
    FAILED: 'failed',
    PROCESSING: 'processing',
    CANCELLED: 'failed', // Mapping CANCELLED to 'failed' for UI simplicity, or add 'cancelled' to UI type
    REVERTED: 'failed',  // Mapping REVERTED to 'failed' for UI simplicity, or add 'reverted' to UI type
  };
  return mapping[domainStatus] || 'pending'; // Fallback
};


// 💸 Hook para crear nueva transacción
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // This mutation should ideally resolve with TransactionModel (domain type)
  return useMutation<TransactionModel, Error, CreateTransactionData>({
    mutationFn: async (data: CreateTransactionData): Promise<TransactionModel> => {
      // 🚧 Endpoint de creación de transacciones no implementado
      console.warn('🚧 Create transaction endpoint not yet implemented in backend. Simulating create transaction.');
      
      // 🎭 Simular creación exitosa, devolviendo algo que se asemeje a TransactionModel
      // CreateTransactionData: { toUserId, amount, currency (UI), description, type (UI) }
      // TransactionModel: { ..., meritId, meritSlug, type (Domain), status, initiatedAt, ... }

      // Simulate mapping UI currency to meritSlug for the "backend"
      const meritSlug = data.currency.toLowerCase(); // Simplified mapping

      const mockCreatedTransaction: TransactionModel = {
        id: `mock-tx-${Date.now()}`,
        userId: user?.id || 'unknown-user',
        fromUserId: user?.id,
        toUserId: data.toUserId,
        meritId: `merit-${meritSlug}`,
        meritSlug: meritSlug,
        amount: data.type === 'transfer' || data.type === 'payment' ? -Math.abs(data.amount) : Math.abs(data.amount), // Assuming expense for transfer/payment from current user
        type: data.type.toUpperCase() as TransactionModel['type'], // Map UI type to Domain type
        status: 'PENDING', // Simulate pending status initially
        description: data.description,
        initiatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sourceSystem: 'WALLET_APP_MOCK',
      };

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      // In a real scenario, this would be:
      // return transactionService.createTransaction(dto); // where dto is mapped from CreateTransactionData
      return mockCreatedTransaction;
    },
    onSuccess: (createdTransaction) => { // data here is TransactionModel
      console.log('Mock transaction created:', createdTransaction);
      // 🔄 Invalidar caché para refrescar datos
      queryClient.invalidateQueries({
        queryKey: queryKeys.walletData(user?.id!),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.walletTransactions(user?.id!),
      });
      // Optionally, update the cache directly with setQueryData if appropriate
    },
    onError: (error) => {
      console.error('Error creating mock transaction:', error.message);
      // Handle error (e.g., show notification)
    }
  });
};

// 💱 Hook para intercambio de monedas
export const useExchangeCurrency = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // TODO: Define a proper return type for exchange results, e.g., ExchangeResultModel or TransactionModel[]
  return useMutation<any, Error, ExchangeData>({
    mutationFn: async (data: ExchangeData): Promise<any> => {
      // 🚧 Endpoint de intercambio no implementado
      console.warn('🚧 Currency exchange endpoint not yet implemented in backend. Simulating exchange.');
      
      // 🎭 Simular intercambio exitoso
      const exchangeRate = getExchangeRate(
        data.fromCurrency,
        data.toCurrency
      );
      const mockExchangeResult = {
        id: `mock-exchange-${Date.now()}`,
        originalAmount: data.amount,
        originalCurrency: data.fromCurrency,
        convertedAmount: data.amount * exchangeRate,
        convertedCurrency: data.toCurrency,
        exchangeRate,
        status: 'COMPLETED', // Using a status similar to TransactionModel
        initiatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        // This could potentially generate two TransactionModel objects (debit and credit)
        // For now, returning a custom exchange result structure.
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real scenario, this would be:
      // return walletService.exchangeCurrency(dto);
      return mockExchangeResult;
    },
    onSuccess: (exchangeResult) => {
      console.log('Mock currency exchange successful:', exchangeResult);
      // 🔄 Refrescar datos del wallet y transacciones
      queryClient.invalidateQueries({
        queryKey: queryKeys.walletData(user?.id!),
      });
       queryClient.invalidateQueries({
        queryKey: queryKeys.walletTransactions(user?.id!),
      });
    },
    onError: (error) => {
      console.error('Error in mock currency exchange:', error.message);
    }
  });
};

// 💳 Hook para métodos de pago con fallback
export const usePaymentMethods = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.paymentMethods(user?.id || 'anonymous'),
    queryFn: async (): Promise<PaymentMethod[]> => {
      // 🚧 Endpoint de métodos de pago no implementado en el backend
      console.warn('🚧 Payment methods endpoint not yet implemented in backend. Using mock data.');
      
      // 🎭 Métodos de pago simulados
      return [
        {
          id: '1',
          name: 'CoomÜnity Card',
          type: 'credit',
          lastFour: '4721',
          primary: true,
        },
        {
          id: '2',
          name: 'Nequi',
          type: 'digital',
          lastFour: '8923',
          primary: false,
        },
        {
          id: '3',
          name: 'Bancolombia',
          type: 'debit',
          lastFour: '1234',
          primary: false,
        },
      ];
    },
    enabled: !!user?.id,
    staleTime: 300000, // 5 minutos
  });
};

// 🔄 Hook para tasas de cambio
export const useExchangeRates = () => {
  return useQuery({
    queryKey: queryKeys.exchangeRates(),
    queryFn: async () => {
      // 🚧 Endpoint de tasas de cambio no implementado
      console.warn('🚧 Exchange rates endpoint not yet implemented in backend. Using mock data.');
      
      // 🎭 Tasas de cambio simuladas para CoomÜnity
      return {
        COP_UC: 0.002, // 1 COP = 0.002 UC
        UC_COP: 500, // 1 UC = 500 COP
        COP_MERITOS: 0.001, // 1 COP = 0.001 MERITOS
        MERITOS_COP: 1000, // 1 MÉRITO = 1000 COP
        UC_MERITOS: 0.5, // 1 UC = 0.5 MERITOS
        MERITOS_UC: 2, // 1 MÉRITO = 2 UC
        lastUpdated: new Date().toISOString(),
      };
    },
    staleTime: 300000, // 5 minutos
    refetchInterval: 600000, // Refrescar cada 10 minutos
  });
};

// 🔧 Funciones auxiliares para mapeo de datos

const mapBackendTransactionType = (
  backendType: string
): Transaction['type'] => {
  const mapping: Record<string, Transaction['type']> = {
    PAY: 'transfer',
    AWARD: 'reward',
    EXCHANGE: 'exchange',
    TRANSFER: 'transfer',
  };
  return mapping[backendType] || 'transfer';
};

const mapBackendCurrency = (
  backendCurrency: string
): Transaction['currency'] => {
  const mapping: Record<string, Transaction['currency']> = {
    UNITS: 'COP',
    TOINS: 'UC',
    MERITOS: 'MERITOS',
    ONDAS: 'ONDAS',
  };
  return mapping[backendCurrency] || 'COP';
};

const mapBackendStatus = (backendStatus: string): Transaction['status'] => {
  const mapping: Record<string, Transaction['status']> = {
    COMPLETED: 'completed',
    PENDING: 'pending',
    FAILED: 'failed',
    PROCESSING: 'processing',
  };
  return mapping[backendStatus] || 'pending';
};

const mapCurrencyToBackend = (currency: Transaction['currency']): string => {
  const mapping: Record<Transaction['currency'], string> = {
    COP: 'UNITS',
    UC: 'TOINS',
    MERITOS: 'MERITOS',
    ONDAS: 'ONDAS',
  };
  return mapping[currency] || 'UNITS';
};

const mapTransactionTypeToBackend = (type: Transaction['type']): string => {
  const mapping: Record<Transaction['type'], string> = {
    transfer: 'PAY',
    payment: 'PAY',
    reward: 'AWARD',
    exchange: 'EXCHANGE',
    reciprocidad: 'PAY',
    income: 'PAY',
    expense: 'PAY',
  };
  return mapping[type] || 'PAY';
};

const getExchangeRate = (from: string, to: string): number => {
  const rates: Record<string, Record<string, number>> = {
    COP: { UC: 0.002, MERITOS: 0.001, ONDAS: 0.0015 },
    UC: { COP: 500, MERITOS: 0.5, ONDAS: 0.75 },
    MERITOS: { COP: 1000, UC: 2, ONDAS: 1.5 },
    ONDAS: { COP: 667, UC: 1.33, MERITOS: 0.67 },
  };
  return rates[from]?.[to] || 1;
};

const generateMockTransactions = (): Transaction[] => {
  const types: Transaction['type'][] = [
    'income',
    'expense',
    'transfer',
    'exchange',
    'reward',
    'reciprocidad',
  ];
  const currencies: Transaction['currency'][] = [
    'COP',
    'UC',
    'MERITOS',
    'ONDAS',
  ];
  const statuses: Transaction['status'][] = [
    'completed',
    'pending',
    'processing',
  ];

  const descriptions = [
    'Recompensa por colaboración CoomÜnity',
    'Intercambio de servicios con María',
    'Pago por diseño web',
    'Conversión ÜCoins a pesos',
    'Transferencia de Carlos',
    'Mëritos por contribuir al Bien Común',
    'Intercambio Reciprocidad equilibrado',
    'Pago de servicios digitales',
    'Recompensa por video completado',
    'Donación a proyecto comunitario',
  ];

  const names = [
    'María González',
    'Carlos López',
    'Ana Rodríguez',
    'Luis Martínez',
    'Sofia Castro',
  ];

  return Array.from({ length: 15 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const isPositive = ['income', 'reward', 'reciprocidad'].includes(type);

    return {
      id: `mock-tx-${i + 1}`,
      type,
      amount: isPositive
        ? Math.floor(Math.random() * 100000) + 10000
        : -(Math.floor(Math.random() * 50000) + 5000),
      currency,
      description:
        descriptions[Math.floor(Math.random() * descriptions.length)],
      date: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      from: isPositive
        ? names[Math.floor(Math.random() * names.length)]
        : undefined,
      to: !isPositive
        ? names[Math.floor(Math.random() * names.length)]
        : undefined,
      reciprocidadScore: Math.floor(Math.random() * 10) + 1,
      bienComunContribution: Math.random() > 0.6,
      category: 'general',
      metadata:
        type === 'exchange'
          ? {
              exchangeRate: Math.random() * 0.01 + 0.001,
              originalCurrency: currency === 'COP' ? 'UC' : 'COP',
            }
          : undefined,
    };
  });
};
