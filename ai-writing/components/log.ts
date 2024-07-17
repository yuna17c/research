export type Action = {
  'action': string,
  'timestamp': number,
}

export type Event = {
  'eventName': string,
  'eventTimestamp': number,
  'textDelta': string,
  'currentCursor': number
}

const logs: Event[] = []

// Create an event and save it to a list
export function logEvent(eventName: string, cursorIdx: number, textDelta='') {
    if (eventName.length == 0) {
      console.log("Wrong event name.")
      return;
    }
    if (eventName == process.env.SKIP) {
      return;
    }
    let log = {
      'eventName': eventName,
      'eventTimestamp': Date.now(),
      'textDelta': textDelta,
      'currentCursor': cursorIdx
    }  
    logs.push(log);
}

export function getLogs(): Event[] {
  return logs;
}
