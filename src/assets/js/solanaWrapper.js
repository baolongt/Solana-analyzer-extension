// eslint-disable-next-line @typescript-eslint/no-unused-vars
const originalSignAndSendTransaction = window.solana.signAndSendTransaction;
const originalSignTransaction = window.solana.signTransaction;
window.solana.signAndSendTransaction = function (...args) {
  console.log('Injecting code before signing transactions:', args);

  const message = {
    type: 'SIGN_AND_SEND_TRANSACTION',
    data: args,
  };

  // Send the message
  window.postMessage(message, '*');

  // Create a promise that resolves when the event is triggered
  const promise = new Promise((resolve, reject) => {
    try {
      window.addEventListener('message', async function (event) {
        // We only accept messages from ourselves
        if (event.source != window) return;

        if (event.data.type && event.data.type == 'APPROVE_SIGN_AND_SEND_TRANSACTION') {
          console.log('Received approve', event.data.data);
          const result = await originalSignAndSendTransaction(...args);
          console.log('Injecting code after signing transactions:', result);
          // Resolve the promise
          resolve(result);
        } else if (event.data.type && event.data.type == 'REJECT_SIGN_AND_SEND_TRANSACTION') {
          reject('No approve message received');
        }
      });
    } catch (e) {
      console.log('Error', e);
      reject(e);
    }
  });

  console.log('sent message');

  // Return the promise
  return promise;
};

window.solana.signTransaction = function (...args) {
  console.log('Injecting code before signing transactions:', args);

  const message = {
    type: 'SIGN_TRANSACTION',
    data: args,
  };

  // Send the message
  window.postMessage(message, '*');

  // Create a promise that resolves when the event is triggered
  const promise = new Promise((resolve, reject) => {
    try {
      window.addEventListener('message', async function (event) {
        // We only accept messages from ourselves
        if (event.source != window) return;

        if (event.data.type && event.data.type == 'APPROVE_SIGN_TRANSACTION') {
          console.log('Received approve', event.data.data);
          const result = await originalSignTransaction(...args);
          console.log('Injecting code after signing transactions:', result);
          // Resolve the promise
          resolve(result);
        } else if (event.data.type && event.data.type == 'REJECT_SIGN_TRANSACTION') {
          reject('No approve message received');
        }
      });
    } catch (e) {
      console.log('Error', e);
      reject(e);
    }
  });

  console.log('sent message');

  // Return the promise
  return promise;
};

console.log('Injected code');
