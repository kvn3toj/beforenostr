// Import default exports first
import AdvancedSearch from './AdvancedSearch';
import AdvancedFilters from './AdvancedFilters';
import FilterStats from './FilterStats';
import ItemGrid from './ItemGrid';

// Export using imported components to avoid binding conflicts
export { AdvancedSearch };
export { AdvancedFilters };
export { FilterStats };
export { ItemGrid };

// Named exports
export { default as ProductCard } from './ProductCard';
export { EnhancedMarketplaceCard } from './EnhancedMarketplaceCard';
export { ProductReviews } from './ProductReviews';
export { SellerInfoCard } from './SellerInfoCard';
// ❌ REMOVIDO: ShareProduct (archivo no existe)
// ❌ REMOVIDO: BottomNavigation (ahora usa navegación consciente unificada)
export { CategoryCarousel } from './CategoryCarousel';
export { CategoryChips } from './CategoryChips';
export { MobileHeader } from './MobileHeader';
export { MobileKeyboard } from './MobileKeyboard';
export { MobileMarketplaceView } from './MobileMarketplaceView';
export { MobileSearchBar } from './MobileSearchBar';
export { RequestCreationSection } from './RequestCreationSection';
export { RoleToggle } from './RoleToggle';

// Nuevos componentes para el detalle del producto
export { ProductDetailView } from './ProductDetailView';
export { ProductGallery } from './ProductGallery';
export { ProductActions } from './ProductActions';
export { RelatedProducts } from './RelatedProducts';
