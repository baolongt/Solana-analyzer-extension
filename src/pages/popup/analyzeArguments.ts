import BN from 'bn.js';
import { PublicKey, Connection, AddressLookupTableAccount, TransactionMessage, MessageV0 } from '@solana/web3.js';

const connection = new Connection(
  'https://attentive-purple-sound.solana-mainnet.quiknode.pro/3e80be3037cae5bb76faa182aede706b608033f9/',
);

// const connection = new Connection(clusterApiUrl('devnet'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertRawToBase58 = (
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

export const analyzeArguments = async (args: unknown) => {
  if (!args) throw new Error('no arguments');
  console.log('args', args);
  if (Array.isArray(args)) {
    for (const arg of args) {
      if (arg === null) continue;

      if (arg.compiledInstructions) {
        for (const instruction of arg.compiledInstructions) {
          // Convert data object to array
          instruction.data = Object.values(instruction.data);
        }
      }
      // legacy transaction
      if (arg.instructions) {
        for (const instruction of arg.instructions) {
          console.log('instruction', instruction);

          if (instruction.keys) {
            const participants = instruction.keys.map(
              (key: {
                pubkey: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  _bn: any;
                };
                isSigner: boolean;
                isWritable: boolean;
              }) => {
                return {
                  pubkey: convertRawToBase58(key.pubkey),
                  isSigner: key.isSigner,
                  isWritable: key.isWritable,
                };
              },
            );
            console.log('participants', participants);
          }
          if (instruction.programId) {
            const programIdBn = new BN(instruction.programId._bn);
            const programId = new PublicKey(programIdBn.toArray()).toBase58();
            console.log('programId', programId);
          }
        }
      }
      // versioned transaction
      if (arg.message) {
        console.log('arg.message', arg.message);
        const parsedMessage = {
          ...arg.message,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          compiledInstructions: arg.message.compiledInstructions.map((instruction: any) => {
            return {
              ...instruction,
              data: Object.values(instruction.data),
            };
          }),
        };

        const ATLs: AddressLookupTableAccount[] = [];

        for (const tableAccountAddress of parsedMessage.addressTableLookups) {
          const acc = await connection.getAddressLookupTable(
            new PublicKey(convertRawToBase58(tableAccountAddress.accountKey)),
          );
          if (acc.value) {
            ATLs.push(acc.value);
          }
        }

        console.log('ATLs', ATLs);
        const messageV0 = new MessageV0(parsedMessage);

        const decompiledTrans = TransactionMessage.decompile(messageV0, {
          addressLookupTableAccounts: ATLs,
        });
        console.log('decompiled', decompiledTrans);

        const programIds = decompiledTrans.instructions.map(instruction => {
          return convertRawToBase58(instruction.programId);
        });

        console.log('programIds', programIds);
      }
    }
  }
};
