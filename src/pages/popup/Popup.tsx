import React, { useEffect, useState } from 'react';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);

  const [data, setData] = useState<unknown>();

  useEffect(() => {
    chrome.storage.local.get('data', function (data) {
      console.log('Data retrieved from Chrome storage: ', data);

      if (data) {
        setData(data);
      }
    });
  }, []);

  const handleApprove = () => {
    chrome.runtime.sendMessage(
      {
        type: 'APPROVE_SIGN_AND_SEND_TRANSACTION',
        data,
      },
      function (response) {
        console.log('Received response:', response);
        window.close();
      },
    );
  };

  const handleReject = () => {
    window.close();
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <h1>{data ? JSON.stringify(data) : 'No Data'}</h1>
      <button onClick={() => handleReject()}>no</button>
      <button onClick={() => handleApprove()}>yes</button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
