import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AttachMoney, TrendingUp, AccountBalance } from '@mui/icons-material';
import { apiService } from '../services/api.service';

interface Token {
  id: string;
  userId: string;
  amount: number;
  type: string;
  status: string;
  caducityDate?: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string;
    username: string;
  };
}

const fetchTokens = async (): Promise<Token[]> => {
  return apiService.get<Token[]>('/tokens');
};

export const TokensPage: React.FC = () => {
  const {
    data: tokens,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading tokens: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  // Calcular estadísticas
  const totalTokens = tokens?.reduce((sum, token) => sum + token.amount, 0) || 0;
  const activeTokens = tokens?.filter(token => token.status === 'ACTIVE').length || 0;
  const tokenTypes = new Set(tokens?.map(token => token.type)).size || 0;

  // Agrupar tokens por tipo para mostrar totales
  const tokensByType = tokens?.reduce((acc, token) => {
    if (!acc[token.type]) {
      acc[token.type] = 0;
    }
    acc[token.type] += token.amount;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Tokens del Sistema
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestión y visualización de tokens de gamificación
      </Typography>

      {/* Estadísticas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Tokens
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {totalTokens.toLocaleString()}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tokens Activos
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {activeTokens}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tipos de Token
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {tokenTypes}
                  </Typography>
                </Box>
                <AccountBalance sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resumen por tipo de token */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(tokensByType).map(([type, amount]) => (
          <Grid item xs={12} sm={6} md={3} key={type}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  {type.replace(/_/g, ' ')}
                </Typography>
                <Typography variant="h6">
                  {amount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabla de tokens */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Tokens
          </Typography>
          
          {tokens && tokens.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell>Fuente</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Caducidad</TableCell>
                    <TableCell>Fecha de Creación</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell>
                        {token.user ? (
                          <Box>
                            <Typography variant="body2">{token.user.name || token.user.username}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {token.user.email}
                            </Typography>
                          </Box>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={token.type.replace(/_/g, ' ')} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {token.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {token.source.replace(/_/g, ' ')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={token.status} 
                          size="small" 
                          color={token.status === 'ACTIVE' ? 'success' : token.status === 'EXPIRED' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {token.caducityDate ? (
                          new Date(token.caducityDate).toLocaleDateString()
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin caducidad
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(token.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron tokens en el sistema
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 