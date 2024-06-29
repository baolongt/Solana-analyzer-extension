import {
  PublicKey,
  Connection,
  AddressLookupTableAccount,
  TransactionMessage,
  MessageV0,
  TransactionInstruction,
} from '@solana/web3.js';
import { buildPrompt, convertRawToBase58 } from './utils';
import { SolFMParser } from './parser';
import { OpenRouterService } from './services/openRouterService';
import { Analyze } from './services/analyze';

const connection = new Connection(
  'https://attentive-purple-sound.solana-mainnet.quiknode.pro/3e80be3037cae5bb76faa182aede706b608033f9/',
);

// const connection = new Connection(clusterApiUrl('devnet'));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const analyzeArguments = async (args: unknown, source: string) => {
  if (!args) throw new Error('no arguments');

  console.log('args', args);
  const ixParser = new SolFMParser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

          for (const alt of ATLs) {
            console.log('alt', alt.key.toBase58());
          }

          const messageV0 = new MessageV0(parsedMessage);

          const decompiledTrans = TransactionMessage.decompile(messageV0, {
            addressLookupTableAccounts: ATLs,
          });
          console.log('decompiledTrans', decompiledTrans);

          const parsedIx = await ixParser.parseTransaction(decompiledTrans);
          console.log('table', parsedIx);

          const enrichProgramList = await Analyze.getInstance().enrichWithPublicData(parsedIx);
          console.log('enrichProgramList', enrichProgramList);

          const res = await OpenRouterService.getInstance().analyzeArguments(
            buildPrompt({
              programList: enrichProgramList,
              blacklistPrograms: [],
              source,
            }),
          );

          const resJsonRaw = res.choices[0].message.content;
          const resJSON = JSON.parse(resJsonRaw);
          console.log('res', resJSON);

          return resJSON;
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

  // console.log('programIds', programIds);

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
