
import { setCursorPosition } from "./cursor";

export type Action = {
  'action': string,
  'timestamp': number,
}

export type Event = {
  'eventName': string,
  'eventTimestamp': number,
  'textDelta': string,
  'cursorRange': string,
  'currentDoc': string,
  'currentCursor': number,
  'currentSuggestion': string
}

const logs: Event[] = []

export function logEvent(eventName: string,
                          cursorIdx: number, 
                          textDelta='', 
                          cursorRange='') {
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
      'cursorRange': cursorRange,
      'currentDoc': '',
      'currentCursor': cursorIdx,
      'currentSuggestion': '',
    }  
    logs.push(log);
}

export function getLogs(): Event[] {
  return logs;
}

function showLog(replayLog: Event) {
  console.log(replayLog)
  try {
    switch(replayLog.eventName) {
      case process.env.SYSTEM_INITIALIZE:
        setText(replayLog.currentDoc);
        setCursorPosition(replayLog.currentCursor);
        break;
      case process.env.TEXT_INSERT:
        var ops = replayLog.textDelta.ops;
        quill.updateContents(ops);
        setCursorPosition(replayLog.currentCursor);
        break;
      case process.env.TEXT_DELETE:
        var ops = replayLog.textDelta.ops;
        quill.updateContents(ops);
        setCursorPosition(replayLog.eventSource, replayLog.currentCursor);
        break;
      case process.env.CURSOR_FORWARD:
        setCursorPosition(replayLog.eventSource, replayLog.currentCursor);
        break;
      case process.env.CURSOR_BACKWARD:
        setCursorPosition(replayLog.eventSource, replayLog.currentCursor);
        break;
      case process.env.CURSOR_SELECT:
        setCursorPosition(replayLog.eventSource, replayLog.currentCursor);
        break;
      case process.env.SUGGESTION_GET:
        // Spin icon to indicate loading
        showLoadingSignal();
        break;
      case process.env.SUGGESTION_ACCEPT:
        currentSuggestion = $('.dropdown-item.sudo-hover')
        $(currentSuggestion).removeClass('sudo-hover').addClass('sudo-click');
        break;
      case process.env.SUGGESTION_REGENERATE:
        // Spin icon to indicate loading
        showLoadingSignal();
        break;
      default:
        $('.dropdown-item').removeClass('sudo-hover');
        $('.dropdown-item').removeClass('sudo-click');
    }
  } catch (e) {
    console.log('Ignored error:', e);
  }
}