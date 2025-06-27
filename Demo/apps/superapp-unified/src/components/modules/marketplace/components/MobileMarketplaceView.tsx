import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Stack,
  Fab,
  Drawer,
  Typography,
  useTheme,
  Button,
  Dialog,
  Slide,
  Container,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMarketplaceData } from '../../../../hooks/useRealBackendData';
import MarketplaceFilterBar from './MarketplaceFilterBar';
import { ItemGrid } from './ItemGrid';
import { CreateItemModal } from './CreateItemModal';
import { ConsciousLoadingState } from '../../../ui/enhanced/ConsciousLoadingState';
import { impactCategories, getConsciousnessStyle } from '../marketplace.constants.tsx';
import { QuickViewModal } from './QuickViewModal';
import { SearchFilters } from '../MarketplaceMain';
import { sanitizeProductImages } from './ConsciousProductImageSystem';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  lukas: number;
  category: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    avatar: string;
    isEmprendedorConfiable: boolean;
    ayniScore: number;
    meritos: number;
  };
  stats: {
    views: number;
    likes: number;
    rating: number;
    reviewCount: number;
    isPopular: boolean;
    isSustainable: boolean;
  };
  type: 'product' | 'service';
  tags: string[];
  createdAt: string;
  location?: string;
  isFavorited?: boolean;
  stock: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

// Image handling now uses the ConsciousProductImageSystem

const mapItemToUIItem = (item: any): MarketplaceItem => {
  const sellerData = item.seller || {};
  const isEmprendedorConfiable = (sellerData.rating || 0) >= 4.5 && (sellerData.reviewCount || 0) > 10;

  return {
    id: item.id || 'unknown-product',
    title: item.title || 'Producto Sin Título',
    description: item.description || 'No hay descripción disponible.',
    priceUSD: item.price || 0,
    lukas: item.price || 0,
    category: item.category || 'General',
    images: sanitizeProductImages(item.images, item.title, item.description, item.category),
    seller: {
      id: sellerData.id || 'unknown-seller',
      name: sellerData.name || 'Vendedor Anónimo',
      avatar: sellerData.avatar || 'https://via.placeholder.com/150',
      isEmprendedorConfiable,
      ayniScore: sellerData.ayniScore || Math.floor(Math.random() * 50) + 50,
      meritos: sellerData.meritos || Math.floor(Math.random() * 1000),
    },
    stats: {
      views: item.viewCount || 0,
      likes: item.favoriteCount || 0,
      rating: item.rating || 0,
      reviewCount: item.reviewCount || 0,
      isPopular: item.trending || false,
      isSustainable: (item.sustainabilityScore || 0) > 70,
    },
    type: item.type || 'product',
    tags: item.tags || [],
    createdAt: item.createdAt || new Date().toISOString(),
    location: item.location || 'Online',
    isFavorited: item.isFavorited || false,
    stock: Math.floor(Math.random() * 50),
  };
};

const MobileMarketplaceView: React.FC = () => {
  const theme = useTheme();

  const {
    data: marketplaceItemsResponse,
    isLoading,
    error,
  } = useMarketplaceData();

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<MarketplaceItem | null>(
    null
  );
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    priceRange: [0, 5000],
    location: 'any',
    rating: 0,
    verified: false,
    sortBy: 'relevance',
    tags: [],
    hasDiscount: false,
  });

  useEffect(() => {
    if (marketplaceItemsResponse?.items) {
      setItems(marketplaceItemsResponse.items.map(mapItemToUIItem));
    }
  }, [marketplaceItemsResponse]);

  const handleToggleFavorite = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isFavorited: !item.isFavorited } : item
      )
    );
     // TODO: API call to persist favorite status
  };

  const handleQuickViewToggleFavorite = (itemId: string) => {
    handleToggleFavorite(itemId);
    setQuickViewItem(prev => (prev ? { ...prev, isFavorited: !prev.isFavorited } : null));
  };

  const handleAddToCart = (itemId: string) => {
    console.log(`Added ${itemId} to cart`);
  };

  const handleProductClick = (itemId: string) => {
    const item = items.find(p => p.id === itemId);
    if (item) {
      setQuickViewItem(item);
    }
  };

  const handleFiltersChange = (filters: Partial<SearchFilters>) => {
    setCurrentFilters(prev => ({ ...prev, ...filters }));
  };

  const filteredItems = useMemo(() => {
    let results = items;
    if (currentFilters.query) {
      results = results.filter(item =>
        item.title.toLowerCase().includes(currentFilters.query.toLowerCase())
      );
    }
    if (currentFilters.category && currentFilters.category !== 'all') {
      results = results.filter(
        item => item.category === currentFilters.category
      );
    }
    // ... otros filtros pueden ir aquí ...
    return results;
  }, [items, currentFilters]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default', p: 2 }}>
      <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
        <MarketplaceFilterBar
          categories={impactCategories}
          activeCategory={currentFilters.category}
          onCategoryChange={category =>
            handleFiltersChange({ category: category === 'all' ? '' : category })
          }
          onSearch={handleFiltersChange}
          onOpenAdvancedFilters={() => {
            /* Lógica para abrir filtros avanzados en móvil */
          }}
        />
        <ItemGrid
          items={filteredItems}
          isLoading={isLoading}
          onToggleFavorite={handleToggleFavorite}
          onProductClick={(id) => {
            const product = items.find((p: MarketplaceItem) => p.id === id);
            if (product) handleProductClick(id);
          }}
          onAddToCart={handleAddToCart}
          onShare={() => console.log('Share')}
        />
      </Stack>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => {
          /* Lógica para abrir el modal de creación de producto */
        }}
      >
        <AddIcon />
      </Fab>

      {/* --- Modals and Drawers --- */}
      <CreateItemModal
        open={false}
        onClose={() => {
          /* Lógica para cerrar el modal de creación de producto */
        }}
        onSuccess={() => {
          /* Lógica para manejar el éxito de la creación de producto */
        }}
      />
      <Drawer
        anchor="right"
        open={false}
        onClose={() => {
          /* Lógica para cerrar el drawer de filtros avanzados */
        }}
      >
        <Box sx={{p: 2, width: 280}}>
          <Typography variant="h6">Filtros Avanzados</Typography>
        </Box>
      </Drawer>
      <QuickViewModal
        open={!!quickViewItem}
        onClose={() => setQuickViewItem(null)}
        item={quickViewItem}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleQuickViewToggleFavorite}
      />
    </Box>
  );
};

export default MobileMarketplaceView;
