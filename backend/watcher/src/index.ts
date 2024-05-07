import { Callback, Context, EventBridgeEvent, Handler, ScheduledHandler } from 'aws-lambda';

import * as C from './constants';
import { storeHoldings } from './holdings';
import { processEvent, scheduleEvents } from './process';

export const handler: Handler = async (event: any, context: Context, callback: Callback): Promise<void> => {
  // if the message is from EventBridge, it is an object that looks like {action: 'the-event'}
  const action: string | boolean = 'action' in event && event.action;
  // if the message is from SQS, event has a Records array of objects, each with a body field that is a stringified object
  const body: string | boolean = 'Records' in event && event.Records;

  if (action !== false) {
    // console.log(`action ${action}`)
    switch (action) {
      case C.FETCH_EVENTS_ACTION:
        await scheduleEvents();
        break;
      case C.STORE_HOLDINGS_ACTION:
        await storeHoldings();
        break;
      default:
        console.error(`Unknown action ${action}`);
    }
  }
  else if (body !== false) {
    console.log(`records count: ${event.Records.length}`);

    try {
      for (const record of event.Records) {
        const parsed = JSON.parse(record.body as string);

        if ('action' in parsed && parsed.action === C.PROCESS_PACKAGE_ACTION && 'contract' in parsed) {
          await processEvent(parsed.contract);
        }
        else {
          console.error('Unknown body', parsed);
        }
      }
    }
    catch (e) {
      console.error('Error parsing body', e);
    }
  }
  else {
    console.log('nothing to do');
  }
  console.info('done');
};
