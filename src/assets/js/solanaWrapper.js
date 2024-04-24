const originalSignAndSendTransaction = window.solana.signAndSendTransaction;
window.solana.signAndSendTransaction = function (...args) {
  console.log('Injecting code before signing transactions:', args);

  const userInput = window.confirm('Do you want to proceed?');

  if (userInput) {
    const text = window.prompt('Please enter your text:');
    if (text !== null) {
      const result = originalSignAndSendTransaction.apply(this, args);
      console.log('Injecting code after signing transactions:', result);
      return result;
    }
  } else throw new Error("user didn't confirm");
};

console.log('Injected code');
