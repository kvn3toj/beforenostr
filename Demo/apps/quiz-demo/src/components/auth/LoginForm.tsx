'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Github, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/logo/Logo';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);

    try {
      await signIn(provider, {
        callbackUrl: '/dashboard',
      });
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md mx-auto p-6">
      <Logo className="mb-6" />

      <div className="w-full text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Iniciar Sesión</h2>
        <p className="text-muted-foreground">
          Inicia sesión para guardar tus respuestas y ver tus resultados
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <Button
          variant="outline"
          className="flex items-center gap-2 p-6"
          onClick={() => handleOAuthSignIn('github')}
          disabled={isLoading}
        >
          <Github className="w-5 h-5" />
          <span>Continuar con GitHub</span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 p-6"
          onClick={() => handleOAuthSignIn('google')}
          disabled={isLoading}
        >
          <Mail className="w-5 h-5" />
          <span>Continuar con Google</span>
        </Button>
      </div>

      <div className="text-center mt-4">
        <Button
          variant="link"
          onClick={() => router.push('/')}
          className="text-muted-foreground"
        >
          Continuar como invitado
        </Button>
      </div>
    </div>
  );
}
