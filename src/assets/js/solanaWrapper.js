const originalSignAndSendTransaction = window.solana.signAndSendTransaction;
window.solana.signAndSendTransaction = async function (...args) {
  console.log('Injecting code before signing transactions:', args);

  const message = {
    type: 'SIGN_AND_SEND_TRANSACTION',
    data: args,
  };

  // Send the message
  window.postMessage(message, '*');

  //code to send message to open notification. This will eventually move into my extension logic
  await window.postMessage(args);

  console.log('sent message');

  return {
    signature: '',
  };

  // if (userInput) {
  //   const text = window.prompt('Please enter your text:');
  //   if (text !== null) {
  //     const result = originalSignAndSendTransaction.apply(this, args);
  //     console.log('Injecting code after signing transactions:', result);
  //     return result;
  //   }
  // } else throw new Error("user didn't confirm");
};

console.log('Injected code');
