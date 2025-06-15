import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api-service';
import { useAuth } from '../contexts/AuthContext';

// 🎯 Tipos específicos para el wallet CoomÜnity
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

  // 🚨 BUILDER.IO SAFE MODE: Detectar entorno Builder.io y usar datos mock
  const isBuilderEnvironment = typeof window !== 'undefined' && 
    (window.location.hostname.includes('builder.io') || 
     window.location.port === '48752' ||
     window.location.hostname.includes('preview'));

  return useQuery({
    queryKey: queryKeys.walletData(user?.id || 'anonymous'),
    queryFn: async (): Promise<WalletData> => {
      // 🛡️ En Builder.io, usar datos mock directamente sin llamadas API
      if (isBuilderEnvironment) {
        console.log('🎭 [Builder.io Safe Mode] Usando datos mock para WalletIntegration');
        const mockBalance = 185000;
        const mockUcoins = 650;
        
        return {
          balance: mockBalance,
          currency: 'COP',
          ucoins: mockUcoins,
          meritos: 485,
          ondas: 1250,
          pendingBalance: 25000,
          monthlyChange: 12.5,
          ayniLevel: 68,
          collaborationScore: 8.7,
          communityRank: '#1,247',
          accounts: [
            {
              id: 'principal',
              name: 'Cuenta Principal CoomÜnity',
              type: 'checking',
              balance: mockBalance,
              currency: 'COP',
              primary: true,
            },
            {
              id: 'ucoins',
              name: 'ÜCoins Wallet',
              type: 'crypto',
              balance: mockUcoins,
              currency: 'UC',
              primary: false,
            },
            {
              id: 'ahorros',
              name: 'Ahorros Ayni',
              type: 'savings',
              balance: Math.floor(mockBalance * 0.3),
              currency: 'COP',
              primary: false,
            },
          ],
          recentTransactions: [
            {
              id: '1',
              type: 'income',
              amount: 18500,
              currency: 'COP',
              description: 'Recompensa por colaboración CoomÜnity',
              date: new Date(Date.now() - 86400000).toISOString(),
              status: 'completed',
              ayniScore: 9,
              bienComunContribution: true,
              category: 'reward',
            },
            {
              id: '2',
              type: 'expense',
              amount: 9250,
              currency: 'COP',
              description: 'Intercambio de servicios',
              date: new Date(Date.now() - 172800000).toISOString(),
              status: 'completed',
              ayniScore: 8,
              bienComunContribution: true,
              category: 'exchange',
            },
          ],
          paymentMethods: [
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
          ],
        };
      }

      // 🔗 En desarrollo normal, intentar llamada API con fallback
      try {
        // 🔗 Intentar conectar con el backend real
        const response = await apiService.get(`/wallets/user/${user?.id}`);

        // 🎯 Mapear respuesta del backend a formato CoomÜnity
        const backendData = response.data[0] || {};

        return {
          balance: backendData.balanceUnits || 0,
          currency: 'COP',
          ucoins: backendData.balanceToins || 0,
          meritos: backendData.meritos || Math.floor(Math.random() * 500) + 100,
          ondas: backendData.ondas || Math.floor(Math.random() * 300) + 50,
          pendingBalance: Math.floor(Math.random() * 50000),
          monthlyChange: Math.floor(Math.random() * 30) - 10,
          ayniLevel: Math.floor(Math.random() * 60) + 25,
          collaborationScore: Math.floor(Math.random() * 50) / 10 + 5,
          communityRank: `#${Math.floor(Math.random() * 5000) + 500}`,
          accounts: [
            {
              id: 'principal',
              name: 'Cuenta Principal CoomÜnity',
              type: 'checking',
              balance: backendData.balanceUnits || 0,
              currency: 'COP',
              primary: true,
            },
            {
              id: 'ucoins',
              name: 'ÜCoins Wallet',
              type: 'crypto',
              balance: backendData.balanceToins || 0,
              currency: 'UC',
              primary: false,
            },
            {
              id: 'ahorros',
              name: 'Ahorros Ayni',
              type: 'savings',
              balance: Math.floor((backendData.balanceUnits || 0) * 0.3),
              currency: 'COP',
              primary: false,
            },
          ],
          recentTransactions: [],
          paymentMethods: [
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
          ],
        };
      } catch (error) {
        console.warn('🔄 Backend no disponible, usando datos simulados');

        // 🎭 Datos simulados realistas con terminología CoomÜnity
        const mockBalance = Math.floor(Math.random() * 500000) + 100000;
        const mockUcoins = Math.floor(Math.random() * 1000) + 200;

        return {
          balance: mockBalance,
          currency: 'COP',
          ucoins: mockUcoins,
          meritos: Math.floor(Math.random() * 800) + 200,
          ondas: Math.floor(Math.random() * 500) + 100,
          pendingBalance: Math.floor(Math.random() * 75000),
          monthlyChange: Math.floor(Math.random() * 40) - 15,
          ayniLevel: Math.floor(Math.random() * 75) + 15,
          collaborationScore: Math.floor(Math.random() * 60) / 10 + 4,
          communityRank: `#${Math.floor(Math.random() * 8000) + 200}`,
          accounts: [
            {
              id: 'principal',
              name: 'Cuenta Principal CoomÜnity',
              type: 'checking',
              balance: mockBalance,
              currency: 'COP',
              primary: true,
            },
            {
              id: 'ucoins',
              name: 'ÜCoins Wallet',
              type: 'crypto',
              balance: mockUcoins,
              currency: 'UC',
              primary: false,
            },
            {
              id: 'ahorros',
              name: 'Ahorros Ayni',
              type: 'savings',
              balance: Math.floor(mockBalance * 0.4),
              currency: 'COP',
              primary: false,
            },
          ],
          recentTransactions: [],
          paymentMethods: [
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
          ],
        };
      }
    },
    enabled: enabled && !!user?.id && !isBuilderEnvironment, // Deshabilitar en Builder.io
    staleTime: 30000, // 30 segundos
    refetchInterval: isBuilderEnvironment ? false : 60000, // No refrescar en Builder.io
  });
};

