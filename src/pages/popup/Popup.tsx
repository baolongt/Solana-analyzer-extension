import React, { useEffect, useState } from 'react';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { analyzeArguments } from './analyzeArguments';
// import { analyzeArguments } from './analyzeArguments';

const Popup = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useStorage(exampleThemeStorage);
  const [response, setResponse] = useState<{
    isSafe?: boolean;
    message: string;
  }>({
    message: '',
  });

  const [data, setData] = useState<{
    type: string;
    data: unknown;
  } | null>();

  useEffect(() => {
    chrome.storage.local.get('event', function (data) {
      console.log('Data retrieved from Chrome storage: ', data);

      if (data) {
        setData(data.event);
        console.log('Data retrieved from Chrome storage: ', data);
      } else if (response) {
        setResponse(response);
        console.log('Response retrieved: ', response);
      }
    });
  }, []);

  const handleApprove = () => {
    chrome.runtime.sendMessage(
      {
        type: 'APPROVE_' + data.type,
        data: data.data,
      },
      function (response) {
        console.log('Received response:', response);
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
      function (response) {
        console.log('Received response:', response);
        window.close();
      },
    );
  };

  const handleDecode = () => {
    console.log('data', data);
    analyzeArguments(data.data);
  };

  return (
    <div className="flex grid grid-cols-2 gap-4 p-40 space-x-8 bg-cover page-container rounded-xl place-content-center">
      <div className="flex flex-col p-8 text-white select-none rounded-2xl pb-50 bg-slate-800 bg-cover bg-center p-10 w-full max-w-[100%] mx-auto page-container flex space-x-4 m-8 ml-2 text-xl ring ring-white ring-offset-2">
        <label htmlFor="Unsafe" className="py-4 m-20 mx-10 mt-10 px-7 rounded-2xl bg-primary">
          Safe
        </label>

        <h1 className="mx-8 my-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis culpa velit quibusdam, ex aperiam maiores
          itaque accusamus quasi facere! Iste qui minus repudiandae laborum sed numquam ea soluta libero ab!
        </h1>
        <div className="grid grid-cols-2 m-20 mx-10">
          <button className="py-4 mt-auto capitalize px-7 rounded-2xl bg-primary" onClick={() => handleReject()}>
            No
          </button>
          <button
            className="px-6 py-3 mx-3 ring ring-pink-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 rounded-2xl"
            onClick={() => handleApprove()}>
            Yes
          </button>
        </div>
      </div>

      <div className="flex flex-col max-m-full p-6 text-white select-none rounded-2xl pb-50 bg-slate-300 bg-cover bg-center p-10 w-full max-w-[100%] mx-auto page-container flex space-x-4 m-8 mr-4 text-xl ring ring-white ring-offset-2">
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
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
