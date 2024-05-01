import React, { useEffect, useState } from 'react';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
// import { analyzeArguments } from './analyzeArguments';

const Popup = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useStorage(exampleThemeStorage);

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

  // const handleDecode = () => {
  //   console.log('data', data);
  //   analyzeArguments(data.data);
  // };

  return (
    <div className="content">
      {/* <h1 className='data'>{data ? JSON.stringify(data) : 'No Data'}</h1> */}
      <h1>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam fugiat ab architecto similique et optio ipsum,
        repudiandae vitae molestias! At natus dignissimos molestiae, error eligendi vitae minus. Saepe, ducimus totam.
      </h1>
      <div className="button-container">
        <button className="button no" onClick={() => handleReject()}>
          No
        </button>
        <button className="button yes" onClick={() => handleApprove()}>
          Yes
        </button>
        {/* <button className="button decode" onClick={() => handleDecode()}>Decode</button> */}
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
