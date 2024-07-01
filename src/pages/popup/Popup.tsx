import React, { useEffect } from 'react';

import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import MainPage from './pages/Main';
import SettingsPage from './pages/Setting';
import { Page } from './types/page';
import Analyze from './pages/Analyze';

const Popup = () => {
  const [page, setPage] = React.useState<Page>(Page.MAIN_PAGE);

  useEffect(() => {
    chrome.storage.local.get('event', async function (d) {
      console.log('d', d);
      if (d && Object.keys(d).length > 0 && d.event) {
        setPage(Page.ANALYZE_PAGE);
        chrome.runtime.connect({ name: 'popup' });
      } else {
        setPage(Page.MAIN_PAGE);
      }
    });
  }, []);

  const handleChangePage = (page: Page) => {
    setPage(page);
  };

  switch (page) {
    case Page.MAIN_PAGE:
      return <MainPage handleChangePage={handleChangePage} />;
    case Page.SETTING_PAGE:
      return <SettingsPage handleChangePage={handleChangePage} />;
    case Page.ANALYZE_PAGE:
      return <Analyze />;
    default:
      return <Analyze />;
  }
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
