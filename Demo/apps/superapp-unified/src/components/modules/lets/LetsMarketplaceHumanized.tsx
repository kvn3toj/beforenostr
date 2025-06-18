import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Fab,
  Dialog,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Handshake as HandshakeIcon,
  School as LearnIcon,
  Work as WorkIcon,
  TrendingUp as GrowthIcon,
  Help as HelpIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

// Import our new LETS components
import LetsOnboardingWizard from './LetsOnboardingWizard';
import { UnitsWalletHumanized } from './UnitsWalletHumanized';
import LetsAssistant from './LetsAssistant';
import { useLetsContext, LetsContextProvider } from './LetsContextProvider';

// Import existing hooks
import { useLetsListings, useCreateLetsListing } from '../../../hooks/useLetsIntegration';
import { useAuth } from '../../../hooks/useAuth';

interface LetsListingCardProps {
  listing: any;
  userLevel: string;
  onInterest: (listingId: string) => void;
}

const LetsListingCard: React.FC<LetsListingCardProps> = ({ 
  listing, 
  userLevel, 
  onInterest 
}) => {
  const isNewcomer = userLevel === 'newcomer';
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        border: listing.priority === 'high' ? '2px solid #ff9800' : 'none',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header with user info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2 }}>
            {listing.providerName?.[0] || '👤'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {listing.providerName || 'Miembro de la comunidad'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Trust visualization for newcomers */}
              {isNewcomer ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      sx={{
                        fontSize: 16,
                        color: i < Math.floor((listing.trustScore || 75) / 20) 
                          ? 'warning.main' 
                          : 'grey.300',
                      }}
                    />
                  ))}
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    Confiable
                  </Typography>
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Confianza: {listing.trustScore || 75}%
                </Typography>
              )}
            </Box>
          </Box>
          
          {listing.priority === 'high' && (
            <Chip 
              size="small" 
              label="Urgent" 
              color="warning"
              sx={{ fontSize: '10px' }}
            />
          )}
        </Box>

        {/* Title and description */}
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {listing.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {isNewcomer && listing.description.length > 100
            ? `${listing.description.substring(0, 100)}...`
            : listing.description
          }
        </Typography>

        {/* Details */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            size="small"
            icon={<HandshakeIcon />}
            label={`${listing.unitsCost || 15} Ünits`}
            color="primary"
          />
          
          <Chip
            size="small"
            icon={<TimeIcon />}
            label={`${listing.duration || 60} min`}
            variant="outlined"
          />
          
          {listing.location && (
            <Chip
              size="small"
              icon={<LocationIcon />}
              label={listing.location}
              variant="outlined"
            />
          )}
        </Box>

        {/* Category badge */}
        <Box sx={{ mb: 2 }}>
          <Chip
            size="small"
            label={listing.category || 'Servicios'}
            sx={{
              bgcolor: listing.category === 'Enseñanza' 
                ? 'success.light' 
                : listing.category === 'Tecnología'
                ? 'info.light'
                : 'secondary.light',
              color: 'text.primary',
            }}
          />
        </Box>

        {/* For newcomers, explain the exchange */}
        {isNewcomer && (
          <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
            <Typography variant="caption">
              💡 <strong>Esto significa:</strong> {listing.providerName} te ayudará con{' '}
              {listing.title.toLowerCase()} y tú le darás {listing.unitsCost || 15} Ünits como agradecimiento.
            </Typography>
          </Alert>
        )}
      </CardContent>

      {/* Action button */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onInterest(listing.id)}
          startIcon={<HandshakeIcon />}
          sx={{
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976d2 30%, #0288d1 90%)',
            }
          }}
        >
          {isNewcomer ? '¡Me interesa!' : 'Contactar'}
        </Button>
      </Box>
    </Card>
  );
};

