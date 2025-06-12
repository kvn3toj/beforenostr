// Video utilities for robust video loading with fallbacks

export interface VideoSource {
  url: string;
  type: 'local' | 'demo' | 'external';
  quality?: 'HD' | 'SD';
}

// Multiple sources for each video with fallbacks
const videoSources: Record<string, VideoSource[]> = {
  'coomunity-intro': [
    { url: '/assets/vid1.mp4', type: 'local' },
    { url: './assets/vid1.mp4', type: 'local' },
    { url: 'assets/vid1.mp4', type: 'local' },
    // Demo video for testing (Big Buck Bunny - open source)
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'external',
    },
  ],
  'ayni-deep-dive': [
    { url: '/assets/vid2.mp4', type: 'local' },
    { url: './assets/vid2.mp4', type: 'local' },
    { url: 'assets/vid2.mp4', type: 'local' },
    // Demo video for testing (Elephant's Dream - open source)
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      type: 'external',
    },
  ],
  'ondas-energia': [
    { url: '/assets/vid3.mp4', type: 'local' },
    { url: './assets/vid3.mp4', type: 'local' },
    { url: 'assets/vid3.mp4', type: 'local' },
    // Demo video for testing (Sintel - open source)
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      type: 'external',
    },
  ],
};

// Default fallback video for any missing videos
const defaultVideoSources: VideoSource[] = [
  // Local fallbacks
  { url: '/assets/vid1.mp4', type: 'local' },
  { url: './assets/vid1.mp4', type: 'local' },
  { url: 'assets/vid1.mp4', type: 'local' },
  // External fallback (Big Buck Bunny - open source, no copyright issues)
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'external',
  },
];

/**
 * Get all possible video sources for a given video ID
 * Returns an array of URLs to try in order of preference
 */
export const getVideoSources = (videoId: string): VideoSource[] => {
  return videoSources[videoId] || defaultVideoSources;
};

/**
 * Get the primary video URL for a video ID (first in the list)
 */
export const getPrimaryVideoUrl = (videoId: string): string => {
  const sources = getVideoSources(videoId);
  return sources[0]?.url || defaultVideoSources[0].url;
};

/**
 * Validate if a video URL is accessible
 * Returns a promise that resolves to true if the video can be loaded
 */
export const validateVideoUrl = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');

    const cleanup = () => {
      video.removeEventListener('loadstart', onLoad);
      video.removeEventListener('error', onError);
      video.removeEventListener('loadedmetadata', onLoad);
      video.src = '';
    };

    const onLoad = () => {
      cleanup();
      resolve(true);
    };

    const onError = () => {
      cleanup();
      resolve(false);
    };

    video.addEventListener('loadstart', onLoad);
    video.addEventListener('loadedmetadata', onLoad);
    video.addEventListener('error', onError);

    // Set a timeout to avoid hanging
    setTimeout(() => {
      cleanup();
      resolve(false);
    }, 5000);

    video.src = url;
    video.load();
  });
};

/**
 * Find the first working video URL from the list of sources
 * Returns the first URL that successfully loads
 */
export const findWorkingVideoUrl = async (
  videoId: string
): Promise<string | null> => {
  const sources = getVideoSources(videoId);

  console.log(
    `🎬 Testing ${sources.length} video sources for ${videoId}:`,
    sources.map((s) => s.url)
  );

  for (const source of sources) {
    console.log(`🎬 Testing video source: ${source.url} (${source.type})`);

    try {
      const isWorking = await validateVideoUrl(source.url);
      if (isWorking) {
        console.log(`✅ Video source working: ${source.url}`);
        return source.url;
      } else {
        console.log(`❌ Video source failed: ${source.url}`);
      }
    } catch (error) {
      console.log(`❌ Video source error: ${source.url}`, error);
    }
  }

  console.error(`🚫 No working video sources found for ${videoId}`);
  return null;
};

/**
 * Check if the video files exist in the public directory
 */
export const checkVideoAvailability = async () => {
  const testUrls = ['/assets/vid1.mp4', '/assets/vid2.mp4', '/assets/vid3.mp4'];

  console.log('🔍 Checking video availability...');

  for (const url of testUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(
        `📹 ${url}: ${response.ok ? '✅ Available' : '❌ Not found'} (${response.status})`
      );
    } catch (error) {
      console.log(`📹 ${url}: ❌ Error checking availability`, error);
    }
  }
};

// Utility to get video duration from URL
export const getVideoDuration = (
  videoElement: HTMLVideoElement
): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (videoElement.duration && !isNaN(videoElement.duration)) {
      resolve(videoElement.duration);
      return;
    }

    const onLoadedMetadata = () => {
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      resolve(videoElement.duration || 0);
    };

    const onError = () => {
      videoElement.removeEventListener('error', onError);
      reject(new Error('Failed to load video metadata'));
    };

    videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
    videoElement.addEventListener('error', onError);

    // If metadata is already loaded
    if (videoElement.readyState >= 1) {
      onLoadedMetadata();
    }
  });
};

export default {
  getVideoSources,
  getPrimaryVideoUrl,
  validateVideoUrl,
  findWorkingVideoUrl,
  checkVideoAvailability,
  getVideoDuration,
};
