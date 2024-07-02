export interface Instruction {
  programId: string;
  accounts: Account[];
  args: Args;
  name: string;
}

export interface Account {
  name?: string;
  isSigner?: boolean;
  isWritable?: boolean;
  pubkey?: string;
}

export interface Args {
  unknown?: InstructionData;
  lamports?: string;
}

export interface InstructionData {
  type: string;
  data: number[];
}

export interface Token {
  address: string;
  chainId: number
  decimals: number
  name: string
  logoURI: string
  symbol: string
}
