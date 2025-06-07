'use client';

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg border border-border bg-background/50 backdrop-blur-md">
        <LoginForm />
      </div>
    </div>
  );
}
