import React, { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  useTheme,
  Chip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  useTotalUsersQuery,
  useTotalPlaylistsQuery,
  useTotalMundosQuery,
} from '../hooks/analytics';
import { useUsersCreatedOverTimeQuery } from '../hooks/analytics/useUsersCreatedOverTimeQuery';
import { usePlaylistsCreatedOverTimeQuery } from '../hooks/analytics/usePlaylistsCreatedOverTimeQuery';
import { useMundosCreatedOverTimeQuery } from '../hooks/analytics/useMundosCreatedOverTimeQuery';
import { useTopViewedPlaylistsQuery } from '../hooks/analytics/useTopViewedPlaylistsQuery';
import { useTopViewedMundosQuery } from '../hooks/analytics/useTopViewedMundosQuery';
import { useActiveUsersOverTimeQuery } from '../hooks/analytics/useActiveUsersOverTimeQuery';
import { useTopInteractedContentQuery } from '../hooks/analytics/useTopInteractedContentQuery';
import { useLeastViewedPlaylistsQuery } from '../hooks/analytics/useLeastViewedPlaylistsQuery';
import { useLeastViewedMundosQuery } from '../hooks/analytics/useLeastViewedMundosQuery';
import { useLeastInteractedPlaylistsQuery } from '../hooks/analytics/useLeastInteractedPlaylistsQuery';
import { useLeastInteractedMundosQuery } from '../hooks/analytics/useLeastInteractedMundosQuery';
import { TimeInterval, TimeSeriesDataPoint, ContentViewMetric, ContentInteractionMetric } from '../types/analytics.types';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';

// Función auxiliar para obtener el número de semana
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Extender el prototipo de Date para añadir getWeek
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function(): number {
  return getWeekNumber(this);
};

