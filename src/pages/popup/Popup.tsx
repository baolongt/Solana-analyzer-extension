import React, { useEffect, useState } from 'react';
import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { analyzeArguments } from './analyzeArguments';

const Popup = () => {
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
    <div className="App">
      <h1>{data ? JSON.stringify(data) : 'No Data'}</h1>
      <button onClick={() => handleReject()}>no</button>
      <button onClick={() => handleApprove()}>yes</button>
      <button onClick={() => handleDecode()}>decode</button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
