import React, { createContext, useContext } from 'react';
import type { Event } from 'nostr-tools/core';
import type { NostrProfile, MundoContent, PlaylistContent, ExperienciaContent } from '../types/nostr';
import type { CoomunityNostrClient } from '../lib/CoomunityNostrClient';

export type NostrContextType = {
  client: CoomunityNostrClient | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectToNostr: () => Promise<void>;
  publicKey: string | null;
  receivedEvents: Event[];
  mundos: Event[];
  playlists: Event[];
  experiencias: Event[];
  profiles: Map<string, NostrProfile>;
  getUserDisplayName: (pubkey: string | null | undefined) => string;
  getUserPicture: (pubkey: string | null | undefined) => string | undefined;
  getMundoIdentifier: (event: Event) => string | null;
  getPlaylistIdentifier: (event: Event) => string | null;
  getExperienciaIdentifier: (event: Event) => string | null;
  loadEvents: (publicKey: string) => void;
  getProfileName: (profile: NostrProfile | null, pubkey: string | undefined | null) => string;
  getLud16: (profile: NostrProfile | null) => string | undefined;
  parseProfileContent: (content: string) => NostrProfile | null;
  parseMundoContent: (event: Event) => MundoContent | null;
  parsePlaylistContent: (event: Event) => PlaylistContent | null;
  parseExperienciaContent: (event: Event) => ExperienciaContent | null;
  getEventTag: (event: Event, tagName: string) => string | undefined;
  parseContent: (content: string) => any;
};

export const NostrContext = createContext<NostrContextType | undefined>(undefined);

export const useNostrContext = () => {
  const ctx = useContext(NostrContext);
  if (!ctx) throw new Error('useNostrContext debe usarse dentro de un NostrProvider');
  return ctx;
}; 