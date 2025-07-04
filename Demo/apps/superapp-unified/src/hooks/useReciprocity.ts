import { useState, useEffect } from 'react';
import reciprocityService, {
  CommunityService,
  SkillExchange
} from '../services/reciprocityService';

interface ReciprocityHook {
  communityServices: CommunityService[];
  recommendedServices: CommunityService[];
  communityImpact: number;
  findCommunityServices: (filters?: {
    category?: 'Skill Exchange' | 'Sustainable Goods' | 'Social Impact';
    location?: string;
  }) => Promise<void>;
  initiateExchange: (exchange: SkillExchange) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useReciprocity = (currentMemberId: string): ReciprocityHook => {
  const [communityServices, setCommunityServices] = useState<CommunityService[]>([]);
  const [recommendedServices, setRecommendedServices] = useState<CommunityService[]>([]);
  const [communityImpact, setCommunityImpact] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findCommunityServices = async (filters?: {
    category?: 'Skill Exchange' | 'Sustainable Goods' | 'Social Impact';
    location?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const services = await reciprocityService.findCommunityServices(filters);
      setCommunityServices(services);
    } catch (err) {
      setError('Failed to fetch community services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initiateExchange = async (exchange: SkillExchange): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await reciprocityService.initiateExchange(exchange);
      if (success) {
        // Optionally update community impact or refresh services
        setCommunityImpact(prev => prev + exchange.öndas);
      }
      return success;
    } catch (err) {
      setError('Failed to initiate exchange');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadRecommendedServices = async () => {
      try {
        const recommendations = await reciprocityService.recommendServices(currentMemberId);
        setRecommendedServices(recommendations);
      } catch (err) {
        console.error('Failed to load recommended services', err);
      }
    };

    loadRecommendedServices();
  }, [currentMemberId]);

  return {
    communityServices,
    recommendedServices,
    communityImpact,
    findCommunityServices,
    initiateExchange,
    loading,
    error
  };
};
