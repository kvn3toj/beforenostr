import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/api-service';

export interface ElementConfig {
  fuego: {
    name: string;
    color: string;
    gradient: string;
    keyword: string;
    description: string;
    icon: string;
  };
  agua: {
    name: string;
    color: string;
    gradient: string;
    keyword: string;
    description: string;
    icon: string;
  };
  tierra: {
    name: string;
    color: string;
    gradient: string;
    keyword: string;
    description: string;
    icon: string;
  };
  aire: {
    name: string;
    color: string;
    gradient: string;
    keyword: string;
    description: string;
    icon: string;
  };
}

// Configuración por defecto basada en la filosofía CoomÜnity
const DEFAULT_ELEMENTAL_CONFIG: ElementConfig = {
  fuego: {
    name: 'Fuego',
    color: '#FF6B35',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    keyword: 'Acción',
    description: 'Impulso transformador y energía creativa',
    icon: '🔥'
  },
  agua: {
    name: 'Agua',
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    keyword: 'Fluidez',
    description: 'Adaptabilidad y sabiduría emocional',
    icon: '💧'
  },
  tierra: {
    name: 'Tierra',
    color: '#8FBC8F',
    gradient: 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)',
    keyword: 'Estabilidad',
    description: 'Fundamento sólido y crecimiento sostenible',
    icon: '🌱'
  },
  aire: {
    name: 'Aire',
    color: '#87CEEB',
    gradient: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
    keyword: 'Visión',
    description: 'Claridad mental y perspectiva elevada',
    icon: '🌬️'
  }
};

export const useElementalConfig = () => {
  return useQuery<ElementConfig>({
    queryKey: ['elemental-config'],
    queryFn: async () => {
      try {
        const response = await apiService.get('/config/elemental-system');
        return response.data || DEFAULT_ELEMENTAL_CONFIG;
      } catch (error) {
        console.warn('🌟 Usando configuración elemental por defecto:', error);
        return DEFAULT_ELEMENTAL_CONFIG;
      }
    },
    staleTime: Infinity, // Configuración estable que no cambia frecuentemente
    placeholderData: DEFAULT_ELEMENTAL_CONFIG, // Datos inmediatos para evitar loading
    retry: false, // No reintentar si falla, usar fallback
  });
};

export default useElementalConfig; 