import 'dotenv/config';

export const CONFIG = {
  rpcUrl: process.env.RPC_URL ?? 'https://api.mainnet-beta.solana.com',
  secretKey: process.env.WALLET_SECRET_KEY ?? '',
  jup: {
    quoteBase: process.env.QUOTE_API_BASE ?? 'https://quote-api.jup.ag',
    apiKey: process.env.JUP_API_KEY ?? '',
  },
  dlmmApiBase: process.env.DLMM_API_BASE ?? 'https://dlmm-api.meteora.ag',
  leaders: (process.env.LEADER_ADDRESSES ?? '').split(',').map(s => s.trim()).filter(Boolean),
  maxTradeQuote: Number(process.env.MAX_TRADE_QUOTE ?? '1'),
  slippageBps: Number(process.env.SLIPPAGE_BPS ?? '100'),
  dexWhitelist: (process.env.DEX_WHITELIST ?? '').split(',').map(s => s.trim()).filter(Boolean),
};
