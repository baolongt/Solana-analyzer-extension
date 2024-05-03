import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

const openPopup = () => {
  chrome.windows.create({
    url: chrome.runtime.getURL('/src/pages/popup/index.html'),
    type: 'popup',
    width: 592,
    height: 500,
    focused: true,
  });
};

const storeDataAndEventType = (type: string, data: unknown, source: string) => {
  chrome.storage.local.set(
    {
      event: {
        type,
        data,
        source,
      },
    },
    function () {
      openPopup();
    },
  );
};

const sendMessageToContentScripts = (type: string, data: unknown) => {
  chrome.tabs.query({ active: true, currentWindow: false }, function (tabs) {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(
        tab.id,
        {
          type,
          data,
        },
        function (response) {
          console.log('Received response from content script:', response);
        },
      );
    }
  });
};

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle the message
  if (message.type === 'SIGN_AND_SEND_TRANSACTION') {
    //TODO: analyze the message and send a response back to the content script
    storeDataAndEventType('SIGN_AND_SEND_TRANSACTION', message.data, message.source);
    sendResponse('success');
  }
  if (message.type === 'SIGN_TRANSACTION') {
    storeDataAndEventType('SIGN_TRANSACTION', message.data, message.source);
    sendResponse('success');
  }

  // Send a response back to the content script
  if (message.type === 'APPROVE_SIGN_AND_SEND_TRANSACTION') {
    sendMessageToContentScripts('APPROVE_SIGN_AND_SEND_TRANSACTION', message.data);
    sendResponse({ status: 'Message received' });
  }
  if (message.type === 'REJECT_SIGN_AND_SEND_TRANSACTION') {
    sendMessageToContentScripts('REJECT_SIGN_AND_SEND_TRANSACTION', message.data);
    sendResponse({ status: 'Message received' });
  }
  if (message.type === 'APPROVE_SIGN_TRANSACTION') {
    sendMessageToContentScripts('APPROVE_SIGN_TRANSACTION', message.data);
    sendResponse({ status: 'Message received' });
  }
  if (message.type === 'REJECT_SIGN_TRANSACTION') {
    sendMessageToContentScripts('REJECT_SIGN_TRANSACTION', message.data);
    sendResponse({ status: 'Message received' });
  }

  return true;
});
