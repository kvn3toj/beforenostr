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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMarketplaceData } from '../../../../hooks/useRealBackendData';
import MarketplaceFilterBar from './MarketplaceFilterBar';
import { ItemGrid } from './';
import { CreateItemModal } from './CreateItemModal';
import { ConsciousLoadingState } from '../../../ui/enhanced/ConsciousLoadingState';
import { impactCategories } from '../marketplace.constants';
import { QuickViewModal } from './QuickViewModal';

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
    images: item.images && item.images.length > 0 ? item.images : ['https://via.placeholder.com/300'],
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

export const MobileMarketplaceView: React.FC = () => {
  const theme = useTheme();

  // --- Estados Esenciales ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mobileItems, setMobileItems] = useState<MarketplaceItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);

  // --- Lógica de Datos ---
  const {
    data: marketplaceItemsResponse,
    isLoading: isLoadingItems,
  } = useMarketplaceData();

  useEffect(() => {
    if (marketplaceItemsResponse?.items) {
      setMobileItems(marketplaceItemsResponse.items.map(mapItemToUIItem));
    }
  }, [marketplaceItemsResponse]);

  const filteredItems = useMemo(() => {
    return mobileItems.filter((item: MarketplaceItem) => {
      const queryMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = selectedCategory ? item.category === selectedCategory : true;
      return queryMatch && categoryMatch;
    }) || [];
  }, [mobileItems, searchQuery, selectedCategory]);

  // --- Handlers ---
  const handleFavoriteToggle = (itemId: string) => {
    setMobileItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, isFavorited: !item.isFavorited } : item
      )
    );
     // TODO: API call to persist favorite status
  };

  const handleQuickViewToggleFavorite = (itemId: string) => {
    handleFavoriteToggle(itemId);
    setSelectedProduct(prev => (prev ? { ...prev, isFavorited: !prev.isFavorited } : null));
  };

  const handleProductClick = (item: MarketplaceItem) => {
    setSelectedProduct(item);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default', p: 2 }}>
      <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
        <MarketplaceFilterBar
            categories={impactCategories}
            activeCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSearch={setSearchQuery}
            onOpenAdvancedFilters={() => setShowFilters(true)}
        />
        <ItemGrid
            items={filteredItems}
            isLoading={isLoadingItems}
            onToggleFavorite={handleFavoriteToggle}
            onProductClick={(id) => {
                const product = mobileItems.find((p: MarketplaceItem) => p.id === id);
                if (product) handleProductClick(product);
            }}
            onAddToCart={() => console.log('Add to cart')}
            onShare={() => console.log('Share')}
        />
      </Stack>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => setShowCreateModal(true)}
      >
        <AddIcon />
      </Fab>

      {/* --- Modals and Drawers --- */}
      <CreateItemModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
            setShowCreateModal(false);
        }}
      />
      <Drawer
        anchor="right"
        open={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <Box sx={{p: 2, width: 280}}>
            <Typography variant="h6">Filtros Avanzados</Typography>
        </Box>
      </Drawer>
      <QuickViewModal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        item={selectedProduct}
        onAddToCart={() => console.log('Add to cart')}
        onToggleFavorite={handleQuickViewToggleFavorite}
      />
    </Box>
  );
};

export default MobileMarketplaceView;
