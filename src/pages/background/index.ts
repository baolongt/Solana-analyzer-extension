import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import { handleMessage } from './handleMessage';

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
    width: 520,
    height: 670,
    focused: true,
  });
};

export const storeDataAndEventType = (type: string, data: unknown, source: string) => {
  chrome.storage.local.set(
    {
      event: {
        type,
        data,
        source,
      },
    },
    async function () {
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
chrome.runtime.onMessage.addListener(async message => {
  // Handle the message
  if (message.type === 'SIGN_AND_SEND_TRANSACTION') {
    //TODO: analyze the message and send a response back to the content script
    handleMessage(message);
  }
  if (message.type === 'SIGN_TRANSACTION') {
    handleMessage(message);
  }

  // Send a response back to the content script
  if (message.type === 'APPROVE_SIGN_AND_SEND_TRANSACTION') {
    sendMessageToContentScripts('APPROVE_SIGN_AND_SEND_TRANSACTION', message.data);
  }
  if (message.type === 'REJECT_SIGN_AND_SEND_TRANSACTION') {
    sendMessageToContentScripts('REJECT_SIGN_AND_SEND_TRANSACTION', message.data);
  }
  if (message.type === 'APPROVE_SIGN_TRANSACTION') {
    sendMessageToContentScripts('APPROVE_SIGN_TRANSACTION', message.data);
  }
  if (message.type === 'REJECT_SIGN_TRANSACTION') {
    sendMessageToContentScripts('REJECT_SIGN_TRANSACTION', message.data);
  }

  return true;
});

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'popup') {
    port.onDisconnect.addListener(function () {
      chrome.storage.local.get('event', async function (d) {
        console.log('current event', d);
        sendMessageToContentScripts('REJECT', {});

        chrome.storage.local.set(
          {
            event: null,
          },
          () => {
            console.log('cleared event');
          },
        );
      });
    });
  }
});
