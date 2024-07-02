import { parsedTx } from '@root/src/shared/lib/sample';
import { Instruction } from '../types';
import { PROGRAMS } from '@root/src/shared/lib/constants';
import { formatWalletAddress } from '@root/src/shared/lib/helper';

export default function InstructionItem({ instruction }: { instruction: Instruction }) {
  const program = PROGRAMS.find(program => program.programId === instruction.programId);

  return (
    <div className="bg-gray-800 rounded-lg text-white divide-y divide-gray-200">
      <div className="px-4 py-2 flex items-center">
        <h4 className="text-lg font-semibold">
          {program ? program.name : instruction.programId} - {instruction.name}
        </h4>
      </div>
      <div>
        {instruction.accounts.map(acc => (
          <div key={acc.pubkey} className="px-4 py-2 flex justify-between items-center">
            <p className="text-base flex-1">{acc.name ?? 'Unknown'}</p>
            <Address address={acc.pubkey} />
          </div>
        ))}
      </div>
      <div className="px-4 py-2 flex items-center justify-between">
        <p className="text-base flex-1">Instruction Data (Hex)</p>
        <pre className="text-base whitespace-normal break-words">{JSON.stringify(instruction.args)}</pre>
      </div>
    </div>
  );
}

const Address = ({ address }: { address: string }) => {
  return (
    <a
      href={`https://explorer.solana.com/address/${address}`}
      target="_blank"
      className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
      {formatWalletAddress(address)}
    </a>
  );
};
