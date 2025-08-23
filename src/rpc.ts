import { Connection, clusterApiUrl } from '@solana/web3.js';
import { CONFIG } from './config.js';

export function getConnection(): Connection {
  const url = CONFIG.rpcUrl.includes('http') ? CONFIG.rpcUrl : clusterApiUrl(CONFIG.rpcUrl as any);
  // Use confirmed/processed commitment for faster copy-trading feedback; tune to 'confirmed' for reliability
  return new Connection(url, { commitment: 'confirmed' });
}
