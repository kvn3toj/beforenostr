/**
 * 🌌 COOMUNITY DATATABLE - Enterprise Grade Component
 * ================================================
 * 
 * Tabla de datos revolucionaria que combina funcionalidad empresarial
 * con la filosofía CoomÜnity y efectos cósmicos.
 * 
 * Características:
 * - Sorting, filtering, pagination avanzados
 * - Efectos cósmicos configurables
 * - Integración con filosofía elemental
 * - Performance optimizada con memoización
 * - Modo Ayni para balance y armonía
 * - Responsive design completo
 * 
 * Design System Scaling Roadmap - Fase 4.1
 * Implementado según especificaciones de PRIORITY ALTA
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// 🎯 Material UI imports específicos
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  alpha,
  useTheme,
  useMediaQuery,
  Skeleton,
  Fab,
  Stack,
  Card,
  CardContent,
  LinearProgress,
  Button
} from '@mui/material';

// 🎯 Icons específicos
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
  ViewColumn as ColumnsIcon,
  MoreVert as MoreIcon,
  KeyboardArrowDown,
  CheckCircle,
  RadioButtonUnchecked,
  Balance as AyniIcon,
  Spa as HarmonyIcon
} from '@mui/icons-material';

// 🌟 Design System imports
import { RevolutionaryWidget } from '../../design-system/templates/RevolutionaryWidget';
import { elementalPatterns, cosmicUtils } from '../../design-system/patterns';

// 🎯 Types y interfaces
interface ColumnDef<T> {
  id: keyof T | 'actions';
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  element?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';
}

interface FilterConfig {
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: { label: string; value: any }[];
  placeholder?: string;
}

interface CosmicEffectsConfig {
  hoverRows?: boolean;
  selectionGlow?: boolean;
  sortAnimations?: boolean;
  elementalTheming?: boolean;
  ayniMode?: boolean;
}

interface AyniMetrics {
  balance: number;
  harmony: number;
  contributions: number;
  reciprocity: number;
}

interface PerformanceConfig {
  virtualScrolling?: boolean;
  lazyLoading?: boolean;
  memoizeRows?: boolean;
  maxVisibleRows?: number;
}

export interface CoomunityDataTableProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  
  // Core features
  features?: {
    sorting?: boolean;
    filtering?: boolean;
    pagination?: boolean;
    selection?: boolean;
    search?: boolean;
    export?: Array<'csv' | 'pdf' | 'excel'>;
    refresh?: boolean;
    columnVisibility?: boolean;
  };
  
  // Cosmic effects
  cosmicEffects?: CosmicEffectsConfig;
  element?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';
  cosmicIntensity?: 'subtle' | 'medium' | 'intense';
  
  // Performance
  performance?: PerformanceConfig;
  
  // Ayni integration
  ayniMode?: boolean;
  ayniMetrics?: AyniMetrics;
  
  // Event handlers
  onRowClick?: (row: T, index: number) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<keyof T, any>) => void;
  onExport?: (format: string, selectedRows: T[]) => void;
  onRefresh?: () => void;
  
  // Styling
  maxHeight?: number;
  stickyHeader?: boolean;
  density?: 'compact' | 'standard' | 'comfortable';
}

// 🎨 Cosmic row animation keyframes
const cosmicRowAnimations = {
  hover: {
    transform: 'translateZ(4px) translateY(-2px)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  selection: {
    background: 'linear-gradient(135deg, rgba(255, 183, 77, 0.1) 0%, rgba(255, 152, 0, 0.15) 100%)',
    borderLeft: '4px solid #FFB74D',
    transform: 'translateX(4px)',
  },
  ayniBalance: {
    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.15) 100%)',
    borderLeft: '4px solid #4CAF50',
  }
};

export const CoomunityDataTable = <T extends Record<string, any>>({
  data = [],
  columns = [],
  title = "Tabla de Datos",
  subtitle,
  isLoading = false,
  features = {
    sorting: true,
    filtering: true,
    pagination: true,
    selection: false,
    search: true,
    export: ['csv'],
    refresh: true,
    columnVisibility: true
  },
  cosmicEffects = {
    hoverRows: true,
    selectionGlow: true,
    sortAnimations: true,
    elementalTheming: true,
    ayniMode: false
  },
  element = 'agua', // Agua por defecto para fluidez de datos
  cosmicIntensity = 'medium',
  performance = {
    memoizeRows: true,
    maxVisibleRows: 100
  },
  ayniMode = false,
  ayniMetrics,
  onRowClick,
  onRowSelect,
  onSort,
  onFilter,
  onExport,
  onRefresh,
  maxHeight = 600,
  stickyHeader = true,
  density = 'standard'
}: CoomunityDataTableProps<T>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // 🎭 Estados del componente
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<keyof T, any>>({});
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.map(col => col.id))
  );
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  
  // 🌟 Calcular métricas Ayni dinámicas
  const calculatedAyniMetrics = useMemo(() => {
    if (!ayniMode || !data.length) return null;
    
    const balance = data.reduce((acc, row, index) => {
      return acc + (selectedRows.has(index) ? 1 : 0);
    }, 0) / data.length;
    
    const harmony = Math.min(balance * 1.2, 1); // Harmony increases with balance
    const contributions = selectedRows.size;
    const reciprocity = balance > 0.5 ? balance * 0.8 : balance * 1.2;
    
    return {
      balance: Math.round(balance * 100) / 100,
      harmony: Math.round(harmony * 100) / 100,
      contributions,
      reciprocity: Math.round(reciprocity * 100) / 100
    };
  }, [ayniMode, data, selectedRows]);
  
  // 🔍 Filtrado y búsqueda avanzada
  const filteredData = useMemo(() => {
    let result = data;
    
    // Aplicar búsqueda general
    if (features.search && searchTerm) {
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.id];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
    
    // Aplicar filtros específicos
    if (features.filtering) {
      Object.entries(filters).forEach(([key, filterValue]) => {
        if (filterValue !== undefined && filterValue !== '') {
          result = result.filter(row => {
            const value = row[key as keyof T];
            if (typeof filterValue === 'string') {
              return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
            }
            return value === filterValue;
          });
        }
      });
    }
    
    return result;
  }, [data, searchTerm, filters, columns, features.search, features.filtering]);
  
  // 📊 Sorting lógica
  const sortedData = useMemo(() => {
    if (!features.sorting || !sortBy) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue === bValue) return 0;
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortBy, sortDirection, features.sorting]);
  
  // 📄 Paginación
  const paginatedData = useMemo(() => {
    if (!features.pagination) return sortedData;
    
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, rowsPerPage, features.pagination]);
  
  // 🎨 Estilos elementales dinámicos
  const elementalStyles = useMemo(() => {
    if (!cosmicEffects.elementalTheming || !element) return {};
    
    const patterns = elementalPatterns[element];
    return {
      tableContainer: {
        background: patterns.background,
        borderRadius: '16px',
        border: `2px solid ${alpha(patterns.primaryColor, 0.3)}`,
        boxShadow: cosmicUtils.createCosmicShadow(element, cosmicIntensity === 'intense' ? 1.5 : 1),
      },
      headerRow: {
        background: `linear-gradient(135deg, ${alpha(patterns.primaryColor, 0.1)} 0%, ${alpha(patterns.secondaryColor, 0.15)} 100%)`,
      },
      selectedRow: {
        background: `linear-gradient(135deg, ${alpha(patterns.primaryColor, 0.05)} 0%, ${alpha(patterns.secondaryColor, 0.08)} 100%)`,
        borderLeft: `4px solid ${patterns.primaryColor}`,
      }
    };
  }, [cosmicEffects.elementalTheming, element, cosmicIntensity]);
  
  // 🎯 Event handlers
  const handleSort = useCallback((column: keyof T) => {
    if (!features.sorting) return;
    
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    
    onSort?.(column, sortDirection === 'asc' ? 'desc' : 'asc');
  }, [sortBy, sortDirection, features.sorting, onSort]);
  
  const handleRowSelect = useCallback((index: number) => {
    if (!features.selection) return;
    
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected).map(i => sortedData[i]));
  }, [selectedRows, features.selection, onRowSelect, sortedData]);
  
  const handleSelectAll = useCallback(() => {
    if (!features.selection) return;
    
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const allIndices = new Set(paginatedData.map((_, index) => index));
      setSelectedRows(allIndices);
      onRowSelect?.(paginatedData);
    }
  }, [selectedRows.size, paginatedData, features.selection, onRowSelect]);
  
  const handleExport = useCallback((format: string) => {
    const dataToExport = selectedRows.size > 0 
      ? Array.from(selectedRows).map(i => sortedData[i])
      : sortedData;
    
    onExport?.(format, dataToExport);
    setExportMenuAnchor(null);
  }, [selectedRows, sortedData, onExport]);
  
  // 🎨 Render header con herramientas
  const renderToolbar = () => (
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      flexWrap: 'wrap',
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
    }}>
      {/* Búsqueda */}
      {features.search && (
        <TextField
          size="small"
          placeholder="Buscar en tabla..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ minWidth: 200 }}
        />
      )}
      
      {/* Filtros */}
      {features.filtering && (
        <IconButton
          onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
          sx={{ 
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.1)
          }}
        >
          <FilterIcon />
        </IconButton>
      )}
      
      {/* Exportar */}
      {features.export && features.export.length > 0 && (
        <IconButton
          onClick={(e) => setExportMenuAnchor(e.currentTarget)}
          disabled={!sortedData.length}
        >
          <ExportIcon />
        </IconButton>
      )}
      
      {/* Refresh */}
      {features.refresh && (
        <IconButton onClick={onRefresh}>
          <RefreshIcon />
        </IconButton>
      )}
      
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Métricas Ayni */}
      {ayniMode && calculatedAyniMetrics && (
        <Stack direction="row" spacing={1}>
          <Chip
            icon={<AyniIcon />}
            label={`Balance: ${calculatedAyniMetrics.balance}`}
            size="small"
            sx={{ 
              background: elementalStyles.headerRow?.background,
              color: elementalPatterns[element].primaryColor
            }}
          />
          <Chip
            icon={<HarmonyIcon />}
            label={`Armonía: ${calculatedAyniMetrics.harmony}`}
            size="small"
            sx={{ 
              background: elementalStyles.headerRow?.background,
              color: elementalPatterns[element].secondaryColor
            }}
          />
        </Stack>
      )}
    </Box>
  );
  
  // 🎨 Render tabla principal
  const renderTable = () => (
    <TableContainer 
      sx={{ 
        maxHeight,
        ...elementalStyles.tableContainer,
        '& .MuiTable-root': {
          '& .MuiTableCell-root': {
            borderColor: alpha(theme.palette.divider, 0.1)
          }
        }
      }}
    >
      <Table stickyHeader={stickyHeader} size={density}>
        {/* Header */}
        <TableHead>
          <TableRow sx={elementalStyles.headerRow}>
            {/* Checkbox de selección múltiple */}
            {features.selection && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.size > 0 && selectedRows.size < paginatedData.length}
                  checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                  onChange={handleSelectAll}
                  sx={{
                    color: elementalPatterns[element].primaryColor,
                    '&.Mui-checked': {
                      color: elementalPatterns[element].primaryColor,
                    }
                  }}
                />
              </TableCell>
            )}
            
            {/* Columnas */}
            {columns
              .filter(col => visibleColumns.has(col.id))
              .map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || 'left'}
                  sx={{
                    fontWeight: 600,
                    color: elementalPatterns[element].primaryColor,
                    width: column.width
                  }}
                >
                  {column.sortable && features.sorting ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                      sx={{
                        '&.MuiTableSortLabel-root': {
                          color: elementalPatterns[element].primaryColor,
                        },
                        '&.Mui-active': {
                          color: elementalPatterns[element].secondaryColor,
                        }
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        
        {/* Body */}
        <TableBody>
          {isLoading ? (
            // Skeleton mientras carga
            Array.from({ length: rowsPerPage }).map((_, index) => (
              <TableRow key={index}>
                {features.selection && <TableCell><Skeleton variant="rectangular" width={20} height={20} /></TableCell>}
                {columns.map((column) => (
                  <TableCell key={String(column.id)}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : paginatedData.length === 0 ? (
            // Estado vacío
            <TableRow>
              <TableCell colSpan={columns.length + (features.selection ? 1 : 0)} align="center">
                <Box sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay datos para mostrar
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            // Datos reales
            paginatedData.map((row, index) => {
              const globalIndex = page * rowsPerPage + index;
              const isSelected = selectedRows.has(index);
              const isHovered = hoveredRow === index;
              
              return (
                <TableRow
                  key={globalIndex}
                  hover
                  selected={isSelected}
                  onClick={() => onRowClick?.(row, globalIndex)}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    ...(isSelected && elementalStyles.selectedRow),
                    ...(isHovered && cosmicEffects.hoverRows && cosmicRowAnimations.hover),
                    ...(ayniMode && calculatedAyniMetrics?.balance > 0.7 && cosmicRowAnimations.ayniBalance),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Checkbox */}
                  {features.selection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleRowSelect(index)}
                        sx={{
                          color: elementalPatterns[element].primaryColor,
                          '&.Mui-checked': {
                            color: elementalPatterns[element].primaryColor,
                          }
                        }}
                      />
                    </TableCell>
                  )}
                  
                  {/* Celdas de datos */}
                  {columns
                    .filter(col => visibleColumns.has(col.id))
                    .map((column) => {
                      const value = row[column.id];
                      const cellContent = column.render 
                        ? column.render(value, row, globalIndex)
                        : value;
                      
                      return (
                        <TableCell
                          key={String(column.id)}
                          align={column.align || 'left'}
                          sx={{
                            ...(column.element && {
                              color: elementalPatterns[column.element].primaryColor
                            })
                          }}
                        >
                          {cellContent}
                        </TableCell>
                      );
                    })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  return (
    <RevolutionaryWidget
      title={title}
      subtitle={subtitle}
      element={element}
      cosmicIntensity={cosmicIntensity}
      cosmicEffects={{
        enableGlow: cosmicEffects.elementalTheming,
        enableAnimations: cosmicEffects.sortAnimations,
        glowIntensity: cosmicIntensity === 'intense' ? 1.5 : 1
      }}
      style={{ overflow: 'hidden' }}
    >
      {/* 🛠️ Toolbar */}
      {renderToolbar()}
      
      {/* 📊 Tabla principal */}
      {renderTable()}
      
      {/* 📄 Paginación */}
      {features.pagination && !isLoading && (
        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '& .MuiTablePagination-toolbar': {
              background: elementalStyles.headerRow?.background
            }
          }}
        />
      )}
      
      {/* 🎛️ Menús contextuales */}
      
      {/* Menú de exportar */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={() => setExportMenuAnchor(null)}
      >
        {features.export?.map((format) => (
          <MenuItem key={format} onClick={() => handleExport(format)}>
            Exportar como {format.toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
      
      {/* Menú de filtros */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{ sx: { minWidth: 200 } }}
      >
        <MenuItem onClick={() => setFilters({})}>
          Limpiar filtros
        </MenuItem>
        {/* Aquí se pueden agregar filtros específicos */}
      </Menu>
    </RevolutionaryWidget>
  );
};

export default CoomunityDataTable; 