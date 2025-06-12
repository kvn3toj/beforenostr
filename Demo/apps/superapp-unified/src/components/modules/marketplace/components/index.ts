// Marketplace Components Exports
export { RoleToggle } from './RoleToggle';
export { MobileHeader } from './MobileHeader';
export { MobileSearchBar } from './MobileSearchBar';
export { CategoryCarousel } from './CategoryCarousel';
export { CategoryChips } from './CategoryChips';
export { RequestCreationSection } from './RequestCreationSection';
export { BottomNavigation } from './BottomNavigation';
export { MobileKeyboard } from './MobileKeyboard';
export { ProductCard } from './ProductCard';
export { default as AdvancedSearch } from './AdvancedSearch';
export { MobileMarketplaceView } from './MobileMarketplaceView';

// Types
export interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

export interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  location: string;
  rating: number;
  seller: {
    name: string;
    username: string;
    avatar: string;
  };
  image: string;
  isFavorited?: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
  variant?: 'recommended' | 'category';
}

export interface RoleToggleProps {
  selectedRole: 'consumer' | 'provider';
  onRoleChange: (role: 'consumer' | 'provider') => void;
}

export interface MobileHeaderProps {
  onMenuClick: () => void;
  onChatClick: () => void;
  onNotificationsClick: () => void;
}

export interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export interface CategoryCarouselProps {
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
  onViewAll: () => void;
}
