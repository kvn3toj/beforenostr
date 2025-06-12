import { useState, useCallback, useMemo } from 'react';
import { MarketplaceFilters } from '../components/modules/marketplace/components/AdvancedFilters';

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

export const useMarketplaceFilters = (items: MarketplaceItem[]) => {
  const [activeFilters, setActiveFilters] = useState<MarketplaceFilters>({
    priceRange: [0, 1000],
    category: '',
    location: '',
    rating: 0,
    deliveryTime: '',
    isVerifiedSeller: false,
    isFeatured: false,
    isTrending: false,
    hasDiscount: false,
    sortBy: 'relevance',
    tags: [],
  });

  const updateFilters = useCallback((newFilters: MarketplaceFilters) => {
    setActiveFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({
      priceRange: [0, 1000],
      category: '',
      location: '',
      rating: 0,
      deliveryTime: '',
      isVerifiedSeller: false,
      isFeatured: false,
      isTrending: false,
      hasDiscount: false,
      sortBy: 'relevance',
      tags: [],
    });
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Filtro por rango de precio
    filtered = filtered.filter(
      (item) =>
        item.price >= activeFilters.priceRange[0] &&
        item.price <= activeFilters.priceRange[1]
    );

    // Filtro por categoría
    if (activeFilters.category) {
      filtered = filtered.filter((item) =>
        item.category
          .toLowerCase()
          .includes(activeFilters.category.toLowerCase())
      );
    }

    // Filtro por ubicación
    if (activeFilters.location) {
      filtered = filtered.filter((item) =>
        item.location
          .toLowerCase()
          .includes(activeFilters.location.toLowerCase())
      );
    }

    // Filtro por rating
    if (activeFilters.rating > 0) {
      filtered = filtered.filter((item) => item.rating >= activeFilters.rating);
    }

    // Filtro por tiempo de entrega
    if (activeFilters.deliveryTime) {
      filtered = filtered.filter((item) => {
        if (!item.deliveryTime) return false;

        switch (activeFilters.deliveryTime) {
          case '24h':
            return (
              item.deliveryTime.includes('24') ||
              item.deliveryTime.includes('inmediato')
            );
          case '48h':
            return (
              item.deliveryTime.includes('48') ||
              item.deliveryTime.includes('2 días')
            );
          case '1week':
            return (
              item.deliveryTime.includes('semana') ||
              item.deliveryTime.includes('7 días')
            );
          case '2weeks':
            return (
              item.deliveryTime.includes('2 semanas') ||
              item.deliveryTime.includes('14 días')
            );
          case 'flexible':
            return item.deliveryTime.includes('flexible');
          default:
            return true;
        }
      });
    }

    // Filtro por vendedor verificado
    if (activeFilters.isVerifiedSeller) {
      filtered = filtered.filter((item) => item.seller.verified);
    }

    // Filtro por productos destacados
    if (activeFilters.isFeatured) {
      filtered = filtered.filter((item) => item.featured);
    }

    // Filtro por productos en tendencia
    if (activeFilters.isTrending) {
      filtered = filtered.filter((item) => item.trending);
    }

    // Filtro por productos con descuento
    if (activeFilters.hasDiscount) {
      filtered = filtered.filter((item) => item.discount && item.discount > 0);
    }

    // Filtro por tags
    if (activeFilters.tags.length > 0) {
      filtered = filtered.filter((item) =>
        activeFilters.tags.some((tag) =>
          item.tags.some((itemTag) =>
            itemTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    // Ordenamiento
    switch (activeFilters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'trending':
        filtered.sort((a, b) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return b.rating - a.rating; // Fallback por rating
        });
        break;
      case 'relevance':
      default:
        // Ordenamiento por relevancia (featured first, then trending, then rating)
        filtered.sort((a, b) => {
          // Primero productos destacados
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;

          // Luego productos en tendencia
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;

          // Finalmente por rating
          return b.rating - a.rating;
        });
        break;
    }

    return filtered;
  }, [items, activeFilters]);

  const hasActiveFilters = useMemo(() => {
    return (
      activeFilters.category ||
      activeFilters.location ||
      activeFilters.rating > 0 ||
      activeFilters.deliveryTime ||
      activeFilters.isVerifiedSeller ||
      activeFilters.isFeatured ||
      activeFilters.isTrending ||
      activeFilters.hasDiscount ||
      activeFilters.tags.length > 0 ||
      activeFilters.priceRange[0] > 0 ||
      activeFilters.priceRange[1] < 1000
    );
  }, [activeFilters]);

  const filterStats = useMemo(() => {
    const totalItems = items.length;
    const filteredCount = filteredItems.length;
    const hiddenCount = totalItems - filteredCount;

    return {
      total: totalItems,
      filtered: filteredCount,
      hidden: hiddenCount,
      percentage:
        totalItems > 0 ? Math.round((filteredCount / totalItems) * 100) : 0,
    };
  }, [items.length, filteredItems.length]);

  const getFilterSuggestions = useCallback(() => {
    if (filteredItems.length > 0) return [];

    const suggestions: string[] = [];

    // Sugerir ajustar precio si es muy restrictivo
    if (activeFilters.priceRange[1] < 100) {
      suggestions.push('Intenta ampliar el rango de precio');
    }

    // Sugerir quitar filtros muy específicos
    if (activeFilters.tags.length > 3) {
      suggestions.push('Reduce el número de etiquetas seleccionadas');
    }

    if (activeFilters.rating > 4) {
      suggestions.push('Considera productos con valoraciones menores');
    }

    if (suggestions.length === 0) {
      suggestions.push(
        'Intenta quitar algunos filtros para ver más resultados'
      );
    }

    return suggestions;
  }, [activeFilters, filteredItems.length]);

  return {
    activeFilters,
    filteredItems,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    filterStats,
    getFilterSuggestions,
  };
};

export type UseMarketplaceFiltersReturn = ReturnType<
  typeof useMarketplaceFilters
>;
