import React from 'react';

// Simplified NostrProvider for admin frontend
// This is a placeholder implementation to prevent import errors
// The full Nostr functionality may not be needed in the admin interface

interface NostrContextType {
  isConnected: boolean;
  isConnecting: boolean;
  publicKey: string | null;
}

const NostrContext = React.createContext<NostrContextType>({
  isConnected: false,
  isConnecting: false,
  publicKey: null,
});

export const NostrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: NostrContextType = {
    isConnected: false,
    isConnecting: false,
    publicKey: null,
  };

  return (
    <NostrContext.Provider value={value}>
      {children}
    </NostrContext.Provider>
  );
};

export const useNostr = () => React.useContext(NostrContext);