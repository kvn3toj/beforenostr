import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Avatar, ListItemAvatar, CardActions, IconButton } from '@mui/material';
import { Event } from 'nostr-tools/core';
import ReactMarkdown from 'react-markdown';
import NoteIcon from '@mui/icons-material/Note';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PublicIcon from '@mui/icons-material/Public';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';

import type { MeritTransaction, NostrProfile, MundoContent, PlaylistContent, ExperienciaContent } from '../../types/nostr';

interface NostrEventListProps {
  receivedEvents: Event[];
  profiles: Map<string, NostrProfile>;
  publicKey: string | null;
  getUserDisplayName: (pubkey: string | null | undefined) => string;
  formatDate: (timestamp: number) => string;
  getUserPicture: (pubkey: string | null | undefined) => string | undefined;
  parseMundoContent: (event: Event) => MundoContent | null;
  parsePlaylistContent: (event: Event) => PlaylistContent | null;
  parseExperienciaContent: (event: Event) => ExperienciaContent | null;
  getParentEventInfo: (event: Event) => { isReply: boolean; parentId?: string };
  mundos: Event[];
  playlists: Event[];
  experiencias: Event[];
}

const NostrEventList: React.FC<NostrEventListProps> = ({
  receivedEvents,
  profiles,
  publicKey,
  getUserDisplayName,
  formatDate,
  getUserPicture,
  parseMundoContent,
  parsePlaylistContent,
  parseExperienciaContent,
  getParentEventInfo,
  mundos,
  playlists,
  experiencias,
}) => {
  const EventHeader: React.FC<{
    event: Event;
    getUserDisplayName: (pubkey: string | null | undefined) => string;
    profiles: Map<string, NostrProfile>;
    formatDate: (timestamp: number) => string;
    getUserPicture: (pubkey: string | null | undefined) => string | undefined;
  }> = ({ event, getUserDisplayName, profiles, formatDate, getUserPicture }) => {
    if (typeof event.pubkey !== 'string') {
      console.error('[EventHeader] pubkey inválido:', event);
      return null;
    }

    const displayName = getUserDisplayName(event.pubkey);
    const picture = getUserPicture(event.pubkey);

    return (
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
  };

  const EventContent: React.FC<{
    event: Event;
    publicKey: string | null;
    receivedEvents: Event[];
    getUserDisplayName: (pubkey: string | null | undefined) => string;
    parseMundoContent: (event: Event) => MundoContent | null;
    parsePlaylistContent: (event: Event) => PlaylistContent | null;
    parseExperienciaContent: (event: Event) => ExperienciaContent | null;
    getParentEventInfo: (event: Event) => { isReply: boolean; parentId?: string };
  }> = ({
    event,
    publicKey,
    receivedEvents,
    getUserDisplayName,
    parseMundoContent,
    parsePlaylistContent,
    parseExperienciaContent,
    getParentEventInfo,
  }) => {
    const { isReply, parentId } = getParentEventInfo(event);
    const parentEvent = parentId ? receivedEvents.find(e => e.id === parentId) : null;

    let content;

    switch (event.kind) {
      case 1: {
        let parentDisplayName = '';
        if (isReply && parentEvent && typeof parentEvent.pubkey === 'string') {
          parentDisplayName = getUserDisplayName(parentEvent.pubkey);
        }
        content = (
          <Box sx={{ borderLeft: '4px solid #2196f3', pl: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <NoteIcon color="primary" />
              <Typography variant="subtitle2" color="textSecondary" component="div">
                Nota
              </Typography>
            </Box>
            {isReply && parentEvent && (
              <Typography variant="caption" color="textSecondary" component="div" sx={{ display: 'block', mb: 1 }}>
                En respuesta a {parentDisplayName}
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
        break;
      }
      case 7: {
        content = (
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
        break;
      }
      case 11000: {
        try {
          const transaction = JSON.parse(event.content);
          const recipientTag = event.tags.find(tag => tag[0] === 'p');
          const recipientPubkey = (recipientTag && typeof recipientTag[1] === 'string') ? recipientTag[1] : undefined;
          if (recipientPubkey && typeof recipientPubkey !== 'string') {
            console.error('[EventContent] recipientPubkey inválido:', recipientPubkey);
            return null;
          }
          const isSent = event.pubkey === publicKey;
          const senderDisplayName = getUserDisplayName(event.pubkey);
          const recipientDisplayName = getUserDisplayName(recipientPubkey);
          content = (
            <Box sx={{ borderLeft: '4px solid #4caf50', pl: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountBalanceWalletIcon color="success" />
                <Typography variant="subtitle2" color="textSecondary" component="div">
                  Transacción Ünits
                </Typography>
              </Box>
              <Typography variant="body1" component="div">
                {isSent
                  ? `${senderDisplayName} envió ${transaction.amount.toFixed(2)} Ünits a ${recipientDisplayName}`
                  : `${senderDisplayName} recibió ${transaction.amount.toFixed(2)} Ünits de ${senderDisplayName}`}
                {transaction.memo && ` (Memo: ${transaction.memo})`}
              </Typography>
            </Box>
          );
        } catch (e) {
          console.error('Error parsing Ünits transaction content:', e);
          content = <Typography variant="body2" color="error">Error al mostrar transacción de Ünits.</Typography>;
        }
        break;
      }
      case 11001: {
        try {
          const transaction: MeritTransaction = JSON.parse(event.content);
          const affectedTag = event.tags.find(tag => tag[0] === 'p');
          const affectedPubkey = (affectedTag && typeof affectedTag[1] === 'string') ? affectedTag[1] : undefined;
          if (affectedPubkey && typeof affectedPubkey !== 'string') {
            console.error('[EventContent] affectedPubkey inválido:', affectedPubkey);
            return null;
          }
          let actionText = '';
          switch(transaction.action) {
            case 'gain': actionText = 'ganó'; break;
            case 'spend': actionText = 'gastó'; break;
            case 'award': actionText = 'otorgó'; break;
            default: actionText = transaction.action;
          }
          const senderDisplayName = getUserDisplayName(event.pubkey);
          const affectedDisplayName = getUserDisplayName(affectedPubkey);
          content = (
            <Box sx={{ borderLeft: '4px solid #ff9800', pl: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EmojiEventsIcon color="warning" />
                <Typography variant="subtitle2" color="textSecondary" component="div">
                  Transacción Méritos
                </Typography>
              </Box>
              <Typography variant="body1" component="div">
                {senderDisplayName} {actionText} {transaction.amount?.toFixed(2) || 'N/A'} Méritos de tipo "{transaction.type || 'N/A'}" {transaction.action === 'award' ? `a ${affectedDisplayName}` : ''}
              </Typography>
            </Box>
          );
        } catch (e) {
          console.error('Error parsing Merits transaction content:', e);
          content = <Typography variant="body2" color="error">Error al mostrar transacción de Méritos.</Typography>;
        }
        break;
      }
      case 31002: {
        content = (
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
                console.error('Error parsing Mundo content:', e);
                return <Typography variant="body2" color="error">Error al mostrar contenido de Mundo.</Typography>;
              }
            })()}
          </Box>
        );
        break;
      }
      case 31003: {
        content = (
          <Box sx={{ borderLeft: '4px solid #00bcd4', pl: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PlaylistPlayIcon color="info" />
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
                    <Typography variant="body2" color="text.secondary" component="div">
                      {playlistContent.description || 'Sin descripción'}
                    </Typography>
                  </>
                );
              } catch (e) {
                console.error('Error parsing Playlist content:', e);
                return <Typography variant="body2" color="error">Error al mostrar contenido de Playlist.</Typography>;
              }
            })()}
          </Box>
        );
        break;
      }
      case 31004: {
        content = (
          <Box sx={{ borderLeft: '4px solid #ffb74d', pl: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SchoolIcon color="warning" />
              <Typography variant="subtitle2" color="textSecondary" component="div">
                Experiencia
              </Typography>
            </Box>
            {(() => {
              try {
                const experienciaContent = parseExperienciaContent(event);
                if (!experienciaContent) return null;
                return (
                  <>
                    <Typography variant="body1" fontWeight="bold" component="div">
                      {experienciaContent.title || 'Sin título'}
                    </Typography>
                    {experienciaContent.description && (
                      <Typography variant="body2" color="text.secondary" component="div">
                        {experienciaContent.description}
                      </Typography>
                    )}
                  </>
                );
              } catch (e) {
                console.error('Error parsing Experiencia content:', e);
                return <Typography variant="body2" color="error">Error al mostrar contenido de Experiencia.</Typography>;
              }
            })()}
          </Box>
        );
        break;
      }
      default: {
        content = (
          <Box sx={{ borderLeft: '4px solid #bdbdbd', pl: 1 }}>
            <Typography variant="subtitle2" color="textSecondary" component="div">
              Evento Desconocido (Kind: {event.kind})
            </Typography>
            <Typography variant="caption" color="textSecondary" component="div">
              ID: {event.id.slice(0, 8)}...
            </Typography>
            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
              Contenido: {event.content ? event.content.slice(0, 100) + '...' : 'Vacío'}
            </Typography>
          </Box>
        );
        break;
      }
    }

    return content;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Mis Eventos
      </Typography>
      <List>
        {(() => {
          console.log('[DIAGNÓSTICO - EventList] Array mapeado:', typeof receivedEvents, receivedEvents.length, receivedEvents);
          return receivedEvents.map((event) => (
            <ListItem
              key={event.id}
              alignItems="flex-start"
              sx={{
                borderBottom: '1px solid #eee',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <ListItemText
                primary={
                  <EventHeader
                    event={event}
                    getUserDisplayName={getUserDisplayName}
                    profiles={profiles}
                    formatDate={formatDate}
                    getUserPicture={getUserPicture}
                  />
                }
                primaryTypographyProps={{ component: 'div' }}
                secondary={
                  <EventContent
                    event={event}
                    publicKey={publicKey}
                    receivedEvents={receivedEvents}
                    getUserDisplayName={getUserDisplayName}
                    parseMundoContent={parseMundoContent}
                    parsePlaylistContent={parsePlaylistContent}
                    parseExperienciaContent={parseExperienciaContent}
                    getParentEventInfo={getParentEventInfo}
                  />
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItem>
          ));
        })()}
        {receivedEvents
          .filter(event => event.kind === 0)
          .map(event => {
            const profile = profiles.get(event.pubkey) || null;
            const displayName = getUserDisplayName(event.pubkey);
            const picture = getUserPicture(event.pubkey);
            const merits = typeof profile?.merits === 'number' ? profile.merits : undefined;
            return (
              <ListItem key={event.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={picture} alt={displayName} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{displayName}</Typography>
                      {typeof merits === 'number' && (
                        <Typography variant="caption" color="warning.main">{merits.toFixed(2)} Mëritos</Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2">
                      {profile?.about || 'Sin descripción'}
                    </Typography>
                  }
                />
                <CardActions>
                  <IconButton component="a" href={`https://nostr.sx/user/${event.pubkey}`} target="_blank">
                    <VisibilityIcon />
                  </IconButton>
                </CardActions>
              </ListItem>
            );
          })}
      </List>
    </Paper>
  );
};

export default NostrEventList; 