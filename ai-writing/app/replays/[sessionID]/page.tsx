"use client"

import "../../style_main.css";
import { GetServerSideProps } from 'next';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Event } from "@/components/log";
import { useEffect, useRef } from "react";
import { setCursorPosition } from "@/components/cursor";
import Head from "next/head";
import $ from 'jquery'
import { browserLocalPersistence } from "firebase/auth";

async function getDb(sessionID:string) {
  const q = query(collection(db, 'user-input'), where('timestamp', '==', sessionID));
  const snapshot = await getDocs(q)
  var tmpID = ""
  var tmpLogs: Event[] = []
  if (!snapshot.empty) {
    snapshot.forEach(doc => {
      tmpID = doc.id
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

  function replayEvent(replayLog: Event) {
    const editableDiv = editableDivRef.current!
    const suggestion = editableDiv.querySelector("span.suggestionText")!
    // const currentTxt = editableDiv.textContent!
    const currentTxt = $('div').contents()
    .filter(function() {
      return this.nodeType === 3;
    }).text()
    const suggestion_text = suggestion?.textContent
    const len = currentTxt.length
    // Log variables
    const txt = replayLog.textDelta
    const cursorPos = replayLog.currentCursor
    console.log("--", replayLog.eventName, txt, cursorPos)

    switch(replayLog.eventName) {
      case process.env.TEXT_INSERT:
        if (suggestion_text) {
          suggestion.textContent = ''
          suggestion.remove()
        }
        editableDiv.innerText = currentTxt.substring(0,cursorPos).concat(txt, currentTxt.substring(cursorPos))
        break
      case process.env.TEXT_DELETE:
        editableDiv.innerText = currentTxt.slice(0,-1)
        break
      case process.env.SUGGESTION_ACCEPT:
        suggestion.remove()
        editableDiv.innerText += suggestion_text
        break
      case process.env.SUGGESTION_GENERATE:
        editableDiv.innerHTML = `${currentTxt}<span class="suggestionText"">&nbsp;${txt}</span>`
        break
      case process.env.SUGGESTION_REGENERATE:
        suggestion.textContent = ' ' + txt
      case process.env.CURSOR_BACKWARD || process.env.CURSOR_FORWARD:
        setCursorPosition(cursorPos)
        break
    }
  }
  const sessionID = params.sessionID;
  console.log("ID: ", sessionID)
  // const doc = await getDb(sessionID);
  // console.log("doc", doc)
  const dummy_doc = [
    {
      cursorRange: '',
      textDelta: '',
      currentCursor: 0,
      eventTimestamp: 1721018418754,
      eventName: 'cursor-select',
      currentSuggestion: '',
      currentDoc: ''
    },
    {
      eventTimestamp: 1721018420111,
      cursorRange: '',
      currentSuggestion: '',
      currentDoc: '',
      textDelta: 'h',
      currentCursor: 0,
      eventName: 'text-insert'
    },
    {
      eventTimestamp: 1721018420240,
      cursorRange: '',
      currentSuggestion: '',
      currentDoc: '',
      textDelta: 'e',
      currentCursor: 1,
      eventName: 'text-insert'
    },
    {
      eventTimestamp: 1721018420316,
      currentDoc: '',
      currentCursor: 2,
      currentSuggestion: '',
      eventName: 'text-insert',
      cursorRange: '',
      textDelta: 'l'
    },
    {
      eventTimestamp: 1721018420473,
      currentDoc: '',
      cursorRange: '',
      currentCursor: 3,
      eventName: 'text-insert',
      textDelta: 'l',
      currentSuggestion: ''
    },
    {
      textDelta: 'o',
      eventTimestamp: 1721018420633,
      currentSuggestion: '',
      cursorRange: '',
      currentCursor: 4,
      eventName: 'text-insert',
      currentDoc: ''
    },
    {
      eventTimestamp: 1721018421348,
      currentSuggestion: '',
      eventName: 'text-insert',
      cursorRange: '',
      currentDoc: '',
      textDelta: '.',
      currentCursor: 5
    },
    {
      textDelta: 'I am eating ice cream.',
      eventTimestamp: 1721018421399,
      currentDoc: '',
      eventName: 'suggestion-generate',
      currentSuggestion: '',
      cursorRange: '',
      currentCursor: 6
    },
    {
      eventTimestamp: 1721018423508,
      eventName: 'suggestion-accept',
      textDelta: '',
      currentCursor: 6,
      currentDoc: '',
      cursorRange: '',
      currentSuggestion: ''
    }, {
      eventTimestamp: 1721018424247,
      currentDoc: '',
      cursorRange: '',
      eventName: 'text-insert',
      currentCursor: 29,
      currentSuggestion: '',
      textDelta: ' '
    },
    {
      eventName: 'text-insert',
      currentCursor: 30,
      currentSuggestion: '',
      currentDoc: '',
      eventTimestamp: 1721018426017,
      cursorRange: '',
      textDelta: 'n'
    },
    {
      currentDoc: '',
      eventTimestamp: 1721018426504,
      cursorRange: '',
      currentCursor: 31,
      textDelta: 'o',
      currentSuggestion: '',
      eventName: 'text-insert'
    },
    {
      currentCursor: 32,
      currentDoc: '',
      eventName: 'text-insert',
      eventTimestamp: 1721018427011,
      currentSuggestion: '',
      cursorRange: '',
      textDelta: 'o'
    },
    {
      currentDoc: '',
      currentSuggestion: '',
      cursorRange: '',
      currentCursor: 33,
      textDelta: '',
      eventName: 'text-delete',
      eventTimestamp: 1721018427505
    },
    {
      eventTimestamp: 1721018427742,
      textDelta: '',
      currentDoc: '',
      currentCursor: 32,
      currentSuggestion: '',
      cursorRange: '',
      eventName: 'text-delete'
    },
    {
      cursorRange: '',
      currentCursor: 31,
      eventTimestamp: 1721018429634,
      textDelta: 'a',
      eventName: 'text-insert',
      currentSuggestion: '',
      currentDoc: ''
    },
    {
      eventName: 'text-insert',
      currentCursor: 32,
      textDelta: 'h',
      currentSuggestion: '',
      currentDoc: '',
      eventTimestamp: 1721018429838,
      cursorRange: ''
    }, {
          currentCursor: 33,
          currentSuggestion: '',
          currentDoc: '',
          eventName: 'cursor-backward',
          textDelta: '',
          eventTimestamp: 1721018430835,
          cursorRange: ''
        },
        {
          currentSuggestion: '',
          currentDoc: '',
          textDelta: '',
          eventTimestamp: 1721018431119,
          eventName: 'cursor-backward',
          currentCursor: 32,
          cursorRange: ''
        },
        {
          currentSuggestion: '',
          textDelta: '',
          eventName: 'cursor-backward',
          currentCursor: 31,
          currentDoc: '',
          cursorRange: '',
          eventTimestamp: 1721018431457
        },
        {
          currentSuggestion: '',
          eventTimestamp: 1721018432533,
          currentDoc: '',
          eventName: 'text-insert',
          currentCursor: 30,
          cursorRange: '',
          textDelta: 'h'
        }, 
        {
            textDelta: 'e',
            eventTimestamp: 1721018432681,
            currentDoc: '',
            currentSuggestion: '',
            cursorRange: '',
            currentCursor: 31,
            eventName: 'text-insert'
          },
          {
            currentCursor: 32,
            eventTimestamp: 1721018432758,
            currentSuggestion: '',
            currentDoc: '',
            eventName: 'text-insert',
            cursorRange: '',
            textDelta: 'l'
          },
          {
            currentDoc: '',
            cursorRange: '',
            textDelta: 'l',
            eventName: 'text-insert',
            currentCursor: 33,
            currentSuggestion: '',
            eventTimestamp: 1721018432911
          },
          {
            currentSuggestion: '',
            cursorRange: '',
            textDelta: ' ',
            eventName: 'text-insert',
            currentCursor: 34,
            eventTimestamp: 1721018433283,
            currentDoc: ''
          },
          {
            eventName: 'cursor-forward',
            textDelta: '',
            currentSuggestion: '',
            cursorRange: '',
            currentDoc: '',
            currentCursor: 35,
            eventTimestamp: 1721018433845
          },
          {
            currentSuggestion: '',
            textDelta: '',
            currentCursor: 36,
            eventName: 'cursor-forward',
            cursorRange: '',
            eventTimestamp: 1721018434040,
            currentDoc: ''
          },
          {
            eventName: 'cursor-forward',
            currentSuggestion: '',
            cursorRange: '',
            currentDoc: '',
            eventTimestamp: 1721018434227,
            currentCursor: 37,
            textDelta: ''
          },
          {
            currentCursor: 38,
            currentSuggestion: '',
            eventTimestamp: 1721018435267,
            cursorRange: '',
            currentDoc: '',
            eventName: 'text-insert',
            textDelta: '.'
          },
          {
            cursorRange: '',
            currentCursor: 39,
            eventTimestamp: 1721018435299,
            textDelta: 'I am eating ice cream.',
            currentDoc: '',
            currentSuggestion: '',
            eventName: 'suggestion-generate'
          }, 
          {
            cursorRange: '',
            currentCursor: 39,
            eventTimestamp: 1721018435799,
            textDelta: 'YOYOYOYO.',
            currentDoc: '',
            currentSuggestion: '',
            eventName: 'suggestion-regenerate'
          }, 
          {
            cursorRange: '',
            currentCursor: 40,
            eventTimestamp: 1721018436499,
            textDelta: ' ',
            currentDoc: '',
            currentSuggestion: '',
            eventName: 'text-insert'
          },
          // {
          //   cursorRange: '',
          //   currentCursor: 41,
          //   eventTimestamp: 1721018437099,
          //   textDelta: 'Y',
          //   currentDoc: '',
          //   currentSuggestion: '',
          //   eventName: 'text-insert'
          // }
  ]

  var prevTime = dummy_doc[0].eventTimestamp;
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
    editableDivRef.current!.innerText = ''
    for (const log of dummy_doc) {
      const currTime = log.eventTimestamp
      const waitTime = currTime-prevTime
      prevTime = currTime
      await sleep(waitTime)
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
      <button className='startButton' ref={button} onClick={startReplay}>Start</button>
          
    </main>
    </>
  )
}
