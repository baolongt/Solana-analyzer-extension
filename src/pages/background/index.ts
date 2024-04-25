import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SIGN_AND_SEND_TRANSACTION') {
    console.log('Received message from content script:', message.data);
    //TODO: analyze the message and send a response back to the content script

    chrome.storage.local.set({ data: message.data }, function () {
      console.log('Data is stored in Chrome storage');

      chrome.windows.create({
        url: chrome.runtime.getURL('/src/pages/popup/index.html'),
        type: 'popup',
        width: 500,
        height: 600,
        focused: true,
      });
    });

    sendResponse('success');
  }

  return true;
});
