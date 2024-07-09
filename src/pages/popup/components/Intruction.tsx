import React from 'react';

interface InstructionProps {
  instruction: {
    programId: string;
    name: string;
    detail: Record<string, unknown> | null;
    isBlackListed: boolean;
  };
  index: number;
}

const Instruction: React.FC<InstructionProps> = ({ instruction, index }) => {
  return (
    <div className="flex flex-col">
      <div className="text-base p-4 font-bold">
        Instruction {index + 1} - {instruction.name}{' '}
        {instruction.isBlackListed ? <BlackListIcon index={index} /> : <CheckIcon index={index} />}
      </div>
      <div className="p-4 rounded-lg">
        <div className="text-sm">Program ID: {instruction.programId}</div>
      </div>
    </div>
  );
};

const BlackListIcon = ({ index }: { index: number }) => {
  console.log('index', index);
  return (
    <>
      <button
        // ta-tooltip-target={`tooltip-top-${index}`}
        data-tooltip-placement="top"
        type="button"
        className="mb-2 md:mb-0 text-sm text-red-600 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </button>

      <div
        // ta-tooltip-target={`tooltip-top-${index}`}
        role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
        Tooltip on top
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    </>
  );
};

const CheckIcon = ({ index }: { index: number }) => {
  return (
    <>
      <button
        data-tooltip-target={`tooltip-top-${index}`}
        data-tooltip-placement="top"
        type="button"
        className="mb-2 md:mb-0 text-sm text-green-500 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>

      <div
        id={`tooltip-top-${index}`}
        role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
        Tooltip on top
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    </>
  );
};

export default Instruction;
