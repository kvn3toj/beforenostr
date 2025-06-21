import { Buffer } from 'buffer';

// Helper function to dynamically import nostr-tools
async function getNostrTools() {
  return await import('nostr-tools');
}

/**
 * Obtiene la clave privada desde localStorage o la genera si no existe.
 * @returns {Promise<string>} Clave privada en formato hex (string)
 */
export async function getPrivateKey(): Promise<string> {
  let privKey = localStorage.getItem('nostr-privkey');
  if (!privKey) {
    const nostr = await getNostrTools();
    privKey = Buffer.from(nostr.generateSecretKey()).toString('hex');
    localStorage.setItem('nostr-privkey', privKey);
  }
  return privKey;
}

/**
 * Obtiene la clave pública a partir de la clave privada.
 * @param {string} [privKeyHex] - Clave privada en formato hex (string)
 * @returns {Promise<string>} Clave pública en formato hex (string)
 */
export async function getPublicKey(privKeyHex?: string): Promise<string> {
  const nostr = await getNostrTools();
  const privKey = privKeyHex || await getPrivateKey();
  const privKeyBytes = Uint8Array.from(Buffer.from(privKey, 'hex'));
  return nostr.getPublicKey(privKeyBytes);
}
