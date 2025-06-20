import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Chip,
  Rating,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Verified,
  LocationOn,
  Schedule,
  StarBorder as Star, // ✅ CORRECTO - StarBorder existe en @mui/icons-material
  Message,
  VideoCall,
  Phone,
  Language,
  Work,
  CalendarToday,
  CheckCircle,
  Close,
  Share,
  Report,
  TrendingUp,
  Security,
  SupportAgent,
  WorkspacePremium,
  EmojiEvents,
  LocalShipping,
  Favorite,
} from '@mui/icons-material';
import { Seller } from '../../../../types/marketplace';

interface SellerInfoCardProps {
  seller: Seller;
}

interface SellerProfileDialogProps {
  seller: Seller;
  open: boolean;
  onClose: () => void;
}

const SellerProfileDialog: React.FC<SellerProfileDialogProps> = ({
  seller,
  open,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Perfil del Vendedor</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Header del perfil */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          {/* Cover image */}
          {seller.coverImage && (
            <Box
              sx={{
                width: '100%',
                height: 200,
                borderRadius: 2,
                backgroundImage: `url(${seller.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mb: 2,
              }}
            />
          )}

          {/* Profile info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                seller.isOnline ? (
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#4CAF50',
                      border: '3px solid white',
                    }}
                  />
                ) : null
              }
            >
              <Avatar
                src={seller.avatar}
                sx={{ width: 80, height: 80, border: '4px solid white' }}
              />
            </Badge>

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {seller?.name || 'Usuario'}
                </Typography>
                {seller.verified && (
                  <Verified sx={{ color: '#1976d2', fontSize: 24 }} />
                )}
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {seller.username}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={seller.rating} precision={0.1} readOnly />
                  <Typography variant="body2">
                    {seller.rating} ({seller.reviewCount} reseñas)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {seller.location}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bio */}
        {seller.bio && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Acerca de
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {seller.bio}
            </Typography>
          </Box>
        )}

        {/* Badges y certificaciones */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Logros y Certificaciones
          </Typography>
          <Grid container spacing={2}>
            {seller.badges.map((badge) => (
              <Grid size={{xs:12,sm:6}} key={badge.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `2px solid ${badge.color}15`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <WorkspacePremium sx={{ color: badge.color }} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      {badge.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {badge.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Obtenido el{' '}
                    {badge.earnedAt.toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Estadísticas detalladas */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Estadísticas
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{xs:6,sm:3}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {seller.salesCount || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ventas
                </Typography>
              </Box>
            </Grid>
            <Grid size={{xs:6,sm:3}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {seller.responseRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tasa de respuesta
                </Typography>
              </Box>
            </Grid>
            <Grid size={{xs:6,sm:3}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {seller.completionRate || 100}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completados
                </Typography>
              </Box>
            </Grid>
            <Grid size={{xs:6,sm:3}}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {seller.yearsActive || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Años activo
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Idiomas */}
        {seller.languagesSpoken && seller.languagesSpoken.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Idiomas
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {seller.languagesSpoken.map((language) => (
                <Chip
                  key={language}
                  label={language}
                  variant="outlined"
                  icon={<Language />}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Disponibilidad */}
        {seller.availability && (
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Horarios de Disponibilidad
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Zona horaria: {seller.availability.timezone}
            </Typography>
            <List dense>
              {Object.entries(seller.availability.schedule).map(
                ([day, schedule]) => (
                  <ListItem key={day} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ textTransform: 'capitalize', minWidth: 80 }}
                          >
                            {day === 'monday'
                              ? 'Lunes'
                              : day === 'tuesday'
                                ? 'Martes'
                                : day === 'wednesday'
                                  ? 'Miércoles'
                                  : day === 'thursday'
                                    ? 'Jueves'
                                    : day === 'friday'
                                      ? 'Viernes'
                                      : day === 'saturday'
                                        ? 'Sábado'
                                        : 'Domingo'}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={
                              schedule.available
                                ? 'text.primary'
                                : 'text.secondary'
                            }
                          >
                            {schedule.available
                              ? `${schedule.start} - ${schedule.end}`
                              : 'No disponible'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                )
              )}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cerrar</Button>
        <Button variant="contained" startIcon={<Message />}>
          Contactar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const SellerInfoCard: React.FC<SellerInfoCardProps> = ({ seller }) => {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const memberSinceText = seller.memberSince.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Información del Vendedor
          </Typography>

          {/* Header del vendedor */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                seller.isOnline ? (
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#4CAF50',
                      border: '3px solid white',
                    }}
                  />
                ) : null
              }
            >
              <Avatar
                src={seller.avatar}
                sx={{ width: 80, height: 80, cursor: 'pointer' }}
                onClick={() => setProfileDialogOpen(true)}
              />
            </Badge>

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setProfileDialogOpen(true)}
                >
                  {seller?.name || 'Usuario'}
                </Typography>
                {seller.verified && (
                  <Tooltip title="Vendedor verificado">
                    <Verified sx={{ color: '#1976d2', fontSize: 20 }} />
                  </Tooltip>
                )}
                {seller.isOnline && (
                  <Chip
                    label="En línea"
                    size="small"
                    color="success"
                    sx={{ fontSize: '10px', height: 20 }}
                  />
                )}
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => setProfileDialogOpen(true)}
              >
                {seller.username}
              </Typography>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={seller.rating} precision={0.1} readOnly />
                  <Typography variant="body2" fontWeight="bold">
                    {seller.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({seller.reviewCount})
                  </Typography>
                </Box>
              </Box>

              {/* Badges del vendedor */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {seller.badges.slice(0, 2).map((badge) => (
                  <Tooltip key={badge.id} title={badge.description}>
                    <Chip
                      label={badge.name}
                      size="small"
                      sx={{
                        backgroundColor: `${badge.color}15`,
                        color: badge.color,
                        borderColor: `${badge.color}30`,
                        fontWeight: 'bold',
                        fontSize: '11px',
                      }}
                      variant="outlined"
                    />
                  </Tooltip>
                ))}
                {seller.badges.length > 2 && (
                  <Chip
                    label={`+${seller.badges.length - 2}`}
                    size="small"
                    variant="outlined"
                    onClick={() => setProfileDialogOpen(true)}
                    sx={{ cursor: 'pointer' }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Estadísticas rápidas */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{xs:6,sm:3}}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {seller.responseTime}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tiempo de respuesta
                </Typography>
              </Box>
            </Grid>
            <Grid size={{xs:6,sm:3}}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {seller.responseRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tasa de respuesta
                </Typography>
              </Box>
            </Grid>
            <Grid size={{xs:6,sm:3}}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {seller.salesCount || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ventas realizadas
                </Typography>
              </Box>
            </Grid>
            <Grid size={{xs:6,sm:3}}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {memberSinceText}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Miembro desde
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Información adicional */}
          <List dense sx={{ mb: 2 }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <LocationOn color="action" />
              </ListItemIcon>
              <ListItemText
                primary="Ubicación"
                secondary={seller.location}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 'bold',
                }}
                secondaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>

            {seller.languagesSpoken && seller.languagesSpoken.length > 0 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Language color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Idiomas"
                  secondary={seller.languagesSpoken.join(', ')}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 'bold',
                  }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            )}

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CalendarToday color="action" />
              </ListItemIcon>
              <ListItemText
                primary="Miembro desde"
                secondary={seller.memberSince.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 'bold',
                }}
                secondaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>

          {/* Métodos de contacto */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Métodos de contacto disponibles
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {seller.contactMethods
                .filter((method) => method.available)
                .map((method) => (
                  <Tooltip key={method.type} title={method.label}>
                    <Chip
                      icon={
                        method.type === 'message' ? (
                          <Message />
                        ) : method.type === 'video' ? (
                          <VideoCall />
                        ) : method.type === 'call' ? (
                          <Phone />
                        ) : (
                          <Message />
                        )
                      }
                      label={method.label}
                      size="small"
                      variant={method.preferred ? 'filled' : 'outlined'}
                      color={method.preferred ? 'primary' : 'default'}
                      clickable
                    />
                  </Tooltip>
                ))}
            </Box>
          </Box>

          {/* Botones de acción */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Message />}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Contactar
            </Button>
            <Button
              variant="outlined"
              onClick={() => setProfileDialogOpen(true)}
              sx={{ borderRadius: 2, minWidth: 120 }}
            >
              Ver Perfil
            </Button>
          </Stack>

          {/* Garantías del vendedor */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              border: '1px solid #e9ecef',
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              ✅ Garantías del vendedor
            </Typography>
            <List dense sx={{ py: 0 }}>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Respuesta garantizada"
                  primaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Security color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Pagos protegidos"
                  primaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <SupportAgent color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Soporte especializado"
                  primaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            </List>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog del perfil completo */}
      <SellerProfileDialog
        seller={seller}
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
    </>
  );
};
