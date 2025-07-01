export interface Product {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  mainImage: string;

  // Vendedor
  seller: Seller;

  // Características del producto
  features?: string[];
  specifications?: Record<string, string>;
  includes?: string[];
  requirements?: string[];

  // Ratings y reviews
  rating: number;
  reviewCount: number;
  reviews?: Review[];

  // Información de entrega
  location: string;
  deliveryOptions: DeliveryOption[];
  deliveryTime?: string;

  // Estados y badges
  status: 'active' | 'sold' | 'paused' | 'draft';
  featured?: boolean;
  trending?: boolean;
  urgent?: boolean;
  is24Hours?: boolean;
  hasVideo?: boolean;

  // Métricas
  viewCount: number;
  favoriteCount: number;
  shareCount?: number;

  // Precios y descuentos
  discount?: number;

  // Fechas
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  // SEO y metadata
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;

  // Relacionados
  relatedProducts?: string[];

  // Configuración de producto
  variants?: ProductVariant[];
  options?: ProductOption[];

  // Tipo de producto
  type: 'service' | 'product' | 'digital' | 'course' | 'consultation';
  serviceType?: 'online' | 'in-person' | 'hybrid';

  // Disponibilidad
  availability?: {
    available: boolean;
    quantity?: number;
    reservations?: number;
    nextAvailable?: Date;
  };
}

export interface Seller {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  location: string;

  // Verificación y credenciales
  verified: boolean;
  badges: SellerBadge[];
  certifications?: Certification[];

  // Métricas
  rating: number;
  reviewCount: number;
  responseTime: string;
  responseRate: number;
  completionRate?: number;

  // Estado
  isOnline: boolean;
  lastSeen?: Date;
  isActive: boolean;

  // Información de contacto
  contactMethods: ContactMethod[];
  socialLinks?: SocialLink[];
  website?: string;

  // Estadísticas de ventas
  salesCount?: number;
  yearsActive?: number;
  languagesSpoken?: string[];

  // Configuración
  allowMessages: boolean;
  instantBooking?: boolean;
  autoReply?: string;

  // Fechas
  memberSince: Date;

  // Políticas
  cancellationPolicy?: string;
  refundPolicy?: string;

  // Horarios de disponibilidad
  availability?: AvailabilitySchedule;
}

export interface Review {
  id: string;
  productId: string;
  reviewerId: string;
  reviewer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  title?: string;
  comment: string;
  images?: string[];

  // Métricas de la review
  helpful: number;
  notHelpful: number;
  userVote?: 'helpful' | 'not-helpful';

  // Fechas
  createdAt: Date;
  updatedAt?: Date;

  // Respuesta del vendedor
  sellerResponse?: {
    comment: string;
    createdAt: Date;
  };

  // Verificación de compra
  verifiedPurchase: boolean;

  // Aspectos específicos
  aspects?: {
    communication: number;
    quality: number;
    delivery: number;
    value: number;
  };
}

export interface DeliveryOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedTime: string;
  type: 'standard' | 'express' | 'overnight' | 'digital' | 'pickup';
  available: boolean;
  icon?: string;
}

export interface SellerBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  category: 'achievement' | 'verification' | 'milestone' | 'special';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  credentialId?: string;
  issueDate: Date;
  expiryDate?: Date;
  verified: boolean;
  badgeImage?: string;
}

export interface ContactMethod {
  type: 'message' | 'call' | 'video' | 'email' | 'whatsapp';
  label: string;
  value?: string;
  available: boolean;
  preferred?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  verified?: boolean;
}

export interface AvailabilitySchedule {
  timezone: string;
  schedule: {
    [key: string]: {
      available: boolean;
      start?: string;
      end?: string;
      breaks?: Array<{ start: string; end: string }>;
    };
  };
  exceptions?: Array<{
    date: string;
    available: boolean;
    start?: string;
    end?: string;
    reason?: string;
  }>;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  available: boolean;
  attributes: Record<string, string>;
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'select' | 'radio' | 'checkbox' | 'text' | 'number';
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
    price?: number;
  }>;
  description?: string;
}

// Tipos para el carrito y compras
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedOptions?: Record<string, string>;
  selectedDelivery?: DeliveryOption;
  notes?: string;
  addedAt: Date;
}

export interface Order {
  id: string;
  items: CartItem[];
  seller: Seller;
  buyer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };

  // Precios
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  currency: string;

  // Estado
  status:
    | 'pending'
    | 'confirmed'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'disputed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  // Fechas importantes
  createdAt: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;

  // Información de entrega
  deliveryAddress?: Address;
  deliveryInstructions?: string;

  // Tracking
  trackingNumber?: string;
  trackingUrl?: string;

  // Comunicación
  messages?: Message[];

  // Calificación post-compra
  rated?: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  attachments?: string[];
  createdAt: Date;
  read: boolean;
}

// Tipos para filtros y búsqueda
export interface MarketplaceFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  location?: string;
  radius?: number;
  rating?: number;
  deliveryOptions?: string[];
  sellerType?: 'individual' | 'business' | 'verified';
  availability?: 'available' | 'urgent' | '24h';
  productType?: Product['type'];
  sortBy?:
    | 'relevance'
    | 'price-low'
    | 'price-high'
    | 'rating'
    | 'newest'
    | 'popular';
  tags?: string[];
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: MarketplaceFilters;
  suggestions?: string[];
  relatedSearches?: string[];
}

// Tipos para analytics y métricas
export interface ProductAnalytics {
  productId: string;
  views: number;
  uniqueViews: number;
  favorites: number;
  shares: number;
  inquiries: number;
  conversions: number;
  conversionRate: number;
  averageViewTime: number;
  bounceRate: number;

  // Métricas temporales
  dailyViews: Array<{ date: string; views: number }>;
  weeklyStats: Array<{ week: string; views: number; conversions: number }>;

  // Información demográfica de visitantes
  demographics?: {
    countries: Array<{ country: string; percentage: number }>;
    cities: Array<{ city: string; percentage: number }>;
    devices: Array<{ device: string; percentage: number }>;
  };
}

// Tipos para notificaciones
export interface MarketplaceNotification {
  id: string;
  type:
    | 'new-message'
    | 'order-update'
    | 'review-received'
    | 'product-question'
    | 'promotion';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Match {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  status: string;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  // ...otros campos si los necesitas
}

// Types moved from MarketplaceMain.tsx for centralization
export interface MarketplaceItem {
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
    reciprocidadScore: number;
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
  consciousnessLevel?: 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT';
}

export interface MarketplaceSearchFilters {
  query: string;
  category: string;
  priceRange: [number, number];
  location: string;
  rating: number;
  verified: boolean;
  sortBy:
    | 'relevance'
    | 'price_asc'
    | 'price_desc'
    | 'rating'
    | 'newest'
    | 'trending'
    | 'impact'
    | 'reciprocidad_score'
    | 'consciousness';
  tags: string[];
  hasDiscount: boolean;
  impactLevel?: 'local' | 'regional' | 'global';
  consciousnessLevel?: 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT';
  minimumReciprocidadScore?: number;
}
