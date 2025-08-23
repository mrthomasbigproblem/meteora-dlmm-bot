import { CONFIG } from './config.js';
import { getConnection } from './rpc.js';
import { loadKeypairFromEnv } from './utils/wallet.js';
import { pollLeadersOnce } from './copytrading/watcher.js';
import { getQuote, createSwapTransaction } from './dex/jupiter.js';
import { signAndSend } from './execution/trader.js';
import { openDb, insertTrade } from './storage/db.js';
import { PublicKey } from '@solana/web3.js';

const ONE_SOL = 1_000_000_000n;

async function main() {
  console.log('Starting Meteora Copy-Bot...');
  const conn = getConnection();
  const kp = loadKeypairFromEnv(CONFIG.secretKey);
  console.log('Bot pubkey:', kp.publicKey.toBase58());

  const db = openDb();

  if (!CONFIG.leaders.length) {
    console.log('No leaders configured. Set LEADER_ADDRESSES in .env');
  }

  // Simple loop: poll leaders, mirror last swap via Jupiter with tight slippage and DEX whitelist
  setInterval(async () => {
    try {
      if (!CONFIG.leaders.length) return;
      const swaps = await pollLeadersOnce(conn, CONFIG.leaders, 10);
      for (const s of swaps) {
        // naive: only act on recent swaps (within 2 minutes)
        if (Date.now() - s.ts > 2 * 60_000) continue;
        if (!s.inMint || !s.outMint) continue;

        // Decide our size: cap by MAX_TRADE_QUOTE (in input token units) — here we only support SOL as input example
        // In production lookup token decimals and compute smallest units accordingly.
        const inputAmount = BigInt(Math.floor(CONFIG.maxTradeQuote * Number(ONE_SOL)));

        console.log(`[mirror] ${s.leader} ${s.signature} ${s.inMint} -> ${s.outMint}`);

        const dexes = CONFIG.dexWhitelist.length ? CONFIG.dexWhitelist : undefined;
        const quote = await getQuote({
          inputMint: s.inMint,
          outputMint: s.outMint,
          amount: Number(inputAmount), // TODO: convert based on decimals
          slippageBps: CONFIG.slippageBps,
          dexes,
        });

        if (!quote || !quote.routePlan || !quote.inAmount) {
          console.warn('No valid quote from Jupiter');
          continue;
        }

        const tx = await createSwapTransaction(conn, kp.publicKey, quote);
        const sig = await signAndSend(conn, kp, tx);
        console.log('Mirrored swap sig:', sig);

        insertTrade(db, {
          ts: s.ts,
          leader: s.leader,
          signature: s.signature,
          inMint: s.inMint ?? null,
          outMint: s.outMint ?? null,
          inAmount: s.inAmount ? s.inAmount.toString() : null,
          outAmount: s.outAmount ? s.outAmount.toString() : null,
        });
      }
    } catch (e) {
      console.error('loop error', e);
    }
  }, 10_000);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
