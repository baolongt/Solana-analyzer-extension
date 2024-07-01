/* eslint-disable react/no-deprecated */
import React from 'react';
import ReactDOM from 'react-dom';
import '@pages/popup/index.css';
import Popup from '@pages/popup/Popup';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
refreshOnUpdate('pages/popup');

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.querySelector('#app-container'),
);
