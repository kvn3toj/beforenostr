export enum VideoPlatform {
  YOUTUBE = 'youtube',
  VIMEO = 'vimeo',
  LOCAL = 'local',
  UPLOADED = 'uploaded',
  UNKNOWN = 'unknown'
}

export const PLATFORM_PATTERNS = {
  [VideoPlatform.YOUTUBE]: [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#"]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#"]+)/,
    /youtu\.be\/([^&\n?#"]+)/,
    /youtube\.com\/embed\/([^&\n?#"]+)/,
    /youtube\.com\/v\/([^&\n?#"]+)/,
    /src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"/,
    /src='https:\/\/www\.youtube\.com\/embed\/([^']+)'/
  ],
  [VideoPlatform.VIMEO]: [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/video\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /src="https:\/\/player\.vimeo\.com\/video\/(\d+)"/,
    /src='https:\/\/player\.vimeo\.com\/video\/(\d+)'/
  ]
};

export const PLATFORM_DOMAINS = {
  [VideoPlatform.YOUTUBE]: ['youtube.com', 'youtu.be', 'm.youtube.com'],
  [VideoPlatform.VIMEO]: ['vimeo.com', 'player.vimeo.com']
}; 