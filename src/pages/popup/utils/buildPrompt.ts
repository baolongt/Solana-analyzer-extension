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
  - do not show url of the website
  - if you know the name of the website or it in the metadata
  - Medata is the best source of information, if it is not available, just make all you can do.

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

  basePrompt = basePrompt.replace('{source}', source);
  const programsList = programList.map(program => {
    if (program.metadata) {
      return `- Program ID: ${program.programId}, Metadata: ${JSON.stringify(program.metadata)}`;
    }
    return `- Program ID: ${program.programId}`;
  });
  basePrompt = basePrompt.replace('{programsList}', programsList.join('\n\t'));

  const blacklistProgramList = blacklistPrograms.map(program => {
    if (program.metadata) {
      return `- Program ID: ${program.programId}, Metadata: ${JSON.stringify(program.metadata)}`;
    }
    return `- Program ID: ${program.programId}`;
  });
  basePrompt = basePrompt
    .replace('{blacklistProgramsNumber}', blacklistProgramList.length.toString())
    .replace('{blacklistPrograms}', blacklistProgramList.join('\n\t'));

  console.log('basePrompt', basePrompt);
  return basePrompt;
};
