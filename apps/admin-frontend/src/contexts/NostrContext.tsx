import React, { createContext, useContext } from 'react';

// Simplified NostrContext for admin frontend
// This provides just the basic structure needed to prevent import errors
// The full Nostr functionality is primarily used in the SuperApp

export type NostrContextType = {
  isConnected: boolean;
  isConnecting: boolean;
  publicKey: string | null;
  getUserDisplayName: (pubkey: string | null | undefined) => string;
  getUserPicture: (pubkey: string | null | undefined) => string | undefined;
};

export const NostrContext = createContext<NostrContextType | undefined>(undefined);

export const useNostrContext = () => {
  const ctx = useContext(NostrContext);
  if (!ctx) {
    // Provide default values for admin interface
    return {
      isConnected: false,
      isConnecting: false,
      publicKey: null,
      getUserDisplayName: (pubkey: string | null | undefined) => pubkey || 'Usuario',
      getUserPicture: (pubkey: string | null | undefined) => undefined,
    };
  }
  return ctx;
};