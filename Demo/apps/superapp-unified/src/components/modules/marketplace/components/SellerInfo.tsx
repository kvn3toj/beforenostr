import React from 'react';
import { Box, Badge, Avatar, Typography } from '@mui/material';
import { Verified, LocationOn, DeliveryDining } from '@mui/icons-material';

export interface SellerInfoProps {
  seller: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    isOnline?: boolean;
    responseTime?: string;
    rating?: number;
  };
  location: string;
  deliveryTime?: string;
  compact?: boolean;
}

const SellerInfo: React.FC<SellerInfoProps> = ({
  seller,
  location,
  deliveryTime,
  compact = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: compact ? 'center' : 'flex-start',
        gap: 1,
      }}
    >
      {/* Info del vendedor */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            seller.isOnline ? (
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  border: '2px solid white',
                }}
              />
            ) : null
          }
        >
          <Avatar
            src={seller.avatar}
            sx={{ width: compact ? 24 : 32, height: compact ? 24 : 32 }}
          />
        </Badge>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant={compact ? 'caption' : 'body2'}
              fontWeight="bold"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {seller.name || 'Usuario'}
            </Typography>
            {seller.verified && (
              <Verified
                sx={{ fontSize: compact ? 12 : 16, color: '#1976d2' }}
              />
            )}
          </Box>

          {!compact && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {seller.username}
            </Typography>
          )}

          {seller.responseTime && !compact && (
            <Typography variant="caption" color="text.secondary">
              Responde en {seller.responseTime}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Info de ubicación y entrega */}
      <Box sx={{ textAlign: 'right', minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <LocationOn
            sx={{ fontSize: compact ? 12 : 14, color: 'text.secondary' }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 80,
            }}
          >
            {(location || 'Online').split(',')[0]}
          </Typography>
        </Box>

        {deliveryTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DeliveryDining
              sx={{ fontSize: compact ? 12 : 14, color: 'text.secondary' }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 80,
              }}
            >
              {deliveryTime}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SellerInfo;
