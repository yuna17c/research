"use client"

import "../../style_main.css";
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Event } from "@/components/log";
import { useRef } from "react";
import { setCursorPosition } from "@/components/cursor";
import $ from 'jquery'

async function getDb(sessionID: string) {
  // Get logs of the requested session ID
  const q = query(collection(db, 'user-input'), where('timestamp', '==', sessionID));
  const snapshot = await getDocs(q)
  var tmpLogs: Event[] = []
  if (!snapshot.empty) {
    snapshot.forEach(doc => {
      tmpLogs = doc.data().logs
    });
  } else {
    console.log("Requested session does not exist.")
  }
  return tmpLogs
}

export default async function SessionReplay( { params }:any) {
  const editableDivRef = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const printable_keys = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?")
  const addToLastDiv = (divRef: HTMLDivElement, addText: string|undefined, isSuggestion: boolean) => {
    if (divRef) {
        const divs = divRef.querySelectorAll('div');
        const lastDiv = divs[divs.length - 1];
        const span = isSuggestion ? `<span class="suggestionText">${addText}</span>` : `${addText}`
        if (lastDiv) {
            lastDiv.innerHTML+=span;
        } else {
            divRef.innerHTML+=span;
        }
      }
  }

  function findIdx(htmlString: string, idx: number): number {
    let charIndex = 0;
    let i = 0;
    while (i < htmlString.length && charIndex < idx) {
        if (htmlString[i] === '<') {
            while (i < htmlString.length && htmlString[i] !== '>') {
                i++;
            }
            i++;
        } else {
            charIndex++;
            i++;
        }
    }
    return i
  }

  function replayEvent(replayLog: Event) {
    const editableDiv = editableDivRef.current!
    const suggestion = editableDiv.querySelector("span.suggestionText")!
    // const currentTxt = $('div').contents()
    // .filter(function() {
    //   return this.nodeType === 3;
    // }).text()
    const suggestion_text = suggestion?.textContent
    // Log variables
    const txt = replayLog.textDelta
    const cursorPos = replayLog.currentCursor
    console.log(editableDiv.innerHTML)

    switch(replayLog.eventName) {
      case process.env.TEXT_INSERT:
        if (suggestion_text) {
          suggestion.textContent = ''
          suggestion.remove()
        }
        if (printable_keys.has(txt) || txt===" ") { 
          const i = findIdx(editableDiv.innerHTML, cursorPos)
          editableDiv.innerHTML = editableDiv.innerHTML.substring(0,i).concat(txt, editableDiv.innerHTML.substring(i))
        }
        break
      case process.env.TEXT_DELETE:
        const i = findIdx(editableDiv.innerHTML, cursorPos-1)
        editableDiv.innerHTML = editableDiv.innerHTML.slice(0,i) + editableDiv.innerHTML.slice(i+1)
        // editableDiv.textContent = currentTxt.slice(0,-1)
        break
      case process.env.SUGGESTION_ACCEPT:
        suggestion.remove()
        addToLastDiv(editableDiv, suggestion?.innerHTML, false)
        break
      case process.env.SUGGESTION_GENERATE:
        const responseLines = txt.replace(/\n/g, '<br>');
        addToLastDiv(editableDiv, responseLines, true)
        // editableDiv.innerHTML = `${editableDiv.innerHTML}<span class="suggestionText"">${txt}</span>`
        break
      case process.env.SUGGESTION_REGENERATE:
        // suggestion.textContent = ' ' + txt
        suggestion.remove()
        addToLastDiv(editableDiv, txt, true)
      case process.env.CURSOR_BACKWARD || process.env.CURSOR_FORWARD:
        // setCursorPosition(cursorPos)
        break
    }
  }
  const sessionID = params.sessionID;
  const doc = await getDb(sessionID);
  var prevTime = doc[0].eventTimestamp;
  function sleep(duration:number) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }

  const startReplay = async () => {
    const suggestion = editableDivRef.current!.querySelector("span.suggestionText")
    button.current!.disabled = true
    if (suggestion) {
      suggestion.remove()
    }
    editableDivRef.current!.textContent = ''
    for (const log of doc) {
      const currTime = log.eventTimestamp
      const waitTime = currTime-prevTime
      prevTime = currTime
      await sleep(waitTime/3) 
      replayEvent(log)
    }
    button.current!.disabled = false;
  }

  return (
    <>
    <main>
      <h1>Replay session {sessionID}</h1>
      <div className='inputContainer'>
            <div id="editableDiv"
              className="inputBox"
              ref={editableDivRef}>
            </div>
      </div>
      <button className='submit-button' id='session-button' ref={button} onClick={startReplay}>Start</button>
    </main>
    </>
  )
}
