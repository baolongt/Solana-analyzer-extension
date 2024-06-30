let instance: PublicProgramService | null = null;
export class PublicProgramService {
  constructor() {}

  public async getPublicPrograms() {
    const res = await fetch('https://raw.githubusercontent.com/baolongt/solana-program-tracking/main/index.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: Record<
      string,
      {
        programId: string;
        metadata?: Record<string, unknown>;
      }
    > = await res.json();

    return data;
  }

  public async getProgramDetails(programId: string) {
    const res = await this.getPublicPrograms();
    const program = res[programId];

    if (!program) {
      return null;
    }

    return program;
  }

  public async getBlacklistedPrograms() {
    // TODO : add the correct endpoint

    const res = await fetch('https://raw.githubusercontent.com/baolongt/solana-scam-tracking/main/index.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: Record<
      string,
      {
        programId: string;
        metadata?: Record<string, unknown>;
      }
    > = await res.json();

    return data;
  }

  public async isProgramBlacklisted(programId: string) {
    const res = await this.getBlacklistedPrograms();
    const program = res[programId];

    if (!program) {
      return false;
    }

    return true;
  }

  public static getInstance() {
    if (!instance) {
      instance = new PublicProgramService();
    }
    return instance;
  }
}
