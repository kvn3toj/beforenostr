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
}: DataTableProps<T>) {
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
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
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
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <Typography color="text.secondary">{message}</Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align || 'left'}
                  style={{ width: column.width }}
                  onClick={() => column.sortField && onSortChange(column.sortField)}
                  sx={{
                    cursor: column.sortField ? 'pointer' : 'default',
                    userSelect: 'none',
                    '&:hover': column.sortField ? { backgroundColor: 'action.hover' } : {},
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {column.tooltip ? (
                      <Tooltip title={column.tooltip}>
                        <Typography component="span">{column.header}</Typography>
                      </Tooltip>
                    ) : (
                      <Typography component="span">{column.header}</Typography>
                    )}
                    {renderSortIndicator(column)}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': onRowClick ? { backgroundColor: 'action.hover' } : {},
                }}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align={column.align || 'left'}
                    style={{ width: column.width }}
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
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  );
} 