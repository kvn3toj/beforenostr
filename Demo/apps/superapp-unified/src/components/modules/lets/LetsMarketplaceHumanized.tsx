import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Fab,
  Alert,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Handshake as HandshakeIcon,
  School as LearnIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

import LetsOnboardingWizard from './LetsOnboardingWizard';
import { UnitsWalletHumanized } from './UnitsWalletHumanized';
import LetsAssistant from './LetsAssistant';
import { useLetsEducation, LetsEducationProvider } from '../../../contexts/LetsEducationContext';

import { useLetsListings } from '../../../hooks/useLetsIntegration';
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2 }}>
            {listing.providerName?.[0] || '👤'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {listing.providerName || 'Miembro de la comunidad'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

        <Typography variant="h6" gutterBottom fontWeight="bold">
          {listing.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {isNewcomer && listing.description.length > 100
            ? `${listing.description.substring(0, 100)}...`
            : listing.description
          }
        </Typography>

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

        {isNewcomer && (
          <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
            <Typography variant="caption">
              💡 <strong>Esto significa:</strong> {listing.providerName} te ayudará con{' '}
              {listing.title.toLowerCase()} y tú le darás {listing.unitsCost || 15} Ünits como agradecimiento.
            </Typography>
          </Alert>
        )}
      </CardContent>

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
  const { state: educationState, completeOnboarding } = useLetsEducation();

  const [showAssistant, setShowAssistant] = useState(true);

  const { data: listings = [] } = useLetsListings();

  const mockListings = [
    {
      id: '1',
      title: 'Clases de Guitarra para Principiantes',
      description: 'Te enseño los básicos de guitarra en ambiente relajado.',
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
      description: 'Necesito ayuda para plantar vegetales en mi huerto comunitario.',
      providerName: 'Carlos Mendoza',
      category: 'Jardinería',
      unitsCost: 15,
      duration: 120,
      location: 'Norte',
      trustScore: 88,
      priority: 'high',
    },
  ];

  const handleOnboardingComplete = () => {
    completeOnboarding();
  };

  const handleInterest = (listingId: string) => {
    console.log(`Interesado en el listing: ${listingId}`);
  };

  const displayListings = listings.length > 0 ? listings : mockListings;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {!educationState.hasCompletedOnboarding && (
        <LetsOnboardingWizard
          open={!educationState.hasCompletedOnboarding}
          onClose={handleOnboardingComplete}
          onComplete={handleOnboardingComplete}
        />
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {educationState.userLevel === 'newcomer'
            ? '¡Bienvenido al Intercambio CoomÜnity! 🌟'
            : 'Marketplace LETS'
          }
        </Typography>

        {educationState.userLevel === 'newcomer' && (
          <Typography variant="body1" color="text.secondary" paragraph>
            Aquí puedes intercambiar habilidades, tiempo y conocimientos con otros miembros de la comunidad.
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <UnitsWalletHumanized
          userId={user?.id || ''}
          userExperience={educationState.userLevel}
          onStartOnboarding={handleOnboardingComplete}
          onExploreOpportunities={() => {
            document.getElementById('marketplace-listings')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </Box>

      {educationState.userLevel === 'newcomer' && (
        <Box sx={{ mb: 4 }}>
          <Alert severity="info" icon={<LearnIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">
                <strong>¿Primera vez aquí?</strong> Te ayudamos a entender cómo funciona el intercambio.
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={handleOnboardingComplete}
                sx={{ ml: 2 }}
              >
                Aprender LETS
              </Button>
            </Box>
          </Alert>
        </Box>
      )}

      <Box id="marketplace-listings" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Explorar Oportunidades
        </Typography>
        <Grid container spacing={3}>
          {displayListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <LetsListingCard
                listing={listing}
                userLevel={educationState.userLevel}
                onInterest={handleInterest}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      {showAssistant && educationState.userLevel === 'newcomer' && (
        <LetsAssistant
          context="marketplace"
          userName={user?.name || 'explorador'}
          onDismiss={() => setShowAssistant(false)}
        />
      )}
    </Container>
  );
};

export const LetsMarketplaceHumanized: React.FC = () => {
  return (
    <LetsEducationProvider>
      <LetsMarketplaceContent />
    </LetsEducationProvider>
  );
};

export default LetsMarketplaceHumanized;
