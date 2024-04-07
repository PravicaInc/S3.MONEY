import {SQSEvent, Context, SQSHandler} from 'aws-lambda'

import {processEvents} from './process'

export const handler: SQSHandler = async (event: SQSEvent, context: Context): Promise<void> => {
  console.log(event.Records);
  await processEvents(true);
  // for (const message of event.Records) {
  //   await processEvents(message)
  // }
  console.info('done')
}
