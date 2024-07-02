import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import BN from 'bn.js';
import { TOKEN_LIST } from './constants';

export const bnToPublicKey = (value: any) => {
  const num = new BN(0);
  num.words = value._bn.words;
  num.length = value._bn.length;
  num.red = value._bn.red;
  num.negative = value._bn.negative;

  return new PublicKey(num);
};

export const findLookupAccounts = async (
  tables: VersionedTransaction['message']['addressTableLookups'],
  connection: Connection,
) => {
  let readonly = [] as PublicKey[];
  let writable = [] as PublicKey[];

  const tableAddresses = tables.map(table => table.accountKey);

  const states = await Promise.all(tableAddresses.map(address => connection.getAddressLookupTable(address)));

  tables.forEach((table, index) => {
    const addresses = states[index].value.state.addresses;

    const writeableAddresses = table.writableIndexes.map(index => addresses?.at(index));
    const readOnlyAddresses = table.readonlyIndexes.map(index => addresses?.at(index));

    readonly = [...readonly, ...readOnlyAddresses];
    writable = [...writable, ...writeableAddresses];
  });

  return { readonly, writable };
};

export const getTokenMetadata = (address: string) => {
  return TOKEN_LIST.find(token => token.address === address);
};

export function formatWalletAddress(publicKey: PublicKey | string, numDigits = 4): string {
  if (!publicKey) return '';
  const pubkeyStr: string = typeof publicKey === 'string' ? publicKey : publicKey.toString();
  if (pubkeyStr.length <= numDigits * 2) return pubkeyStr;
  return `${pubkeyStr.slice(0, numDigits)}...${pubkeyStr.slice(pubkeyStr.length - numDigits)}`;
}
