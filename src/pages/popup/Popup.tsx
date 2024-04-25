import React, { useEffect, useState } from 'react';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);

  const [data, setData] = useState();

  useEffect(() => {
    chrome.storage.local.get('data', function (data) {
      console.log('Data retrieved from Chrome storage: ', data);

      if (data) {
        setData(data);
      }
    });
  }, []);

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <h1>{data ? JSON.stringify(data) : 'No Data'}</h1>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
