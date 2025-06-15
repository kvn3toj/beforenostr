import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { apiService } from '../services/api.service';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
}

interface UserGroup {
  userId: string;
  groupId: string;
  roleInGroup: string;
  joinedAt: string;
  user: User;
}

interface Group {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
  userGroups: UserGroup[];
}

const fetchGroups = async (): Promise<Group[]> => {
  return apiService.get<Group[]>('/groups');
};

const getGroupTypeColor = (type: string) => {
  switch (type) {
    case 'GOVERNANCE_BODY':
      return 'primary';
    case 'CLAN':
      return 'secondary';
    case 'FRIEND':
      return 'success';
    case 'COMMUNITY_OF_PRACTICE':
      return 'info';
    default:
      return 'default';
  }
};

const getGroupTypeLabel = (type: string) => {
  switch (type) {
    case 'GOVERNANCE_BODY':
      return 'Gobierno';
    case 'CLAN':
      return 'Clan';
    case 'FRIEND':
      return 'Amigos';
    case 'COMMUNITY_OF_PRACTICE':
      return 'Comunidad';
    default:
      return type;
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'LEADER':
      return 'Líder';
    case 'MODERATOR':
      return 'Moderador';
    case 'ARBITRATOR':
      return 'Árbitro';
    case 'MEMBER':
      return 'Miembro';
    default:
      return role;
  }
};

export const GroupsPage: React.FC = () => {
  const {
    data: groups,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
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
          Error loading groups data: {error instanceof Error ? 
            error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  // Calculate stats from real data
  const totalMembers = groups?.reduce((total, group) => total + group.userGroups.length, 0) || 0;
  const averageGroupSize = groups?.length ? Math.round(totalMembers / groups.length) : 0;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestión de Grupos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra equipos de gamificación y rendimiento colaborativo
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Grupos
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {groups?.length || 0}
                  </Typography>
                </Box>
                <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Miembros
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {totalMembers}
                  </Typography>
                </Box>
                <PersonAddIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Promedio por Grupo
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {averageGroupSize}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Grupo Más Grande
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {groups ? Math.max(...groups.map(g => g.userGroups.length)) : 0}
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Grupos Activos */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium' }}>
            Grupos Activos
          </Typography>
          <Grid container spacing={3}>
            {groups && groups.length > 0 ? (
              groups.map((group) => (
                <Grid item xs={12} md={6} key={group.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6" component="h3" fontWeight="bold">
                          {group.name}
                        </Typography>
                        <Chip
                          label={getGroupTypeLabel(group.type)}
                          color={getGroupTypeColor(group.type) as any}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {group.description}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Líder:</strong> {group.owner.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {group.userGroups.length} miembros
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Miembros por rol:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Array.from(new Set(group.userGroups.map(ug => ug.roleInGroup))).map(role => {
                            const count = group.userGroups.filter(ug => ug.roleInGroup === role).length;
                            return (
                              <Chip 
                                key={role} 
                                label={`${getRoleLabel(role)}: ${count}`} 
                                size="small" 
                                variant="outlined"
                              />
                            );
                          })}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
                            {group.userGroups.slice(0, 4).map((userGroup, i) => (
                              <Avatar key={userGroup.userId} title={userGroup.user.name}>
                                {userGroup.user.name.charAt(0).toUpperCase()}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                          {group.userGroups.length > 4 && (
                            <Typography variant="body2" color="text.secondary">
                              +{group.userGroups.length - 4} más
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Creado: {new Date(group.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<PersonAddIcon />}>
                        Gestionar
                      </Button>
                      <Button size="small" color="primary">
                        Ver Detalles
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">
                  No hay grupos registrados en el sistema.
                </Alert>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Resumen de Grupos por Tipo */}
        <Grid item xs={12} lg={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium' }}>
            Grupos por Tipo
          </Typography>
          <Paper elevation={2} sx={{ p: 2 }}>
            {groups && groups.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Miembros</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from(new Set(groups.map(g => g.type))).map((type) => {
                      const groupsOfType = groups.filter(g => g.type === type);
                      const membersCount = groupsOfType.reduce((sum, g) => sum + g.userGroups.length, 0);
                      return (
                        <TableRow key={type}>
                          <TableCell>
                            <Chip 
                              label={getGroupTypeLabel(type)} 
                              color={getGroupTypeColor(type) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {groupsOfType.length}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {membersCount}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No hay datos de grupos para mostrar.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GroupsPage; 