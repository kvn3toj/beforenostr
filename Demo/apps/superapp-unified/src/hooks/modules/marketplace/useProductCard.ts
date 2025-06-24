import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  useUpdateMarketplaceItem,
  useDeleteMarketplaceItem,
} from '../../useRealBackendData';

export interface UseProductCardProps {
  id: string;
  sellerId?: string;
  images: string[];
  isFavorited: boolean;
  onToggleFavorite?: (id: string) => void;
  onClick?: (id: string) => void;
  onRefresh?: () => void;
}

export const useProductCard = ({
  id,
  sellerId,
  images = [],
  isFavorited,
  onToggleFavorite,
  onClick,
  onRefresh,
}: UseProductCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  // State
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isFavoritedLocal, setIsFavoritedLocal] = useState(isFavorited);

  // Mutations
  const deleteItemMutation = useDeleteMarketplaceItem();

  // Derived State
  const isOwner = user?.id === sellerId;

  // Event Handlers
  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    } else {
      navigate(`/marketplace/product/${id}`);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleCloseQuickView = () => setShowQuickView(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    setIsAddingToCart(false);
    // Visual feedback
    if (cardRef.current) {
      cardRef.current.style.transform = 'scale(1.05)';
      setTimeout(() => {
        if (cardRef.current) cardRef.current.style.transform = '';
      }, 150);
    }
  };

  const handleImageNavigation = (
    e: React.MouseEvent,
    direction: 'next' | 'prev',
  ) => {
    e.stopPropagation();
    if (direction === 'next') {
      setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    } else {
      setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavoritedLocal(!isFavoritedLocal);
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  // Edit/Delete Handlers
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteItemMutation.mutateAsync(id);
      setShowDeleteDialog(false);
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditSave = () => {
    setEditModalOpen(false);
    onRefresh?.();
  };

  return {
    // Refs
    cardRef,
    // State
    isHovered,
    showDeleteDialog,
    anchorEl,
    showQuickView,
    isAddingToCart,
    currentImageIndex,
    isMenuOpen,
    editModalOpen,
    isFavoritedLocal,
    // Derived State
    isOwner,
    // Mutations
    deleteItemMutation,
    // Handlers
    handleCardClick,
    handleMenuOpen,
    handleMenuClose,
    handleQuickView,
    handleCloseQuickView,
    handleAddToCart,
    handleImageNavigation,
    handleToggleFavorite,
    handleEditClick,
    handleDeleteClick,
    handleDeleteConfirm,
    handleEditSave,
    setIsHovered,
    setShowDeleteDialog,
    setEditModalOpen,
  };
};
