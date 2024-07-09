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
          className="w-full px-4 py-2 bg-gray-500 text-base text-white rounded shadow hover:bg-gray-600"
          onClick={() => handleAnalyze()}>
          {isAskingAI ? <Loading /> : <>Analyze</>}
        </button>
      </div>
      <div className="mt-2 flex justify-between w-full gap-4">
        <button
          className="w-4/12 px-4 py-2 bg-gray-500 text-base text-white rounded shadow hover:bg-gray-600"
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

  // return response ? (
  //   <div className="flex items-center justify-center">
  //     <div className="flex justify-center">
  //       <button
  //         className="mt-4 px-4 py-2 bg-white text-zinc-950 text-xl text-white rounded shadow hover:bg-slate-100"
  //         onClick={() => handleReject()}>
  //         No
  //       </button>
  //       <button
  //         className="mt-4 px-4 py-2 bg-white text-zinc-950 text-xl text-white rounded shadow hover:bg-slate-100"
  //         onClick={() => handleApprove()}>
  //         Yes
  //       </button>
  //     </div>
  //   </div>
  // ) : (
  //   <div className="flex items-center justify-center">
  //     <div role="status">
  //       <svg
  //         aria-hidden="true"
  //         className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
  //         viewBox="0 0 100 101"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg">
  //         <path
  //           d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
  //           fill="currentColor"
  //         />
  //         <path
  //           d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
  //           fill="currentFill"
  //         />
  //       </svg>
  //       <span className="sr-only">Loading...</span>
  //     </div>
  //   </div>
  // );
};

export default withErrorBoundary(withSuspense(Analyze, <div> Loading ... </div>), <div> Error Occur </div>);
