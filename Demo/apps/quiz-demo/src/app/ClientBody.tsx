'use client';

import { SessionProvider } from 'next-auth/react';
import NavBar from '@/components/NavBar';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useEffect } from "react";

export default function ClientBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Remove any extension-added classes during hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <SessionProvider>
      <LanguageProvider>
        <NavBar />
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}
