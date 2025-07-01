import { useState, useCallback, useMemo, useEffect } from 'react';
import { MarketplaceFilters } from '../components/modules/marketplace/components/AdvancedFilters';
import { useDebouncedCallback } from 'use-debounce';
import { SelectChangeEvent } from '@mui/material';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  location: string;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  discount?: number;
  seller: {
    verified: boolean;
    responseTime?: string;
  };
  deliveryTime?: string;
  createdAt?: Date;
}

export interface SearchFilters {
  query: string;
  category: string;
  sortBy: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'reciprocidad_score' | 'consciousness';
  verified: boolean;
  // Futuros filtros avanzados
  priceMin?: number;
  priceMax?: number;
}

export const useMarketplaceFilters = (
  onSearch: (filters: Partial<SearchFilters>) => void
) => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('relevance');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  const debouncedSearch = useDebouncedCallback((filters: Partial<SearchFilters>) => {
    onSearch(filters);
  }, 500);

  useEffect(() => {
    debouncedSearch({ query, sortBy, verified: verifiedOnly, category: activeCategory });
  }, [query, sortBy, verifiedOnly, activeCategory, debouncedSearch]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value as SearchFilters['sortBy']);
  };

  const handleVerifiedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerifiedOnly(event.target.checked);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return {
    filters: {
      query,
      sortBy,
      verifiedOnly,
      activeCategory,
    },
    handlers: {
      handleQueryChange,
      handleSortChange,
      handleVerifiedChange,
      handleCategoryChange,
    },
  };
};

export type UseMarketplaceFiltersReturn = ReturnType<
  typeof useMarketplaceFilters
>;
