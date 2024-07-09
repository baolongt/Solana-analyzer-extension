import { type ParsedInstruction } from '@debridge-finance/solana-transaction-parser';
import { type Idl } from '@project-serum/anchor';
import { PublicProgramService } from '@root/src/pages/popup/services/publicProgramService';

export const enrichTransaction = async (instructions: ParsedInstruction<Idl, string>[]) => {
  if (!instructions) throw new Error('no instructions');

  const enrichedIx = await Promise.all(
    instructions.map(async instruction => {
      console.log('instruction', instruction);
      const detail = await PublicProgramService.getInstance().getProgramDetails(
        instruction.programId as unknown as string,
      );
      const isBlackListed = await PublicProgramService.getInstance().isProgramBlacklisted(
        instruction.programId as unknown as string,
      );

      return {
        name: instruction.name,
        programId: instruction.programId as unknown as string,
        detail: detail,
        isBlackListed,
      };
    }),
  );

  return enrichedIx;
};
