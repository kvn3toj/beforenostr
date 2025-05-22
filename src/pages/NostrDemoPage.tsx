import React, { useState, useEffect, useCallback, useRef, ErrorInfo, useMemo } from 'react';
import { Container, Box, Typography, Button, TextField, Paper, List, ListItem, ListItemText, CircularProgress, Avatar, IconButton, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Grid from '@mui/material/Grid';
import { CoomunityNostrClient } from '../lib/CoomunityNostrClient';
import { Event } from 'nostr-tools/core';
import type { Filter } from '../lib/CoomunityNostrClient';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import NoteIcon from '@mui/icons-material/Note';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PublicIcon from '@mui/icons-material/Public';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import SchoolIcon from '@mui/icons-material/School';

interface NostrProfile {
  name?: string;
  display_name?: string;
  picture?: string;
  about?: string;
  website?: string;
  nip05?: string;
  lud06?: string;
  lud16?: string | { address: string };
  created_at?: number;
  [key: string]: string | number | { address: string } | undefined;
}

type MeritAction = 'gain' | 'spend' | 'award';

interface MeritTransaction {
  amount: number;
  type: string;
  action: MeritAction;
}

interface MundoContent {
  title: string;
  description: string;
}

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
  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>('');
  const [receivedEvents, setReceivedEvents] = useState<Event[]>([]);
  const [profiles, setProfiles] = useState<Map<string, NostrProfile>>(new Map());
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [replyToEventId, setReplyToEventId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isReacting, setIsReacting] = useState<boolean>(false);

  // New state variables for Ünits transactions
  const [recipientPubkey, setRecipientPubkey] = useState<string>('');
  const [unitAmount, setUnitAmount] = useState<string>('');
  const [unitMemo, setUnitMemo] = useState<string>('');
  const [isSendingUnits, setIsSendingUnits] = useState<boolean>(false);

  // New state for Ünits balance
  const [unitBalance, setUnitBalance] = useState<number>(0);

  // New state variables for Merit transactions
  const [meritRecipientPubkey, setMeritRecipientPubkey] = useState<string>('');
  const [meritAmount, setMeritAmount] = useState<string>('');
  const [meritType, setMeritType] = useState<string>('');
  const [meritAction, setMeritAction] = useState<MeritAction>('gain');
  const [isSendingMerits, setIsSendingMerits] = useState<boolean>(false);
  const [meritBalance, setMeritBalance] = useState<number>(0);

  // New state variables for Mundo events
  const [mundos, setMundos] = useState<Map<string, Event>>(new Map());
  const [mundoDTag, setMundoDTag] = useState<string>('');
  const [mundoTitle, setMundoTitle] = useState<string>('');
  const [mundoDescription, setMundoDescription] = useState<string>('');
  const [isPublishingMundo, setIsPublishingMundo] = useState<boolean>(false);

  // New state for diagnostic delay before enabling publish buttons
  const [isReadyToPublish, setIsReadyToPublish] = useState<boolean>(false);

  // Nuevos estados para el formulario de perfil
  const [profileName, setProfileName] = useState<string>('');
  const [profileDisplayName, setProfileDisplayName] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [profileAbout, setProfileAbout] = useState<string>('');
  const [isPublishingProfile, setIsPublishingProfile] = useState<boolean>(false);

  const clientRef = useRef<CoomunityNostrClient | null>(null);
  const subscriptionIdRef = useRef<string | null>(null);

  // Ref para rastrear si es el primer montaje
  const isFirstMount = useRef(true);

  // Define relayUrls inside the component using useMemo
  const relayUrls = useMemo(() => ['wss://nos.lol'], []);

  // Funciones auxiliares de validación y obtención de datos
  const parseProfileContent = useCallback((content: string): NostrProfile | null => {
    try {
      return JSON.parse(content) as NostrProfile;
    } catch (e) {
      console.warn('Error al parsear contenido del perfil:', e);
      return null;
    }
  }, []); // No dependencies needed as it's a pure function

  const calculateTransactionDelta = useCallback((event: Event, userPubkey: string): number => {
    try {
      const transaction = JSON.parse(event.content) as { amount: number };
      if (isNaN(transaction.amount)) return 0;

      // If user is the sender, subtract the amount
      if (event.pubkey === userPubkey) {
        return -transaction.amount;
      }

      // If user is the recipient (in p tags), add the amount
      const isRecipient = event.tags.some(tag =>
        tag[0] === 'p' && tag[1] === userPubkey && tag[1] !== event.pubkey
      );
      if (isRecipient) {
        return transaction.amount;
      }

      return 0;
    } catch (e) {
      console.warn('Error al calcular delta de transacción:', e);
      return 0;
    }
  }, []); // No dependencies needed as it's a pure function

  const calculateBalanceFromEvents = useCallback((events: Event[], userPubkey: string): number => {
    return events.reduce((balance, event) => {
      if (event.kind === 11000) {
        return balance + calculateTransactionDelta(event, userPubkey);
      }
      return balance;
    }, 0);
  }, [calculateTransactionDelta]);

  const calculateMeritTransactionDelta = useCallback((event: Event, userPubkey: string): number => {
    try {
      const transaction = JSON.parse(event.content) as MeritTransaction;
      if (isNaN(transaction.amount)) return 0;

      // Check if user is affected by this transaction
      const isAffected = event.tags.some(tag => tag[0] === 'p' && tag[1] === userPubkey);
      if (!isAffected && event.pubkey !== userPubkey) return 0;

      // Calculate delta based on action
      switch (transaction.action) {
        case 'gain':
        case 'award':
          return transaction.amount;
        case 'spend':
          return -transaction.amount;
        default:
          return 0;
      }
    } catch (e) {
      console.warn('Error al calcular delta de transacción de méritos:', e);
      return 0;
    }
  }, []); // No dependencies needed as it's a pure function

  const calculateMeritBalanceFromEvents = useCallback((events: Event[], userPubkey: string): number => {
    return events.reduce((balance, event) => {
      if (event.kind === 11001) {
        return balance + calculateMeritTransactionDelta(event, userPubkey);
      }
      return balance;
    }, 0);
  }, [calculateMeritTransactionDelta]);

  const getMundoDTag = useCallback((event: Event): string | null => {
    const dTag = event.tags.find(tag => tag[0] === 'd');
    return dTag ? dTag[1] : null;
  }, []); // No dependencies needed as it's a pure function

  const getMundoKey = useCallback((event: Event): string | null => {
    const dTag = getMundoDTag(event);
    return dTag ? `${event.pubkey}:${dTag}` : null;
  }, [getMundoDTag]);

  const parseMundoContent = useCallback((event: Event): MundoContent | null => {
    try {
      return JSON.parse(event.content) as MundoContent;
    } catch (e) {
      console.warn('Error al parsear contenido de Mundo:', e);
      return null;
    }
  }, []); // No dependencies needed as it's a pure function

  // Funciones auxiliares para obtener datos de perfil de forma segura (Mantener igual)
  const getProfileName = (profile: NostrProfile | null, pubkey: string): string => {
    if (typeof profile !== 'object' || profile === null) {
      return pubkey.slice(0, 16) + '...';
    }
    return profile.display_name || profile.name || pubkey.slice(0, 16) + '...';
  };

  const getProfilePicture = (profile: NostrProfile | null): string | undefined => {
     if (typeof profile !== 'object' || profile === null || typeof profile.picture !== 'string') {
       return undefined;
     }
     // Opcional: Añadir validación de URL si es necesario
     return profile.picture;
  };

   const getLud16 = (profile: NostrProfile | null): string | undefined => {
     if (typeof profile !== 'object' || profile === null) {
       return undefined;
     }
     if (typeof profile.lud16 === 'object' && profile.lud16 !== null && typeof profile.lud16.address === 'string') {
       return profile.lud16.address;
     }
     if (typeof profile.lud16 === 'string') {
       return profile.lud16;
     }
     return undefined;
   };


  // Inicializar y limpiar el cliente Nostr y la suscripción
  useEffect(() => {
    if (isFirstMount.current) {
      console.log('[DIAGNÓSTICO] Montaje inicial de NostrDemoPage.');
      isFirstMount.current = false;
    } else {
      console.log('[DIAGNÓSTICO] Re-render de NostrDemoPage.');
    }

    let mounted = true;
    const currentClient = clientRef.current;

    // Initialize client if it doesn't exist
    if (!currentClient) {
       clientRef.current = new CoomunityNostrClient();
       console.log('Cliente Nostr creado.');
    }

    const initializeConnectionAndSubscription = async () => {
       try {
          if (clientRef.current) {
             console.log('Conectando a relays...');
             try {
               await clientRef.current.connect(relayUrls);
               console.log('Conectado a relays Nostr');
               if (!mounted) return;
               setIsConnected(true);
             } catch (error) {
               console.error('Error al conectar a relays:', error);
               if (!mounted) return;
               setIsConnected(false);
               return;
             }
          } else {
             console.log('Cliente no inicializado');
             return;
          }

          // --- Lógica de Suscripción Basada en publicKey ---

          // Cancelar cualquier suscripción anterior antes de crear una nueva
          if (subscriptionIdRef.current && clientRef.current) {
              console.log('Cancelando suscripción anterior:', subscriptionIdRef.current);
              clientRef.current.unsubscribe(subscriptionIdRef.current);
              subscriptionIdRef.current = null; // Limpiar la referencia
          }

          const filters: Filter[] = [];
          if (publicKey) {
             console.log(`Definiendo filtros para pubkey: ${publicKey}`);
             // Filtro para eventos publicados *por* este usuario (notas, reacciones, txs, mundos, su propio perfil kind:0)
             filters.push({
                kinds: [1, 7, 11000, 11001, 31002, 0],
                authors: [publicKey],
                limit: 100 // Limitar para no cargar un historial infinito
             });
             // Filtro para transacciones *recibidas* por este usuario (mencionado en una p-tag)
             filters.push({
                 kinds: [11000, 11001],
                 '#p': [publicKey],
                 limit: 100
             });
          } else {
             console.log('No hay clave pública disponible, no se suscribirá a eventos personales.');
          }

          // Suscribirse con los filtros definidos (solo si hay filtros)
          if (filters.length > 0 && clientRef.current) {
             const handleEventReceived = (event: Event) => {
               if (!mounted) return; // No procesar eventos si el componente se desmontó
               try {
                  console.log('-> EVT recibido:', event.kind, event.id, event);

                  if (event.kind === 0) {
                    const profileData = parseProfileContent(event.content);
                    console.log('-> Perfil parseado:', profileData);
                    if (profileData) {
                      setProfiles(prevProfiles => {
                        const newProfiles = new Map(prevProfiles);
                        const existingProfile = newProfiles.get(event.pubkey);
                        if (!existingProfile || event.created_at > (existingProfile.created_at || 0)) {
                          const profileCopy = JSON.parse(JSON.stringify(profileData));
                          newProfiles.set(event.pubkey, { ...profileCopy, created_at: event.created_at });
                          console.log('-> Perfil guardado:', profileCopy);
                        }
                        return newProfiles;
                      });
                    }
                  } else if (event.kind === 31002) {
                    const dTag = getMundoDTag(event);
                    if (dTag) {
                      const mundoKey = getMundoKey(event);
                      if (mundoKey) {
                        const mundoContent = parseMundoContent(event);
                        console.log('-> Mundo parseado:', mundoContent);
                        setMundos(prevMundos => {
                          const newMundos = new Map(prevMundos);
                          const existingMundo = newMundos.get(mundoKey);
                          if (!existingMundo || event.created_at > existingMundo.created_at) {
                            const eventCopy = JSON.parse(JSON.stringify(event));
                            newMundos.set(mundoKey, eventCopy);
                            console.log('-> Mundo guardado:', eventCopy);
                          }
                          return newMundos;
                        });
                      }
                    }
                  } else { // Kind 1, 7, 11000, 11001
                    setReceivedEvents(prevEvents => {
                      const isDuplicate = prevEvents.some(e => e.id === event.id);
                      if (isDuplicate) {
                        console.log('-> Evento duplicado ignorado:', event.id);
                        return prevEvents;
                      }
                      const eventCopy = JSON.parse(JSON.stringify(event));
                      const newEvents = [eventCopy, ...prevEvents]
                        .sort((a, b) => b.created_at - a.created_at)
                        .slice(0, 100);
                      console.log('-> Evento guardado:', eventCopy);
                      return newEvents;
                    });
                  }
                } catch (error) {
                  console.error('Error al procesar evento:', error);
                }
             };

             const subId = await clientRef.current.subscribe(filters, handleEventReceived);
             if (!mounted) {
               // Si el componente se desmontó mientras se establecía la suscripción,
               // cancelarla inmediatamente
               clientRef.current.unsubscribe(subId);
               return;
             }
             subscriptionIdRef.current = subId;
             console.log('Suscripción activa con ID:', subId, 'Filtros:', filters);

             // --- Prueba de retraso diagnóstico para publicación ---
             const publishDelayMs = 10000; // Aumentado para diagnóstico
             const publishTimeout = setTimeout(() => {
               if (mounted) {
                 setIsReadyToPublish(true);
                 console.log(`[DIAGNÓSTICO] Listo para publicar después de retraso (${publishDelayMs}ms).`);
               }
             }, publishDelayMs);
          } else {
               if (subscriptionIdRef.current && clientRef.current) {
                  clientRef.current.unsubscribe(subscriptionIdRef.current);
                  console.log('Suscripción anterior cancelada (no hay filtros):', subscriptionIdRef.current);
               }
               subscriptionIdRef.current = null;
               console.log('No hay clave pública, no hay filtros para suscribir.');
          }

       } catch (error) {
         console.error('Error durante conexión o suscripción:', error);
         if (mounted) {
           setIsConnected(false);
         }
       }
    };

    // Ejecutar la lógica de conexión y suscripción
    initializeConnectionAndSubscription();

    // Función de limpieza del efecto
    return () => {
      console.log('[DIAGNÓSTICO] Desmontaje de NostrDemoPage.');
      mounted = false;
      console.log('Cleanup effect...');
      if (clientRef.current) {
        if (subscriptionIdRef.current) {
          console.log('Cancelando suscripción en cleanup:', subscriptionIdRef.current);
          clientRef.current.unsubscribe(subscriptionIdRef.current);
          subscriptionIdRef.current = null;
        }
        clientRef.current.disconnect();
        console.log('Cliente Nostr desconectado en cleanup.');
      }
    };
  }, [publicKey, calculateBalanceFromEvents, calculateMeritBalanceFromEvents, getMundoKey, parseProfileContent, parseMundoContent, getMundoDTag]);

  // Effect para recalcular balances cuando cambian los eventos recibidos o la clave pública (Mantener igual)
  useEffect(() => {
    if (publicKey) {
      // Solo calcular balances para los eventos que son transacciones (kind 11000 o 11001)
      const transactionEvents = receivedEvents.filter(event => event.kind === 11000 || event.kind === 11001);

      const newUnitBalance = calculateBalanceFromEvents(transactionEvents, publicKey);
      const newMeritBalance = calculateMeritBalanceFromEvents(transactionEvents, publicKey);
      setUnitBalance(newUnitBalance);
      setMeritBalance(newMeritBalance);
    } else {
      setUnitBalance(0);
      setMeritBalance(0);
    }
  }, [publicKey, receivedEvents, calculateBalanceFromEvents, calculateMeritBalanceFromEvents]);


  // Generar claves (MODIFICADO para limpiar estados)
  const handleGenerateKeys = useCallback(() => {
    if (clientRef.current) {
      const { pubkey, privkey } = clientRef.current.generateKeys();
      setPrivateKey(privkey);
      setPublicKey(pubkey);
      clientRef.current.setPrivateKey(privkey);
      console.log('Claves generadas:', { pubkey, privkey });

      // Limpiar datos antiguos al generar nuevas claves
      setReceivedEvents([]);
      setProfiles(new Map());
      setMundos(new Map());
      setUnitBalance(0);
      setMeritBalance(0);

      // Resetear estado de publicación lista al generar nuevas claves
      setIsReadyToPublish(false);
    }
  }, [clientRef]); // Dependencia en clientRef para asegurar acceso a generateKeys

  // Publicar nota (Mantener igual)
  const handlePublishNote = useCallback(async () => {
    if (!clientRef.current || !noteContent.trim()) return;

    setIsPublishing(true);
    try {
      const event = await clientRef.current.publish({
        kind: 1,
        content: noteContent,
        tags: [],
        created_at: Math.floor(Date.now() / 1000)
      });
      console.log('Nota publicada:', event);
      setNoteContent('');
    } catch (error) {
      console.error('Error al publicar nota:', error);
    } finally {
      setIsPublishing(false);
    }
  }, [noteContent]);

  // Manejar respuesta (Mantener igual)
  const handleReply = useCallback(async () => {
    if (!clientRef.current || !replyContent.trim() || !replyToEventId) return;

    setIsReplying(true);
    try {
      // Encontrar el evento al que se está respondiendo
      const parentEvent = receivedEvents.find(e => e.id === replyToEventId);
      if (!parentEvent) {
        throw new Error('Evento padre no encontrado');
      }

      const event = await clientRef.current.publish({
        kind: 1,
        content: replyContent,
        tags: [
          ['e', replyToEventId],
          ['p', parentEvent.pubkey] // Mencionar al autor del evento padre
        ],
        created_at: Math.floor(Date.now() / 1000)
      });
      console.log('Respuesta publicada:', event);
      setReplyContent('');
      setReplyToEventId(null);
    } catch (error) {
      console.error('Error al publicar respuesta:', error);
    } finally {
      setIsReplying(false);
    }
  }, [replyContent, replyToEventId, receivedEvents]);

  // Manejar reacción (Mantener igual)
  const handleReact = useCallback(async (eventToReactTo: Event) => {
    if (!clientRef.current) return;

    setIsReacting(true);
    try {
      const event = await clientRef.current.publish({
        kind: 7,
        content: '+', // Contenido típico para una reacción positiva
        tags: [
          ['e', eventToReactTo.id], // Referenciar el evento reaccionado
          ['p', eventToReactTo.pubkey] // Mencionar al autor del evento reaccionado
        ],
        created_at: Math.floor(Date.now() / 1000)
      });
      console.log('Reacción publicada:', event);
    } catch (error) {
      console.error('Error al publicar reacción:', error);
    } finally {
      setIsReacting(false);
    }
  }, []);

  // Manejar transacción Ünits (Mantener igual)
  const handleSendUnits = useCallback(async () => {
    if (!clientRef.current || !privateKey || !publicKey || !recipientPubkey || !unitAmount) return;

    const amount = parseFloat(unitAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, ingresa un monto válido mayor que 0');
      return;
    }

    setIsSendingUnits(true);
    try {
      const event = await clientRef.current.publish({
        kind: 11000,
        content: JSON.stringify({
          amount,
          memo: unitMemo
        }),
        tags: [
          ['p', recipientPubkey] // Destinatario (el remitente es el autor del evento)
        ],
        created_at: Math.floor(Date.now() / 1000)
      });
      console.log('Transacción Ünits publicada:', event);

      // Limpiar el formulario
      setRecipientPubkey('');
      setUnitAmount('');
      setUnitMemo('');
    } catch (error) {
      console.error('Error al publicar transacción Ünits:', error);
      alert('Error al enviar Ünits. Por favor, intenta de nuevo.');
    } finally {
      setIsSendingUnits(false);
    }
  }, [privateKey, publicKey, recipientPubkey, unitAmount, unitMemo]);

  // Manejar envío de Méritos (Mantener igual)
  const handleSendMerits = useCallback(async () => {
    if (!clientRef.current || !privateKey || !publicKey || !meritRecipientPubkey || !meritAmount || !meritType) return;

    const amount = parseFloat(meritAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, ingresa un monto válido mayor que 0');
      return;
    }

    setIsSendingMerits(true);
    try {
      const event = await clientRef.current.publish({
        kind: 11001,
        content: JSON.stringify({
          amount,
          type: meritType,
          action: meritAction
        }),
        tags: [
          ['p', meritRecipientPubkey], // Afectado (el otorgante es el autor del evento)
          ['merit_type', meritType]
        ],
        created_at: Math.floor(Date.now() / 1000)
      });
      console.log('Transacción de Méritos publicada:', event);

      // Limpiar el formulario
      setMeritRecipientPubkey('');
      setMeritAmount('');
      setMeritType('');
      setMeritAction('gain');
    } catch (error) {
      console.error('Error al publicar transacción de Méritos:', error);
      alert('Error al enviar Méritos. Por favor, intenta de nuevo.');
    } finally {
      setIsSendingMerits(false);
    }
  }, [privateKey, publicKey, meritRecipientPubkey, meritAmount, meritType, meritAction]);

  // Manejar publicación de Mundo (Mantener igual)
  const handlePublishMundo = useCallback(async () => {
    if (!clientRef.current || !privateKey || !publicKey || !mundoDTag || !mundoTitle) return;

    setIsPublishingMundo(true);
    try {
      const event = await clientRef.current.publish({
        kind: 31002,
        content: JSON.stringify({
          title: mundoTitle,
          description: mundoDescription
        }),
        tags: [
          ['d', mundoDTag], // Identificador único del mundo para este autor
          ['t', 'coomunity_world'] // Tag de tipo (opcional, para categorización)
        ],
        created_at: Math.floor(Date.now() / 1000)
      });
      console.log('Mundo publicado:', event);

      // Limpiar el formulario
      setMundoDTag('');
      setMundoTitle('');
      setMundoDescription('');
    } catch (error) {
      console.error('Error al publicar Mundo:', error);
      alert('Error al publicar Mundo. Por favor, intenta de nuevo.');
    } finally {
      setIsPublishingMundo(false);
    }
  }, [privateKey, publicKey, mundoDTag, mundoTitle, mundoDescription]);

  // Nueva función para publicar perfil
  const handlePublishProfile = useCallback(async () => {
    if (!clientRef.current || !privateKey || !publicKey) return;

    setIsPublishingProfile(true);
    try {
      const profileContent: NostrProfile = {
        name: profileName,
        display_name: profileDisplayName,
        picture: profilePicture,
        about: profileAbout,
        created_at: Math.floor(Date.now() / 1000)
      };

      const event = await clientRef.current.publish({
        kind: 0,
        content: JSON.stringify(profileContent),
        tags: [],
        created_at: Math.floor(Date.now() / 1000)
      });
      console.log('Perfil publicado:', event);

      // Limpiar el formulario
      setProfileName('');
      setProfileDisplayName('');
      setProfilePicture('');
      setProfileAbout('');
    } catch (error) {
      console.error('Error al publicar perfil:', error);
      alert('Error al publicar perfil. Por favor, intenta de nuevo.');
    } finally {
      setIsPublishingProfile(false);
    }
  }, [privateKey, publicKey, profileName, profileDisplayName, profilePicture, profileAbout]);

  // Función para obtener el nombre de usuario (Usando función auxiliar segura)
  const getUserDisplayName = (pubkey: string): string => {
    const profile = profiles.get(pubkey);
    return getProfileName(profile || null, pubkey); // Usar la función auxiliar
  };

  // Función para obtener la imagen de perfil (Usando función auxiliar segura)
  const getUserPicture = (pubkey: string): string | undefined => {
    const profile = profiles.get(pubkey);
    return getProfilePicture(profile || null); // Usar la función auxiliar
  };

  const formatDate = (timestamp: number): string => {
    return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true, locale: es });
  };

  const getParentEventInfo = (event: Event): { isReply: boolean; parentId?: string } => {
    const eTag = event.tags.find(tag => tag[0] === 'e');
    return {
      isReply: !!eTag,
      parentId: eTag?.[1]
    };
  };

  return (
    <ErrorBoundary>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Demo Nostr
          </Typography>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Estado de Conexión
            </Typography>
            <Typography>
              {isConnected ? 'Conectado a relays' : 'Desconectado'}
            </Typography>
          </Paper>

          {/* Balances Display */}
          {publicKey && (
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Paper sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Balance de Ünits
                </Typography>
                <Typography variant="h4" color="primary">
                  {unitBalance.toFixed(2)} Ünits
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Balance de Méritos
                </Typography>
                <Typography variant="h4" color="primary">
                  {meritBalance.toFixed(2)} Méritos
                </Typography>
              </Paper>
            </Stack>
          )}

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Claves
            </Typography>
            {!privateKey ? (
              <Button variant="contained" onClick={handleGenerateKeys}>
                Generar Claves
              </Button>
            ) : (
              <Box>
                <Typography variant="subtitle1">Clave Pública (npub):</Typography>
                <Typography sx={{ wordBreak: 'break-all' }}>{publicKey}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>Clave Privada (nsec):</Typography>
                <Typography sx={{ wordBreak: 'break-all' }}>{privateKey ? new TextDecoder().decode(privateKey) : ''}</Typography>
                <Typography variant="caption" color="textSecondary">
                  (Guarda tu clave privada en un lugar seguro. No la compartas.)
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mi Perfil
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Nombre"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                disabled={!privateKey || isPublishingProfile || !isReadyToPublish}
                placeholder="Tu nombre"
              />
              <TextField
                fullWidth
                label="Nombre para mostrar"
                value={profileDisplayName}
                onChange={(e) => setProfileDisplayName(e.target.value)}
                disabled={!privateKey || isPublishingProfile || !isReadyToPublish}
                placeholder="Tu nombre para mostrar"
              />
              <TextField
                fullWidth
                label="URL de imagen de perfil"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                disabled={!privateKey || isPublishingProfile || !isReadyToPublish}
                placeholder="https://..."
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Acerca de"
                value={profileAbout}
                onChange={(e) => setProfileAbout(e.target.value)}
                disabled={!privateKey || isPublishingProfile || !isReadyToPublish}
                placeholder="Cuéntanos sobre ti..."
              />
              <Button
                variant="contained"
                onClick={handlePublishProfile}
                disabled={!privateKey || !profileName.trim() || isPublishingProfile || !isReadyToPublish}
              >
                {isPublishingProfile ? <CircularProgress size={24} /> : 'Publicar Perfil'}
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Publicar Nota
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Escribe tu nota aquí..."
              disabled={!privateKey || isPublishing || !isReadyToPublish}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handlePublishNote}
              disabled={!privateKey || !noteContent.trim() || isPublishing || !isReadyToPublish}
              sx={{ mt: 2 }}
            >
              {isPublishing ? <CircularProgress size={24} /> : 'Publicar Nota'}
            </Button>
          </Paper>

          {/* Formulario de Respuesta (Mantener igual) */}
          {replyToEventId && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Responder a Nota
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                disabled={!privateKey || isReplying || !isReadyToPublish}
                sx={{ mb: 2 }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleReply}
                  disabled={!privateKey || !replyContent.trim() || isReplying || !isReadyToPublish}
                >
                  {isReplying ? <CircularProgress size={24} /> : 'Enviar Respuesta'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setReplyToEventId(null);
                    setReplyContent('');
                  }}
                >
                  Cancelar
                </Button>
              </Stack>
            </Paper>
          )}

          {/* Formulario Enviar Ünits (Mantener igual) */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Enviar Ünits
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Clave Pública del Destinatario"
                value={recipientPubkey}
                onChange={(e) => setRecipientPubkey(e.target.value)}
                disabled={!privateKey || isSendingUnits || !isReadyToPublish}
                placeholder="npub..."
              />
              <TextField
                fullWidth
                label="Cantidad de Ünits"
                type="number"
                value={unitAmount}
                onChange={(e) => setUnitAmount(e.target.value)}
                disabled={!privateKey || isSendingUnits || !isReadyToPublish}
                inputProps={{ min: "0", step: "0.01" }}
              />
              <TextField
                fullWidth
                label="Memo (opcional)"
                value={unitMemo}
                onChange={(e) => setUnitMemo(e.target.value)}
                disabled={!privateKey || isSendingUnits || !isReadyToPublish}
                placeholder="Mensaje opcional..."
              />
              <Button
                variant="contained"
                onClick={handleSendUnits}
                disabled={!privateKey || !recipientPubkey.trim() || !unitAmount.trim() || isSendingUnits || !isReadyToPublish}
              >
                {isSendingUnits ? <CircularProgress size={24} /> : 'Enviar Ünits'}
              </Button>
            </Stack>
          </Paper>

          {/* Formulario Enviar Méritos (Mantener igual) */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Enviar Méritos
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Clave Pública del Afectado"
                value={meritRecipientPubkey}
                onChange={(e) => setMeritRecipientPubkey(e.target.value)}
                disabled={!privateKey || isSendingMerits || !isReadyToPublish}
                placeholder="npub..."
              />
              <TextField
                fullWidth
                label="Cantidad de Méritos"
                type="number"
                value={meritAmount}
                onChange={(e) => setMeritAmount(e.target.value)}
                disabled={!privateKey || isSendingMerits || !isReadyToPublish}
                inputProps={{ min: "0", step: "0.01" }}
              />
              <TextField
                fullWidth
                label="Tipo de Mérito"
                value={meritType}
                onChange={(e) => setMeritType(e.target.value)}
                disabled={!privateKey || isSendingMerits || !isReadyToPublish}
                placeholder="Ej: Contribución, Participación..."
              />
              <FormControl fullWidth>
                <InputLabel>Acción</InputLabel>
                <Select
                  value={meritAction}
                  onChange={(e) => setMeritAction(e.target.value as MeritAction)}
                  disabled={!privateKey || isSendingMerits || !isReadyToPublish}
                  label="Acción"
                >
                  <MenuItem value="gain">Ganar</MenuItem>
                  <MenuItem value="spend">Gastar</MenuItem>
                  <MenuItem value="award">Otorgar</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleSendMerits}
                disabled={!privateKey || !meritRecipientPubkey.trim() || !meritAmount.trim() || !meritType.trim() || isSendingMerits || !isReadyToPublish}
              >
                {isSendingMerits ? <CircularProgress size={24} /> : 'Enviar Méritos'}
              </Button>
            </Stack>
          </Paper>

          {/* Formulario Crear/Actualizar Mundo (Mantener igual) */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Crear/Actualizar Mundo
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="ID Único del Mundo"
                value={mundoDTag}
                onChange={(e) => setMundoDTag(e.target.value)}
                disabled={!privateKey || isPublishingMundo || !isReadyToPublish}
                placeholder="Ej: mundo1, comunidad1..."
              />
              <TextField
                fullWidth
                label="Título del Mundo"
                value={mundoTitle}
                onChange={(e) => setMundoTitle(e.target.value)}
                disabled={!privateKey || isPublishingMundo || !isReadyToPublish}
                placeholder="Ej: Mundo de Programación..."
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción del Mundo"
                value={mundoDescription}
                onChange={(e) => setMundoDescription(e.target.value)}
                disabled={!privateKey || isPublishingMundo || !isReadyToPublish}
                placeholder="Describe tu mundo..."
              />
              <Button
                variant="contained"
                onClick={handlePublishMundo}
                disabled={!privateKey || !mundoDTag.trim() || !mundoTitle.trim() || !mundoDescription.trim() || isPublishingMundo || !isReadyToPublish}
              >
                {isPublishingMundo ? <CircularProgress size={24} /> : 'Publicar Mundo'}
              </Button>
            </Stack>
          </Paper>

          {/* Lista de Eventos Recibidos - Mejorada visualmente */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mis Eventos
            </Typography>
            <List>
              {receivedEvents.map((event) => {
                const displayName = getUserDisplayName(event.pubkey);
                const picture = getUserPicture(event.pubkey);
                const { isReply, parentId } = getParentEventInfo(event);
                const parentEvent = parentId ? receivedEvents.find(e => e.id === parentId) : null;

                // Función auxiliar para el encabezado del evento
                const EventHeader = () => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {picture && (
                      <Avatar
                        src={picture}
                        alt={displayName}
                        sx={{ width: 32, height: 32 }}
                      />
                    )}
                    <Typography variant="subtitle2" color="primary" component="div">
                      {displayName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="div">
                      {formatDate(event.created_at)}
                    </Typography>
                  </Box>
                );

                // Función auxiliar para el contenido del evento
                const EventContent = () => {
                  switch (event.kind) {
                    case 1: // Nota
                      return (
                        <Box sx={{ borderLeft: '4px solid #2196f3', pl: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <NoteIcon color="primary" />
                            <Typography variant="subtitle2" color="textSecondary" component="div">
                              Nota
                            </Typography>
                          </Box>
                          {isReply && parentEvent && (
                            <Typography variant="caption" color="textSecondary" component="div" sx={{ display: 'block', mb: 1 }}>
                              En respuesta a {getUserDisplayName(parentEvent.pubkey)}
                            </Typography>
                          )}
                          <Typography variant="body1" component="div">
                            {typeof event.content === 'string' ? (
                              <ReactMarkdown>{event.content}</ReactMarkdown>
                            ) : (
                              'Contenido inválido'
                            )}
                          </Typography>
                        </Box>
                      );

                    case 7: // Reacción
                      return (
                        <Box sx={{ borderLeft: '4px solid #f50057', pl: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <FavoriteIcon color="error" />
                            <Typography variant="subtitle2" color="textSecondary" component="div">
                              Reacción
                            </Typography>
                          </Box>
                          <Typography variant="body1" color="textSecondary" component="div">
                            Reaccionó con {event.content} a una nota
                          </Typography>
                        </Box>
                      );

                    case 11000: // Ünits
                      return (
                        <Box sx={{ borderLeft: '4px solid #4caf50', pl: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AccountBalanceWalletIcon color="success" />
                            <Typography variant="subtitle2" color="textSecondary" component="div">
                              Transacción Ünits
                            </Typography>
                          </Box>
                          {(() => {
                            try {
                              const transaction = JSON.parse(event.content);
                              if (!transaction || typeof transaction.amount !== 'number') return null;

                              const recipientTag = event.tags.find(tag => tag[0] === 'p');
                              const recipientPubkey = recipientTag?.[1] || 'unknown';
                              const isSent = event.pubkey === publicKey;

                              return (
                                <Typography variant="body1" component="div">
                                  {isSent
                                    ? `${getUserDisplayName(event.pubkey)} envió ${transaction.amount.toFixed(2)} Ünits a ${getUserDisplayName(recipientPubkey)}`
                                    : `${getUserDisplayName(event.pubkey)} recibió ${transaction.amount.toFixed(2)} Ünits de ${getUserDisplayName(event.pubkey)}`}
                                  {transaction.memo && ` (Memo: ${transaction.memo})`}
                                </Typography>
                              );
                            } catch (e) {
                              console.warn('Error al parsear transacción Ünits:', e);
                              return null;
                            }
                          })()}
                        </Box>
                      );

                    case 11001: // Méritos
                      return (
                        <Box sx={{ borderLeft: '4px solid #ff9800', pl: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <EmojiEventsIcon color="warning" />
                            <Typography variant="subtitle2" color="textSecondary" component="div">
                              Transacción Méritos
                            </Typography>
                          </Box>
                          {(() => {
                            try {
                              const transaction = JSON.parse(event.content) as MeritTransaction;
                              if (!transaction || typeof transaction.amount !== 'number') return null;

                              const affectedTag = event.tags.find(tag => tag[0] === 'p');
                              const affectedPubkey = affectedTag?.[1] || 'unknown';

                              let actionText = '';
                              switch(transaction.action) {
                                case 'gain': actionText = 'ganó'; break;
                                case 'spend': actionText = 'gastó'; break;
                                case 'award': actionText = 'otorgó'; break;
                                default: actionText = transaction.action;
                              }

                              return (
                                <Typography variant="body1" component="div">
                                  {getUserDisplayName(event.pubkey)} {actionText} {transaction.amount.toFixed(2)} Méritos de tipo "{transaction.type}" {transaction.action === 'award' ? `a ${getUserDisplayName(affectedPubkey)}` : ''}
                                </Typography>
                              );
                            } catch (e) {
                              console.warn('Error al parsear transacción de méritos:', e);
                              return null;
                            }
                          })()}
                        </Box>
                      );

                    case 31002: // Mundo
                      return (
                        <Box sx={{ borderLeft: '4px solid #9c27b0', pl: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <PublicIcon color="secondary" />
                            <Typography variant="subtitle2" color="textSecondary" component="div">
                              Mundo
                            </Typography>
                          </Box>
                          {(() => {
                            try {
                              const mundoContent = parseMundoContent(event);
                              if (!mundoContent) return null;

                              return (
                                <>
                                  <Typography variant="body1" fontWeight="bold" component="div">
                                    {mundoContent.title || 'Sin título'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" component="div">
                                    {mundoContent.description || 'Sin descripción'}
                                  </Typography>
                                </>
                              );
                            } catch (e) {
                              console.warn('Error al renderizar Mundo:', e);
                              return null;
                            }
                          })()}
                        </Box>
                      );

                    case 31003: // Playlist
                      return (
                        <Box sx={{ borderLeft: '4px solid #ff9800', pl: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <PlaylistPlayIcon color="warning" />
                            <Typography variant="subtitle2" color="textSecondary" component="div">
                              Playlist
                            </Typography>
                          </Box>
                          {(() => {
                            try {
                              const playlistContent = parsePlaylistContent(event);
                              if (!playlistContent) return null;

                              return (
                                <>
                                  <Typography variant="body1" fontWeight="bold" component="div">
                                    {playlistContent.title || 'Sin título'}
                                  </Typography>
                                  {playlistContent.description && (
                                    <Typography variant="body2" color="text.secondary" component="div">
                                      {playlistContent.description}
                                    </Typography>
                                  )}
                                </>
                              );
                            } catch (e) {
                              console.warn('Error al renderizar Playlist:', e);
                              return null;
                            }
                          })()}
                        </Box>
                      );

                    case 31004: // Experiencia
                      return (
                        <Box sx={{ borderLeft: '4px solid #4caf50', pl: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <SchoolIcon color="success" />
                            <Typography variant="subtitle2" color="textSecondary" component="div">
                              Experiencia
                            </Typography>
                          </Box>
                          {(() => {
                            try {
                              const experienciaContent = parseExperienciaContent(event);
                              if (!experienciaContent) return null;

                              const parentPlaylistRef = event.tags.find(tag => tag[0] === 'a' && tag[1].startsWith('31003:'));
                              let parentPlaylistInfo = '';
                              if (parentPlaylistRef) {
                                const [, refContent] = parentPlaylistRef;
                                const parts = refContent.split(':');
                                if (parts.length >= 3) {
                                  const [, parentPubkey, parentDTag] = parts;
                                  const parentPlaylistKey = `${parentPubkey}:${parentDTag}`;
                                  const parentPlaylistEvent = playlists.get(parentPlaylistKey);
                                  const parentPlaylistTitle = parentPlaylistEvent ? parsePlaylistContent(parentPlaylistEvent)?.title : 'Playlist desconocida';
                                  parentPlaylistInfo = `(en Playlist: ${parentPlaylistTitle})`;
                                }
                              }

                              return (
                                <>
                                  <Typography variant="body1" fontWeight="bold" component="div">
                                    {experienciaContent.title || 'Sin título'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1 }}>
                                    {parentPlaylistInfo}
                                  </Typography>
                                  <Typography variant="body1" component="div"> {/* Usar div para markdown */}
                                    <ReactMarkdown>{experienciaContent.content}</ReactMarkdown>
                                  </Typography>
                                </>
                              );
                            } catch (e) {
                              console.warn('Error al renderizar Experiencia:', e);
                              return null;
                            }
                          })()}
                        </Box>
                      );

                    default:
                      // Opcional: Renderizar eventos desconocidos de alguna manera básica
                      return (
                        <Box sx={{ borderLeft: '4px solid #607d8b', pl: 1 }}>
                           <Typography variant="subtitle2" color="textSecondary">
                             Evento Desconocido (Kind: {event.kind})
                           </Typography>
                           <Typography variant="caption" color="textSecondary">
                             ID: {event.id.slice(0, 8)}...
                           </Typography>
                           <Typography variant="body2" sx={{ mt: 1 }}>
                             Contenido: {event.content ? event.content.slice(0, 100) + '...' : 'Vacío'}
                           </Typography>
                         </Box>
                      );
                  }
                };

                return (
                  <ListItem
                    key={event.id}
                    sx={{
                      borderBottom: '1px solid #eee',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <ListItemText
                      primary={<EventHeader />}
                      primaryTypographyProps={{ component: 'div' }}
                      secondary={<EventContent />}
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>

          {/* Sección de Perfiles Recibidos */}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mis Perfiles Recibidos (Solo tu perfil si usas tus claves)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              {/* Asegurarse de que solo se renderiza el perfil del usuario actual si publicKey existe */}
              {publicKey && profiles.has(publicKey) && (() => {
                 const profileData = profiles.get(publicKey) || null;
                 console.log('-> Renderizando Perfil (Usuario Actual):', {
                   tipo: typeof profileData,
                   datos: profileData,
                   lud16: profileData?.lud16 ? {
                     tipo: typeof profileData.lud16,
                     valor: profileData.lud16
                   } : null
                 });

                 // Usar las funciones auxiliares seguras
                 const displayName = getProfileName(profileData, publicKey);
                 const picture = getProfilePicture(profileData);
                 const lud16Address = getLud16(profileData);

                 return (
                   <Paper
                     key={publicKey}
                     elevation={1}
                     sx={{
                       p: 2,
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       gap: 1
                     }}
                   >
                     {picture && (
                       <Avatar
                         src={picture}
                         alt={displayName}
                         sx={{ width: 64, height: 64 }}
                       />
                     )}
                     <Typography variant="h6">
                       {displayName}
                     </Typography>
                     {profileData?.about && typeof profileData.about === 'string' && (
                       <Typography variant="body2" color="text.secondary" align="center">
                         {profileData.about}
                       </Typography>
                     )}
                     {profileData?.website && typeof profileData.website === 'string' && (
                       <Typography variant="caption" color="primary">
                         {profileData.website}
                       </Typography>
                     )}
                     {lud16Address && (
                       <Typography variant="caption" color="primary">
                         {lud16Address}
                       </Typography>
                     )}
                   </Paper>
                 );
              })()}
              {/* Si quieres mostrar otros perfiles que *aparecen* en tus eventos (ej: autores de notas a las que respondes),
                  necesitarías recolectar esas pubkeys y añadirlas a los filtros de kind:0, o manejar la visualización aquí.
                  Por ahora, solo mostramos el perfil del usuario actual si existe. */}
            </Box>
          </Paper>


          {/* Sección de Mundos Definidos */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mis Mundos Definidos
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              {Array.from(mundos.values()).map((mundo) => {
                // Solo mostrar mundos si fueron publicados por el usuario actual
                if (!publicKey || mundo.pubkey !== publicKey) {
                  return null;
                }

                const mundoContent = parseMundoContent(mundo);
                if (!mundoContent) return null;

                const dTag = getMundoDTag(mundo);
                if (!dTag) return null;

                return (
                  <Paper
                    key={`${mundo.pubkey}:${dTag}`}
                    elevation={1}
                    sx={{
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getUserPicture(mundo.pubkey) && (
                        <Avatar
                          src={getUserPicture(mundo.pubkey)}
                          alt={getUserDisplayName(mundo.pubkey)}
                          sx={{ width: 32, height: 32 }}
                        />
                      )}
                      <Typography variant="subtitle2" color="primary">
                        {getUserDisplayName(mundo.pubkey)}
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {mundoContent.title || 'Sin título'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID: {dTag}
                    </Typography>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {mundoContent.description || 'Sin descripción'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {formatDate(mundo.created_at)}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>
          </Paper>


        </Box>
      </Container>
    </ErrorBoundary>
  );
};

export default NostrDemoPage;