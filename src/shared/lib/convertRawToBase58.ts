import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const convertRawToBase58 = (
  raw:
    | {
        _bn: {
          words: number[];
          length: number;
          red: null;
          negative: number;
        };
      }
    | (PublicKey & {
        _bn?: {
          words: number[];
          length: number;
          red: null;
          negative: number;
        };
      }),
) => {
  const num = new BN(0);
  num.words = raw._bn.words;
  num.length = raw._bn.length;
  num.red = raw._bn.red;
  num.negative = raw._bn.negative;
  const accountMetadata = new BN(num, 'hex');
  return new PublicKey({
    _bn: accountMetadata,
  }).toBase58();
};
