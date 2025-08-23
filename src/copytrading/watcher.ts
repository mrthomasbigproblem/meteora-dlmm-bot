import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';

// Known program IDs we care about
export const PROGRAMS = {
  JUP_V6: new PublicKey('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'),
  DLMM:   new PublicKey('LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo'),
};

export type DetectedSwap = {
  signature: string;
  ts: number;
  leader: string;
  program: 'JUPITER' | 'METEORA' | 'OTHER';
  inMint?: string;
  outMint?: string;
  inAmount?: bigint;
  outAmount?: bigint;
};

/**
 * Poll leader addresses for recent transactions and heuristically detect swaps
 * routed via Jupiter or directly via Meteora DLMM.
 */
export async function pollLeadersOnce(conn: Connection, leaders: string[], limit = 20): Promise<DetectedSwap[]> {
  const out: DetectedSwap[] = [];
  for (const l of leaders) {
    const addr = new PublicKey(l);
    const sigs = await conn.getSignaturesForAddress(addr, { limit });
    const toFetch = sigs.map(s => s.signature);
    if (!toFetch.length) continue;
    const txs = await conn.getParsedTransactions(toFetch, { maxSupportedTransactionVersion: 0 });
    txs.forEach((tx, i) => {
      if (!tx) return;
      const det = parseSwapHeuristic(l, tx);
      if (det) out.push(det);
    });
  }
  // Simple de-dup & sort
  const uniq = new Map(out.map(s => [s.signature, s]));
  return Array.from(uniq.values()).sort((a,b) => b.ts - a.ts);
}

function parseSwapHeuristic(leader: string, tx: ParsedTransactionWithMeta): DetectedSwap | null {
  const sig = tx.transaction.signatures[0];
  const ts = (tx.blockTime ?? 0) * 1000;
  const log = tx.meta?.logMessages?.join('\n') ?? '';

  let program: 'JUPITER' | 'METEORA' | 'OTHER' = 'OTHER';
  if (log.includes(PROGRAMS.JUP_V6.toBase58())) program = 'JUPITER';
  if (log.includes(PROGRAMS.DLMM.toBase58())) program = 'METEORA';

  if (program === 'OTHER') return null;

  // Try to infer in/out from token balances (rough heuristic)
  const pre = tx.meta?.preTokenBalances ?? [];
  const post = tx.meta?.postTokenBalances ?? [];
  let inMint: string | undefined;
  let outMint: string | undefined;
  let inAmount: bigint | undefined;
  let outAmount: bigint | undefined;

  if (pre.length && post.length) {
    // Find largest decrease as input mint, largest increase as output mint
    const map: Record<string, bigint> = {};
    for (const b of pre) {
      if (!b.mint || b.uiTokenAmount.decimals === undefined) continue;
      const key = b.mint;
      map[key] = (map[key] ?? 0n) - BigInt(b.uiTokenAmount.amount);
    }
    for (const b of post) {
      if (!b.mint || b.uiTokenAmount.decimals === undefined) continue;
      const key = b.mint;
      map[key] = (map[key] ?? 0n) + BigInt(b.uiTokenAmount.amount);
    }
    const entries = Object.entries(map);
    const sortedByAbs = entries.sort((a,b) => Number((b[1] < 0n ? -b[1]: b[1]) - (a[1] < 0n ? -a[1]: a[1])));
    const dec = sortedByAbs.find(e => e[1] < 0n);
    const inc = sortedByAbs.find(e => e[1] > 0n);
    if (dec) { inMint = dec[0]; inAmount = -dec[1]; }
    if (inc) { outMint = inc[0]; outAmount = inc[1]; }
  }

  return {
    signature: sig,
    ts,
    leader,
    program,
    inMint,
    outMint,
    inAmount,
    outAmount,
  };
}
