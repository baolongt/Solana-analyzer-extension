import { useEffect, useState } from 'react';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { AIResponseText, Loading } from '../components';
import Instruction from '../components/Intruction';
import { OpenRouterService } from '../services/openAiService';
import { buildPrompt } from '../utils';
import { initFlowbite } from 'flowbite';
import { enrichTransaction } from '@root/src/shared/lib/enrichTransaction';

const Analyze = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [intructions, setInstructions] = useState<
    {
      programId: string;
      name: string;
      detail: Record<string, unknown> | null;
      isBlackListed: boolean;
    }[]
  >([]);
  const [analyzeResponse, setAnalyzeResponse] = useState<string | null>('');
  const [isAskingAI, setIsAskingAI] = useState<boolean>(false);

  const [data, setData] = useState<{
    type: string;
    data: unknown;
    source: string;
  } | null>();

  useEffect(() => {
    initFlowbite();
    chrome.storage.local.get('event', async function (d) {
      if (d) {
        setData(d.event);
        const { data } = d.event;
        const enrichTrans = await enrichTransaction(JSON.parse(data));
        // const intructions = await analyzeArguments(data);
        setInstructions(enrichTrans);
      }
    });
  }, []);

  const handleApprove = () => {
    chrome.runtime.sendMessage(
      {
        type: 'APPROVE_' + data.type,
        data: data.data,
      },
      function () {
        window.close();
      },
    );
  };

  const handleReject = () => {
    chrome.runtime.sendMessage(
      {
        type: 'REJECT_' + data.type,
        data: data.data,
      },
      function () {
        chrome.storage.local.remove('event');
        window.close();
      },
    );
  };

  const handleAnalyze = async () => {
    setIsAskingAI(true);
    chrome.storage.local.get('event', async function (d) {
      if (d) {
        const { source } = d.event;

        let res = '';

        await OpenRouterService.getInstance().analyzeArguments(
          buildPrompt({
            intructionList: intructions,
            source,
          }),
          chunk => {
            res += chunk;
            setAnalyzeResponse(res);
          },
        );

        setIsAskingAI(false);
      }
    });
  };

  const onClickAccordion = () => {};

  return (
    <div className="popup flex w-full flex-col min-h-screen py-12">
      <div id="accordion-collapse" data-accordion="collapse">
        <h2 id="accordion-collapse-heading-1">
          <button
            type="button"
            className="flex items-center justify-between w-full p-5 font-medium rtl:text-right bg-gray-700 text-white rounded-t-xl gap-3"
            data-accordion-target="#accordion-collapse-body-1"
            onClick={onClickAccordion}
            aria-expanded="true"
            aria-controls="accordion-collapse-body-1">
            <span className="text-base">Instructions</span>
            <svg
              data-accordion-icon
              className="w-3 h-3 rotate-180 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
        </h2>
        <div id="accordion-collapse-body-1" className="hidden" aria-labelledby="accordion-collapse-heading-1">
          <div className="mx-auto flex flex-col items-center justify-center text-white text-base bg-gray-700">
            {intructions.length > 0 ? (
              <>
                {intructions.map((instruction, index) => (
                  <Instruction key={index} instruction={instruction} index={index} />
                ))}
              </>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col w-full gap-4">
        {analyzeResponse ? (
          <div className="flex justify-start text-pretty p-5">
            <div className="mx-auto px-1">
              <div className="text-black text-base">
                <AIResponseText content={analyzeResponse} />
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <button
          className="w-full px-4 py-2 bg-gray-700 text-base text-white rounded shadow hover:bg-gray-600"
          onClick={() => handleAnalyze()}>
          {isAskingAI ? <Loading /> : <>Analyze</>}
        </button>
      </div>
      <div className="mt-2 flex justify-between w-full gap-4">
        <button
          className="w-4/12 px-4 py-2 bg-gray-700 text-base text-white rounded shadow hover:bg-gray-600"
          onClick={() => handleReject()}>
          Reject
        </button>
        <button
          className="w-8/12 px-4 py-2 bg-green-500 text-white text-base text-white rounded shadow hover:bg-green-700"
          onClick={() => handleApprove()}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Analyze, <div> Loading ... </div>), <div> Error Occur </div>);
