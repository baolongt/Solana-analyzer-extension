import BN from 'bn.js';
import {
  PublicKey,
  Connection,
  AddressLookupTableAccount,
  TransactionMessage,
  MessageV0,
  TransactionInstruction,
} from '@solana/web3.js';
import { convertRawToBase58 } from './utils';
import { SolFMParser } from './parser';

const connection = new Connection(
  'https://attentive-purple-sound.solana-mainnet.quiknode.pro/3e80be3037cae5bb76faa182aede706b608033f9/',
);

// const connection = new Connection(clusterApiUrl('devnet'));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const analyzeArguments = async (args: unknown, source: string) => {
  if (!args) throw new Error('no arguments');
  const ixParser = new SolFMParser();
  const programIds = new Set<string>();
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
        console.log('arg', arg);
        const arr = [];

        for (const ix of arg.instructions) {
          const parsedIX = await ixParser.parseIx(ix as TransactionInstruction);
          arr.push(parsedIX);
        }

        console.table(arr);
      }
      // versioned transaction
      if (arg.message) {
        console.log('arg.message', arg.message);

        if ('compiledInstructions' in arg.message) {
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

          const messageV0 = new MessageV0(parsedMessage);

          const decompiledTrans = TransactionMessage.decompile(messageV0, {
            addressLookupTableAccounts: ATLs,
          });

          const parsedIx = await ixParser.parseTransaction(decompiledTrans);
          console.table('table', parsedIx);
        } else {
          return {
            isSafe: false,
            message: 'All programs are safe',
          };
        }

        // for (const programId of programIds) {
        //   try {
        //     const SFMIdlItem = await getProgramIdl(programId);
        //     if (SFMIdlItem) {
        //     }
        //   } catch (e) {
        //     console.log('error', e);
        //   }
        // }
      }
    }
  }

  return {
    isSafe: true,
    message: 'All programs are safe',
  };

  // console.log('programIds', programIds);

  // const res = await AIService.getInstance().analyzeArguments(
  //   buildPrompt({
  //     programList: Array.from(programIds),
  //     source,
  //   }),
  // );

  // const regex = /{.*}/s;
  // const match = res.match(regex);
  // if (match) {
  //   const jsonString = match[0];
  //   const jsonData = JSON.parse(jsonString);
  //   return jsonData;
  // } else {
  //   console.log('No JSON found in response');
  //   throw new Error('No JSON found in response');
  // }
};
