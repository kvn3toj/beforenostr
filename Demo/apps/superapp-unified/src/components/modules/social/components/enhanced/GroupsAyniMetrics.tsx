import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Avatar,
  alpha,
  useTheme,
  Divider,
  CircularProgress,
  Badge,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Groups,
  Handshake,
  EmojiEvents,
  TrendingUp,
  Psychology,
  Star,
  LocalFireDepartment,
  Waves,
  Air,
  Park,
  People,
  ForumOutlined,
  EventNote,
  Share,
  Favorite,
  VolunteerActivism,
  Bolt,
  AutoAwesome,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

interface GroupElement {
  comunicacion: number; // Aire - Comunicación efectiva
  colaboracion: number; // Agua - Fluidez colaborativa
  estabilidad: number; // Tierra - Estabilidad del grupo
  inspiracion: number; // Fuego - Pasión e inspiración
}

interface GroupAyniData {
  id: string;
  name: string;
  ayniBalance: number; // Balance general de reciprocidad del grupo
  ayniGiving: number; // Lo que el grupo da a la comunidad
  ayniReceiving: number; // Lo que el grupo recibe
  meritos: number; // Méritos totales generados
  ondas: number; // Ondas de energía positiva
  impactoBienComun: number; // Impacto en el bien común (0-100)
  nivelColaboracion: string; // Nivel textual
  elementos: GroupElement;
  proyectosActivos: number;
  intercambiosAyni: number;
  miembrosActivos: number;
  crecimientoSemanal: number;
  fechaCreacion: string;
  proximoEvento?: string;
  categoriaImpacto: 'alto' | 'medio' | 'bajo';
  especialidades: string[];
}

interface GroupsAyniMetricsProps {
  groupData: GroupAyniData;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  showCompactView?: boolean;
  enableInteractions?: boolean;
}

