import React from 'react';
import { Grid, Box } from '@mui/material';
import ProductCard from './ProductCard';
import { EnhancedMobileProductCard } from './MobileMarketplaceView';
import type { Product, Seller } from '../../../../types/marketplace';

interface ItemGridProps {
  items: Product[];
  onToggleFavorite: (id: string) => void;
  onProductClick: (id: string) => void;
  viewMode?: 'grid' | 'list';
  variant?: 'enhanced' | 'standard';
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  onToggleFavorite,
  onProductClick,
  viewMode = 'grid',
  variant = 'enhanced'
}) => {
  const getGridColumns = () => {
    if (viewMode === 'list') {
      return { xs: 12 };
    }
    // Grid mode columns based on screen size
    return { xs: 12, sm: 6, md: 4, lg: 3 };
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {items.map((item: Product) => {
          // Transformar seller para cumplir con el tipo Seller estricto
          const strictSeller: Seller = {
            id: item.seller.id,
            name: item.seller.name,
            username: item.seller.username,
            avatar: item.seller.avatar,
            coverImage: item.seller.coverImage ?? '',
            bio: item.seller.bio ?? '',
            location: item.seller.location ?? '',
            verified: item.seller.verified ?? false,
            badges: item.seller.badges ?? [],
            certifications: item.seller.certifications ?? [],
            rating: item.seller.rating ?? 0,
            reviewCount: item.seller.reviewCount ?? 0,
            responseTime: item.seller.responseTime ?? '',
            responseRate: item.seller.responseRate ?? 0,
            completionRate: item.seller.completionRate ?? 0,
            isOnline: item.seller.isOnline ?? false,
            lastSeen: item.seller.lastSeen ? new Date(item.seller.lastSeen) : new Date(),
            isActive: item.seller.isActive ?? true,
            contactMethods: item.seller.contactMethods ?? [],
            socialLinks: item.seller.socialLinks ?? [],
            website: item.seller.website ?? '',
            salesCount: item.seller.salesCount ?? 0,
            yearsActive: item.seller.yearsActive ?? 0,
            languagesSpoken: item.seller.languagesSpoken ?? [],
            allowMessages: item.seller.allowMessages ?? true,
            instantBooking: item.seller.instantBooking ?? false,
            autoReply: item.seller.autoReply ?? '',
            memberSince: item.seller.memberSince ? new Date(item.seller.memberSince) : new Date(),
            cancellationPolicy: item.seller.cancellationPolicy ?? '',
            refundPolicy: item.seller.refundPolicy ?? '',
            availability: item.seller.availability ?? undefined,
          };
          // Transformar item para cumplir con Product estricto
          const strictItem: Product = {
            ...item,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
            publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
            seller: strictSeller,
          };
          return (
            <Grid
              item
              {...getGridColumns()}
              key={item.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {variant === 'enhanced' ? (
                <EnhancedMobileProductCard
                  id={strictItem.id}
                  title={strictItem.title}
                  description={strictItem.description}
                  fullDescription={strictItem.fullDescription}
                  shortDescription={strictItem.shortDescription}
                  price={strictItem.price}
                  originalPrice={strictItem.originalPrice}
                  currency={strictItem.currency}
                  category={strictItem.category}
                  subcategory={strictItem.subcategory}
                  tags={strictItem.tags}
                  images={strictItem.images}
                  mainImage={strictItem.mainImage || strictItem.images[0] || ''}
                  seller={strictItem.seller}
                  features={strictItem.features}
                  specifications={strictItem.specifications}
                  includes={strictItem.includes}
                  requirements={strictItem.requirements}
                  rating={strictItem.rating}
                  reviewCount={strictItem.reviewCount}
                  reviews={strictItem.reviews}
                  location={strictItem.location}
                  deliveryOptions={strictItem.deliveryOptions || []}
                  deliveryTime={strictItem.deliveryTime}
                  status={strictItem.status || 'active'}
                  featured={strictItem.featured}
                  trending={strictItem.trending}
                  urgent={strictItem.urgent}
                  is24Hours={strictItem.is24Hours}
                  hasVideo={strictItem.hasVideo}
                  viewCount={strictItem.viewCount}
                  favoriteCount={strictItem.favoriteCount}
                  shareCount={strictItem.shareCount}
                  discount={strictItem.discount}
                  createdAt={strictItem.createdAt}
                  updatedAt={strictItem.updatedAt}
                  publishedAt={strictItem.publishedAt}
                  slug={strictItem.slug}
                  metaTitle={strictItem.metaTitle}
                  metaDescription={strictItem.metaDescription}
                  relatedProducts={strictItem.relatedProducts}
                  variants={strictItem.variants}
                  options={strictItem.options}
                  type={strictItem.type || 'product'}
                  serviceType={strictItem.serviceType}
                  availability={strictItem.availability}
                  viewMode={viewMode}
                  isFavorited={item.isFavorited}
                  onToggleFavorite={onToggleFavorite}
                  onClick={onProductClick}
                />
              ) : (
                <ProductCard
                  id={strictItem.id}
                  title={strictItem.title}
                  description={strictItem.description}
                  fullDescription={strictItem.fullDescription}
                  shortDescription={strictItem.shortDescription}
                  price={strictItem.price}
                  originalPrice={strictItem.originalPrice}
                  currency={strictItem.currency}
                  category={strictItem.category}
                  subcategory={strictItem.subcategory}
                  tags={strictItem.tags}
                  images={strictItem.images}
                  mainImage={strictItem.mainImage || strictItem.images[0] || ''}
                  seller={strictItem.seller}
                  features={strictItem.features}
                  specifications={strictItem.specifications}
                  includes={strictItem.includes}
                  requirements={strictItem.requirements}
                  rating={strictItem.rating}
                  reviewCount={strictItem.reviewCount}
                  reviews={strictItem.reviews}
                  location={strictItem.location}
                  deliveryOptions={strictItem.deliveryOptions || []}
                  deliveryTime={strictItem.deliveryTime}
                  status={strictItem.status || 'active'}
                  featured={strictItem.featured}
                  trending={strictItem.trending}
                  urgent={strictItem.urgent}
                  is24Hours={strictItem.is24Hours}
                  hasVideo={strictItem.hasVideo}
                  viewCount={strictItem.viewCount}
                  favoriteCount={strictItem.favoriteCount}
                  shareCount={strictItem.shareCount}
                  discount={strictItem.discount}
                  createdAt={strictItem.createdAt}
                  updatedAt={strictItem.updatedAt}
                  publishedAt={strictItem.publishedAt}
                  slug={strictItem.slug}
                  metaTitle={strictItem.metaTitle}
                  metaDescription={strictItem.metaDescription}
                  relatedProducts={strictItem.relatedProducts}
                  variants={strictItem.variants}
                  options={strictItem.options}
                  type={strictItem.type || 'product'}
                  serviceType={strictItem.serviceType}
                  availability={strictItem.availability}
                  viewMode={viewMode}
                  isFavorited={item.isFavorited}
                  image={item.images[0] || '/placeholder.jpg'}
                  onToggleFavorite={onToggleFavorite}
                  onClick={onProductClick}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ItemGrid;
