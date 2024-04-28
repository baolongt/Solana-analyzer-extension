import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

const parseAccountMetadata = (raw: {
  _bn: {
    words: number[];
  };
}) => {
  const accountMetadata = new BN(raw._bn.words);
  return new PublicKey(accountMetadata).toBase58();
};

export const analyzeArguments = async (args: unknown) => {
  if (!args) throw new Error('no arguments');
  console.log('args', args);
  if (Array.isArray(args)) {
    for (const arg of args) {
      if (arg === null) continue;
      if (arg.instructions) {
        for (const instruction of arg.instructions) {
          console.log('instruction', instruction);
          // if (instruction.data) {

          // }

          if (instruction.keys) {
            const participants = instruction.keys.map(
              (key: {
                pubkey: {
                  _bn: {
                    words: number[];
                  };
                };
                isSigner: boolean;
                isWritable: boolean;
              }) => {
                console.log('key', key);
                const pubkey = new BN(key.pubkey._bn.words);
                return {
                  pubkey: new PublicKey(pubkey).toBase58(),
                  isSigner: key.isSigner,
                  isWritable: key.isWritable,
                };
              },
            );
            console.log('participants', participants);
          }
          if (instruction.programId) {
            const programIdBn = new BN(instruction.programId._bn.words);
            const programId = new PublicKey(programIdBn.toArray()).toBase58();
            console.log('programId', programId);
          }
        }
      }
      if (arg.message) {
        console.log('arg.message', arg.message);
        if (arg.message.staticAccountKeys) {
          console.log('staticAccountKeys', arg.message.staticAccountKeys);
          for (const key of arg.message.staticAccountKeys) {
            const pubkey = parseAccountMetadata(key);
            console.log('pubkey', pubkey);
          }
        }
      }
    }
  }
};
