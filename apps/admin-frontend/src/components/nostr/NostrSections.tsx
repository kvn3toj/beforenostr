import React from 'react';
import { Box, Typography, Paper, Avatar, Card, CardHeader, CardContent, CardActions, Button, Alert, Grid, IconButton } from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  EmojiEvents as EmojiEventsIcon,
} from '../common/Icons';
import { Event } from 'nostr-tools/core';
import { useNostrContext } from '../../contexts/NostrContext';
import type { MundoContent, PlaylistContent, ExperienciaContent, NostrProfile } from '../../types/nostr';

interface NostrSectionsProps {
  publicKey: string | null;
  profiles: Map<string, NostrProfile>;
  mundos: Map<string, Event>;
  parseMundoContent: (event: Event) => MundoContent | null;
  getMundoDTag: (event: Event) => string | null;
  getProfilePicture: (profile: NostrProfile | null) => string | undefined;
  getLud16: (profile: NostrProfile | null) => string | undefined;
  formatDate: (timestamp: number) => string;
  playlists: Map<string, Event>;
  parsePlaylistContent: (event: Event) => PlaylistContent | null;
  experiencias: Map<string, Event>;
  parseExperienciaContent: (event: Event) => ExperienciaContent | null;
}

const NostrSections: React.FC<NostrSectionsProps> = ({
  publicKey,
  profiles,
  mundos,
  parseMundoContent,
  getMundoDTag,
  getProfilePicture,
  getLud16,
  formatDate,
  playlists,
  parsePlaylistContent,
  experiencias,
  parseExperienciaContent,
}) => {
  const { getUserDisplayName } = useNostrContext();

  // --- Perfiles ---
  const renderProfileCard = () => {
    if (!publicKey || !profiles.has(publicKey)) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Genera claves para crear y ver tu perfil.
        </Alert>
      );
    }
    const profileData = profiles.get(publicKey) || null;
    const displayName = getUserDisplayName(publicKey);
    const picture = getProfilePicture(profileData);
    const lud16Address = getLud16(profileData);
    const merits = typeof profileData?.merits === 'number' ? profileData.merits : undefined;
    const isModerator = typeof merits === 'number' && merits >= 100;
    function isLud16Obj(val: unknown): val is { address: string } {
      return typeof val === 'object' && val !== null && 'address' in (val as Record<string, unknown>) && typeof (val as Record<string, any>).address === 'string';
    }
    let lud16String = '';
    if (lud16Address) {
      if (typeof lud16Address === 'string') lud16String = lud16Address;
      else if (isLud16Obj(lud16Address)) lud16String = lud16Address.address;
    }
    return (
      <Card elevation={4} sx={{ mb: 2 }}>
        <CardHeader
          avatar={picture ? (
            <Avatar src={picture} alt={displayName} sx={{ width: 64, height: 64, border: '2px solid #fff' }} />
          ) : undefined}
          title={<Typography variant="h6">{displayName}</Typography>}
          subheader={profileData?.created_at ? formatDate(profileData.created_at) : ''}
        />
        <CardContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {profileData?.about || 'Sin descripción'}
          </Typography>
          {profileData?.display_name && (
            <Typography variant="subtitle1">@{profileData.display_name}</Typography>
          )}
          {profileData?.website && (
            <Typography gutterBottom>
              <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a>
            </Typography>
          )}
          {profileData?.nip05 && (
            <Typography variant="caption" sx={{ mt: 1 }}>
              Email verificado: {profileData.nip05}
            </Typography>
          )}
          {lud16String && (
            <Typography variant="caption" color="primary">
              Pago: {lud16String}
            </Typography>
          )}
          {typeof merits === 'number' && (
            <Typography variant="h6" color="warning.main" sx={{ mt: 1 }}>
              Méritos: {merits.toFixed(2)} Mëritos
            </Typography>
          )}
          {isModerator && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
              <EmojiEventsIcon color="warning" />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                Moderador Certificado
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" startIcon={<EditIcon />} onClick={() => {/* handleEditProfile */}}>
            Editar Perfil
          </Button>
        </CardActions>
      </Card>
    );
  };

  // --- Mundos ---
  const renderMundos = () => (
    <Grid container spacing={2}>
      {Array.from(mundos.values())
        .filter(item => {
          if (typeof item.pubkey !== 'string') {
            console.warn('[NostrSections] pubkey inválido en item:', item);
            return false;
          }
          return publicKey && item.pubkey === publicKey;
        })
        .sort((a, b) => b.created_at - a.created_at)
        .map((mundo) => {
          const mundoContent = parseMundoContent(mundo);
          if (!mundoContent) return null;
          const dTag = getMundoDTag(mundo);
          if (!dTag) return null;
          const mundoProfile = profiles.get(mundo.pubkey) || null;
          const mundoDisplayName = typeof mundo.pubkey === 'string' ? getUserDisplayName(mundo.pubkey) : '';
          return (
            <Grid item xs={12} sm={6} md={4} key={`${mundo.pubkey}:${dTag}`}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  avatar={getProfilePicture(mundoProfile) ? (
                    <Avatar src={getProfilePicture(mundoProfile)} alt={mundoDisplayName} />
                  ) : undefined}
                  title={mundoContent.title || 'Sin título'}
                  subheader={formatDate(mundo.created_at)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    ID: {dTag}
                  </Typography>
                  <Typography variant="body2">
                    {mundoContent.description || 'Sin descripción'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<VisibilityIcon />} disabled>
                    Ver Detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      {mundos.size === 0 && (
        <Grid item xs={12}><Typography>No hay Mundos disponibles.</Typography></Grid>
      )}
    </Grid>
  );

  // --- Playlists ---
  const renderPlaylists = () => (
    <Grid container spacing={2}>
      {Array.from(playlists.values())
        .filter(item => {
          if (typeof item.pubkey !== 'string') {
            console.warn('[NostrSections] pubkey inválido en item:', item);
            return false;
          }
          return publicKey && item.pubkey === publicKey;
        })
        .sort((a, b) => b.created_at - a.created_at)
        .map((playlist) => {
          const playlistContent = parsePlaylistContent(playlist);
          if (!playlistContent) return null;
          const dTag = playlist.tags.find(tag => tag[0] === 'd')?.[1];
          if (!dTag) return null;
          const playlistProfile = profiles.get(playlist.pubkey) || null;
          const playlistDisplayName = typeof playlist.pubkey === 'string' ? getUserDisplayName(playlist.pubkey) : '';
          return (
            <Grid item xs={12} sm={6} md={4} key={`${playlist.pubkey}:${dTag}`}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  avatar={getProfilePicture(playlistProfile) ? (
                    <Avatar src={getProfilePicture(playlistProfile)} alt={playlistDisplayName} />
                  ) : undefined}
                  title={playlistContent.title || 'Sin título'}
                  subheader={formatDate(playlist.created_at)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    ID: {dTag}
                  </Typography>
                  <Typography variant="body2">
                    {playlistContent.description || 'Sin descripción'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<VisibilityIcon />} disabled>
                    Ver Detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      {playlists.size === 0 && (
        <Grid item xs={12}><Typography>No hay Playlists disponibles.</Typography></Grid>
      )}
    </Grid>
  );

  // --- Experiencias ---
  const renderExperiencias = () => (
    <Grid container spacing={2}>
      {Array.from(experiencias.values())
        .filter(item => {
          if (typeof item.pubkey !== 'string') {
            console.warn('[NostrSections] pubkey inválido en item:', item);
            return false;
          }
          return publicKey && item.pubkey === publicKey;
        })
        .sort((a, b) => b.created_at - a.created_at)
        .map((experiencia) => {
          const experienciaContent = parseExperienciaContent(experiencia);
          if (!experienciaContent) return null;
          const dTag = experiencia.tags.find(tag => tag[0] === 'd')?.[1];
          if (!dTag) return null;
          const experienciaProfile = profiles.get(experiencia.pubkey) || null;
          const experienciaDisplayName = typeof experiencia.pubkey === 'string' ? getUserDisplayName(experiencia.pubkey) : '';
          return (
            <Grid item xs={12} sm={6} md={4} key={`${experiencia.pubkey}:${dTag}`}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  avatar={getProfilePicture(experienciaProfile) ? (
                    <Avatar src={getProfilePicture(experienciaProfile)} alt={experienciaDisplayName} />
                  ) : undefined}
                  title={experienciaContent.title || 'Sin título'}
                  subheader={formatDate(experiencia.created_at)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    ID: {dTag}
                  </Typography>
                  <Typography variant="body2">
                    {experienciaContent.description || 'Sin descripción'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<VisibilityIcon />} disabled>
                    Ver Detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      {experiencias.size === 0 && (
        <Grid item xs={12}><Typography>No hay Experiencias disponibles.</Typography></Grid>
      )}
    </Grid>
  );

  return (
    <>
      {/* Sección de Perfiles Recibidos */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Mi Perfil
        </Typography>
        {renderProfileCard()}
      </Paper>
      {/* Sección de Mundos Definidos */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Mis Mundos Definidos
        </Typography>
        {renderMundos()}
      </Paper>
      {/* Sección de Playlists Definidas */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Mis Playlists Definidas
        </Typography>
        {renderPlaylists()}
      </Paper>
      {/* Sección de Experiencias Definidas */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Mis Experiencias Definidas
        </Typography>
        {renderExperiencias()}
      </Paper>
    </>
  );
};

export default NostrSections; 