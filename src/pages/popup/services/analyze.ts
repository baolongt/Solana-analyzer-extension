import { SolFmParserOutput } from '../parser';
import { PublicProgramService } from './publicProgramService';

let instance: Analyze | null = null;

export class Analyze {
  constructor() {}

  public async enrichWithPublicData(ixs: SolFmParserOutput[]) {
    const enrichList = [];

    for (const ix of ixs) {
      const programDetails = await PublicProgramService.getInstance().getProgramDetails(ix.programId);
      if (!programDetails) {
        enrichList.push(ix);
      } else
        enrichList.push({
          ...ix,
          ...programDetails,
        });
    }

    return enrichList;
  }

  public static getInstance() {
    if (!instance) {
      instance = new Analyze();
    }
    return instance;
  }
}
