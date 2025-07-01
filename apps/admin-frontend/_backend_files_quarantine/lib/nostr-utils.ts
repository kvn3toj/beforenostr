import { Buffer } from 'buffer';
import { getPublicKey as nostrGetPublicKey, generateSecretKey } from 'nostr-tools';

/**
 * Obtiene la clave privada desde localStorage o la genera si no existe.
 * @returns Clave privada en formato hex (string)
 */
export function getPrivateKey(): string {
  let privKey = localStorage.getItem('nostr-privkey');
  if (!privKey) {
    privKey = Buffer.from(generateSecretKey()).toString('hex');
    localStorage.setItem('nostr-privkey', privKey);
  }
  return privKey;
}

/**
 * Obtiene la clave pública a partir de la clave privada.
 * @param privKeyHex Clave privada en formato hex (string)
 * @returns Clave pública en formato hex (string)
 */
export function getPublicKey(privKeyHex?: string): string {
  const privKey = privKeyHex || getPrivateKey();
  const privKeyBytes = Uint8Array.from(Buffer.from(privKey, 'hex'));
  return nostrGetPublicKey(privKeyBytes);
} 