type ProgramList = {
  programList: {
    programId: string;
    metadata: Record<string, string>;
  }[];
  blacklistPrograms: {
    programId: string;
    metadata: Record<string, string>;
  }[];
  source: string;
};

export const buildPrompt = ({ programList, blacklistPrograms, source }: ProgramList) => {
  const basePrompt = `
  User is trying to interact with a Solana Dapp website.

  The url of the website is: 
  {source}

  This user is trying to interact with the following programs: 
  {programsList}

  Blacklist programs: 
  {blacklistPrograms}

  Following those information, Tell the user the detail of the transaction and if it is safe to proceed.
  
  WHAT SHOULD RETURN:
  - A detail what will happended if the user proceed with the transaction.
  - How many cost will be charged in what token.
  
  WHAT SHOULD NOT RETURN:
  - computed unit of the transaction.

  IMPORTANT: 
  - You should return with these format as raw JSON, DO NOT return markdown or html.
  {
    isSafe: boolean,
    message: string
  }
  - If blacklist contains one program id you should return isSafe = false.
  `;

  basePrompt.replace('{source}', source);
  const programsList = programList.map(program => {
    if (program.metadata) {
      return `- Program ID: ${program.programId}, Metadata: ${program.metadata}`;
    }
    return `- Program ID: ${program.programId}`;
  });
  basePrompt.replace('{programsList}', programsList.join('\n'));

  const blacklistProgramList = blacklistPrograms.map(program => {
    if (program.metadata) {
      return `Program ID: ${program.programId}, Metadata: ${program.metadata}`;
    }
    return `Program ID: ${program.programId}`;
  });

  basePrompt.replace('{blacklistPrograms}', blacklistProgramList.join('\n'));

  return basePrompt;
};
