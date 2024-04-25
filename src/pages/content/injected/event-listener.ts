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
              chrome.storage.local.get('data', function (data) {
                console.log('Data retrieved from Chrome storage: ', data);
              });
            }
          },
        );
      }
    },
    false,
  );
}

void initEventListener();