// Componente para mostrar una métrica individual
interface MetricCardProps {
  title: string;
  value: number | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  isLoading,
  isError,
  error,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error?.message || 'Error al cargar'}
          </Alert>
        ) : (
          <Typography variant="h4" component="div" sx={{ mt: 1 }}>
            {value?.toLocaleString() || '0'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para mostrar la serie temporal
interface TimeSeriesSectionProps {
  title: string;
  data: TimeSeriesDataPoint[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  interval: TimeInterval;
  onIntervalChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  lineName: string;
  lineColor: string;
}

const TimeSeriesSection: React.FC<TimeSeriesSectionProps> = ({
  title,
  data,
  isLoading,
  isError,
  error,
  interval,
  onIntervalChange,
  lineName,
  lineColor,
}) => {
  const theme = useTheme();

  // Función para formatear la fecha en el eje X
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    switch (interval) {
      case 'day':
        return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
      case 'week':
        return `Sem ${date.getWeek()}`;
      case 'month':
        return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString();
    }
  };

  // Función para formatear el tooltip
  const formatTooltip = (value: number, name: string) => {
    return [`${value.toLocaleString()} ${lineName.toLowerCase()}`, name];
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Intervalo</InputLabel>
          <Select
            value={interval}
            label="Intervalo"
            onChange={onIntervalChange}
          >
            <MenuItem value="day">Diario</MenuItem>
            <MenuItem value="week">Semanal</MenuItem>
            <MenuItem value="month">Mensual</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ width: '100%', height: 400 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            {error?.message || 'Error al cargar los datos'}
          </Alert>
        ) : !data?.length ? (
          <Alert severity="info" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            No hay datos disponibles para el período seleccionado
          </Alert>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="time_period"
                tickFormatter={formatXAxis}
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name={lineName}
                stroke={lineColor}
                strokeWidth={2}
                dot={{ fill: lineColor }}
                activeDot={{ r: 8, fill: lineColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

// Define column configuration for the top viewed playlists table
const topViewedPlaylistsColumns: ColumnDefinition<ContentViewMetric>[] = [
  {
    header: 'Nombre',
    field: 'name',
    width: '60%',
  },
  {
    header: 'Vistas',
    field: 'view_count',
    width: '40%',
    align: 'right',
    render: (item) => (
      <Typography variant="body2" color="text.secondary">
        {item.view_count.toLocaleString()}
      </Typography>
    ),
  },
];

// Define column configuration for the top viewed mundos table
const topViewedMundosColumns: ColumnDefinition<ContentViewMetric>[] = [
  {
    header: 'Nombre',
    field: 'name',
    width: '60%',
  },
  {
    header: 'Vistas',
    field: 'view_count',
    width: '40%',
    align: 'right',
    render: (item) => (
      <Typography variant="body2" color="text.secondary">
        {item.view_count.toLocaleString()}
      </Typography>
    ),
  },
];

// Define column configuration for the top interacted content table
const topInteractedContentColumns: ColumnDefinition<ContentInteractionMetric>[] = [
  {
    header: 'Nombre',
    field: 'name',
    width: '40%',
  },
  {
    header: 'Tipo',
    field: 'content_type',
    width: '20%',
    render: (item) => (
      <Chip
        label={item.content_type === 'playlist' ? 'Playlist' : 'Mundo'}
        color={item.content_type === 'playlist' ? 'secondary' : 'info'}
        size="small"
      />
    ),
  },
  {
    header: 'Interacciones',
    field: 'interaction_count',
    width: '40%',
    align: 'right',
    render: (item) => (
      <Typography variant="body2" color="text.secondary">
        {item.interaction_count.toLocaleString()}
      </Typography>
    ),
  },
];

// Define column configuration for the least viewed playlists table
const leastViewedPlaylistsColumns: ColumnDefinition<ContentViewMetric>[] = [
  {
    header: 'Nombre',
    field: 'name',
    width: '60%',
  },
  {
    header: 'Vistas',
    field: 'view_count',
    width: '40%',
    align: 'right',
    render: (item) => (
      <Typography variant="body2" color="text.secondary">
        {item.view_count.toLocaleString()}
      </Typography>
    ),
  },
];

// Define column configuration for the least viewed mundos table
const leastViewedMundosColumns: ColumnDefinition<ContentViewMetric>[] = [
  {
    header: 'Nombre',
    field: 'name',
    width: '60%',
  },
  {
    header: 'Vistas',
    field: 'view_count',
    width: '40%',
    align: 'right',
    render: (item) => (
      <Typography variant="body2" color="text.secondary">
        {item.view_count.toLocaleString()}
      </Typography>
    ),
  },
];

// Define column configuration for the least interacted playlists table
const leastInteractedPlaylistsColumns: ColumnDefinition<ContentInteractionMetric>[] = [
  {
    header: 'Nombre',
    field: 'name',
    width: '60%',
  },
  {
    header: 'Interacciones',
    field: 'interaction_count',
    width: '40%',
    align: 'right',
    render: (item) => (
      <Typography variant="body2" color="text.secondary">
        {item.interaction_count.toLocaleString()}
      </Typography>
    ),
  },
];

// Define column configuration for the least interacted mundos table
const leastInteractedMundosColumns: ColumnDefinition<ContentInteractionMetric>[] = [
  {
    header: 'Nombre',
    field: 'name',
    width: '60%',
  },
  {
    header: 'Interacciones',
    field: 'interaction_count',
    width: '40%',
    align: 'right',
    render: (item) => (
      <Typography variant="body2" color="text.secondary">
        {item.interaction_count.toLocaleString()}
      </Typography>
    ),
  },
];

export const AnalyticsPage: React.FC = () => {
  const theme = useTheme();
  const [interval, setInterval] = useState<TimeInterval>('day');
  
  // Calcular fechas por defecto (último mes)
  const endDate = new Date().toISOString();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  const startDateStr = startDate.toISOString();

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: usersError,
  } = useTotalUsersQuery();

  const {
    data: playlistsData,
    isLoading: isLoadingPlaylists,
    isError: isErrorPlaylists,
    error: playlistsError,
  } = useTotalPlaylistsQuery();

  const {
    data: mundosData,
    isLoading: isLoadingMundos,
    isError: isErrorMundos,
    error: mundosError,
  } = useTotalMundosQuery();

  const {
    data: usersCreatedData,
    isLoading: isLoadingUsersCreated,
    isError: isErrorUsersCreated,
    error: usersCreatedError,
  } = useUsersCreatedOverTimeQuery({
    interval,
    startDate: startDateStr,
    endDate,
  });

  const {
    data: playlistsCreatedData,
    isLoading: isLoadingPlaylistsCreated,
    isError: isErrorPlaylistsCreated,
    error: playlistsCreatedError,
  } = usePlaylistsCreatedOverTimeQuery({
    interval,
    startDate: startDateStr,
    endDate,
  });

  const {
    data: mundosCreatedData,
    isLoading: isLoadingMundosCreated,
    isError: isErrorMundosCreated,
    error: mundosCreatedError,
  } = useMundosCreatedOverTimeQuery({
    interval,
    startDate: startDateStr,
    endDate,
  });

  const {
    data: topViewedPlaylists,
    isLoading: isLoadingTopViewedPlaylists,
    isError: isErrorTopViewedPlaylists,
    error: topViewedPlaylistsError,
  } = useTopViewedPlaylistsQuery();

  const {
    data: topViewedMundos,
    isLoading: isLoadingTopViewedMundos,
    isError: isErrorTopViewedMundos,
    error: topViewedMundosError,
  } = useTopViewedMundosQuery();

  const {
    data: activeUsersData,
    isLoading: isLoadingActiveUsers,
    isError: isErrorActiveUsers,
    error: activeUsersError,
  } = useActiveUsersOverTimeQuery({
    interval,
    startDate: startDateStr,
    endDate,
  });

  const {
    data: topInteractedContent,
    isLoading: isLoadingTopInteractedContent,
    isError: isErrorTopInteractedContent,
    error: topInteractedContentError,
  } = useTopInteractedContentQuery();

  const {
    data: leastViewedPlaylists,
    isLoading: isLoadingLeastViewedPlaylists,
    isError: isErrorLeastViewedPlaylists,
    error: leastViewedPlaylistsError,
  } = useLeastViewedPlaylistsQuery();

  const {
    data: leastViewedMundos,
    isLoading: isLoadingLeastViewedMundos,
    isError: isErrorLeastViewedMundos,
    error: leastViewedMundosError,
  } = useLeastViewedMundosQuery();

  const {
    data: leastInteractedPlaylists,
    isLoading: isLoadingLeastInteractedPlaylists,
    isError: isErrorLeastInteractedPlaylists,
    error: leastInteractedPlaylistsError,
  } = useLeastInteractedPlaylistsQuery();

  const {
    data: leastInteractedMundos,
    isLoading: isLoadingLeastInteractedMundos,
    isError: isErrorLeastInteractedMundos,
    error: leastInteractedMundosError,
  } = useLeastInteractedMundosQuery();

  const handleIntervalChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setInterval(event.target.value as TimeInterval);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Total Usuarios"
            value={usersData?.count}
            isLoading={isLoadingUsers}
            isError={isErrorUsers}
            error={usersError}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Total Playlists"
            value={playlistsData?.count}
            isLoading={isLoadingPlaylists}
            isError={isErrorPlaylists}
            error={playlistsError}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Total Mundos"
            value={mundosData?.count}
            isLoading={isLoadingMundos}
            isError={isErrorMundos}
            error={mundosError}
          />
        </Grid>
      </Grid>

      <TimeSeriesSection
        title="Usuarios Activos a lo Largo del Tiempo"
        data={activeUsersData}
        isLoading={isLoadingActiveUsers}
        isError={isErrorActiveUsers}
        error={activeUsersError}
        interval={interval}
        onIntervalChange={handleIntervalChange}
        lineName="Usuarios Activos"
        lineColor={theme.palette.warning.main}
      />

      <TimeSeriesSection
        title="Usuarios Creados a lo Largo del Tiempo"
        data={usersCreatedData}
        isLoading={isLoadingUsersCreated}
        isError={isErrorUsersCreated}
        error={usersCreatedError}
        interval={interval}
        onIntervalChange={handleIntervalChange}
        lineName="Usuarios Creados"
        lineColor={theme.palette.primary.main}
      />

      <TimeSeriesSection
        title="Playlists Creadas a lo Largo del Tiempo"
        data={playlistsCreatedData}
        isLoading={isLoadingPlaylistsCreated}
        isError={isErrorPlaylistsCreated}
        error={playlistsCreatedError}
        interval={interval}
        onIntervalChange={handleIntervalChange}
        lineName="Playlists Creadas"
        lineColor={theme.palette.secondary.main}
      />

      <TimeSeriesSection
        title="Mundos Creados a lo Largo del Tiempo"
        data={mundosCreatedData}
        isLoading={isLoadingMundosCreated}
        isError={isErrorMundosCreated}
        error={mundosCreatedError}
        interval={interval}
        onIntervalChange={handleIntervalChange}
        lineName="Mundos Creados"
        lineColor={theme.palette.info.main}
      />

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Top 10 Playlists Más Vistas
        </Typography>
        <DataTable
          data={topViewedPlaylists}
          columns={topViewedPlaylistsColumns}
          isLoading={isLoadingTopViewedPlaylists}
          isError={isErrorTopViewedPlaylists}
          errorMessage={topViewedPlaylistsError?.message}
          emptyMessage="No hay datos de vistas disponibles"
          // Pagination props (disabled for top 10)
          page={0}
          pageSize={10}
          totalCount={topViewedPlaylists?.length || 0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          // Sorting props (disabled for top 10)
          sortBy={null}
          sortDirection={null}
          onSortChange={() => {}}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Top 10 Playlists Menos Vistas
        </Typography>
        <DataTable
          data={leastViewedPlaylists}
          columns={leastViewedPlaylistsColumns}
          isLoading={isLoadingLeastViewedPlaylists}
          isError={isErrorLeastViewedPlaylists}
          errorMessage={leastViewedPlaylistsError?.message}
          emptyMessage="No hay datos de vistas disponibles para playlists menos vistas"
          // Pagination props (disabled for top 10)
          page={0}
          pageSize={10}
          totalCount={leastViewedPlaylists?.length || 0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          // Sorting props (disabled for top 10)
          sortBy={null}
          sortDirection={null}
          onSortChange={() => {}}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Top 10 Mundos Más Vistas
        </Typography>
        <DataTable
          data={topViewedMundos}
          columns={topViewedMundosColumns}
          isLoading={isLoadingTopViewedMundos}
          isError={isErrorTopViewedMundos}
          errorMessage={topViewedMundosError?.message}
          emptyMessage="No hay datos de vistas disponibles"
          // Pagination props (disabled for top 10)
          page={0}
          pageSize={10}
          totalCount={topViewedMundos?.length || 0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          // Sorting props (disabled for top 10)
          sortBy={null}
          sortDirection={null}
          onSortChange={() => {}}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Top 10 Mundos Menos Vistos
        </Typography>
        <DataTable
          data={leastViewedMundos}
          columns={leastViewedMundosColumns}
          isLoading={isLoadingLeastViewedMundos}
          isError={isErrorLeastViewedMundos}
          errorMessage={leastViewedMundosError?.message}
          emptyMessage="No hay datos de vistas disponibles para mundos menos vistos"
          // Pagination props (disabled for top 10)
          page={0}
          pageSize={10}
          totalCount={leastViewedMundos?.length || 0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          // Sorting props (disabled for top 10)
          sortBy={null}
          sortDirection={null}
          onSortChange={() => {}}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Top 10 Contenido Más Interaccionado
        </Typography>
        <DataTable
          data={topInteractedContent}
          columns={topInteractedContentColumns}
          isLoading={isLoadingTopInteractedContent}
          isError={isErrorTopInteractedContent}
          errorMessage={topInteractedContentError?.message}
          emptyMessage="No hay datos de interacciones disponibles para contenido"
          // Pagination props (disabled for top 10)
          page={0}
          pageSize={10}
          totalCount={topInteractedContent?.length || 0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          // Sorting props (disabled for top 10)
          sortBy={null}
          sortDirection={null}
          onSortChange={() => {}}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Top 10 Playlists Menos Interaccionadas
        </Typography>
        <DataTable
          data={leastInteractedPlaylists}
          columns={leastInteractedPlaylistsColumns}
          isLoading={isLoadingLeastInteractedPlaylists}
          isError={isErrorLeastInteractedPlaylists}
          errorMessage={leastInteractedPlaylistsError?.message}
          emptyMessage="No hay datos de interacciones disponibles para playlists menos interaccionadas"
          // Pagination props (disabled for top 10)
          page={0}
          pageSize={10}
          totalCount={leastInteractedPlaylists?.length || 0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          // Sorting props (disabled for top 10)
          sortBy={null}
          sortDirection={null}
          onSortChange={() => {}}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Top 10 Mundos Menos Interaccionados
        </Typography>
        <DataTable
          data={leastInteractedMundos}
          columns={leastInteractedMundosColumns}
          isLoading={isLoadingLeastInteractedMundos}
          isError={isErrorLeastInteractedMundos}
          errorMessage={leastInteractedMundosError?.message}
          emptyMessage="No hay datos de interacciones disponibles para mundos menos interaccionados"
          // Pagination props (disabled for top 10)
          page={0}
          pageSize={10}
          totalCount={leastInteractedMundos?.length || 0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          // Sorting props (disabled for top 10)
          sortBy={null}
          sortDirection={null}
          onSortChange={() => {}}
        />
      </Paper>
    </Container>
  );
}; 