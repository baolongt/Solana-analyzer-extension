import { PublicKey } from '@solana/web3.js';

type BuildPromptInput = {
  intructionList: {
    data: Buffer;
    keys: {
      pubkey: PublicKey;
      isSigner: boolean;
      isWritable: boolean;
    }[];
    programId: string;
    name: string;
    enrichProgramDetail: Record<string, unknown> | null;
    isBlackListed: boolean;
  }[];
  source: string;
};

export const buildPrompt = ({ intructionList, source }: BuildPromptInput) => {
  let basePrompt = `
  User is trying to interact with a Solana Dapp website.

  The url of the website is: 
  {source}

  This user is trying to interact with the following programs: 
  {programsList}
  
  =============================================
  Blacklist programs - {blacklistProgramsNumber} programs are blacklisted:
  {blacklistPrograms}

  Following those information, Tell the user the detail of the transaction and if it is safe to proceed.
  
  WHAT SHOULD RETURN:
  - A detail what will happended if the user proceed with the transaction.
  - Show the name of the website if you know the website dapp alread
  - If there is a metadata provide for programId, you can use it as source of information.
  - The response should be easy to understand for the user.
  - Don't show the plain programId, if it have a metadata, use it like name or description for meaningful
  - Do not show url of the website
  - If you know the name of the website or it in the metadata
  - Medata is the best source of information, if it is not available, just make all you can do.

  WHAT SHOULD NOT RETURN:
  - computed unit of the transaction.
  - include markdown syntax like ** or something else.

  IMPORTANT: 
  - Should response with markdown syntax
  - If blacklist contains one or more program id you should warn the user about the blacklist programs.
  - Don't show the plain programId, if it have a metadata, use it like name or description for meaningful
  `;

  basePrompt = basePrompt.replace('{source}', source);

  const programsList = intructionList
    .map((instruction, index) => {
      return `
    Intruction ${index + 1}:
    \tInstruction name: ${instruction.name}
    \tProgram ID: ${instruction.programId}
    \tMetadata: ${JSON.stringify(instruction.enrichProgramDetail)}
    `;
    })
    .join('\n\t');

  basePrompt = basePrompt.replace('{programsList}', programsList);

  const blacklistPrograms = intructionList
    .filter(instruction => instruction.isBlackListed)
    .map(instruction => {
      return `
    Program ID: ${instruction.programId}
    `;
    })
    .join('\n\t');

  basePrompt = basePrompt.replace('{blacklistProgramsNumber}', blacklistPrograms.length.toString());
  basePrompt = basePrompt.replace('{blacklistPrograms}', blacklistPrograms);

  console.log('basePrompt', basePrompt);
  return basePrompt;
};