// 🎨 Componente para elementos de grupo con iconos naturales
const GroupElementIcon: React.FC<{
  element: string;
  value: number;
  color: string;
  description: string;
}> = ({ element, value, color, description }) => {
  const theme = useTheme();

  const getElementData = (element: string) => {
    switch (element) {
      case 'comunicacion':
        return {
          icon: <Air />,
          name: 'Comunicación',
          shortName: 'Aire',
        };
      case 'colaboracion':
        return {
          icon: <Waves />,
          name: 'Colaboración',
          shortName: 'Agua',
        };
      case 'estabilidad':
        return {
          icon: <Park />,
          name: 'Estabilidad',
          shortName: 'Tierra',
        };
      case 'inspiracion':
        return {
          icon: <LocalFireDepartment />,
          name: 'Inspiración',
          shortName: 'Fuego',
        };
      default:
        return {
          icon: <Star />,
          name: 'Elemento',
          shortName: 'Balance',
        };
    }
  };

  const elementData = getElementData(element);

  return (
    <Tooltip
      title={`${elementData.name}: ${value}% - ${description}`}
      placement="top"
    >
      <Box
        sx={{ textAlign: 'center', position: 'relative', cursor: 'pointer' }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `conic-gradient(${color} ${
              value * 3.6
            }deg, ${alpha(color, 0.1)} 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            mb: 1,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              fontSize: 20,
            }}
          >
            {elementData.icon}
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 'bold',
            display: 'block',
            mb: 0.5,
            fontSize: '0.7rem',
          }}
        >
          {elementData.shortName}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          sx={{ fontSize: '0.65rem' }}
        >
          {value}%
        </Typography>
      </Box>
    </Tooltip>
  );
};

// 🎯 Indicador de impacto Bien Común
const ImpactoBienComunIndicator: React.FC<{
  impacto: number;
  categoria: 'alto' | 'medio' | 'bajo';
}> = ({ impacto, categoria }) => {
  const getImpactColor = () => {
    switch (categoria) {
      case 'alto':
        return '#4CAF50';
      case 'medio':
        return '#FF9800';
      case 'bajo':
        return '#F44336';
    }
  };

  const getImpactMessage = () => {
    switch (categoria) {
      case 'alto':
        return 'Generando gran impacto positivo';
      case 'medio':
        return 'Impacto moderado en la comunidad';
      case 'bajo':
        return 'Iniciando su contribución';
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          mb: 1,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={64}
          thickness={4}
          sx={{
            color: alpha(getImpactColor(), 0.2),
          }}
        />
        <CircularProgress
          variant="determinate"
          value={impacto}
          size={64}
          thickness={4}
          sx={{
            color: getImpactColor(),
            position: 'absolute',
            left: 0,
            [`& .MuiCircularProgress-circle`]: {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <VolunteerActivism sx={{ color: getImpactColor(), fontSize: 20 }} />
        </Box>
      </Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: getImpactColor() }}
      >
        {impacto}%
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        {getImpactMessage()}
      </Typography>
    </Box>
  );
};

export const GroupsAyniMetrics: React.FC<GroupsAyniMetricsProps> = ({
  groupData,
  isExpanded = false,
  onToggleExpanded,
  showCompactView = false,
  enableInteractions = true,
}) => {
  const theme = useTheme();

  const getAyniBalanceColor = (balance: number) => {
    if (balance >= 0.8) return theme.palette.success.main;
    if (balance >= 0.6) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getAyniMessage = (balance: number) => {
    if (balance >= 0.9) return 'Ayni en excelente equilibrio';
    if (balance >= 0.8) return 'Muy buen equilibrio de reciprocidad';
    if (balance >= 0.6) return 'Equilibrio moderado, puede mejorar';
    return 'Necesita fortalecer la reciprocidad';
  };

  const getNivelIcon = (nivel: string) => {
    if (nivel.includes('Tejedor')) return <Psychology />;
    if (nivel.includes('Guardián')) return <Star />;
    if (nivel.includes('Sembrador')) return <Park />;
    return <Groups />;
  };

  if (showCompactView) {
    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha('#8E24AA', 0.02)} 0%, ${alpha('#5E35B1', 0.02)} 100%)`,
          border: `1px solid ${alpha('#8E24AA', 0.1)}`,
        }}
      >
        <CardContent sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: '#8E24AA',
                background: `linear-gradient(45deg, #8E24AA, #5E35B1)`,
                width: 40,
                height: 40,
              }}
            >
              <Handshake />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Balance Ayni: {Math.round(groupData.ayniBalance * 100)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {groupData.meritos} Mëritos • {groupData.ondas} Öndas
              </Typography>
            </Box>
            <Chip
              label={groupData.nivelColaboracion}
              color="primary"
              size="small"
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha('#8E24AA', 0.02)} 0%, ${alpha('#5E35B1', 0.02)} 100%)`,
        border: `1px solid ${alpha('#8E24AA', 0.1)}`,
      }}
    >
      <CardContent>
        {/* 🎯 Header con información principal */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: '#8E24AA',
              background: `linear-gradient(45deg, #8E24AA, #5E35B1)`,
              width: 48,
              height: 48,
            }}
          >
            <Handshake />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Métricas Ayni del Grupo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reciprocidad y colaboración en {groupData.name}
            </Typography>
          </Box>
          {enableInteractions && onToggleExpanded && (
            <IconButton onClick={onToggleExpanded} size="small">
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Stack>

        {/* 📊 Métricas principales en grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography
                variant="h4"
                fontWeight="bold"
                className="guardian-text-mystic"
              >
                {Math.round(groupData.ayniBalance * 100)}%
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Balance Ayni
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {groupData.meritos}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Mëritos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {groupData.ondas}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Öndas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {groupData.proyectosActivos}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >
                Proyectos
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 🎯 Progreso de nivel colaborativo */}
        <Box sx={{ mb: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Chip
              icon={getNivelIcon(groupData.nivelColaboracion)}
              label={groupData.nivelColaboracion}
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${alpha('#8E24AA', 0.1)}, ${alpha('#5E35B1', 0.1)})`,
              }}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <TrendingUp
                sx={{
                  fontSize: 16,
                  color:
                    groupData.crecimientoSemanal > 0
                      ? 'success.main'
                      : 'text.secondary',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                +{groupData.crecimientoSemanal}% esta semana
              </Typography>
            </Stack>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={groupData.ayniBalance * 100}
            sx={{
              height: 8,
              borderRadius: 5,
              bgcolor: alpha('#8E24AA', 0.1),
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, #8E24AA, #5E35B1)`,
                borderRadius: 5,
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: 'block' }}
          >
            {getAyniMessage(groupData.ayniBalance)}
          </Typography>
        </Box>

        {/* 🌿 Elementos del grupo en equilibrio */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Elementos en Equilibrio
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid>
              <GroupElementIcon
                element="comunicacion"
                value={groupData.elementos.comunicacion}
                color="#8B5CF6"
                description="Claridad en la comunicación del grupo"
              />
            </Grid>
            <Grid>
              <GroupElementIcon
                element="colaboracion"
                value={groupData.elementos.colaboracion}
                color="#06B6D4"
                description="Fluidez en la colaboración"
              />
            </Grid>
            <Grid>
              <GroupElementIcon
                element="estabilidad"
                value={groupData.elementos.estabilidad}
                color="#78716C"
                description="Estabilidad y confianza del grupo"
              />
            </Grid>
            <Grid>
              <GroupElementIcon
                element="inspiracion"
                value={groupData.elementos.inspiracion}
                color="#EF4444"
                description="Inspiración y pasión compartida"
              />
            </Grid>
          </Grid>
        </Box>

        {/* 🎯 Impacto en el Bien Común */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                border: `1px solid ${alpha('#4CAF50', 0.2)}`,
                bgcolor: alpha('#4CAF50', 0.02),
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Impacto Bien Común
              </Typography>
              <ImpactoBienComunIndicator
                impacto={groupData.impactoBienComun}
                categoria={groupData.categoriaImpacto}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ForumOutlined color="primary" />
                <Typography variant="body2">
                  <strong>{groupData.intercambiosAyni}</strong> intercambios
                  Ayni realizados
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <People color="secondary" />
                <Typography variant="body2">
                  <strong>{groupData.miembrosActivos}</strong> miembros activos
                  esta semana
                </Typography>
              </Stack>
              {groupData.proximoEvento && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EventNote color="info" />
                  <Typography variant="body2">
                    Próximo evento: <strong>{groupData.proximoEvento}</strong>
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* 🏷️ Especialidades del grupo */}
        {groupData.especialidades.length > 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Especialidades y Fortalezas
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {groupData.especialidades.map((especialidad, index) => (
                <Chip
                  key={index}
                  label={especialidad}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: alpha('#8E24AA', 0.3),
                    color: '#8E24AA',
                    '&:hover': {
                      bgcolor: alpha('#8E24AA', 0.1),
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* 📈 Vista expandida adicional */}
        {isExpanded && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Detalles de Reciprocidad Ayni
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <AutoAwesome sx={{ color: 'success.main', mb: 1 }} />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {Math.round(groupData.ayniGiving * 100)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lo que el grupo aporta
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Bolt sx={{ color: 'info.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {Math.round(groupData.ayniReceiving * 100)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lo que el grupo recibe
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};
