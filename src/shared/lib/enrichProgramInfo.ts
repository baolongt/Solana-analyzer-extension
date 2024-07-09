import { PublicProgramService } from '@root/src/pages/popup/services/publicProgramService';

export const enrichProgramInfo = async (programIds: string[]) => {
  if (!programIds) throw new Error('no programIds');

  const enrichProgramList = await Promise.all(
    programIds.map(programId => {
      return PublicProgramService.getInstance().getProgramDetails(programId);
    }),
  );

  return enrichProgramList;
};
