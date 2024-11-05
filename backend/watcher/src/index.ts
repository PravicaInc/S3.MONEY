import { Callback, Context, EventBridgeEvent, Handler, SQSEvent } from 'aws-lambda';

import * as C from './constants';
import { storeHoldings } from './holdings';
import { processEvent, scheduleEvents } from './process';

type EventType = EventBridgeEvent<'action', string> | SQSEvent

function isEventBridgeEvent(event: EventType): event is EventBridgeEvent<'action', string> {
  return 'action' in event;
}

function isSQSEvent(event: EventType): event is SQSEvent {
  return 'Records' in event;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler: Handler = async (event: EventType, context: Context, callback: Callback): Promise<void> => {
  // if the message is from EventBridge, it is an object that looks like {action: 'the-event'}
  let action: string;

  if (isEventBridgeEvent(event)) {
    action = event['action'];
  }
  else {
    action = '';
  }

  if (action !== '') {
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
  else if (isSQSEvent(event)) {
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
