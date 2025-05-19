import React, { useState, useEffect, useCallback, useRef, ErrorInfo } from 'react';
import { Container, Box, Typography, Button, Paper, Stack, Snackbar, Alert as MuiAlert, Fade } from '@mui/material';
import { Event } from 'nostr-tools/core';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import NostrForms from '../components/nostr/NostrForms';
import NostrEventList from '../components/nostr/NostrEventList';
import NostrSections from '../components/nostr/NostrSections';
import { useNostrContext } from '../contexts/NostrContext';
import type { MeritAction, MeritTransaction } from '../types/nostr';
import { ProfileForm } from '../components/nostr/ProfileForm';
import type { ProfileFormData } from '../components/nostr/ProfileForm';

// Error Boundary Component (Mantener igual)
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error en el componente:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Algo salió mal
              </Typography>
              <Typography variant="body1">
                {this.state.error?.message || 'Error desconocido'}
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{ mt: 2 }}
              >
                Recargar página
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

const NostrDemoPage: React.FC = () => {
  // Estados locales para la demo (claves, formularios, balances, etc)
  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [replyToEventId, setReplyToEventId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [recipientPubkey, setRecipientPubkey] = useState<string>('');
  const [unitAmount, setUnitAmount] = useState<string>('');
  const [unitMemo, setUnitMemo] = useState<string>('');
  const [isSendingUnits, setIsSendingUnits] = useState<boolean>(false);
  const [unitBalance, setUnitBalance] = useState<number>(0);
  const [meritRecipientPubkey, setMeritRecipientPubkey] = useState<string>('');
  const [meritAmount, setMeritAmount] = useState<string>('');
  const [meritType, setMeritType] = useState<string>('');
  const [meritAction, setMeritAction] = useState<MeritAction>('gain');
  const [isSendingMerits, setIsSendingMerits] = useState<boolean>(false);
  const [meritBalance, setMeritBalance] = useState<number>(0);
  const [mundoDTag, setMundoDTag] = useState<string>('');
  const [mundoTitle, setMundoTitle] = useState<string>('');
  const [mundoDescription, setMundoDescription] = useState<string>('');
  const [isPublishingMundo, setIsPublishingMundo] = useState<boolean>(false);
  const [isReadyToPublish, setIsReadyToPublish] = useState<boolean>(false);
  const [profileSnackbar, setProfileSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [noteSnackbar, setNoteSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [replySnackbar, setReplySnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [unitsSnackbar, setUnitsSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [meritsSnackbar, setMeritsSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [mundoSnackbar, setMundoSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // Ref para la suscripción específica de la página demo
  const demoSubscriptionIdRef = useRef<string | null>(null);

  // Contexto Nostr
  const {
    client,
    isConnected,
    receivedEvents: contextReceivedEvents,
    profiles: contextProfiles,
    mundos: contextMundos,
    playlists: contextPlaylists,
    experiencias: contextExperiencias,
    getUserDisplayName,
    getProfilePicture,
    getLud16,
    parseMundoContent,
    getMundoDTag,
    parsePlaylistContent,
    parseExperienciaContent,
  } = useNostrContext();

  // Suscripción personal
  useEffect(() => {
    if (!client || !publicKey) return;
    let mounted = true;
    if (demoSubscriptionIdRef.current && client) {
      client.unsubscribe(demoSubscriptionIdRef.current);
      demoSubscriptionIdRef.current = null;
    }
    // Suscribirse solo a eventos personales (autor y p-tag), excluyendo kind 0
    const filters = [
      {
        kinds: [1, 7, 11000, 11001, 31002, 31003, 31004],
        authors: [publicKey],
        limit: 100
      },
      {
        kinds: [1, 7, 11000, 11001, 31002, 31003, 31004],
        '#p': [publicKey],
        limit: 100
      }
    ];
    console.log('Filters sent to relay:', filters);
    const handleEventReceived = () => {
      if (!mounted) return;
      // No filtrar kind 0 aquí, el provider ya lo hace
    };
    client.subscribe(filters, handleEventReceived).then(subId => {
      if (!mounted) {
        client.unsubscribe(subId);
        return;
      }
      demoSubscriptionIdRef.current = subId;
      setTimeout(() => {
        if (mounted) setIsReadyToPublish(true);
      }, 10000);
    });
    return () => {
      mounted = false;
      if (client && demoSubscriptionIdRef.current) {
        client.unsubscribe(demoSubscriptionIdRef.current);
        demoSubscriptionIdRef.current = null;
      }
    };
  }, [client, publicKey]);

  // Filtrar eventos personales para la demo
  const allowedKinds = [1, 7, 11000, 11001, 31002, 31003, 31004];
  const filteredEvents = contextReceivedEvents.filter(event => {
    if (!publicKey) return false;
    // Filter by allowed kinds first
    if (!allowedKinds.includes(event.kind)) return false;
    // Filter by author or recipient tag
    if (event.pubkey === publicKey) return true;
    if (event.tags && event.tags.some(tag => tag[0] === 'p' && tag[1] === publicKey)) return true;
    return false;
  });

  // Calcular balances locales
  const calculateTransactionDelta = useCallback((event: Event, userPubkey: string): number => {
    try {
      const transaction = JSON.parse(event.content) as { amount: number };
      if (isNaN(transaction.amount)) return 0;
      if (event.pubkey === userPubkey) return -transaction.amount;
      const isRecipient = event.tags.some(tag => tag[0] === 'p' && tag[1] === userPubkey && tag[1] !== event.pubkey);
      if (isRecipient) return transaction.amount;
      return 0;
    } catch {
      return 0;
    }
  }, []);
  const calculateBalanceFromEvents = useCallback((events: Event[], userPubkey: string): number => {
    return events.reduce((balance, evt) => {
      if (evt.kind === 11000) {
        return balance + calculateTransactionDelta(evt, userPubkey);
      }
      return balance;
    }, 0);
  }, [calculateTransactionDelta]);
  const calculateMeritTransactionDelta = useCallback((event: Event, userPubkey: string): number => {
    try {
      const transaction = JSON.parse(event.content) as MeritTransaction;
      if (isNaN(transaction.amount)) return 0;
      const isAffected = event.tags.some(tag => tag[0] === 'p' && tag[1] === userPubkey);
      if (!isAffected && event.pubkey !== userPubkey) return 0;
      switch (transaction.action) {
        case 'gain':
        case 'award':
          return transaction.amount;
        case 'spend':
          return -transaction.amount;
        default:
          return 0;
      }
    } catch {
      return 0;
    }
  }, []);
  const calculateMeritBalanceFromEvents = useCallback((events: Event[], userPubkey: string): number => {
    return events.reduce((balance, event) => {
      if (event.kind === 11001) {
        return balance + calculateMeritTransactionDelta(event, userPubkey);
      }
      return balance;
    }, 0);
  }, [calculateMeritTransactionDelta]);
  useEffect(() => {
    if (publicKey) {
      const transactionEvents = contextReceivedEvents.filter(event => event.kind === 11000 || event.kind === 11001);
      setUnitBalance(calculateBalanceFromEvents(transactionEvents, publicKey));
      setMeritBalance(calculateMeritBalanceFromEvents(transactionEvents, publicKey));
    } else {
      setUnitBalance(0);
      setMeritBalance(0);
    }
  }, [publicKey, contextReceivedEvents, calculateBalanceFromEvents, calculateMeritBalanceFromEvents]);

  // Generar claves demo
  const handleGenerateKeys = async () => {
    if (client) {
      client.generateKeys();
      const newPublicKey = client.getPublicKey();
      setPrivateKey(null); // No hay método getPrivateKey, limpiar local
      setPublicKey(newPublicKey);
      // Reset states
      setNoteContent('');
      setReplyContent('');
      setReplyToEventId(null);
      setRecipientPubkey('');
      setUnitAmount('');
      setUnitMemo('');
      setUnitBalance(0);
      setMeritRecipientPubkey('');
      setMeritAmount('');
      setMeritType('');
      setMeritAction('gain');
      setMeritBalance(0);
      setMundoDTag('');
      setMundoTitle('');
      setMundoDescription('');
      setIsPublishingMundo(false);
      setIsReadyToPublish(false);
    }
  };

  // Publicar nota simple
  const handlePublishNote = async () => {
    if (!client || !noteContent || !isReadyToPublish) return;
    setIsPublishing(true);
    try {
      const event = await client.publishNote(noteContent);
      console.log('Note published:', event);
      setNoteContent('');
      setNoteSnackbar({ open: true, message: 'Note published successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error publishing note:', error);
      setNoteSnackbar({ open: true, message: `Error publishing note: ${(error as Error).message}`, severity: 'error' });
    } finally {
      setIsPublishing(false);
    }
  };

  // Responder a un evento
  const handleReply = async (originalEvent: Event) => {
    if (!client || !replyContent || !isReadyToPublish) return;
    setIsReplying(true);
    try {
      const event = await client.publishReply(replyContent, originalEvent);
      console.log('Reply published:', event);
      setReplyContent('');
      setReplyToEventId(null);
      setReplySnackbar({ open: true, message: 'Reply published successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error publishing reply:', error);
      setReplySnackbar({ open: true, message: `Error publishing reply: ${(error as Error).message}`, severity: 'error' });
    } finally {
      setIsReplying(false);
    }
  };

  // Enviar Ünits
  const handleSendUnits = async () => {
    if (!client || !recipientPubkey || !unitAmount || !isReadyToPublish) return;
    setIsSendingUnits(true);
    try {
      const amount = parseInt(unitAmount, 10);
      if (isNaN(amount) || amount <= 0) {
        setUnitsSnackbar({ open: true, message: 'Please enter a valid positive amount for Ünits.', severity: 'error' });
        return;
      }
      const event = await client.publishUnitsTransaction(recipientPubkey, amount, unitMemo);
      console.log('Ünits transaction published:', event);
      setRecipientPubkey('');
      setUnitAmount('');
      setUnitMemo('');
      setUnitsSnackbar({ open: true, message: 'Ünits sent successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error sending Ünits:', error);
      setUnitsSnackbar({ open: true, message: `Error sending Ünits: ${(error as Error).message}`, severity: 'error' });
    } finally {
      setIsSendingUnits(false);
    }
  };

  // Enviar Méritos
  const handleSendMerits = async () => {
    if (!client || !meritRecipientPubkey || !meritAmount || !meritType || !isReadyToPublish) return;
    setIsSendingMerits(true);
    try {
      const amount = parseInt(meritAmount, 10);
      if (isNaN(amount) || amount <= 0) {
        setMeritsSnackbar({ open: true, message: 'Please enter a valid positive amount for Merits.', severity: 'error' });
        return;
      }
      const event = await client.publishMeritTransaction(meritRecipientPubkey, amount, meritType, meritAction);
      console.log('Merit transaction published:', event);
      setMeritRecipientPubkey('');
      setMeritAmount('');
      setMeritType('');
      setMeritAction('gain');
      setMeritsSnackbar({ open: true, message: 'Merits sent successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error sending Merits:', error);
      setMeritsSnackbar({ open: true, message: `Error sending Merits: ${(error as Error).message}`, severity: 'error' });
    } finally {
      setIsSendingMerits(false);
    }
  };

  // Publicar Mundo
  const handlePublishMundo = async () => {
    if (!client || !mundoDTag || !mundoTitle || !mundoDescription || !isReadyToPublish) return;
    setIsPublishingMundo(true);
    try {
      const event = await client.publishMundo(mundoDTag, mundoTitle, mundoDescription);
      console.log('Mundo published:', event);
      setMundoDTag('');
      setMundoTitle('');
      setMundoDescription('');
      setMundoSnackbar({ open: true, message: 'Mundo published successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error publishing Mundo:', error);
      setMundoSnackbar({ open: true, message: `Error publishing Mundo: ${(error as Error).message}`, severity: 'error' });
    } finally {
      setIsPublishingMundo(false);
    }
  };

  // Publicar perfil
  const handlePublishProfile = async (data: ProfileFormData) => {
    if (!client || !publicKey || !isReadyToPublish) return;
    try {
      const event = await client.publishProfile(data);
      console.log('Profile published:', event);
      setProfileSnackbar({ open: true, message: 'Profile published successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error publishing profile:', error);
      setProfileSnackbar({ open: true, message: `Error publishing profile: ${(error as Error).message}`, severity: 'error' });
    }
  };

  // Helper para formatear fecha de evento
  const formatEventDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  // Cerrar Snackbars
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setProfileSnackbar({ ...profileSnackbar, open: false });
    setNoteSnackbar({ ...noteSnackbar, open: false });
    setReplySnackbar({ ...replySnackbar, open: false });
    setUnitsSnackbar({ ...unitsSnackbar, open: false });
    setMeritsSnackbar({ ...meritsSnackbar, open: false });
    setMundoSnackbar({ ...mundoSnackbar, open: false });
  };

  return (
    <ErrorBoundary>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            CoomÜnity Nostr Demo
          </Typography>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Status
            </Typography>
            <Typography variant="body1">
              Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
            <Typography variant="body1">
              Public Key: {publicKey || 'Not generated'}
            </Typography>
            <Typography variant="body1">
              Unit Balance: {unitBalance}
            </Typography>
            <Typography variant="body1">
              Merit Balance: {meritBalance}
            </Typography>
            {!publicKey && (
              <Button
                variant="contained"
                onClick={handleGenerateKeys}
                sx={{ mt: 2 }}
              >
                Generate Demo Keys
              </Button>
            )}
          </Paper>

          {publicKey && (
            <Fade in={isReadyToPublish} timeout={1000}>
              <Box>
                <ProfileForm onSubmit={handlePublishProfile} />

                <NostrForms
                  noteContent={noteContent}
                  setNoteContent={setNoteContent}
                  isPublishing={isPublishing}
                  handlePublishNote={handlePublishNote}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  isReplying={isReplying}
                  handleReply={handleReply}
                  replyToEventId={replyToEventId}
                  setReplyToEventId={setReplyToEventId}
                  recipientPubkey={recipientPubkey}
                  setRecipientPubkey={setRecipientPubkey}
                  unitAmount={unitAmount}
                  setUnitAmount={setUnitAmount}
                  unitMemo={unitMemo}
                  setUnitMemo={setUnitMemo}
                  isSendingUnits={isSendingUnits}
                  handleSendUnits={handleSendUnits}
                  meritRecipientPubkey={meritRecipientPubkey}
                  setMeritRecipientPubkey={setMeritRecipientPubkey}
                  meritAmount={meritAmount}
                  setMeritAmount={setMeritAmount}
                  meritType={meritType}
                  setMeritType={setMeritType}
                  meritAction={meritAction}
                  setMeritAction={setMeritAction}
                  isSendingMerits={isSendingMerits}
                  handleSendMerits={handleSendMerits}
                  mundoDTag={mundoDTag}
                  setMundoDTag={setMundoDTag}
                  mundoTitle={mundoTitle}
                  setMundoTitle={setMundoTitle}
                  mundoDescription={mundoDescription}
                  setMundoDescription={setMundoDescription}
                  isPublishingMundo={isPublishingMundo}
                  handlePublishMundo={handlePublishMundo}
                />

                <NostrSections
                  mundos={contextMundos}
                  playlists={contextPlaylists}
                  experiencias={contextExperiencias}
                  profiles={contextProfiles}
                  getUserDisplayName={getUserDisplayName}
                  getProfilePicture={getProfilePicture}
                  // parseMundoContent={parseMundoContent}
                  getMundoDTag={getMundoDTag}
                  parsePlaylistContent={parsePlaylistContent}
                  parseExperienciaContent={parseExperienciaContent}
                />

                <NostrEventList
                  events={filteredEvents}
                  publicKey={publicKey}
                  onReplyClick={(event) => setReplyToEventId(event.id)}
                  getUserDisplayName={getUserDisplayName}
                  getProfilePicture={getProfilePicture}
                  formatEventDate={formatEventDate}
                  calculateTransactionDelta={calculateTransactionDelta}
                  calculateMeritTransactionDelta={calculateMeritTransactionDelta}
                />
              </Box>
            </Fade>
          )}

          {/* Snackbars para notificaciones */}
          <Snackbar open={profileSnackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <MuiAlert onClose={handleCloseSnackbar} severity={profileSnackbar.severity} sx={{ width: '100%' }}>
              {profileSnackbar.message}
            </MuiAlert>
          </Snackbar>
          <Snackbar open={noteSnackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <MuiAlert onClose={handleCloseSnackbar} severity={noteSnackbar.severity} sx={{ width: '100%' }}>
              {noteSnackbar.message}
            </MuiAlert>
          </Snackbar>
          <Snackbar open={replySnackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <MuiAlert onClose={handleCloseSnackbar} severity={replySnackbar.severity} sx={{ width: '100%' }}>
              {replySnackbar.message}
            </MuiAlert>
          </Snackbar>
          <Snackbar open={unitsSnackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <MuiAlert onClose={handleCloseSnackbar} severity={unitsSnackbar.severity} sx={{ width: '100%' }}>
              {unitsSnackbar.message}
            </MuiAlert>
          </Snackbar>
          <Snackbar open={meritsSnackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <MuiAlert onClose={handleCloseSnackbar} severity={meritsSnackbar.severity} sx={{ width: '100%' }}>
              {meritsSnackbar.message}
            </MuiAlert>
          </Snackbar>
          <Snackbar open={mundoSnackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <MuiAlert onClose={handleCloseSnackbar} severity={mundoSnackbar.severity} sx={{ width: '100%' }}>
              {mundoSnackbar.message}
            </MuiAlert>
          </Snackbar>

        </Box>
      </Container>
    </ErrorBoundary>
  );
};

export default NostrDemoPage;