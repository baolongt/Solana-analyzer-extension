export async function injectScript(src) {
  const settingsObj = await chrome.storage.sync.get('settings');
  console.log('in content script', settingsObj);

  if (settingsObj.settings && !settingsObj.settings.isStop) {
    console.log('logic true');
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(src);
    s.type = 'module'; // <-- Add this line for ESM module support
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
  }
}

injectScript('../../../assets/js/solanaWrapper.js');
