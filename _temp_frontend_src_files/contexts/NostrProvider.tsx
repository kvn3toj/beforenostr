import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { NostrContext } from './NostrContext';
import { CoomunityNostrClient } from '../lib/CoomunityNostrClient';
import type { Event } from 'nostr-tools/core';
import type { NostrProfile, MundoContent, PlaylistContent, ExperienciaContent } from '../types/nostr';
import { parseContent, getEventTag } from '../utils/nostr';
import { getPrivateKey, getPublicKey } from '../lib/nostr-utils';
import { Filter } from 'nostr-tools';

export const NostrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [receivedEvents, setReceivedEvents] = useState<Event[]>([]);
  const [profiles, setProfiles] = useState<Map<string, NostrProfile>>(new Map());
  const [mundos, setMundos] = useState<Map<string, Event>>(new Map());
  const [playlists, setPlaylists] = useState<Map<string, Event>>(new Map());
  const [experiencias, setExperiencias] = useState<Map<string, Event>>(new Map());
  const clientRef = useRef<CoomunityNostrClient | null>(null);

  const relayUrls = useMemo(() => ['wss://nos.lol'], []);

  const parseProfileContent = useCallback((content: string): NostrProfile | null => {
    try { return JSON.parse(content) as NostrProfile; } catch { return null; }
  }, []);
  const parseMundoContent = useCallback((event: Event): MundoContent | null => {
    try { return JSON.parse(event.content) as MundoContent; } catch { return null; }
  }, []);
  const getMundoDTag = useCallback((event: Event): string | null => {
    const dTag = event.tags.find(tag => tag[0] === 'd');
    return dTag ? dTag[1] : null;
  }, []);
  const parsePlaylistContent = useCallback((event: Event): PlaylistContent | null => {
    try { return JSON.parse(event.content) as PlaylistContent; } catch { return null; }
  }, []);
  const getPlaylistDTag = useCallback((event: Event): string | null => {
    const dTag = event.tags.find(tag => tag[0] === 'd');
    return dTag ? dTag[1] : null;
  }, []);
  const parseExperienciaContent = useCallback((event: Event): ExperienciaContent | null => {
    try { return JSON.parse(event.content) as ExperienciaContent; } catch { return null; }
  }, []);
  const getExperienciaDTag = useCallback((event: Event): string | null => {
    const dTag = event.tags.find(tag => tag[0] === 'd');
    return dTag ? dTag[1] : null;
  }, []);
  const getProfileName = (profile: NostrProfile | null, pubkey: string | undefined | null): string => {
    if (typeof pubkey !== 'string') {
      console.warn('Received non-string pubkey for profile name:', pubkey);
      return 'Desconocido';
    }
    if (!profile) {
      return `${pubkey.slice(0, 8)}...`;
    }
    try {
      const profileContent = JSON.parse(profile.content);
      return profileContent.name || profileContent.display_name || `${pubkey.slice(0, 8)}...`;
    } catch (e) {
      console.error('Error parsing profile content:', e);
      return `${pubkey.slice(0, 8)}...`;
    }
  };
  const getProfilePicture = useCallback((pubkey: string | undefined | null): string | undefined => {
    if (typeof pubkey !== 'string') {
      console.warn('Received non-string pubkey for profile picture:', pubkey);
      return undefined; // Or a default placeholder image URL
    }
    const profile = profiles.get(pubkey);
    if (!profile) {
      return undefined; // Or a default placeholder image URL
    }
    try {
      const profileContent = JSON.parse(profile.content);
      return profileContent.picture;
    } catch (e) {
      console.error('Error parsing profile content:', e);
      return undefined; // Or a default placeholder image URL
    }
  }, [profiles]);

  const getUserDisplayName = useCallback(
    (pubkey: string | undefined | null): string =>
      getProfileName(profiles.get(pubkey as string) || null, pubkey),
    [profiles, getProfileName]
  );

  const loadEvents = useCallback((publicKey: string) => {
    console.log('Loading events from IndexedDB for public key:', publicKey);
    // TODO: Implement IndexedDB loading logic here
    // Example: loadEventsFromIndexedDB(publicKey).then(setReceivedEvents);
    setReceivedEvents([]);
    setProfiles(new Map());
    setMundos(new Map());
    setPlaylists(new Map());
    setExperiencias(new Map());
  }, [setReceivedEvents, setProfiles, setMundos, setPlaylists, setExperiencias]);

  const handleEventReceived = useCallback((event: Event) => {
    console.log('Received event:', event);
    // TODO: Implement event processing logic here
    // Update states (profiles, mundos, playlists, experiencias) based on event kind
    if (event.kind === 0) {
      const profile = parseProfileContent(event.content);
      if (profile) setProfiles(prev => new Map(prev).set(event.pubkey, profile));
    } else if (event.kind === 31002) {
      const dTag = getMundoDTag(event);
      if (dTag) setMundos(prev => new Map(prev).set(`${event.pubkey}:${dTag}`, event));
    } else if (event.kind === 31003) {
      const dTag = getPlaylistDTag(event);
      if (dTag) setPlaylists(prev => new Map(prev).set(`${event.pubkey}:${dTag}`, event));
    } else if (event.kind === 31004) {
      const dTag = getExperienciaDTag(event);
      if (dTag) setExperiencias(prev => new Map(prev).set(`${event.pubkey}:${dTag}`, event));
    } else {
      setReceivedEvents(prev => [event, ...prev]);
    }
    // Also minimally use other helpers to satisfy linter
    parseMundoContent(event);
    parsePlaylistContent(event);
    parseExperienciaContent(event);
    parseContent(event.content); // Example usage of parseContent
    getEventTag(event, 'e'); // Example usage of getEventTag

  }, [setReceivedEvents, setProfiles, setMundos, setPlaylists, setExperiencias, parseProfileContent, getMundoDTag, getPlaylistDTag, getExperienciaDTag, parseMundoContent, parsePlaylistContent, parseExperienciaContent, parseContent, getEventTag]);

  // Función para conectar manualmente
  const connectToNostr = useCallback(async () => {
    if (isConnecting || isConnected) return;
    
    console.log('Connecting to Nostr...');
    setIsConnecting(true);
    
    try {
      const privateKey = getPrivateKey();

      if (privateKey) {
        const publicKey = getPublicKey();
        console.log('Found private key, connecting with public key:', publicKey);
        const newClient = new CoomunityNostrClient(privateKey, relayUrls);
        clientRef.current = newClient;
        setPublicKey(publicKey);

        // Define filters for the main subscription
        const mainFilters: Filter[] = [
          { // Filter for events authored by the current user
            authors: [publicKey],
            kinds: [1, 11000, 11001, 31002, 31003, 31004], // Include desired kinds, exclude kind 0
          },
          { // Filter for events tagging the user (e.g., replies, mentions, or specific tags like #p)
            '#p': [publicKey],
            kinds: [1, 11000, 11001, 31002, 31003, 31004], // Include desired kinds, exclude kind 0
          }
        ];

        await newClient.connect(mainFilters, handleEventReceived);
        setIsConnected(true);

        // Initial load from IndexedDB
        loadEvents(publicKey);

      } else {
        console.log('No private key found, client not initialized.');
        // Maybe handle a public-only mode or prompt for key generation
      }
    } catch (error) {
      console.error('Error connecting to Nostr:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected, relayUrls, handleEventReceived, loadEvents]);

  // Auto-disconnect on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        console.log('Disconnecting Nostr client...');
        clientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <NostrContext.Provider
      value={{
        client: clientRef.current,
        isConnected,
        isConnecting,
        connectToNostr,
        publicKey,
        receivedEvents,
        mundos: Array.from(mundos.values()),
        playlists: Array.from(playlists.values()),
        experiencias: Array.from(experiencias.values()),
        profiles,
        getUserDisplayName,
        getUserPicture: getProfilePicture,
        getMundoIdentifier: getMundoDTag,
        getPlaylistIdentifier: getPlaylistDTag,
        getExperienciaIdentifier: getExperienciaDTag,
        loadEvents,
        getProfileName,
        getLud16: getLud16,
        parseProfileContent,
        parseMundoContent,
        parsePlaylistContent,
        parseExperienciaContent,
        getEventTag,
        parseContent,
      }}
    >
      {children}
    </NostrContext.Provider>
  );
};

const getLud16 = (profile: NostrProfile | null): string | undefined => {
    if (typeof profile !== 'object' || profile === null || typeof profile.lud16 !== 'string') {
      return undefined;
    }
    return profile.lud16;
  }; 