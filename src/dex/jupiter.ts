import { Connection, Keypair, VersionedTransaction, PublicKey } from '@solana/web3.js';
import { CONFIG } from '../config.js';
import { request } from 'undici';

type QuoteParams = {
  inputMint: string;
  outputMint: string;
  amount: number; // integer in smallest units
  slippageBps: number;
  onlyDirectRoutes?: boolean;
  dexes?: string[]; // labels
};

export async function getQuote(params: QuoteParams) {
  const url = new URL(CONFIG.jup.quoteBase + '/v6/quote');
  url.searchParams.set('inputMint', params.inputMint);
  url.searchParams.set('outputMint', params.outputMint);
  url.searchParams.set('amount', String(params.amount));
  url.searchParams.set('slippageBps', String(params.slippageBps));
  if (params.onlyDirectRoutes) url.searchParams.set('onlyDirectRoutes', 'true');
  if (params.dexes && params.dexes.length) url.searchParams.set('dexes', params.dexes.join(','));
  const headers: Record<string, string> = {};
  if (CONFIG.jup.apiKey) headers['x-api-key'] = CONFIG.jup.apiKey;
  const res = await request(url, { method: 'GET', headers });
  if (res.statusCode !== 200) {
    throw new Error('Jupiter quote error: ' + res.statusCode);
  }
  const data = await res.body.json();
  return data;
}

export async function createSwapTransaction(
  connection: Connection,
  user: PublicKey,
  route: any, // the 'route' object from /quote
  asLegacyTransaction = false,
): Promise<VersionedTransaction> {
  const url = CONFIG.jup.quoteBase + '/v6/swap';
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (CONFIG.jup.apiKey) headers['x-api-key'] = CONFIG.jup.apiKey;

  const body = {
    quoteResponse: route,
    userPublicKey: user.toBase58(),
    wrapAndUnwrapSol: true,
    asLegacyTransaction,
    dynamicComputeUnitLimit: true,
    prioritizationFeeLamports: 'auto',
    // Optionally: restrict to certain DEXes
    // (Jupiter will try to honor but may return best route if impossible)
    // dexes: CONFIG.dexWhitelist.length ? CONFIG.dexWhitelist : undefined,
  };

  const res = await request(url, { method: 'POST', body: JSON.stringify(body), headers });
  if (res.statusCode !== 200) {
    const text = await res.body.text();
    throw new Error('Jupiter swap error: ' + res.statusCode + ' ' + text);
  }
  const data = await res.body.json();
  const swapTxBase64 = data.swapTransaction;
  const txBytes = Buffer.from(swapTxBase64, 'base64');
  const tx = VersionedTransaction.deserialize(txBytes);
  return tx;
}
