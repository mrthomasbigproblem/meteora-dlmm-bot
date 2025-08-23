import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

export type TradeRow = {
  ts: number;
  leader: string;
  signature: string;
  inMint: string | null;
  outMint: string | null;
  inAmount: string | null;
  outAmount: string | null;
};

export function openDb(dbPath = path.join(process.cwd(), 'data', 'bot.db')) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,
      leader TEXT NOT NULL,
      signature TEXT UNIQUE NOT NULL,
      in_mint TEXT,
      out_mint TEXT,
      in_amount TEXT,
      out_amount TEXT
    );
  `);
  return db;
}

export function insertTrade(db: Database, row: TradeRow) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO trades (ts, leader, signature, in_mint, out_mint, in_amount, out_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(row.ts, row.leader, row.signature, row.inMint, row.outMint, row.inAmount, row.outAmount);
}
