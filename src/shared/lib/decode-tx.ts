import * as bs58 from 'bs58';
import { VersionedTransaction, Connection } from '@solana/web3.js';
// import { SolanaFMParser, checkIfInstructionParser, ParserType } from '@solanafm/explorer-kit';
// import { getProgramIdl } from '@solanafm/explorer-kit-idls';
import { SolanaParser } from '@debridge-finance/solana-transaction-parser';
import { findLookupAccounts } from './helper';
import jupiter from '@src/assets/jupiter.json';
import { ENV } from './constants';

export const decodeAndParseTransaction = async (encodedTx: string) => {
  try {
    const transaction = VersionedTransaction.deserialize(bs58.decode(encodedTx));
    const connection = new Connection(ENV.SOLANA_RPC, 'confirmed');

    const txParser = new SolanaParser([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { idl: jupiter as any, programId: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4' },
    ]);

    const lookup = await findLookupAccounts(transaction.message.addressTableLookups, connection);

    const parsed = await txParser.parseTransactionData(transaction.message, lookup);
    console.log('[utils] parsed', parsed);

    // const accountKeys = transaction.message.staticAccountKeys;
    // transaction.message.compiledInstructions.forEach(async ix => {
    //   try {
    //     const programId = accountKeys?data .[ix.programIdIndex];
    //     if (!programId) {
    //       throw new Error('Program id not found');
    //     }
    //     const SFMIdlItem = await getProgramIdl(programId.toBase58());
    //     const parser = new SolanaFMParser(SFMIdlItem, programId.toBase58());
    //     const instructionParser = parser.createParser(ParserType.INSTRUCTION);

    //     if (instructionParser && checkIfInstructionParser(instructionParser)) {
    //       // Parse the transaction
    //       const ixData = bs58.encode(ix.data);
    //       const decodedData = instructionParser.parseInstructions(ixData);
    //       console.log('decodedData', decodedData);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });

    return parsed;
  } catch (error) {
    console.log(error);
    return null;
  }
};
