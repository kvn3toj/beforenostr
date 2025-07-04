import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export const ProductDetails: React.FC = () => {
  const { id } = useParams();
  
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📦 Producto {id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detalles del producto en desarrollo
        </Typography>
      </Box>
    </Container>
  );
}; 