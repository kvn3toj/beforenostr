/**
 * 👤 User Types - Tipos de usuario para la SuperApp CoomÜnity
 * 
 * Tipos centralizados para el usuario que reemplazan las dependencias temporales
 */

// 🎮 Datos de gamificación del usuario
export interface GameData {
  userId: string;
  ondas: number;
  happiness: number;
  level: number;
  badges: string[];
}

// 👤 Perfil completo del usuario
export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin';
  created_at: string;
  game_data?: GameData;
}

// 💰 Datos del wallet del usuario
export interface WalletData {
  balance: number;
  ucoins: number;
  accounts: Array<{
    id: string;
    type: string;
    balance: number;
  }>;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    date: string;
  }>;
}

// 🔐 Usuario autenticado (del contexto de auth)
export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin';
  created_at: string;
  access_token?: string;
  refresh_token?: string;
} 