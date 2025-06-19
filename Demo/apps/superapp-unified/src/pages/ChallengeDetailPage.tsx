import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Alert,
  Skeleton,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { ArrowBack, Error } from '@mui/icons-material';
import { toast } from 'sonner';

// Componentes mejorados
import { ChallengeDetail } from '../components/modules/challenges';

// Hooks y servicios
import {
  useChallenge,
  useJoinChallenge,
  useLeaveChallenge,
  useUserChallenges,
} from '../hooks/useRealBackendData';
import { useAuth } from '../contexts/AuthContext';

export const ChallengeDetailPage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hooks para datos
  const {
    data: challenge,
    isLoading: challengeLoading,
    error: challengeError,
    refetch: refetchChallenge,
  } = useChallenge(challengeId || '');

  const { data: userChallengesData, refetch: refetchUserChallenges } =
    useUserChallenges(user?.id || '');

  const joinChallengeMutation = useJoinChallenge();
  const leaveChallengeeMutation = useLeaveChallenge();

  // Verificar parámetros
  useEffect(() => {
    if (!challengeId) {
      toast.error('ID de desafío no válido');
      navigate('/challenges');
    }
  }, [challengeId, navigate]);

  // Handlers
  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await joinChallengeMutation.mutateAsync(challengeId);
      toast.success('¡Te has unido al desafío exitosamente!', {
        description: 'Comienza a participar y gana Mëritos por tus logros.',
        duration: 5000,
      });
      refetchChallenge();
      refetchUserChallenges();
    } catch (error) {
      toast.error('Error al unirse al desafío', {
        description: 'Inténtalo de nuevo en unos momentos.',
      });
      console.error('Error joining challenge:', error);
    }
  };

  const handleLeaveChallenge = async (challengeId: string) => {
    try {
      await leaveChallengeeMutation.mutateAsync(challengeId);
      toast.success('Has abandonado el desafío', {
        description: 'Puedes volver a unirte en cualquier momento.',
      });
      refetchChallenge();
      refetchUserChallenges();
    } catch (error) {
      toast.error('Error al abandonar el desafío');
      console.error('Error leaving challenge:', error);
    }
  };

  const handleUpdateProgress = async (progressData: any) => {
    // TODO: Implementar actualización de progreso con el backend
    console.log('Updating progress:', progressData);
    toast.success('Progreso actualizado');
  };

  const handleLikeChallenge = (challengeId: string) => {
    // TODO: Implementar sistema de likes
    toast.info('¡Funcionalidad de likes próximamente!');
  };

  const handleShareChallenge = (challengeId: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: challenge?.title || 'Desafío CoomÜnity',
          text:
            challenge?.shortDescription ||
            'Únete a este increíble desafío en CoomÜnity',
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      // Fallback para navegadores sin Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('Enlace copiado al portapapeles');
      });
    }
  };

  // Loading state
  if (challengeLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={300} height={40} />
        </Box>

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ mb: 3 }}>
              <Skeleton variant="rectangular" height={300} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="60%" height={24} />
                <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
                  <Skeleton variant="rounded" width={80} height={24} />
                  <Skeleton variant="rounded" width={100} height={24} />
                </Box>
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} />
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: 300 }}>
            <Card sx={{ p: 3 }}>
              <Skeleton variant="text" width="50%" height={32} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={48}
                sx={{ my: 2 }}
              />
              <Skeleton variant="rectangular" width="100%" height={48} />
            </Card>
          </Box>
        </Box>
      </Container>
    );
  }

  // Error state
  if (challengeError || !challenge) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/challenges')}
            variant="outlined"
          >
            Volver a Desafíos
          </Button>
        </Box>

        <Alert
          severity="error"
          sx={{ mb: 3 }}
          icon={<Error />}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => refetchChallenge()}
            >
              Reintentar
            </Button>
          }
        >
          <Typography variant="h6" gutterBottom>
            Error al cargar el desafío
          </Typography>
          <Typography variant="body2">
            {challengeError instanceof Error
              ? challengeError.message
              : 'No se pudo encontrar el desafío solicitado. Puede que haya sido eliminado o no tengas permisos para verlo.'}
          </Typography>
        </Alert>

        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Error sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Desafío no encontrado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            El desafío que buscas no existe o no está disponible.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/challenges')}
            startIcon={<ArrowBack />}
          >
            Explorar Otros Desafíos
          </Button>
        </Card>
      </Container>
    );
  }

  // Obtener progreso del usuario para este desafío específico
  const userProgress = userChallengesData?.activeChallenges?.find(
    (userChallenge: any) => userChallenge.challengeId === challengeId
  );

  return (
    <ChallengeDetail
      challenge={challenge}
      userProgress={userProgress}
      onJoin={handleJoinChallenge}
      onLeave={handleLeaveChallenge}
      onUpdateProgress={handleUpdateProgress}
      onLike={handleLikeChallenge}
      onShare={handleShareChallenge}
      isLoading={
        joinChallengeMutation.isPending || leaveChallengeeMutation.isPending
      }
    />
  );
};

// Export default para compatibilidad con lazy loading
export default ChallengeDetailPage;
