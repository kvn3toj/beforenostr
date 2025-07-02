import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { useMarketplaceData } from '../../../../hooks/useRealBackendData';
import MarketplaceFilterBar from './MarketplaceFilterBar';
import { ItemGrid } from './ItemGrid';
import { CreateItemModal } from './CreateItemModal';
import { ConsciousLoadingState } from '../../../ui/enhanced/ConsciousLoadingState';
import { impactCategories, getConsciousnessStyle } from '../marketplace.constants.tsx';
import { QuickViewModal } from './QuickViewModal';
import type { MarketplaceItem } from '../../../../types/marketplace';

interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: [number, number];
  location?: string;
  rating?: number;
  verified?: boolean;
  sortBy?: string;
  tags?: string[];
  hasDiscount?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  'https://images.unsplash.com/photo-1584147791147-4e72b042ad2f?w=600&q=80',
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80',
];

const needsImageReplacement = (url: string) => {
  if (!url) return true;
  const lower = url.toLowerCase();
  return lower.includes('loremflickr') || lower.includes('cat') || lower.includes('statue');
};

const sanitizeImages = (imgs: string[] | undefined): string[] => {
  if (!imgs || imgs.length === 0) return [FALLBACK_IMGS[0]];
  return imgs.map((url, idx) => (needsImageReplacement(url) ? FALLBACK_IMGS[idx % FALLBACK_IMGS.length] : url));
};

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
    images: sanitizeImages(item.images),
    seller: {
      id: sellerData.id || 'unknown-seller',
      name: sellerData.name || 'Vendedor Anónimo',
      avatar: sellerData.avatar || 'https://via.placeholder.com/150',
      isEmprendedorConfiable,
      reciprocidadScore: sellerData.reciprocidadScore || Math.floor(Math.random() * 50) + 50,
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
    consciousnessLevel: item.consciousnessLevel || 'SEED',
  };
};

const MobileMarketplaceView: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    data: marketplaceItemsResponse,
    isLoading,
    error,
  } = useMarketplaceData();

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<MarketplaceItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
  });

  useEffect(() => {
    if (marketplaceItemsResponse?.items) {
      setItems(marketplaceItemsResponse.items);
    }
  }, [marketplaceItemsResponse]);

  const handleToggleFavorite = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isFavorited: !item.isFavorited } : item
      )
    );
    // TODO: API call
  };

  const handleAddToCart = (item: MarketplaceItem) => {
    console.log(`Added ${item.title} to cart`);
    // Lógica futura de añadir al carro
  };

  const handleOpenChat = (item: MarketplaceItem) => {
    console.log("Opening chat for:", item.title);
    // Lógica para abrir modal de chat
  };

  const handleFiltersChange = (filters: Partial<SearchFilters>) => {
    setCurrentFilters((prev) => ({ ...prev, ...filters }));
  };

  const filteredItems = useMemo(() => {
    let results = items;
    if (currentFilters.query) {
      results = results.filter((item) =>
        item.title.toLowerCase().includes(currentFilters.query!.toLowerCase())
      );
    }
    if (currentFilters.category && currentFilters.category !== 'all') {
      results = results.filter(
        (item) => item.category === currentFilters.category
      );
    }
    return results;
  }, [items, currentFilters]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.paper',
      }}
    >
      <Container sx={{ py: 2, flex: 1, overflowY: 'auto' }}>
        <Stack spacing={2}>
          <MarketplaceFilterBar
            categories={impactCategories}
            onSearch={handleFiltersChange}
            onOpenAdvancedFilters={() => console.log('advanced filters')}
          />

          <ItemGrid
            items={filteredItems}
            isLoading={isLoading}
            onToggleFavorite={handleToggleFavorite}
            onShare={(id) => console.log('share', id)}
            onAddToCart={(id) => console.log('add', id)}
            onOpenChat={handleOpenChat}
            viewMode="grid"
          />
        </Stack>
      </Container>

      <Fab
        onClick={() => navigate('/marketplace/dashboard')}
        sx={{
          position: 'fixed',
          bottom: 150,
          right: 16,
          bgcolor: 'secondary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'secondary.dark',
          },
        }}
        aria-label="dashboard"
      >
        <DashboardIcon />
      </Fab>

      <Fab
        onClick={() => setShowCreateModal(true)}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <AddIcon />
      </Fab>

      {quickViewItem && (
        <QuickViewModal
          item={quickViewItem}
          open={!!quickViewItem}
          onClose={() => setQuickViewItem(null)}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={() => handleAddToCart(quickViewItem)}
        />
      )}
      <CreateItemModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          // podrías añadir un refetch de los datos aquí
        }}
      />
    </Box>
  );
};

export default MobileMarketplaceView;
