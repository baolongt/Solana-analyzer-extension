import { decodeAndParseTransaction } from '@root/src/shared/lib/decode-tx';
import { storeDataAndEventType } from '.';
import { simulateTransaction } from '@root/src/shared/lib/simulateTransaction';

export const handleMessage = async message => {
  if (!message.data) {
    console.error('[Background] No data for this transaction');
    return;
  }

  try {
    await simulateTransaction(message.data);
    const parsedTx = await decodeAndParseTransaction(message.data);
    console.log('[Background] Parsed transaction:', parsedTx);
    if (parsedTx) {
      storeDataAndEventType(message.type, JSON.stringify(parsedTx), message.source);
    }
  } catch (error) {
    console.error('[Background]', error);
  }
};
