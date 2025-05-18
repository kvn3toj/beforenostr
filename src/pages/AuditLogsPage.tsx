import React, { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  TextField,
  Stack,
  Chip,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { useAuditLogsQuery } from '../hooks/system/useAuditLogsQuery';
import { useHasRole } from '../hooks/useHasRole';
import type { AuditLog } from '../types/system.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FetchAuditLogsParams } from '../services/system.service';

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
const formatChanges = (changes: Record<string, any> | null) => {
  if (!changes) return '-';
  return JSON.stringify(changes, null, 2);
};

export const AuditLogsPage: React.FC = () => {
  // Verificar permisos
  const isSuperAdmin = useHasRole('Super Admin');

  // Si no es Super Admin, redirigir al dashboard
  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  // Obtener datos de auditoría
  const { data: auditLogs, isLoading, error } = useAuditLogsQuery();

  // Definir columnas de la tabla
  const auditLogColumns: ColumnDefinition<AuditLog>[] = [
    {
      header: 'Fecha/Hora',
      field: 'created_at',
      width: '20%',
      render: (log) => formatDate(log.created_at),
    },
    {
      header: 'Usuario ID',
      field: 'user_id',
      width: '15%',
    },
    {
      header: 'Acción',
      field: 'action',
      width: '15%',
      render: (log) => (
        <Chip
          label={log.action}
          color={
            log.action === 'create' ? 'success' :
            log.action === 'update' ? 'info' :
            log.action === 'delete' ? 'error' :
            log.action === 'status_change' ? 'warning' : 'default'
          }
          size="small"
        />
      ),
    },
    {
      header: 'Tipo Entidad',
      field: 'entity_type',
      width: '15%',
      render: (log) => (
        <Chip
          label={log.entity_type}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      header: 'ID Entidad',
      field: 'entity_id',
      width: '15%',
    },
    {
      header: 'Cambios',
      field: 'changes',
      width: '20%',
      render: (log) => (
        <Box
          component="pre"
          sx={{
            maxHeight: '100px',
            overflow: 'auto',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {formatChanges(log.changes)}
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registros de Auditoría
        </Typography>

        <DataTable
          data={auditLogs}
          columns={auditLogColumns}
          isLoading={isLoading}
          isError={!!error}
          errorMessage={error?.message}
          emptyMessage="No hay registros de auditoría disponibles."
        />
      </Box>
    </Container>
  );
}; 