import { decodeAndParseTransaction } from '@root/src/shared/lib/decode-tx';
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
    width: 600,
    height: 800,
    focused: true,
  });
};

// openPopup();

const storeDataAndEventType = async (type: string, data: unknown, source: string) => {
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
  console.log('[background] SIGN_AND_SEND_TRANSACTION: ', message);
  // Handle the message
  if (message.type === 'SIGN_AND_SEND_TRANSACTION') {
    //TODO: analyze the message and send a response back to the content script
    handleMessage(message, sender);
    // storeDataAndEventType('SIGN_AND_SEND_TRANSACTION', message.data, message.source);
    sendResponse('success');
  }
  if (message.type === 'SIGN_TRANSACTION') {
    handleMessage(message, sender);
    // storeDataAndEventType('SIGN_TRANSACTION', message.data, message.source);
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

const handleMessage = async (message, sender) => {
  console.log('[handleMessage] message', message);
  if (!message.data) {
    console.error('[Background] No data for this transaction');
    return;
  }

  try {
    const parsedTx = await decodeAndParseTransaction(message.data);
    if (parsedTx) {
      storeDataAndEventType(message.type, JSON.stringify(parsedTx), message.source);
    }
  } catch (error) {
    console.error('[Background]', error);
  }
};
