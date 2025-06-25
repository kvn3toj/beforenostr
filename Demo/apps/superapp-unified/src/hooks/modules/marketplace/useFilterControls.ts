import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { SelectChangeEvent } from '@mui/material';

// Note: This SearchFilters interface is simplified and should be aligned with the backend DTOs.
// It is defined here for clarity, but could be imported from a shared types folder.
export interface SearchFilters {
  query: string;
  category: string;
  sortBy: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'ayni_score' | 'consciousness';
  verified: boolean;
  priceMin?: number;
  priceMax?: number;
}

/**
 * Custom hook to manage the state and logic of marketplace filter controls.
 * It debounces search actions to prevent excessive API calls while typing.
 *
 * @param onSearch - Callback function that is triggered when filters change.
 */
export const useFilterControls = (
  onSearch: (filters: Partial<SearchFilters>) => void
) => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('relevance');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  // Debounce the search callback to avoid firing it on every keystroke
  const debouncedSearch = useDebouncedCallback((filters: Partial<SearchFilters>) => {
    onSearch(filters);
  }, 500);

  // Effect to trigger the debounced search when any filter changes
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

  // Return the state and handlers to be used by the component
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
      setQuery // Expose setQuery for programmatic changes if needed
    },
  };
};
