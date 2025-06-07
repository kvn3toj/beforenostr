'use client';

import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border border-border">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h2 className="text-xl font-bold">{user.name || 'Usuario'}</h2>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="flex flex-col gap-2 w-full mt-4">
        <Button
          onClick={() => router.push('/dashboard')}
          variant="outline"
        >
          Ver mi Dashboard
        </Button>

        <Button
          onClick={() => router.push('/results')}
          variant="outline"
        >
          Mis Resultados
        </Button>

        <Button
          onClick={handleSignOut}
          variant="destructive"
          className="mt-4"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
