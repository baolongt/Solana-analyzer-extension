import { BN } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsePublicKey(pubkeyObject: any): PublicKey {
  const bn = new BN(pubkeyObject._bn.words);
  const byteArray = new Uint8Array(bn.toArray());
  return new PublicKey(byteArray);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseAccount(accountObject: any): { pubkey: PublicKey; isSigner: boolean; isWritable: boolean } {
  return {
    pubkey: parsePublicKey(accountObject.pubkey),
    isSigner: accountObject.isSigner,
    isWritable: accountObject.isWritable,
  };
}
