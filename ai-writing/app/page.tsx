"use client"

import "./style_main.css";
import Head from "next/head";
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection } from "firebase/firestore";
import React, { useRef } from "react"
import $ from 'jquery'
import { setCursorPosition, getCursorPosition } from "@/components/cursor"
import { logEvent, getLogs, Action } from "@/components/log";

require('dotenv').config({path: '../.env'});

export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const editableDivRef = useRef<HTMLDivElement>(null);
  const userActions: Action[] = [];
  const actionNums: { [key:string]:number } = {'Generate':0, 'Accept':0, 'Regenerate':0, 'Ignore':0}
  const printable_keys = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?")
  let spaceBarTimer: NodeJS.Timeout | null = null;
  const [isTypingDisabled, setIsTypingDisabled] = useState(false);

  // Call API to generate suggestion from OpenAI model and move the cursor to cursorPosition
  const handleGenerate = async (cursorPosition: number, eventName: string) => {
    // Get prompt excluding the suggestion.
    const prompt = $('div').contents()
    .filter(function() {
      return this.nodeType === 3;
    }).text()
    console.log("sent", prompt)
    if (prompt) {
      try {
        // Get response from API
        const response = await fetch("/api/generate?prompt="+encodeURIComponent(prompt))
        const body = await response.json();
        console.log("response:", body.response)
        // Add the response to the page as a suggestion
        if (body.response) {
          const editableDiv = editableDivRef.current!;
          editableDiv.innerHTML = `${prompt}<span class="suggestionText"">${body.response}</span>`;
          console.log(cursorPosition)
          setCursorPosition(cursorPosition);
          logEvent(eventName, cursorPosition, body.response)
        }
      } catch(error) {
        console.error(error)
      }
    }
  }

  // Update the logs
  function update(key: string) {
    userActions.push({'action':key, 'timestamp':Date.now()})
    actionNums[key]+=1
  }

  const handleSpaceBarAction = () => {
    console.log("generating suggestion")
    const cursorPos = getCursorPosition()
    logEvent("text-insert", cursorPos, ' ')
    handleGenerate(cursorPos, "suggestion-generate");
    update("Generate")
  };

  useEffect(() => {
    // Handles keyboard actions
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingDisabled) {
        e.preventDefault();
        return;
      }
      const prompt = editableDiv.innerText
      const suggestion = editableDiv.querySelector("span.suggestionText")
      const suggestion_text = suggestion?.textContent
      const cursorPos = getCursorPosition()
      console.log('prompt: ', prompt, ' suggestion: ', suggestion)
      if (suggestion_text) {
        if (e.key=="ArrowRight") {
          // Accept suggestion
          e.preventDefault()
          console.log("accepted")
          suggestion.remove()
          editableDiv.innerText+=suggestion_text
          setCursorPosition(cursorPos+suggestion_text.length)
          update("Accept")
          logEvent("suggestion-accept", cursorPos)
        } else if (e.key=='Tab') {
          // Regenerate suggestion
          e.preventDefault();
          console.log('regenerating...')
          handleGenerate(cursorPos, "suggestion-regenerate");
          update("Regenerate")
        } else if (printable_keys.has(e.key) || e.key===" " || e.key==="Backspace") {
          // Continue writing removes suggestions
          suggestion.remove()
          update("Ignore")
          logEvent("text-insert", cursorPos, e.key)
        }
      } else if (e.key==' ') {
        // Space bar generates suggestion if waited more than a 1.5 second
        if (spaceBarTimer) {
          clearTimeout(spaceBarTimer);
        }
        spaceBarTimer = setTimeout(() => {
          e.preventDefault();
          handleSpaceBarAction();
        }, 3000);
      } else if (spaceBarTimer) {
          clearTimeout(spaceBarTimer);
          spaceBarTimer = null;
      } else if (e.key=="ArrowRight") {
        logEvent("cursor-forward", cursorPos)
      } else if (e.key=="Tab") {
        console.log("tabbed:", suggestion_text)
      } else if (e.key=='ArrowLeft') {
        logEvent("cursor-backward", cursorPos)
      } else if (e.ctrlKey==true) {
        e.preventDefault()
      } else if (e.key=='Backspace') {
        logEvent("text-delete", cursorPos)
      } else {
        logEvent("text-insert", cursorPos, e.key)
      }
    }
    const editableDiv = editableDivRef.current!;
    if (editableDiv) {
      editableDiv.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (editableDiv) {
        editableDiv.removeEventListener('keydown', handleKeyDown);
      }
      if (spaceBarTimer) {
        clearTimeout(spaceBarTimer);
      }
    };
  }, []);

  // Logs click event
  const handleClick = async () => {
    const cursorPos = getCursorPosition()
    logEvent("cursor-select", cursorPos)
  }

  // Handles submit action
  const handleSubmit = async () => {
    const text = editableDivRef.current?.innerText
    setIsPopupVisible(true);
    try {
      // Write to Firebase DB
      await addDoc(collection(db, "user-input"), {
        input: text,
        timestamp: String(Date.now()),
        logs: getLogs(),
        nums: actionNums, 
        actions: userActions,
      });
    } catch(e) {
      console.error('error adding document: ', e)
    }
    editableDivRef.current!.innerText = ""
  };

  // Function to close pop up 
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
   <>
    <Head>
      <style>
        @import url(&apos;https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap&apos;);
      </style>
    </Head>
    <main>
      <h1>Task</h1>
      <p id="task-desc">You ask your professor, William Smith, you took a class with a while ago to introduce you to someone who may be hiring in your chosen career path.</p>
      <h1>Instructions </h1>
      <div className="instructions">
        <p><span>&rsaquo;</span>Right arrow to accept suggestions.</p>
        <p><span>&rsaquo;</span>Continue writing to ignore suggestions.</p>
        <p><span>&rsaquo;</span>Tab to regenerate recommendation.</p>
      </div>
      <div className="container">
          <div className='inputContainer'>
            <div id="editableDiv"
              unselectable="on"
              className="inputBox"
              contentEditable="true"
              onClick={handleClick}
              ref={editableDivRef}></div>
          </div>
      </div>
      <div className="submit">
        <button className="submit-button" onClick={handleSubmit}>submit</button>
      </div>
      {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={handleClosePopup}>&times;</button>
              <h1>Thank you!</h1>
              <p>Your submission has been recorded.</p>
            </div>
          </div>
        )}
    </main>
    </>
  );
}
