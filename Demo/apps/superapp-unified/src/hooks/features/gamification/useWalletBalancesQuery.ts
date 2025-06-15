import { useQuery } from '@tanstack/react-query';
import { fetchMyWalletBalances } from '../../../services/wallet.service';
import type { WalletBalance } from '../../../services/wallet.service';
import { useAuth } from '../../useAuth';

export const useWalletBalancesQuery = () => {
  const { user } = useAuth();

  // 🚨 BUILDER.IO SAFE MODE: Detectar entorno Builder.io y usar datos mock
  const isBuilderEnvironment = typeof window !== 'undefined' && 
    (window.location.hostname.includes('builder.io') || 
     window.location.port === '48752' ||
     window.location.hostname.includes('preview'));

  return useQuery<WalletBalance[]>({
    queryKey: ['walletBalances', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // 🛡️ En Builder.io, usar datos mock directamente sin llamadas API
      if (isBuilderEnvironment) {
        console.log('🎭 [Builder.io Safe Mode] Usando datos mock para WalletBalances');
        return [
          {
            id: 'balance-1',
            userId: user.id,
            meritId: 'merit-ondas',
            balance: 1250,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            merit: {
              id: 'merit-ondas',
              name: 'Öndas',
              slug: 'ondas',
              description: 'Energía vibracional positiva',
              icon: '🌊',
              color: '#4FC3F7',
              category: 'energy',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          },
          {
            id: 'balance-2',
            userId: user.id,
            meritId: 'merit-meritos',
            balance: 485,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            merit: {
              id: 'merit-meritos',
              name: 'Mëritos',
              slug: 'meritos',
              description: 'Reconocimiento por contribuir al Bien Común',
              icon: '⭐',
              color: '#FFB74D',
              category: 'achievement',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          },
          {
            id: 'balance-3',
            userId: user.id,
            meritId: 'merit-lukas',
            balance: 185000,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            merit: {
              id: 'merit-lukas',
              name: 'Lükas',
              slug: 'lukas',
              description: 'Moneda interna de CoomÜnity',
              icon: '💰',
              color: '#81C784',
              category: 'currency',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          }
        ];
      }

      // 🔗 En desarrollo normal, intentar llamada API
      return fetchMyWalletBalances(user.id);
    },
    enabled: !!user?.id && !isBuilderEnvironment, // Deshabilitar en Builder.io
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}; 