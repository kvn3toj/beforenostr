import React from 'react';
import {
  Typography,
  Container,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data para demostración
const mockAuditLogs = [
  {
    id: '1',
    created_at: '2024-01-15T10:30:00Z',
    user_id: 'user123',
    action: 'create',
    entity_type: 'Challenge',
    entity_id: 'challenge456',
    changes: { title: 'New Challenge', status: 'active' },
  },
  {
    id: '2',
    created_at: '2024-01-15T11:45:00Z',
    user_id: 'user456',
    action: 'update',
    entity_type: 'User',
    entity_id: 'user789',
    changes: { email: 'new@email.com' },
  },
  {
    id: '3',
    created_at: '2024-01-15T12:15:00Z',
    user_id: 'admin123',
    action: 'delete',
    entity_type: 'Group',
    entity_id: 'group123',
    changes: null,
  },
];

// Función auxiliar para formatear la fecha
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Función auxiliar para formatear los cambios
const formatChanges = (changes: Record<string, unknown> | null) => {
  if (!changes) return '-';
  return JSON.stringify(changes, null, 2);
};

export const AuditLogsPage: React.FC = () => {
  const { user } = useAuth();

  // Verificar si el usuario está autenticado y es admin
  // Para simplificar, asumimos que cualquier usuario autenticado puede ver los logs
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Simular loading y datos
  const isLoading = false;
  const error = null;
  const auditLogs = mockAuditLogs;

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Error al cargar los registros de auditoría
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registros de Auditoría
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Esta es una página de demostración con datos simulados.
        </Alert>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="audit logs table">
            <TableHead>
              <TableRow>
                <TableCell>Fecha/Hora</TableCell>
                <TableCell>Usuario ID</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell>Tipo Entidad</TableCell>
                <TableCell>ID Entidad</TableCell>
                <TableCell>Cambios</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow
                  key={log.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {formatDate(log.created_at)}
                  </TableCell>
                  <TableCell>{log.user_id}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      color={
                        log.action === 'create' ? 'success' :
                        log.action === 'update' ? 'info' :
                        log.action === 'delete' ? 'error' :
                        'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.entity_type}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.entity_id}</TableCell>
                  <TableCell>
                    <Box
                      component="pre"
                      sx={{
                        maxHeight: '100px',
                        overflow: 'auto',
                        fontSize: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxWidth: '200px',
                      }}
                    >
                      {formatChanges(log.changes)}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {auditLogs.length === 0 && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info">
              No hay registros de auditoría disponibles.
            </Alert>
          </Box>
        )}
      </Box>
    </Container>
  );
}; 