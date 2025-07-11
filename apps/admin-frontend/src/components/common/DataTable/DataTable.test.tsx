import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DataTable, ColumnDefinition } from './DataTable';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// Mock MUI icons
vi.mock('@mui/icons-material/ArrowUpward', () => ({
  default: vi.fn(() => <span data-testid="arrow-up">↑</span>),
}));

vi.mock('@mui/icons-material/ArrowDownward', () => ({
  default: vi.fn(() => <span data-testid="arrow-down">↓</span>),
}));

// Mock MUI components used internally by DataTable
vi.mock("@mui/material/CircularProgress", () => ({
  default: vi.fn(() => <div data-testid="mock-circular-progress" />),
}));

// Basic mock for TablePagination that allows testing event handlers
vi.mock('@mui/material/TablePagination', () => ({
  default: vi.fn(({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => (
    <div data-testid="mock-table-pagination">
      <span data-testid="pagination-info">{`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, count)} de ${count}`}</span>
      <button data-testid="next-page-button" onClick={() => onPageChange(null, page + 1)}>Next Page</button>
      <select 
        data-testid="rows-per-page-select" 
        value={rowsPerPage} 
        onChange={(e) => onRowsPerPageChange({ target: { value: e.target.value } })} 
        aria-label="Rows per page"
      >
        {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
      </select>
    </div>
  )),
}));

// Basic mock for TableSortLabel
vi.mock('@mui/material/TableSortLabel', () => ({
    default: vi.fn(({ active, direction, onClick, children }) => (
      <span data-testid="mock-table-sort-label" onClick={onClick}>
        {children}
        {active ? (direction === 'asc' ? ' (asc)' : ' (desc)') : ''}
      </span>
    )),
  }));

  // Basic mock for TableCell to ensure interaction within rows
vi.mock('@mui/material/TableCell', () => ({
    default: vi.fn(({ children, ...props }) => (
      <td data-testid="mock-table-cell" {...props}>{children}</td>
    )),
  }));

    // Basic mock for TableRow to capture row clicks
vi.mock('@mui/material/TableRow', () => ({
    default: vi.fn(({ children, onClick, ...props }) => (
      <tr data-testid="mock-table-row" onClick={onClick} {...props}>{children}</tr>
    )),
  }));

// Define mock data type
interface MockData {
  id: number;
  name: string;
  age: number;
  createdAt: string;
}

// Define mock data
const mockData: MockData[] = [
  { id: 1, name: 'John Doe', age: 30, createdAt: '2024-01-01' },
  { id: 2, name: 'Jane Smith', age: 25, createdAt: '2024-01-02' },
  { id: 3, name: 'Bob Johnson', age: 35, createdAt: '2024-01-03' },
];

// Define mock columns
const mockColumns: ColumnDefinition<MockData>[] = [
  {
    header: 'ID',
    field: 'id',
    width: '10%',
    align: 'center',
    sortField: 'id',
  },
  {
    header: 'Nombre',
    field: 'name',
    width: '40%',
    sortField: 'name',
  },
  {
    header: 'Edad',
    field: 'age',
    width: '20%',
    align: 'center',
    sortField: 'age',
  },
  {
    header: 'Fecha de Creación',
    field: 'createdAt',
    width: '20%',
    align: 'center',
  },
  {
    header: 'Acciones',
    width: '10%',
    align: 'center',
    render: (item) => (
      <button
        data-testid={`action-button-${item.id}`}
        onClick={(e) => {
          e.stopPropagation();
          // This will be handled by the test
        }}
      >
        Acción
      </button>
    ),
  },
];

describe('DataTable', () => {
  const defaultProps = {
    data: mockData,
    columns: mockColumns,
    page: 0,
    pageSize: 10,
    totalCount: mockData.length,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
    sortBy: null,
    sortDirection: null,
    onSortChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear mocks of MUI components
    vi.mocked(CircularProgress).mockClear();
    vi.mocked(TablePagination).mockClear();
    vi.mocked(TableSortLabel).mockClear();
    vi.mocked(TableCell).mockClear();
    vi.mocked(TableRow).mockClear();
  });

  it('should render basic table with data', () => {
    render(<DataTable {...defaultProps} />);

    // Verify headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Edad')).toBeInTheDocument();
    expect(screen.getByText('Fecha de Creación')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();

    // Verify data rows
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<DataTable {...defaultProps} isLoading={true} />);

    expect(screen.getByTestId('mock-circular-progress')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should show error state', () => {
    const errorMessage = 'Error de prueba';
    render(
      <DataTable
        {...defaultProps}
        isError={true}
        errorMessage={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should show empty state without filters', () => {
    const emptyMessage = 'No hay datos disponibles';
    render(
      <DataTable
        {...defaultProps}
        data={[]}
        totalCount={0}
        emptyMessage={emptyMessage}
      />
    );

    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should show empty state with filters', () => {
    render(
      <DataTable
        {...defaultProps}
        data={[]}
        totalCount={5}
        filters={{ name: 'test' }}
      />
    );

    expect(screen.getByText('No hay resultados para los filtros aplicados')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should handle pagination', async () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <DataTable
        {...defaultProps}
        totalCount={20}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

    // Verify pagination controls
    expect(screen.getByText('1-10 de 20')).toBeInTheDocument();
    expect(screen.getByTestId('mock-table-pagination')).toBeInTheDocument();

    // Click next page
    const nextPageButton = screen.getByTestId('next-page-button');
    await userEvent.click(nextPageButton);
    expect(onPageChange).toHaveBeenCalledWith(1);

    // Change page size
    const pageSizeSelect = screen.getByTestId('rows-per-page-select');
    await userEvent.selectOptions(pageSizeSelect, '25');
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it('should handle sorting', async () => {
    const onSortChange = vi.fn();

    render(
      <DataTable
        {...defaultProps}
        onSortChange={onSortChange}
      />
    );

    // Click sortable header
    const nameHeader = screen.getByText('Nombre');
    await userEvent.click(nameHeader);
    expect(onSortChange).toHaveBeenCalledWith('name');

    // Verify sort indicators
    render(
      <DataTable
        {...defaultProps}
        sortBy="name"
        sortDirection="asc"
      />
    );
    expect(screen.getByTestId('arrow-up')).toBeInTheDocument();

    render(
      <DataTable
        {...defaultProps}
        sortBy="name"
        sortDirection="desc"
      />
    );
    expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
  });

  it('should handle row click', async () => {
    const onRowClick = vi.fn();

    render(
      <DataTable
        {...defaultProps}
        onRowClick={onRowClick}
      />
    );

    // Click row
    const row = screen.getByText('John Doe').closest('tr');
    await userEvent.click(row!);
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('should handle action button click without triggering row click', async () => {
    const onRowClick = vi.fn();
    const onActionClick = vi.fn();

    // Modify mock columns to include action click handler
    const columnsWithAction = mockColumns.map(col => {
      if (col.header === 'Acciones') {
        return {
          ...col,
          render: (item: MockData) => (
            <button
              data-testid={`action-button-${item.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onActionClick(item);
              }}
            >
              Acción
            </button>
          ),
        };
      }
      return col;
    });

    render(
      <DataTable
        {...defaultProps}
        columns={columnsWithAction}
        onRowClick={onRowClick}
      />
    );

    // Click action button
    const actionButton = screen.getByTestId('action-button-1');
    await userEvent.click(actionButton);

    // Verify action was called but row click wasn't
    expect(onActionClick).toHaveBeenCalledWith(mockData[0]);
    expect(onRowClick).not.toHaveBeenCalled();
  });
}); 