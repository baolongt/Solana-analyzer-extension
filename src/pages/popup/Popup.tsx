import React, { useEffect, useState } from 'react';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { analyzeArguments } from './analyzeArguments';

const Popup = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useStorage(exampleThemeStorage);
  const [response, setResponse] = useState<{
    isSafe?: boolean;
    message: string;
  }>(null);

  const [data, setData] = useState<{
    type: string;
    data: unknown;
    source: string;
  } | null>();

  useEffect(() => {
    chrome.storage.local.get('event', async function (d) {
      if (d) {
        setData(d.event);
        const { data, source } = d.event;
        const res = await analyzeArguments(data, source);
        setResponse(res);
      }
    });
  }, []);

  const handleApprove = () => {
    chrome.runtime.sendMessage(
      {
        type: 'APPROVE_' + data.type,
        data: data.data,
      },
      function (res) {
        console.log('Received response:', res);
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
      function (res) {
        console.log('Received response:', res);
        window.close();
      },
    );
  };

  // const handleDecode = () => {
  //   analyzeArguments(data.data, data.source);
  // };

  return response ? (
    <div className="flex h-full height place-content-center">
      <div className="w-full flex flex-col text-white select-none  bg-slate-800 bg-cover bg-center p-10 w-full page-container space-x-4 m-8 text-xl ring ring-white ring-offset-2">
        {response.isSafe ? (
          <label htmlFor="safe" className="text-center p-4 mx-8 rounded-2xl bg-[#352F44] text-[#DBD8E3]">
            ✅ Safe
          </label>
        ) : (
          <label htmlFor="unsafe" className="text-center p-4 mx-8 rounded-2xl bg-primary">
            ⚠ Unsafe
          </label>
        )}
        <h1 className="text-center mx-8 my-10 w-full">{response.message}</h1>
        <div className="mx-8 w-full flex justify-center mb-5">
          <button className="underline-offset-8 text-yellow-400" onClick={() => handleReject()}>
            Report
          </button>
        </div>
        <div className="mx-8 w-full flex justify-center">
          <button className="py-4 mt-auto capitalize px-20 rounded-2xl bg-primary" onClick={() => handleReject()}>
            No
          </button>
          <button
            className="px-20 py-3 mx-3 ring ring-pink-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 rounded-2xl"
            onClick={() => handleApprove()}>
            Yes
          </button>
        </div>
      </div>

      {/* <div className="flex flex-col max-m-full p-6 text-white select-none rounded-2xl pb-50 bg-slate-300 bg-cover bg-center p-10 w-full max-w-[100%] mx-auto page-container flex space-x-4 m-8 mr-4 text-xl ring ring-white ring-offset-2">
        <label htmlFor="Unsafe" className="py-4 m-20 mx-10 mt-10 px-7 rounded-2xl bg-[#352F44] text-[#DBD8E3]">
          Unsafe
        </label>
        <h1 className="mx-8 my-10 text-[#352F44]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis culpa velit quibusdam, ex aperiam maiores
          itaque accusamus quasi facere! Iste qui minus repudiandae laborum sed numquam ea soluta libero ab!
        </h1>
        <div className="grid grid-cols-2 m-20 mx-10">
          <button className="py-4 mt-auto capitalize px-7 rounded-2xl bg-[#352F44]" onClick={() => handleReject()}>
            No
          </button>
          <button
            className="px-6 py-3 mx-3 ring ring-[#161518] ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 rounded-2xl text-[#352F44]"
            onClick={() => handleDecode()}>
            Decode
          </button>
        </div>
      </div> */}
    </div>
  ) : (
    <div className="flex h-full height place-content-center mt-52">
      <div role="status">
        <svg
          aria-hidden="true"
          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
