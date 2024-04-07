import {processEvents} from './process'

void (async () => {
  await processEvents(true)

  console.log('done')
})()
