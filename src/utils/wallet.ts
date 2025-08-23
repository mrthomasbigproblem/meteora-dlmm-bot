import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Load a keypair from ENV (testing). In production, read from a file or key management system.
export function loadKeypairFromEnv(secret: string): Keypair {
  if (!secret) {
    throw new Error('WALLET_SECRET_KEY is empty. Provide a base58 or JSON array secret key.');
  }
  try {
    if (secret.trim().startsWith('[')) {
      const arr = JSON.parse(secret) as number[];
      return Keypair.fromSecretKey(Uint8Array.from(arr));
    } else {
      const bytes = bs58.decode(secret.trim());
      return Keypair.fromSecretKey(Uint8Array.from(bytes));
    }
  } catch (e) {
    throw new Error('Failed to parse WALLET_SECRET_KEY: ' + (e as Error).message);
  }
}
