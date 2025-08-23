import { fetchDlmmPairs, DlmmPair } from '../dex/meteora.js';
import { request } from 'undici';

export type PoolMetric = {
  pair: DlmmPair;
  // Estimated metrics (fill if available)
  liquidityUsd?: number;
  volume24hUsd?: number;
  baseFeeBps?: number;
  dynamicFeeHintBps?: number;
  estFeeApr?: number;
};

/**
 * Compute a crude fee APR proxy:
 *   feeAPR ≈ (volume24h * avgFee) / liquidity * 365
 * This is only an estimate; for production, plug a reliable market data source.
 */
export function estimateFeeApr(volume24hUsd: number, liquidityUsd: number, avgFeeBps: number): number {
  if (!liquidityUsd || !volume24hUsd) return 0;
  const fee = avgFeeBps / 10_000;
  return (volume24hUsd * fee / liquidityUsd) * 365;
}

/**
 * Fetch basic Meteora DLMM pairs and (optionally) enrich with third-party data.
 * You can wire Birdeye/Bitquery here for reliable volume/liquidity figures.
 */
export async function scanPools(): Promise<PoolMetric[]> {
  const pairs = await fetchDlmmPairs();

  // Placeholder enrichment; in real use, query Birdeye/Bitquery/Jupiter price to fill liquidity/volume.
  const metrics: PoolMetric[] = pairs.map(p => {
    const avgFeeBps = p.baseFeeBps ?? 5; // a benign default; replace with real data
    return {
      pair: p,
      baseFeeBps: p.baseFeeBps,
      dynamicFeeHintBps: 0,
      liquidityUsd: undefined,
      volume24hUsd: undefined,
      estFeeApr: undefined,
    };
  });

  // Sort with whatever we have (no-op if no data). Users should plug in a data provider.
  return metrics;
}
