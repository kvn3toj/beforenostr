'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from './logo/Logo';
import { signOut } from 'next-auth/react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Locale, locales } from '@/lib/i18n';

const languageOptions = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
];

export default function NavBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const handleLanguageChange = (code: Locale) => {
    setLanguage(code);
    // Close the mobile menu
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-32 sm:w-40">
                <Logo className="transform scale-50 origin-left" />
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className={`px-3 py-2 rounded-md ${pathname === '/' ? 'text-primary' : 'text-foreground'}`}>
              {language === 'es' ? 'Inicio' : language === 'en' ? 'Home' : 'Início'}
            </Link>
            <Link href="/dashboard" className={`px-3 py-2 rounded-md ${pathname === '/dashboard' ? 'text-primary' : 'text-foreground'}`}>
              Dashboard
            </Link>
            <Link href="/results" className={`px-3 py-2 rounded-md ${pathname === '/results' ? 'text-primary' : 'text-foreground'}`}>
              {language === 'es' ? 'Resultados' : language === 'en' ? 'Results' : 'Resultados'}
            </Link>

            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {language === 'es' ? 'Idioma / Language' :
                   language === 'en' ? 'Language / Idioma' :
                   'Idioma / Language'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as Locale)}
                    className={`${language === lang.code ? 'text-primary' : ''}`}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Authentication */}
            {status === 'authenticated' ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                      <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    {language === 'es' ? 'Mi Perfil' :
                     language === 'en' ? 'My Profile' :
                     'Meu Perfil'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/results')}>
                    {language === 'es' ? 'Mis Resultados' :
                     language === 'en' ? 'My Results' :
                     'Meus Resultados'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    {language === 'es' ? 'Cerrar Sesión' :
                     language === 'en' ? 'Logout' :
                     'Sair'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" onClick={() => router.push('/auth/login')}>
                {language === 'es' ? 'Iniciar Sesión' :
                 language === 'en' ? 'Login' :
                 'Entrar'}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-foreground hover:text-primary focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md ${pathname === '/' ? 'text-primary font-medium' : 'text-foreground'}`}
            >
              {language === 'es' ? 'Inicio' :
               language === 'en' ? 'Home' :
               'Início'}
            </Link>
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md ${pathname === '/dashboard' ? 'text-primary font-medium' : 'text-foreground'}`}
            >
              Dashboard
            </Link>
            <Link
              href="/results"
              className={`block px-3 py-2 rounded-md ${pathname === '/results' ? 'text-primary font-medium' : 'text-foreground'}`}
            >
              {language === 'es' ? 'Resultados' :
               language === 'en' ? 'Results' :
               'Resultados'}
            </Link>

            {/* Language options */}
            <div className="px-3 py-2 border-t border-border mt-2">
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'es' ? 'Idioma / Language' :
                 language === 'en' ? 'Language / Idioma' :
                 'Idioma / Language'}
              </p>
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  className={`block w-full text-left px-3 py-2 rounded-md ${language === lang.code ? 'text-primary font-medium' : 'text-foreground'}`}
                  onClick={() => handleLanguageChange(lang.code as Locale)}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {/* Authentication */}
            <div className="border-t border-border pt-2 mt-2">
              {status === 'authenticated' ? (
                <>
                  <div className="px-3 py-2 flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                      <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
                    </Avatar>
                    <span>{session?.user?.name}</span>
                  </div>
                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-foreground"
                    onClick={() => router.push('/profile')}
                  >
                    {language === 'es' ? 'Mi Perfil' :
                     language === 'en' ? 'My Profile' :
                     'Meu Perfil'}
                  </button>
                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-destructive"
                    onClick={handleSignOut}
                  >
                    {language === 'es' ? 'Cerrar Sesión' :
                     language === 'en' ? 'Logout' :
                     'Sair'}
                  </button>
                </>
              ) : (
                <Button
                  className="w-full mt-2"
                  onClick={() => router.push('/auth/login')}
                >
                  {language === 'es' ? 'Iniciar Sesión' :
                   language === 'en' ? 'Login' :
                   'Entrar'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
