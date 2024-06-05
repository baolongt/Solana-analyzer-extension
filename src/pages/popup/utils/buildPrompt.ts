import { BlackListService, URLBlackListService } from '../services/blacklistService';

export const buildPrompt = ({ programList, source }: { programList: string[]; source: string }) => {
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
  - You should return with these format as raw JSON, DO NOT return markdown or html.
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
