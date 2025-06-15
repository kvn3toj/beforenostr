import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '../Icons';
import React from 'react';

// Define the type for column definitions
export interface ColumnDefinition<T> {
  header: string;
  field?: keyof T; // Optional field name for simple text rendering
  render?: (item: T) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortField?: string; // Field name to use for sorting
  tooltip?: string; // Optional tooltip for the column header
}

// Define the props for the DataTable component
interface DataTableProps<T> {
  data: T[] | undefined;
  columns: ColumnDefinition<T>[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  // Pagination props
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  // Sorting props
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSortChange: (field: string) => void;
  // Filter props
  filters?: Record<string, any>;
  // Accessibility props
  caption?: string; // Caption describing the table
  'aria-label'?: string; // Aria label for the table
  'aria-describedby'?: string; // Element ID that describes the table
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  isError = false,
  errorMessage = 'Error al cargar los datos',
  onRowClick,
  emptyMessage = 'No hay datos disponibles',
  // Pagination props
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  // Sorting props
  sortBy,
  sortDirection,
  onSortChange,
  // Filter props
  filters,
  // Accessibility props
  caption,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: DataTableProps<T>) {
  // Generar ID único para la tabla
  const tableId = React.useMemo(() => 
    `datatable-${Math.random().toString(36).substr(2, 9)}`, []
  );

  // Helper function to get aria-sort value
  const getAriaSort = (column: ColumnDefinition<T>) => {
    if (!column.sortField) return undefined;
    
    if (sortBy === column.sortField) {
      return sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none';
    }
    
    return 'none';
  };

  // Helper function to render cell content
  const renderCell = (item: T, column: ColumnDefinition<T>) => {
    if (column.render) {
      return column.render(item);
    }
    
    if (column.field) {
      const value = item[column.field];
      
      // Format dates if the value is a date string
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        try {
          return format(new Date(value), 'PPP', { locale: es });
        } catch {
          return value;
        }
      }
      
      return value;
    }
    
    return null;
  };

  // Helper function to render sort indicator
  const renderSortIndicator = (column: ColumnDefinition<T>) => {
    if (!column.sortField) return null;

    const isActive = sortBy === column.sortField;
    const direction = isActive ? sortDirection : null;

    return (
      <Box component="span" sx={{ ml: 1, display: 'inline-flex', alignItems: 'center' }}>
        {direction === 'asc' && <ArrowUpwardIcon fontSize="small" />}
        {direction === 'desc' && <ArrowDownwardIcon fontSize="small" />}
      </Box>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3} role="status" aria-live="polite">
        <CircularProgress aria-label="Cargando datos" />
        <Typography variant="body2" sx={{ ml: 2 }}>Cargando datos...</Typography>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }} role="alert">
        {errorMessage}
      </Alert>
    );
  }

  // Empty state with different messages based on filters
  if (!data || data.length === 0) {
    const message = totalCount > 0 && filters
      ? 'No hay resultados para los filtros aplicados'
      : emptyMessage;
    
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3} role="status">
        <Typography color="text.secondary">{message}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={1} sx={{ overflow: 'hidden' }}>
      <TableContainer role="region" aria-label="Contenedor de tabla de datos">
        <Table 
          id={tableId}
          role="table"
          aria-label={ariaLabel || 'Tabla de datos'}
          aria-describedby={ariaDescribedBy}
          aria-rowcount={totalCount}
          aria-colcount={columns.length}
        >
          {caption && (
            <caption 
              style={{ 
                captionSide: 'top', 
                textAlign: 'left', 
                padding: '16px',
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#1976d2'
              }}
            >
              {caption}
            </caption>
          )}
          <TableHead role="rowgroup">
            <TableRow role="row" aria-rowindex={1}>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  component="th"
                  scope="col"
                  align={column.align || 'left'}
                  style={{ width: column.width }}
                  onClick={() => column.sortField && onSortChange(column.sortField)}
                  aria-sort={getAriaSort(column)}
                  aria-colindex={index + 1}
                  role="columnheader"
                  tabIndex={column.sortField ? 0 : -1}
                  onKeyDown={(e) => {
                    if (column.sortField && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSortChange(column.sortField);
                    }
                  }}
                  sx={{
                    cursor: column.sortField ? 'pointer' : 'default',
                    userSelect: 'none',
                    fontWeight: 600,
                    backgroundColor: 'grey.50',
                    borderBottom: '2px solid',
                    borderBottomColor: 'primary.main',
                    '&:hover': column.sortField ? { backgroundColor: 'action.hover' } : {},
                    '&:focus': column.sortField ? { 
                      backgroundColor: 'action.selected', 
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: '-2px'
                    } : {},
                  }}
                  aria-label={column.sortField ? 
                    `${column.header}. Columna ordenable. ${
                      sortBy === column.sortField 
                        ? `Actualmente ordenada ${sortDirection === 'asc' ? 'ascendente' : 'descendente'}` 
                        : 'Hacer clic para ordenar'
                    }` : 
                    column.header
                  }
                >
                  <Box display="flex" alignItems="center">
                    {column.tooltip ? (
                      <Tooltip title={column.tooltip}>
                        <Typography component="span" sx={{ fontWeight: 'inherit' }}>
                          {column.header}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography component="span" sx={{ fontWeight: 'inherit' }}>
                        {column.header}
                      </Typography>
                    )}
                    {renderSortIndicator(column)}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody role="rowgroup">
            {data.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
                role="row"
                aria-rowindex={page * pageSize + rowIndex + 2} // +2 because header is row 1
                tabIndex={onRowClick ? 0 : -1}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onRowClick(item);
                  }
                }}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:nth-of-type(even)': {
                    backgroundColor: 'grey.25',
                  },
                  '&:hover': onRowClick ? { 
                    backgroundColor: 'action.hover',
                    '& td': {
                      backgroundColor: 'transparent'
                    }
                  } : {},
                  '&:focus': onRowClick ? { 
                    backgroundColor: 'action.selected', 
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '-2px',
                    '& td': {
                      backgroundColor: 'transparent'
                    }
                  } : {},
                }}
                aria-label={onRowClick ? `Fila ${rowIndex + 1} de ${data.length}. Hacer clic para ver detalles` : undefined}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align={column.align || 'left'}
                    style={{ width: column.width }}
                    role="gridcell"
                    aria-colindex={colIndex + 1}
                    sx={{
                      borderBottom: '1px solid',
                      borderBottomColor: 'divider',
                      py: 2,
                    }}
                  >
                    {renderCell(item, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(event) => onPageSizeChange(parseInt(event.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
        aria-label="Navegación de páginas de la tabla"
        sx={{
          borderTop: '1px solid',
          borderTopColor: 'divider',
          backgroundColor: 'grey.50',
        }}
      />
    </Paper>
  );
} 