// Tipos compartidos para Nostr y CoomÜnity

export interface NostrProfile {
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

export interface MundoContent {
  title: string;
  description: string;
}

export interface PlaylistContent {
  title: string;
  description: string;
}

export interface ExperienciaContent {
  title: string;
  description: string;
}

export type MeritAction = 'gain' | 'spend' | 'award';

export interface MeritTransaction {
  amount: number;
  type: string;
  action: MeritAction;
} 