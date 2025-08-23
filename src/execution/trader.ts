import { Connection, Keypair, sendAndConfirmTransaction, VersionedTransaction } from '@solana/web3.js';

export async function signAndSend(
  connection: Connection,
  kp: Keypair,
  tx: VersionedTransaction,
): Promise<string> {
  tx.sign([kp]);
  const sig = await sendAndConfirmTransaction(connection, tx, { signers: [kp] as any });
  return sig;
}
