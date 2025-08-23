import { Connection, PublicKey } from '@solana/web3.js';
import DLMM from '@meteora-ag/dlmm';
import { request } from 'undici';
import { CONFIG } from '../config.js';

/**
 * Lightweight helpers around Meteora DLMM pool discovery.
 * For direct DLMM interactions (adding liquidity, custom quotes), use the SDK.
 */

export type DlmmPair = {
  address: string;           // pool address (LB pair)
  tokenXMint: string;
  tokenYMint: string;
  binStep: number;
  baseFeeBps?: number;
  // other fields if present in API
};

export async function fetchDlmmPairs(): Promise<DlmmPair[]> {
  const url = CONFIG.dlmmApiBase + '/pair/all';
  const res = await request(url);
  if (res.statusCode !== 200) {
    throw new Error('DLMM API error: ' + res.statusCode);
  }
  const data = await res.body.json();
  // Expecting array of objects; keep only essentials
  return data.map((p: any) => ({
    address: p.address ?? p.lb_pair_address ?? p.id ?? '',
    tokenXMint: p.tokenXMint ?? p.base_mint ?? p.tokenX?.mint ?? '',
    tokenYMint: p.tokenYMint ?? p.quote_mint ?? p.tokenY?.mint ?? '',
    binStep: Number(p.binStep ?? p.bin_step ?? p.bin_step_bps ?? 0),
    baseFeeBps: Number(p.baseFeeBps ?? p.base_fee_bps ?? p.baseFee ?? 0) || undefined,
  })) as DlmmPair[];
}

/**
 * Optional: instantiate a pool via SDK (useful for advanced ops)
 */
export async function createDlmmPool(connection: Connection, poolAddress: string) {
  const pub = new PublicKey(poolAddress);
  return DLMM.create(connection, pub);
}
