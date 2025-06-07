'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ProfileCard from '@/components/profile/ProfileCard';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Mi Perfil</h1>

        <div className="max-w-md mx-auto">
          <ProfileCard user={session.user as any} />
        </div>
      </div>
    </div>
  );
}
