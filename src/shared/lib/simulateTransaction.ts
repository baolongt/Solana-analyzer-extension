import { Connection, VersionedTransaction } from '@solana/web3.js';
import { ENV } from './constants';
import * as bs58 from 'bs58';

export const simulateTransaction = async (encodedTx: string) => {
  const transaction = VersionedTransaction.deserialize(bs58.decode(encodedTx));
  const connection = new Connection(ENV.SOLANA_RPC, 'confirmed');

  const result = await connection.simulateTransaction(transaction);

  console.log('[utils] simulateTransaction', result);
};
