
import { PublicKey, Connection, AddressLookupTableAccount, TransactionMessage, MessageV0 } from '@solana/web3.js';
import { convertRawToBase58, parseAccount } from './utils';
import { SolFMParser } from './parser';
import { PublicProgramService } from './services/publicProgramService';


const connection = new Connection(
  'https://attentive-purple-sound.solana-mainnet.quiknode.pro/3e80be3037cae5bb76faa182aede706b608033f9/',
);

// const connection = new Connection(clusterApiUrl('devnet'));


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

        console.log('ATLs', ATLs);
        const messageV0 = new MessageV0(parsedMessage);

        const decompiledTrans = TransactionMessage.decompile(messageV0, {
          addressLookupTableAccounts: ATLs,
        });
        console.log('decompiled', decompiledTrans);

        decompiledTrans.instructions.forEach(instruction => {
          programIds.add(convertRawToBase58(instruction.programId));
        });
      }
    }
  }

  console.log('programIds', programIds);

  console.log(
    await AIService.getInstance().analyzeArguments(
      buildPrompt({
        programList: Array.from(programIds),
        source,
      }),
    ),
  );
};

const buildPrompt = ({ programList, source }: { programList: string[]; source: string }) => {
  console.log('programList', programList);
  console.log('source', source);
  let basePrompt = `
  User is trying to interact with a Solana Dapp website.
  The url of the website is: {source}
  This user is trying to interact with the following programs: {programsList}

  Blacklist programs:

  `;
  if (URLBlackListService.getInstance().isBlacklisted(source)) {
    basePrompt = basePrompt.replace('{source}', source + ' this is reported as scam website');
  } else {
    basePrompt = basePrompt.replace('{source}', source);
  }

  if (programList.length === 0) {
    basePrompt = basePrompt.replace('{programsList}', 'No programs, this might need user sign with their wallet.');
  } else {
    basePrompt = basePrompt.replace('{programsList}', programList.join(', '));
  }

  const blacklistProgram = programList.filter(program => {
    return BlackListService.getInstance().isBlacklisted(program);
  });
  console.log('blacklistProgram', blacklistProgram);
  if (blacklistProgram.length > 0) {
    basePrompt += blacklistProgram.join(', ') + ' is reported as scam programs';
  } else {
    basePrompt += 'All programs are safe';
  }

  basePrompt += `
  Return a message to warn user if it not safe to interact with these programs or website. If it's safe, you can return an short message that tell it's safe.

  IMPORTANT: 
  - You should return with these format as raw JSON, dont return markdown or html.
  {
    isSafe: boolean,
    message: string
  }
  - If there is a blacklist stuff contains you should return isSafe = false or else it should be true.
  - The message should user friendly and tell them what they should do next.
  - And please list the programs in the message if there is any scam programs it should be shortern
  `;

  return basePrompt;
};
