import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/content/injected/event-listener');

const sendEventToBackground = (type: string, data: unknown, source: string) => {
  chrome.runtime.sendMessage(
    {
      type,
      data,
      source,
    },
    function (response) {
      console.log('Received response:', response);
    },
  );
};

async function initEventListener() {
  const settingsObj = await chrome.storage.sync.get('settings');
  console.log('in content script', settingsObj);

  if (settingsObj.settings && !settingsObj.settings.isStop) {
    window.addEventListener(
      'message',
      function (event) {
        // We only accept messages from ourselves
        if (event.source != window) return;

        if (event.data.type && event.data.type == 'SIGN_AND_SEND_TRANSACTION') {
          sendEventToBackground('SIGN_AND_SEND_TRANSACTION', event.data.data, event.data.source);
        }

        if (event.data.type && event.data.type == 'SIGN_TRANSACTION') {
          sendEventToBackground('SIGN_TRANSACTION', event.data.data, event.data.source);
        }
      },
      false,
    );

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log({
        sender,
        sendResponse,
      });

      if (message.type === 'APPROVE_SIGN_AND_SEND_TRANSACTION') {
        window.postMessage(message, '*');
      }
      if (message.type === 'REJECT_SIGN_AND_SEND_TRANSACTION') {
        window.postMessage(message, '*');
      }
      if (message.type === 'APPROVE_SIGN_TRANSACTION') {
        window.postMessage(message, '*');
      }
      if (message.type === 'REJECT_SIGN_TRANSACTION') {
        window.postMessage(message, '*');
      }
    });
  }
}

void initEventListener();
