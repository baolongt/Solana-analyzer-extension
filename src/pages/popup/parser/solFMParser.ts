import { TransactionInstruction, TransactionMessage } from '@solana/web3.js';
import { SolanaFMParser, checkIfInstructionParser, ParserType, ParserOutput } from '@solanafm/explorer-kit';
import { getProgramIdl } from '@solanafm/explorer-kit-idls';
import bs58 from 'bs58';
import { convertRawToBase58 } from '../utils';

export type SolFmParserOutput = {
  programId: string;
  data: ParserOutput;
};

export class SolFMParser {
  constructor() {}

  public async parseIx(ix: TransactionInstruction) {
    const base58IXData = bs58.encode(Buffer.from(ix.data));
    const programId = convertRawToBase58(ix.programId);
    const SFMIdlItem = await getProgramIdl(programId);
    const parser = new SolanaFMParser(SFMIdlItem, programId);
    const instructionParser = parser.createParser(ParserType.INSTRUCTION);
    if (instructionParser && checkIfInstructionParser(instructionParser)) {
      // Parse the transaction
      const decodedData = instructionParser.parseInstructions(base58IXData);
      console.log('decodedData', decodedData);
      return {
        programId,
        data: decodedData,
      };
    }
  }

  public async parseTransaction(transaction: TransactionMessage) {
    const parsedIxs: SolFmParserOutput[] = [];
    for (const ix of transaction.instructions) {
      const parsedIx = await this.parseIx(ix);
      if (parsedIx) {
        parsedIxs.push(parsedIx);
      }
    }
    return parsedIxs;
  }
}
