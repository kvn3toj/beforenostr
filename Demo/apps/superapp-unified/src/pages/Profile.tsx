import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  LinearProgress,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Switch,
  FormControlLabel,
  Rating,
  Slider
} from '@mui/material';
import {
  Person,
  Edit,
  Settings,
  Security,
  Notifications,
  Work,
  School,
  LocationOn,
  Language,
  Visibility,
  VisibilityOff,
  Star,
  TrendingUp,
  EmojiEvents,
  Group,
  LocalAtm,
  AccountBalance,
  PhotoCamera,
  Phone,
  Email,
  CalendarMonth,
  Verified,
  PublicOff,
  Public,
  LockOpen,
  Lock,
  Analytics,
  Timeline,
  BusinessCenter,
  SportsEsports,
  VideoLibrary,
  Palette
} from '@mui/icons-material';

// Datos del perfil del usuario basados en el ecosistema CoomÜnity
const userProfileData = {
  personal: {
    id: 'usr_640baa58', // Basado en IDs vistos en el proyecto
    name: 'Ana García Mendoza',
    email: 'ana.garcia@coomunity.co',
    phone: '+57 300 123 4567',
    avatar: '/assets/img/avatars/ana-garcia.jpg',
    coverImage: '/assets/img/covers/profile-cover.jpg',
    bio: 'Diseñadora UX/UI especializada en interfaces intuitivas y experiencias de usuario excepcionales. Apasionada por la innovación y el desarrollo de comunidades digitales.',
    location: 'Medellín, Colombia',
    joinDate: '2024-03-15',
    verified: true,
    publicProfile: true
  },
  
  coommunityStats: {
    level: 7,
    ucoins: 1250,
    totalEarnings: 2850000, // COP
    completedGigs: 23,
    averageRating: 4.8,
    totalReviews: 15,
    ayniPoints: 340,
    communityRank: 'Pionero',
    memberSince: '8 meses'
  },
  
  activities: {
    marketplace: {
      gigsCompleted: 23,
      servicesOffered: 8,
      clientSatisfaction: 98,
      responseTime: '2 horas'
    },
    uplay: {
      participatedEvents: 12,
      organizerRating: 4.9,
      eventsHosted: 3,
      networkConnections: 89
    },
    social: {
      postsShared: 45,
      communitiesJoined: 7,
      helpfulVotes: 156,
      mentoringSessions: 12
    },
    pilgrim: {
      journeysCompleted: 8,
      skillsLearned: 15,
      certificatesEarned: 5,
      learningStreak: 23
    }
  },
  
  skills: [
    { name: 'Diseño UX/UI', level: 95, category: 'design' },
    { name: 'Figma', level: 90, category: 'tools' },
    { name: 'React.js', level: 85, category: 'development' },
    { name: 'Design Thinking', level: 88, category: 'methodology' },
    { name: 'Prototipado', level: 92, category: 'design' },
    { name: 'Investigación UX', level: 87, category: 'research' }
  ],
  
  achievements: [
    { 
      id: 1, 
      title: 'Pionero CoomÜnity', 
      description: 'Miembro fundador de la comunidad', 
      date: '2024-03-15',
      rarity: 'legendary'
    },
    { 
      id: 2, 
      title: 'Mentor Destacado', 
      description: '10+ sesiones de mentoría completadas', 
      date: '2024-08-22',
      rarity: 'epic'
    },
    { 
      id: 3, 
      title: 'Diseñador Estrella', 
      description: 'Rating promedio 4.8+ en diseño', 
      date: '2024-10-15',
      rarity: 'rare'
    },
    { 
      id: 4, 
      title: 'Colaborador Activo', 
      description: '100+ interacciones en comunidad', 
      date: '2024-11-02',
      rarity: 'common'
    }
  ],
  
  preferences: {
    language: 'español',
    timezone: 'America/Bogota',
    currency: 'COP',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      showEarnings: false,
      showLocation: true,
      showEmail: false
    },
    theme: 'system' // light, dark, system
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Profile: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [privacySettings, setPrivacySettings] = useState(userProfileData.preferences.privacy);
  const [notifications, setNotifications] = useState(userProfileData.preferences.notifications);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9C27B0';
      case 'rare': return '#2196F3';
      case 'common': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getSkillCategoryIcon = (category: string) => {
    switch (category) {
      case 'design': return <Palette />;
      case 'tools': return <Settings />;
      case 'development': return <SportsEsports />;
      case 'methodology': return <School />;
      case 'research': return <Analytics />;
      default: return <Work />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header del Perfil */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        {/* Cover Image */}
        <Box 
          sx={{ 
            height: 200, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, width: '100%' }}>
            {/* Avatar */}
            <Avatar
              src={userProfileData.personal.avatar}
              sx={{ 
                width: 120, 
                height: 120, 
                border: '4px solid white',
                boxShadow: theme.shadows[3]
              }}
            />
            
            {/* Información Principal */}
            <Box sx={{ flex: 1, color: 'white', pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                  {userProfileData.personal.name}
                </Typography>
                {userProfileData.personal.verified && (
                  <Verified sx={{ color: '#1DA1F2', fontSize: 28 }} />
                )}
                <Chip 
                  label={userProfileData.coommunityStats.communityRank}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              <Typography variant="h6" component="h2" sx={{ opacity: 0.9, mb: 1 }}>
                {userProfileData.personal.bio}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{userProfileData.personal.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarMonth sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    Miembro desde {userProfileData.coommunityStats.memberSince}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    {userProfileData.coommunityStats.averageRating}/5 
                    ({userProfileData.coommunityStats.totalReviews} reseñas)
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Botones de Acción */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit />
              </IconButton>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                <PhotoCamera />
              </IconButton>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                <Settings />
              </IconButton>
            </Box>
          </Box>
        </Box>
        
        {/* Stats Rápidas */}
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                  {userProfileData.coommunityStats.level}
                </Typography>
                <Typography variant="body2" color="text.secondary">Nivel</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {userProfileData.coommunityStats.ucoins}
                </Typography>
                <Typography variant="body2" color="text.secondary">ÜCoins</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {userProfileData.coommunityStats.completedGigs}
                </Typography>
                <Typography variant="body2" color="text.secondary">Gigs Completados</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" color="info.main" sx={{ fontWeight: 'bold' }}>
                  {userProfileData.coommunityStats.ayniPoints}
                </Typography>
                <Typography variant="body2" color="text.secondary">Puntos Ayni</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs de Navegación */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Actividades" icon={<Timeline />} />
          <Tab label="Habilidades" icon={<Work />} />
          <Tab label="Logros" icon={<EmojiEvents />} />
          <Tab label="Configuración" icon={<Settings />} />
        </Tabs>
      </Box>

      {/* Tab Panel 0: Actividades */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Marketplace */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <BusinessCenter color="primary" />
                  <Typography variant="h6" component="h3" color="primary">Marketplace</Typography>
                </Box>
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Gigs Completados"
                      secondary={`${userProfileData.activities.marketplace.gigsCompleted} proyectos`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Servicios Ofrecidos"
                      secondary={`${userProfileData.activities.marketplace.servicesOffered} categorías`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Satisfacción del Cliente"
                      secondary={`${userProfileData.activities.marketplace.clientSatisfaction}%`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Tiempo de Respuesta"
                      secondary={userProfileData.activities.marketplace.responseTime}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* ÜPlay */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <SportsEsports color="secondary" />
                  <Typography variant="h6" component="h3" color="secondary">ÜPlay</Typography>
                </Box>
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Eventos Participados"
                      secondary={`${userProfileData.activities.uplay.participatedEvents} eventos`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Rating como Organizador"
                      secondary={`${userProfileData.activities.uplay.organizerRating}/5.0`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Eventos Organizados"
                      secondary={`${userProfileData.activities.uplay.eventsHosted} eventos`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Conexiones de Red"
                      secondary={`${userProfileData.activities.uplay.networkConnections} personas`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Social */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Group color="success" />
                  <Typography variant="h6" component="h3" color="success">Social</Typography>
                </Box>
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Posts Compartidos"
                      secondary={`${userProfileData.activities.social.postsShared} publicaciones`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Comunidades Unidas"
                      secondary={`${userProfileData.activities.social.communitiesJoined} grupos`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Votos Útiles Recibidos"
                      secondary={`${userProfileData.activities.social.helpfulVotes} votos`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Sesiones de Mentoría"
                      secondary={`${userProfileData.activities.social.mentoringSessions} sesiones`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Pilgrim */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <VideoLibrary color="warning" />
                  <Typography variant="h6" component="h3" color="warning">Pilgrim</Typography>
                </Box>
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Jornadas Completadas"
                      secondary={`${userProfileData.activities.pilgrim.journeysCompleted} jornadas`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Habilidades Aprendidas"
                      secondary={`${userProfileData.activities.pilgrim.skillsLearned} nuevas skills`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Certificados Obtenidos"
                      secondary={`${userProfileData.activities.pilgrim.certificatesEarned} certificados`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Racha de Aprendizaje"
                      secondary={`${userProfileData.activities.pilgrim.learningStreak} días`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab Panel 1: Habilidades */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="primary">
                  🎯 Habilidades y Competencias
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Basado en tu desempeño en proyectos y evaluaciones de la comunidad
                </Typography>
                
                <Grid container spacing={3}>
                  {userProfileData.skills.map((skill, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getSkillCategoryIcon(skill.category)}
                            <Typography variant="subtitle2" fontWeight="bold">
                              {skill.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {skill.level}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={skill.level}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: skill.level >= 90 ? 'success.main' : 
                                      skill.level >= 75 ? 'primary.main' : 
                                      skill.level >= 60 ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    💡 <strong>Consejo:</strong> Completa más proyectos relacionados con estas habilidades 
                    para aumentar tu nivel y acceder a oportunidades premium en el Marketplace.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab Panel 2: Logros */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="primary">
                  🏆 Logros y Reconocimientos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Insignias ganadas por tu participación activa en CoomÜnity
                </Typography>
                
                <Grid container spacing={2}>
                  {userProfileData.achievements.map((achievement) => (
                    <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                      <Card 
                        elevation={1} 
                        sx={{ 
                          borderRadius: 3,
                          border: `2px solid ${getRarityColor(achievement.rarity)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 3
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <EmojiEvents 
                            sx={{ 
                              fontSize: 48, 
                              color: getRarityColor(achievement.rarity),
                              mb: 2 
                            }} 
                          />
                          <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {achievement.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {achievement.description}
                          </Typography>
                          <Chip 
                            label={achievement.rarity.toUpperCase()}
                            size="small"
                            sx={{ 
                              bgcolor: getRarityColor(achievement.rarity) + '20',
                              color: getRarityColor(achievement.rarity),
                              fontWeight: 'bold'
                            }}
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.7 }}>
                            {new Date(achievement.date).toLocaleDateString('es-CO')}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Alert severity="success">
                    <Typography variant="body2">
                      🎉 <strong>¡Próximo logro!</strong> Completa 5 gigs más para desbloquear 
                      "Maestro del Marketplace" (Legendary)
                    </Typography>
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab Panel 3: Configuración */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {/* Privacidad */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="primary">
                  🔐 Configuración de Privacidad
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Public />
                    </ListItemIcon>
                    <ListItemText primary="Perfil Visible Públicamente" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.profileVisible}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            profileVisible: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <LocalAtm />
                    </ListItemIcon>
                    <ListItemText primary="Mostrar Ingresos" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.showEarnings}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            showEarnings: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText primary="Mostrar Ubicación" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.showLocation}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            showLocation: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary="Mostrar Email" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={privacySettings.showEmail}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            showEmail: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Notificaciones */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="primary">
                  🔔 Configuración de Notificaciones
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones por Email" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.email}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            email: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones Push" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.push}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            push: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary="Notificaciones SMS" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.sms}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            sms: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp />
                    </ListItemIcon>
                    <ListItemText primary="Marketing y Promociones" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.marketing}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            marketing: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Configuraciones Generales */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="primary">
                  ⚙️ Configuraciones Generales
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Idioma</InputLabel>
                      <Select value={userProfileData.preferences.language} label="Idioma">
                        <MenuItem value="español">Español</MenuItem>
                        <MenuItem value="english">English</MenuItem>
                        <MenuItem value="português">Português</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Zona Horaria</InputLabel>
                      <Select value={userProfileData.preferences.timezone} label="Zona Horaria">
                        <MenuItem value="America/Bogota">Bogotá (COT)</MenuItem>
                        <MenuItem value="America/Mexico_City">Ciudad de México (CST)</MenuItem>
                        <MenuItem value="America/Argentina/Buenos_Aires">Buenos Aires (ART)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Moneda Preferida</InputLabel>
                      <Select value={userProfileData.preferences.currency} label="Moneda Preferida">
                        <MenuItem value="COP">COP - Peso Colombiano</MenuItem>
                        <MenuItem value="USD">USD - Dólar Americano</MenuItem>
                        <MenuItem value="EUR">EUR - Euro</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Alert severity="success" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    ✅ <strong>Perfil Completo:</strong> Tu perfil está 100% completo. 
                    Esto mejora tu visibilidad en el Marketplace y aumenta las oportunidades de negocio.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Diálogo de Edición */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>✏️ Editar Perfil</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre Completo"
            fullWidth
            variant="outlined"
            defaultValue={userProfileData.personal.name}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Bio"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            defaultValue={userProfileData.personal.bio}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Ubicación"
            fullWidth
            variant="outlined"
            defaultValue={userProfileData.personal.location}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            variant="outlined"
            defaultValue={userProfileData.personal.phone}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 