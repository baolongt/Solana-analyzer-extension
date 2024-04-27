import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/content/injected/event-listener');

function initEventListener() {
  window.addEventListener(
    'message',
    function (event) {
      // We only accept messages from ourselves
      if (event.source != window) return;

      if (event.data.type && event.data.type == 'SIGN_AND_SEND_TRANSACTION') {
        console.log('Received message: ', event.data.data);

        // Send a message to the background script
        chrome.runtime.sendMessage(
          {
            type: 'SIGN_AND_SEND_TRANSACTION',
            data: event.data.data,
          },
          function (response) {
            if (response && response === 'success') {
              console.log('sent to background successfull');
            }
          },
        );
      }
    },
    false,
  );

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'APPROVE_SIGN_AND_SEND_TRANSACTION') {
      console.log('Received message from background script:', message.data);

      // Forward the message to the DOM
      window.postMessage(message, '*');

      // Send a response back to the background script
      sendResponse({ status: 'Message forwarded to DOM' });
    }
  });
}

void initEventListener();
