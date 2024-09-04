"use client"

import "../../style_main.css";
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Event } from "@/components/log";
import { useRef } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";

async function getDb(id: string, param: string) {
  // Get logs of the requested ID
  console.log(id)
  const docRef = doc(collection(db, 'user-input'), id);
  const docSnap = await getDoc(docRef);
  console.log(docSnap)
  if (docSnap.exists()) {
    var tmpLogs = docSnap.data().logs
  } else {
    console.log("Requested session does not exist.")
    alert("Failed to get session.")
    return null
  }
  if (param==='1') return tmpLogs.task1
  return tmpLogs.task2
}

export default async function SessionReplay( { params }:any) {
  const editableDivRef = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const printable_keys = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?")
  const param = params.sessionID.split('-');
  const sessionID = param[0]
  const taskNum= param[1]
  const doc = await getDb(sessionID, taskNum);
  var prevTime = doc![0].eventTimestamp;
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

  function replayEvent(replayLog: Event) {
    const editableDiv = editableDivRef.current!
    const suggestion = editableDiv.querySelector("span.suggestionText")!
    const suggestion_text = suggestion?.textContent
    // Log variables
    const txt = replayLog.textDelta
    const cursorPos = replayLog.currentCursor
    const len = editableDiv.innerHTML.split('<br>').length-1
    const i = cursorPos+4*len

    switch(replayLog.eventName) {
      case process.env.TEXT_INSERT:
        if (suggestion_text) {
          suggestion.textContent = ''
          suggestion.remove()
        }
        if (printable_keys.has(txt) || txt===" ") {
          editableDiv.innerHTML = editableDiv.innerHTML.substring(0,i).concat(txt, editableDiv.innerHTML.substring(i))
        } else if (txt=="\n") {
          console.log("newline", editableDiv.innerHTML, ", adding", txt.replace(/\n/g, '<br>'))
          editableDiv.innerHTML += txt.replace(/\n/g, '<br>');
          console.log(editableDiv.innerHTML)
        }
        break
      case process.env.TEXT_DELETE:
        editableDiv.innerHTML = editableDiv.innerHTML.slice(0,i-1) + editableDiv.innerHTML.slice(i)
        break
      case process.env.SUGGESTION_ACCEPT:
        suggestion.remove()
        addToLastDiv(editableDiv, suggestion?.innerHTML, false)
        break
      case process.env.SUGGESTION_GENERATE:
        const responseLines = txt.replace(/\n/g, '<br>');
        addToLastDiv(editableDiv, responseLines, true)
        break
      case process.env.SUGGESTION_REGENERATE:
        suggestion.remove()
        addToLastDiv(editableDiv, txt, true)
      case process.env.SUGGESTION_CLOSE:
        suggestion.remove()
    }
  }
  
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
    for (const log of doc!) {
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
      <h2>Task: {taskNum}</h2>
      <div className="container">
        <div className='inputContainer'>
              <div id="editableDiv"
                className="inputBox"
                ref={editableDivRef}>
              </div>
        </div>
      </div>
      <button className='submit-button' id='session-button' ref={button} onClick={startReplay}>Start</button>
    </main>
    </>
  )
}