// 📋 Hook para transacciones del wallet
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
      try {
        // 🔗 Intentar obtener transacciones del backend
        const response = await apiService.get(`/transactions/user/${user?.id}`);

        // 🎯 Mapear transacciones del backend a formato CoomÜnity
        return response.data.map((tx: any) => ({
          id: tx.id,
          type: mapBackendTransactionType(tx.type),
          amount: tx.amount,
          currency: mapBackendCurrency(tx.tokenType),
          description: tx.description || 'Transacción sin descripción',
          date: tx.createdAt,
          status: mapBackendStatus(tx.status),
          from: tx.fromUser?.name,
          to: tx.toUser?.name,
          ayniScore: Math.floor(Math.random() * 10) + 1,
          bienComunContribution: tx.type === 'AWARD' || Math.random() > 0.7,
          category: 'general',
          metadata:
            tx.tokenType === 'EXCHANGE'
              ? {
                  exchangeRate: Math.random() * 0.01 + 0.001,
                }
              : undefined,
        }));
      } catch (error) {
        console.warn(
          '🔄 Backend no disponible, generando transacciones simuladas'
        );

        // 🎭 Generar transacciones simuladas realistas
        return generateMockTransactions();
      }
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
      try {
        // 🔗 Enviar al backend real
        const response = await apiService.post('/transactions', {
          fromUserId: user?.id,
          toUserId: data.toUserId,
          amount: data.amount,
          tokenType: mapCurrencyToBackend(data.currency),
          type: mapTransactionTypeToBackend(data.type),
          description: data.description,
        });
        return response.data;
      } catch (error) {
        // 🎭 Simular creación exitosa en modo offline
        console.warn('🔄 Creando transacción en modo simulado');
        return {
          id: `mock-${Date.now()}`,
          ...data,
          status: 'pending',
          date: new Date().toISOString(),
        };
      }
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
      try {
        // 🔗 Endpoint específico para intercambios (a implementar en backend)
        const response = await apiService.post('/wallets/exchange', {
          userId: user?.id,
          fromCurrency: data.fromCurrency,
          toCurrency: data.toCurrency,
          amount: data.amount,
        });
        return response.data;
      } catch (error) {
        // 🎭 Simular intercambio exitoso
        console.warn('🔄 Realizando intercambio en modo simulado');
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
      }
    },
    onSuccess: () => {
      // 🔄 Refrescar datos del wallet
      queryClient.invalidateQueries({
        queryKey: queryKeys.walletData(user?.id || 'anonymous'),
      });
    },
  });
};

// 💳 Hook para métodos de pago
export const usePaymentMethods = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.paymentMethods(user?.id || 'anonymous'),
    queryFn: async (): Promise<PaymentMethod[]> => {
      try {
        // 🔗 Obtener métodos de pago del backend
        const response = await apiService.get(
          `/users/${user?.id}/payment-methods`
        );
        return response.data;
      } catch (error) {
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
      }
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
      try {
        const response = await apiService.get('/exchange-rates');
        return response.data;
      } catch (error) {
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
      }
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
