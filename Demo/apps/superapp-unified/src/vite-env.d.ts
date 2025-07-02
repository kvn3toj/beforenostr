/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BASE_URL: string;

  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_HOTJAR_ID: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_BETA_TRACKING: string;
  readonly VITE_PUBLIC_BUILDER_KEY: string;
  readonly VITE_FORCE_YOUTUBE_VIDEOS: string;
  readonly VITE_NETWORK_MODE: string;
  readonly VITE_LOCAL_IP: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