const LetsMarketplaceContent: React.FC = () => {
  const { user } = useAuth();
  const { 
    userLevel, 
    hasCompletedOnboarding, 
    setHasCompletedOnboarding,
    shouldUseHumanizedUI,
  } = useLetsContext();
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAssistant, setShowAssistant] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for demonstration - replace with real data
  const { data: listings = [], isLoading } = useLetsListings();
  
  const mockListings = [
    {
      id: '1',
      title: 'Clases de Guitarra para Principiantes',
      description: 'Te enseño los básicos de guitarra en ambiente relajado. Incluye teoría musical básica y canciones populares.',
      providerName: 'María González',
      category: 'Enseñanza',
      unitsCost: 20,
      duration: 90,
      location: 'Centro',
      trustScore: 92,
      priority: 'normal',
    },
    {
      id: '2',
      title: 'Ayuda con Jardín Urbano',
      description: 'Necesito ayuda para plantar vegetales en mi huerto comunitario. Aprenderás sobre cultivo orgánico.',
      providerName: 'Carlos Mendoza',
      category: 'Jardinería',
      unitsCost: 15,
      duration: 120,
      location: 'Norte',
      trustScore: 88,
      priority: 'high',
    },
    {
      id: '3',
      title: 'Reparación de Bicicletas',
      description: 'Servicio completo de mantenimiento de bicicletas. Incluye ajustes y reparaciones menores.',
      providerName: 'Ana Ruiz',
      category: 'Reparaciones',
      unitsCost: 25,
      duration: 60,
      location: 'Sur',
      trustScore: 95,
      priority: 'normal',
    },
  ];

  const displayListings = listings.length > 0 ? listings : mockListings;

  useEffect(() => {
    // Show onboarding for newcomers who haven't completed it
    if (userLevel === 'newcomer' && !hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [userLevel, hasCompletedOnboarding]);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
    setShowAssistant(true);
  };

  const handleInterest = (listingId: string) => {
    // Handle interest in a listing
    console.log('Interest in listing:', listingId);
    // Here you would typically open a contact dialog or redirect to details
  };

  const categories = [
    { id: 'all', label: 'Todas', icon: '🌍' },
    { id: 'teaching', label: 'Enseñanza', icon: '📚' },
    { id: 'technology', label: 'Tecnología', icon: '💻' },
    { id: 'gardening', label: 'Jardinería', icon: '🌱' },
    { id: 'repairs', label: 'Reparaciones', icon: '🔧' },
    { id: 'cooking', label: 'Cocina', icon: '👨‍🍳' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {userLevel === 'newcomer' 
            ? '¡Bienvenido al Intercambio CoomÜnity! 🌟'
            : 'Marketplace LETS'
          }
        </Typography>
        
        {userLevel === 'newcomer' ? (
          <Typography variant="body1" color="text.secondary" paragraph>
            Aquí puedes intercambiar habilidades, tiempo y conocimientos con otros miembros 
            de la comunidad. Cada intercambio fortalece nuestra red de reciprocidad.
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Encuentra servicios, comparte habilidades y contribuye al Bien Común
          </Typography>
        )}
      </Box>

      {/* Wallet Section */}
      <Box sx={{ mb: 4 }}>
        <UnitsWalletHumanized
          userId={user?.id || ''}
          userExperience={userLevel}
          onStartOnboarding={() => setShowOnboarding(true)}
          onExploreOpportunities={() => {
            // Scroll to listings or highlight them
            document.getElementById('marketplace-listings')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
          simplified={shouldUseHumanizedUI()}
        />
      </Box>

      {/* Quick actions for newcomers */}
      {userLevel === 'newcomer' && (
        <Box sx={{ mb: 4 }}>
          <Alert severity="info" icon={<LearnIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">
                <strong>¿Primera vez aquí?</strong> Te ayudamos a entender cómo funciona el intercambio.
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowOnboarding(true)}
                sx={{ ml: 2 }}
              >
                Aprender LETS
              </Button>
            </Box>
          </Alert>
        </Box>
      )}

      {/* Category filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Categorías
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.icon} ${category.label}`}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              color={selectedCategory === category.id ? 'primary' : 'default'}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Box>

      {/* Listings Grid */}
      <Box id="marketplace-listings" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Oportunidades de Intercambio
        </Typography>
        
        {isLoading ? (
          <Typography>Cargando oportunidades...</Typography>
        ) : (
          <Grid container spacing={3}>
            {displayListings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <LetsListingCard
                  listing={listing}
                  userLevel={userLevel}
                  onInterest={handleInterest}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="Crear oferta"
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
        }}
        onClick={() => {
          // Handle create listing
          console.log('Create new listing');
        }}
      >
        <AddIcon />
      </Fab>

      {/* Onboarding Dialog */}
      <LetsOnboardingWizard
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Smart Assistant */}
      {showAssistant && userLevel === 'newcomer' && (
        <LetsAssistant
          context="marketplace"
          visible={showAssistant}
          onDismiss={() => setShowAssistant(false)}
          userBalance={0} // Get from wallet data
          userTrustScore={75} // Get from user data
        />
      )}
    </Container>
  );
};

export const LetsMarketplaceHumanized: React.FC = () => {
  return (
    <LetsContextProvider>
      <LetsMarketplaceContent />
    </LetsContextProvider>
  );
};

export default LetsMarketplaceHumanized; 