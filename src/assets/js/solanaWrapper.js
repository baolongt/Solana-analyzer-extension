// eslint-disable-next-line @typescript-eslint/no-unused-vars
const originalSignAndSendTransaction = window.solana.signAndSendTransaction;
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
    window.addEventListener(
      'message',
      async function (event) {
        // We only accept messages from ourselves
        if (event.source != window) return;

        if (event.data.type && event.data.type == 'APPROVE_SIGN_AND_SEND_TRANSACTION') {
          console.log('Received approve', event.data.data);
          const result = await originalSignAndSendTransaction(...args);
          console.log('Injecting code after signing transactions:', result);
          // Resolve the promise
          resolve(result);
        }
      },
      false,
    );
  });

  console.log('sent message');

  // Return the promise
  return promise;
};

console.log('Injected code');
