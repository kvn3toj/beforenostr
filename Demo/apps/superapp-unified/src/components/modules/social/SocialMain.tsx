import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  Badge,
  Chip,
  AppBar,
  Toolbar,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// Hooks personalizados
import {
  useSocialMatches,
  useMatchMessages,
  useSendMessage,
  useUpdateUserStatus,
  useSocialNotifications
} from '../../../hooks/useRealBackendData';

// Tipos
import type { SocialMatch, ChatMessage } from '../../../types';

// Componentes
import MatchesList from './components/MatchesList';
import ChatArea from './components/ChatArea';
import SocialHeader from './components/SocialHeader';
import SocialFeed from './components/SocialFeed';
import { LoadingSpinner } from '../../ui/LoadingSpinner';

const SocialMain: React.FC = () => {
  // Estados locales
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0: Feed, 1: Chat
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Hooks del backend
  const {
    data: matchesResponse,
    isLoading: matchesLoading,
    isError: matchesError,
    refetch: refetchMatches
  } = useSocialMatches();

  // Extraer los datos correctamente de la respuesta de la API
  const matches = matchesResponse?.data || [];

  const {
    data: messagesResponse,
    isLoading: messagesLoading,
    isError: messagesError,
    refetch: refetchMessages
  } = useMatchMessages(selectedMatch || '');

  // Extraer los datos correctamente de la respuesta de la API
  const messages = messagesResponse?.data || [];

  const {
    data: notificationsResponse,
    isLoading: notificationsLoading
  } = useSocialNotifications();

  // Extraer los datos correctamente de la respuesta de la API
  const notifications = notificationsResponse?.data || [];

  const sendMessageMutation = useSendMessage();
  const updateStatusMutation = useUpdateUserStatus();

  // Obtener datos del match seleccionado
  const selectedMatchData = Array.isArray(matches) 
    ? matches.find((m: SocialMatch) => m.id === selectedMatch)
    : null;

  // Formatear tiempo
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  // Manejar envío de mensaje
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedMatch || sendMessageMutation.isPending) return;

    try {
      const messageType = /^[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}]+$/u.test(messageInput.trim()) 
        ? 'emoji' 
        : 'text';

      await sendMessageMutation.mutateAsync({
        matchId: selectedMatch,
        content: messageInput.trim(),
        type: messageType
      });

      setMessageInput('');
      setShowEmojiPicker(false);
      setSnackbarMessage('Mensaje enviado');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setSnackbarMessage('Error enviando mensaje');
      setSnackbarOpen(true);
    }
  };

  // Manejar click en emoji
  const handleEmojiClick = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Manejar grabación de audio
  const handleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implementar lógica de grabación de audio
  };

  // Manejar selección de match
  const handleSelectMatch = (matchId: string) => {
    setSelectedMatch(matchId);
    setMessageInput('');
    setShowEmojiPicker(false);
  };

  // Auto-scroll cuando llegan nuevos mensajes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Actualizar estado de usuario cuando el componente se monta
  useEffect(() => {
    updateStatusMutation.mutate('online');
    
    // Cleanup: marcar como offline al salir
    return () => {
      updateStatusMutation.mutate('offline');
    };
  }, []);

  // Manejar errores
  if (matchesError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error cargando conversaciones. 
          <button onClick={() => refetchMatches()}>Reintentar</button>
        </Alert>
      </Container>
    );
  }

  // Loading inicial
  if (matchesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner message="Cargando conversaciones..." />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header principal */}
      <Box sx={{ bgcolor: '#E91E63', color: 'white', py: 2, textAlign: 'center' }}>
        <Container>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            🤝 Social CoomÜnity
          </Typography>
          <Typography component="p" variant="body1">
            Conecta con tu comunidad y gestiona tus conversaciones
          </Typography>
        </Container>
      </Box>
      
      {/* Header secundario con notificaciones */}
      <SocialHeader 
        notificationsCount={Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0}
        isLoadingNotifications={notificationsLoading}
      />

      {/* Navegación por pestañas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label="Feed Social"
            icon={<Badge badgeContent={0} color="primary"><PeopleIcon /></Badge>}
            iconPosition="start"
            sx={{ minHeight: 64, fontSize: '1rem', fontWeight: 500 }}
          />
          <Tab
            label="Chat & Matches"
            icon={
              <Badge badgeContent={Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0} color="error">
                <ChatIcon />
              </Badge>
            }
            iconPosition="start"
            sx={{ minHeight: 64, fontSize: '1rem', fontWeight: 500 }}
          />
        </Tabs>
      </Box>
      
      {/* Contenido de las pestañas */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Tab 0: Feed Social */}
        {activeTab === 0 && (
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            <SocialFeed />
          </Box>
        )}

        {/* Tab 1: Chat & Matches */}
        {activeTab === 1 && (
          <Container maxWidth="xl" sx={{ flexGrow: 1, py: 2, height: '100%' }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {/* Lista de matches */}
              <Grid item xs={12} md={4}>
                <MatchesList
                  matches={matches}
                  selectedMatch={selectedMatch}
                  onSelectMatch={handleSelectMatch}
                  isLoading={matchesLoading}
                  formatTime={formatTime}
                />
              </Grid>
              
              {/* Área de chat */}
              <Grid item xs={12} md={8}>
                <ChatArea
                  selectedMatch={selectedMatch}
                  selectedMatchData={selectedMatchData}
                  messages={messages}
                  isLoadingMessages={messagesLoading}
                  messageInput={messageInput}
                  setMessageInput={setMessageInput}
                  onSendMessage={handleSendMessage}
                  showEmojiPicker={showEmojiPicker}
                  setShowEmojiPicker={setShowEmojiPicker}
                  onEmojiClick={handleEmojiClick}
                  isRecording={isRecording}
                  onRecording={handleRecording}
                  isSending={sendMessageMutation.isPending}
                  formatTime={formatTime}
                  messageEndRef={messageEndRef}
                />
              </Grid>
            </Grid>
          </Container>
        )}
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default SocialMain; 