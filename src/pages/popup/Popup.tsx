import '@pages/popup/Popup.css';
import React, { useEffect, useState } from 'react';
import withSuspense from '@src/shared/hoc/withSuspense';
import tokens from '@src/assets/tokens.json';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import InstructionItem from './instruction-item';
import AIResult from './ai-result';
import { Instruction } from '../types';
import { askAI } from '@root/src/shared/lib/ai';
import { parsedTx } from '@root/src/shared/lib/sample';

const tokenList = tokens as Array<any>;

const Popup = () => {
  const [instructions, setInstructions] = useState<Instruction[]>(parsedTx);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState('');

  useEffect(() => {
    chrome.storage.local.get('event', function (data) {
      console.log('Data retrieved from Chrome storage: ', data);
      if (data?.event?.data) {
        try {
          const parsed = JSON.parse(data?.event?.data);
          setInstructions(parsed);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }, []);

  const handleApprove = () => {};

  const handleReject = () => {};

  const handleDecode = async () => {
    try {
      setAnalyzing(true);
      askAI(instructions, result => {
        if (result) {
          setAnalyzeResult(r => (r += result));
        }
        if (!result) {
          setAnalyzing(false);
        }
      });
    } catch (error) {
      setAnalyzing(false);
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen p-6">
      <div className="flex justify-between items-center gap-4 mb-10">
        <h1 className="text-2xl font-bold text-white">Instructions</h1>
        <div className="flex gap-4">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            disabled={instructions.length === 0}
            onClick={handleDecode}>
            {analyzing ? 'Analyzing' : 'Analyze'}
          </button>

          <button
            type="button"
            onClick={handleApprove}
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            Approve
          </button>
        </div>
      </div>

      {analyzeResult && (
        <div className="mb-10 border border-white rounded-xl p-4 text-base">
          <AIResult>{analyzeResult}</AIResult>
        </div>
      )}

      <div className="space-y-8">
        {instructions.map((item, idx) => (
          <InstructionItem key={idx} instruction={item} />
        ))}
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
