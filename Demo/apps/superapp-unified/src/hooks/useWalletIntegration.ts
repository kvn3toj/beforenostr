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
  type: 'transfer' | 'payment' | 'reward' | 'ayni';
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

  const walletData = useQuery({
    queryKey: ['wallet-integration', user?.id || 'anonymous'],
    queryFn: async () => {
      // 🔗 SIEMPRE intentar llamada API real al backend NestJS
      try {
        const response = await walletAPI.getBalance(user?.id || 'anonymous');
        console.log('✅ [WalletIntegration] Datos del backend obtenidos exitosamente');
        return response;
      } catch (error) {
        // 🔄 Fallback básico en caso de error
        console.log('🔄 [WalletIntegration] Usando datos básicos como fallback');
        return {
          balance: 0,
          currency: 'COP',
          ucoins: 0,
          accounts: [],
          transactions: [],
        };
      }
    },
    enabled: enabled && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return walletData;
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

  return useQuery({
    queryKey: queryKeys.walletHistory(user?.id || 'anonymous', filters),
    queryFn: async (): Promise<Transaction[]> => {
      // 🚧 Endpoint de transacciones no implementado en el backend
      // Devolver datos simulados directamente para evitar errores 404
      console.warn('🚧 Transactions endpoint not yet implemented in backend. Using mock data.');
      
      // 🎭 Generar transacciones simuladas realistas
      return generateMockTransactions();
    },
    enabled: !!user?.id,
    staleTime: 15000, // 15 segundos
  });
};

// 💸 Hook para crear nueva transacción
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateTransactionData) => {
      // 🚧 Endpoint de creación de transacciones no implementado
      console.warn('🚧 Create transaction endpoint not yet implemented in backend');
      
      // 🎭 Simular creación exitosa
      return {
        id: `mock-${Date.now()}`,
        ...data,
        status: 'pending',
        date: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      // 🔄 Invalidar caché para refrescar datos
      queryClient.invalidateQueries({
        queryKey: queryKeys.walletData(user?.id || 'anonymous'),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.walletTransactions(user?.id || 'anonymous'),
      });
    },
  });
};

// 💱 Hook para intercambio de monedas
export const useExchangeCurrency = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: ExchangeData) => {
      // 🚧 Endpoint de intercambio no implementado
      console.warn('🚧 Currency exchange endpoint not yet implemented in backend');
      
      // 🎭 Simular intercambio exitoso
      const exchangeRate = getExchangeRate(
        data.fromCurrency,
        data.toCurrency
      );
      return {
        id: `exchange-${Date.now()}`,
        originalAmount: data.amount,
        originalCurrency: data.fromCurrency,
        convertedAmount: data.amount * exchangeRate,
        convertedCurrency: data.toCurrency,
        exchangeRate,
        status: 'completed',
        date: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      // 🔄 Refrescar datos del wallet
      queryClient.invalidateQueries({
        queryKey: queryKeys.walletData(user?.id || 'anonymous'),
      });
    },
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
    ayni: 'PAY',
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
    'ayni',
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
    'Intercambio Ayni equilibrado',
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
    const isPositive = ['income', 'reward', 'ayni'].includes(type);

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
      ayniScore: Math.floor(Math.random() * 10) + 1,
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
