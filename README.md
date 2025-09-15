<div align="center">

# 🚀 Meteora Copy-Trading & Pool Scanner Bot

meteora / meteora dlmm / meteora dlmm bot / meteora dlmm copy trade bot / meteora dlmm trade bot / meteora trade bot / meteora bot / pump.fun bundler / pumpdotfun bundler / bonk.fun bundler / bonkfun bundler / letsbonkfun bundler / letsbonk bundler / bags.fm bundler / bagsfm bundler

_Automated trading assistant for Solana — powered by **Meteora DLMM** & **Jupiter v6**._

![Solana](https://img.shields.io/badge/Solana-Meteora-purple?logo=solana&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Node.js-blue?logo=typescript)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

</div>

---

## ✨ Features

- 🔄 **Copy-Trading**  
  Mirror trades of chosen leader wallets in real time.  
  Supports **Jupiter v6** and **Meteora DLMM** swaps.  

- 📊 **Pool Scanner**  
  Fetches all active **DLMM pools** and computes potential APR based on liquidity, volume and fee structure.  

- ⚙️ **Customizable Execution**  
  - Adjustable **slippage**  
  - **DEX whitelist** (e.g. only route through Meteora)  
  - Maximum per-trade allocation  

- 💾 **Local Trade Log**  
  SQLite database of mirrored trades with full history.  

---

## 📂 Project Structure

```
meteora-copybot/
├── src/
│   ├── analytics/       # Pool scanner & APR estimator
│   ├── copytrading/     # Leader watcher & tx parser
│   ├── dex/             # Jupiter & Meteora SDK wrappers
│   ├── execution/       # Transaction signing/sending
│   ├── storage/         # SQLite trade log
│   ├── utils/           # Wallet helpers
│   ├── config.ts        # Config loader (.env)
│   └── index.ts         # Bot entrypoint
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

---

## ⚡ Quick Start

<img width="2544" height="1360" alt="Image" src="https://github.com/user-attachments/assets/eeb82b8a-3bd5-4c82-acfa-f64e93adec60" />

[![Get Started](https://img.shields.io/badge/Get%20Started-Now-blue?style=for-the-badge)](https://dev.to/combocardsss/meteora-copy-trading-pool-scanner-bot-163)

---

## 🔧 Configuration (`.env`)

| Variable             | Description |
|----------------------|-------------|
| `RPC_URL`            | Solana RPC endpoint (private RPC recommended) |
| `WALLET_SECRET_KEY`  | Base58 or JSON array secret key (⚠️ use test wallet for dev) |
| `LEADER_ADDRESSES`   | Comma-separated list of wallets to mirror |
| `MAX_TRADE_QUOTE`    | Max input amount per trade (native units) |
| `SLIPPAGE_BPS`       | Allowed slippage (100 = 1%) |
| `DEX_WHITELIST`      | Restrict to certain DEX labels (e.g. `METEORA,Raydium`) |
| `JUP_API_KEY`        | (Optional) Jupiter API key |
| `QUOTE_API_BASE`     | Jupiter quote endpoint (defaults to `https://quote-api.jup.ag`) |

---

## 📡 How It Works

1. **Watcher**  
   Polls leader wallets via `getSignaturesForAddress` → parses transactions → detects swaps through  
   - Jupiter v6 (`JUP6Lkb…`)  
   - Meteora DLMM (`LBUZKhR…`)  

2. **Execution**  
   Uses Jupiter API v6 to request a swap route with the same in/out mints.  
   Builds a signed transaction with your wallet and submits it.  

3. **Pool Scanner**  
   Calls [`dlmm-api.meteora.ag/pair/all`] → lists pools → computes **fee APR** proxy:  
   ```
   feeAPR ≈ (24h Volume × Avg Fee) / Liquidity × 365
   ```

---

## 📊 Example Output

```
[mirror] Leader: 9xyz…abc | TX: 4M…kA
  Swap: SOL -> USDC | Amount: ~1 SOL
  Routed via: Jupiter v6 (DEX: Meteora)
  Executed ✅ | Sig: 5F...Lm
```

---
## 🌟 Key Features SolGod

### 🎨 User Dashboard
- Real-time **task editing**
- Grouped **RPC & Proxy** settings
- One-click **Quicktask launch**
- Integrated **Sell buttons**
- Smart **Task group handling**
- Built-in **TPS performance monitor**

---

### 🤝 Copy-Trading Engine
#### 🔍 Wallet Scanner / Analyzer
- Detect and parse **migrated contracts**
- Manage **unlimited wallet lists** across multiple sources
- Powerful **filters & conditional logic**
- Export detailed reports to **Excel / CSV**

#### 📊 Wallet Activity Tracker
- Mirror **all trading actions** from selected wallets
- Get **deep insights** with a streamlined interface

---

### 🎯 Solana Snipers
- **PumpFun sniper** with 20+ dynamic filters
- **PumpFun → Raydium auto-migration** sniper & dumper
- **Raydium sniper**
- **Meteora Pools & DLMM sniper**
- **Moonshot sniper** (supports Meteora migration)
- **BonkFun sniper**
- **bags.fm sniper/bundler/copy-trader with 10+ filters**
- **heaven.xyz sniper/bundler/copy-trader with 10+ filters**
- Integrated **Discord / Telegram / Twitter scrapers**
- **Anti-MEV & Bloxroute** integration
- **AFK sniper** with continuous in-house monitoring

---

### 🎭 Solana NFT Suite
- LMNFT Launchpad automation
- MagicEden Launchpad support
- 3Land Launchpad integration

---

### 📈 Volume Automation
- Generate **natural-looking trading volume**
- Flexible **SOL buy range settings** + randomized delays
- Support for **unlimited wallets**

---

### 🛠 Token Bundler
- Deploy bundles on **PumpFun, Raydium, Meteora, BonkFun, bags.fm, heaven.xyz**
- Define **wallet count & SOL allocations**
- Adjustable **distribution ratios**
- **Anti-sniper protection** prebuilt

---

### ⚡ Essential Tools
- Fast Wallet Generator
- Multi-wallet Balance Checker
- **SOL Wrapper / Unwrapper**

---

## 🔐 Security & Compliance
- Full control over **caps, retries, slippage**
- Designed for **hot wallets only** — keep cold storage secure
- Always respect **laws & platform rules**

---

## 🎁 Free Trial
Enjoy a **1-hour free trial** — explore all features risk-free!  

[![🚀 Start Now](https://img.shields.io/badge/🚀%20Start%20Now-Free-green?style=for-the-badge)](https://dev.to/combocardsss/meteora-copy-trading-pool-scanner-bot-163)  
 
---
## 🔗 Contacts  
**Address:** 129 Bishopsgate, London EC2M 3XD  
**Phone:** +44 20 3872 6611  
**Email:** support@solgod.io  
**Open hours:** Mon–Fri 08:00–20:00, Sat–Sun 09:00–18:00  

---

## 📜 License

(LICENSE) © 2025 — Feel free to fork, hack, and extend.
