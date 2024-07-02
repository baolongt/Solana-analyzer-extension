import { PublicKey, Connection, AddressLookupTableAccount, TransactionMessage, MessageV0 } from '@solana/web3.js';
import { convertRawToBase58, parseAccount } from './utils';
import { SolFMParser } from './parser';
import { PublicProgramService } from './services/publicProgramService';

const connection = new Connection(
  'https://attentive-purple-sound.solana-mainnet.quiknode.pro/3e80be3037cae5bb76faa182aede706b608033f9/',
);

export const analyzeArguments = async (args: unknown) => {
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
        return arg.instructions;
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

          const messageV0 = new MessageV0(parsedMessage);

          const decompiledTrans = TransactionMessage.decompile(messageV0, {
            addressLookupTableAccounts: ATLs,
          });

          const parsedIx = await ixParser.parseTransaction(decompiledTrans);
          console.log('parsedIx', parsedIx);

          const enrichProgramList = await Promise.all(
            parsedIx.map(ix => {
              return PublicProgramService.getInstance().getProgramDetails(ix.programId);
            }),
          );

          const transaction = await Promise.all(
            decompiledTrans.instructions.map(async (ix, index) => {
              const isBlackListed = await PublicProgramService.getInstance().isProgramBlacklisted(
                parsedIx[index].programId,
              );
              return {
                data: Buffer.from(ix.data),
                keys: ix.keys.map(key => parseAccount(key)),
                programId: parsedIx[index].programId,
                enrichProgramDetail: enrichProgramList[index],
                isBlackListed: isBlackListed,
                name: parsedIx[index].data ? parsedIx[index].data.name : 'Unknown',
              };
            }),
          );

          return transaction;

          // return decompiledTrans.instructions;
        }
      }
    }
  }
};
