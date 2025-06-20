export interface VideoPermissions {
  id: string;
  videoItemId: number;
  // Derechos de visualización del jugador
  showWaveCount: boolean;
  showVideos: boolean;
  showVideoSubtitles: boolean;
  showComments: boolean;
  showPublishDate: boolean;
  
  // Configuraciones de video
  showVideoDuration: boolean;
  showLikeButton: boolean;
  allowRewindForward: boolean;
  
  // Configuraciones de comentarios
  allowViewComments: boolean;
  allowMakeComments: boolean;
  showLikeComments: boolean;
  sortCommentsByAffinity: boolean;
  showCommenterName: boolean;
  
  // Posición en playlist
  playlistPosition: PlaylistPosition;
  
  // Estado
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  
  // Relaciones
  videoItem?: {
    id: number;
    title: string;
  };
  createdBy?: {
    id: string;
    name?: string;
    email: string;
  };
}

export type PlaylistPosition = 'position1' | 'position2' | 'position3' | 'final';

export interface VideoPermissionsUpdate {
  videoItemId: number;
  permissions: Omit<VideoPermissions, 'id' | 'videoItemId' | 'createdAt' | 'updatedAt' | 'videoItem' | 'createdBy'>;
  isDraft: boolean;
}

export interface VideoPermissionsManagerProps {
  videoItemId: number;
  onSave?: (permissions: VideoPermissions) => void;
  isLoading?: boolean;
}

export interface PlaylistOption {
  value: PlaylistPosition;
  label: string;
  description: string;
}

export const DEFAULT_VIDEO_PERMISSIONS: Omit<VideoPermissions, 'id' | 'videoItemId' | 'createdAt' | 'updatedAt' | 'videoItem' | 'createdBy'> = {
  showWaveCount: true,
  showVideos: true,
  showVideoSubtitles: true,
  showComments: true,
  showPublishDate: true,
  showVideoDuration: true,
  showLikeButton: true,
  allowRewindForward: false,
  allowViewComments: true,
  allowMakeComments: true,
  showLikeComments: true,
  sortCommentsByAffinity: false,
  showCommenterName: false,
  playlistPosition: 'position1',
  isDraft: false,
  createdById: undefined,
};

export const PLAYLIST_POSITION_OPTIONS: PlaylistOption[] = [
  {
    value: 'position1',
    label: 'Posición 1',
    description: 'Primera posición en la playlist',
  },
  {
    value: 'position2',
    label: 'Posición 2',
    description: 'Segunda posición en la playlist',
  },
  {
    value: 'position3',
    label: 'Posición 3',
    description: 'Tercera posición en la playlist',
  },
  {
    value: 'final',
    label: 'Posición Final',
    description: 'Última posición en la playlist',
  },
];

// Configuración de switches con sus metadatos
export interface PermissionSwitchConfig {
  key: keyof VideoPermissions;
  label: string;
  description?: string;
  color?: 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success';
  section: 'main' | 'videos' | 'comments';
}

export const PERMISSION_SWITCHES: PermissionSwitchConfig[] = [
  {
    key: 'showWaveCount',
    label: 'Visibilidad del número de Öndas',
    description: 'Los jugadores podrán ver la cantidad de Öndas',
    color: 'primary',
    section: 'main',
  },
  {
    key: 'showVideoSubtitles',
    label: 'Subtítulos de video',
    description: 'Los jugadores podrán activar los subtítulos del video',
    color: 'warning',
    section: 'main',
  },
  {
    key: 'showPublishDate',
    label: 'Fecha de publicación',
    description: 'Mostrar a los jugadores la fecha de lanzamiento del video',
    color: 'warning',
    section: 'main',
  },
  {
    key: 'showVideoDuration',
    label: 'Duración de lo videos',
    color: 'warning',
    section: 'videos',
  },
  {
    key: 'showLikeButton',
    label: 'Indicar me gusta',
    color: 'warning',
    section: 'videos',
  },
  {
    key: 'allowRewindForward',
    label: 'Retroceder y avanzar en el video',
    section: 'videos',
  },
  {
    key: 'allowViewComments',
    label: 'Ver comentarios',
    color: 'warning',
    section: 'comments',
  },
  {
    key: 'allowMakeComments',
    label: 'Realizar comentarios',
    color: 'warning',
    section: 'comments',
  },
  {
    key: 'showLikeComments',
    label: 'Indicar me gusta',
    color: 'warning',
    section: 'comments',
  },
  {
    key: 'sortCommentsByAffinity',
    label: 'Ordenar comentarios por afinidad',
    section: 'comments',
  },
  {
    key: 'showCommenterName',
    label: 'Ver nombre de la comentarista',
    section: 'comments',
  },
]; 