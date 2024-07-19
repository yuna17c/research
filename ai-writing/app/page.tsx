"use client"

import "./style_main.css";
import Head from "next/head";
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection } from "firebase/firestore";
require('dotenv').config({path: '../.env.local'});
import React, { useRef } from "react"
import $ from 'jquery'
import { setCursorPosition, getCursorPosition } from "@/components/cursor"
import { logEvent, getLogs, Action } from "@/components/log";
import Image from "next/image";

export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const editableDivRef = useRef<HTMLDivElement>(null);
  const userActions: Action[] = [];
  const actionNums: { [key:string]:number } = {'Generate':0, 'Accept':0, 'Regenerate':0, 'Ignore':0}

  // Call API to generate suggestion from OpenAI model and move the cursor to cursorPosition
  const handleGenerate = async (cursorPosition: number, eventName: string) => {
    const editableDiv = editableDivRef.current!;
    // Get prompt excluding the suggestion.
    const prompt = $('div').contents()
    .filter(function() {
      return this.nodeType === 3;
    }).text()
    console.log("sent", prompt)
    if (prompt) {
      try {
        const response = await fetch("/api/generate?prompt="+encodeURIComponent(prompt))
        const body = await response.json();
        console.log("response:", body.response)
        if (body.response) {
          editableDiv.innerHTML = `${prompt}<span class="suggestionText"">&nbsp;${body.response}</span>`;
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
  function update(key:string) {
    userActions.push({'action':key, 'timestamp':Date.now()})
    actionNums[key]+=1
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const prompt = editableDiv.innerText
      const suggestion = editableDiv.querySelector("span.suggestionText")
      const suggestion_text = suggestion?.textContent
      const cursorPos = getCursorPosition()
      console.log('prompt: ', prompt, ' suggestion: ', suggestion)
      
      if (e.key=="ArrowRight") {
        // Accept suggestion
        if (suggestion_text) {
          console.log("accepted")
          e.preventDefault()
          suggestion.remove()
          editableDiv.innerText+=suggestion_text
          setCursorPosition(cursorPos+suggestion_text.length)
          update("Accept")
          logEvent("suggestion-accept", cursorPos)
        } else {
          logEvent("cursor-forward", cursorPos)
        }
      } else if (e.key=="Tab") {
        console.log("tabbed:", suggestion_text)
        // Regenerate suggestion
        if (suggestion_text) {
          e.preventDefault();
          console.log('regenerating...')
          handleGenerate(cursorPos, "suggestion-regenerate");
          update("Regenerate")
        }
      } else if (e.key=="." || e.key=="?" || e.key=="!") {
        // Generate suggestion
        editableDiv.innerText+=e.key
        logEvent("text-insert", cursorPos, e.key)
        handleGenerate(cursorPos+1, "suggestion-generate");
        update("Generate")        
      } else if (e.key=='ArrowLeft') {
        logEvent("cursor-backward", cursorPos)
      } else if (e.key=='Backspace') {
        logEvent("text-delete", cursorPos)
      } else {
        // Continue writing removes suggestions
        if (suggestion_text) {
          suggestion.remove()
          update("Ignore")
        } else {
          logEvent("text-insert", cursorPos, e.key)
        }
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
    };
  }, []);

  const handleClick = async () => {
    const cursorPos = getCursorPosition()
    logEvent("cursor-select", cursorPos)
  }
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

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleSessions = async () => {
    const logs = getLogs()
    console.log(logs)
    console.log("session submitted")
    console.log(userActions)
    console.log(actionNums)
  }

  return (
   <>
    <Head>
      <style>
        @import url(&apos;https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap&apos;);
      </style>
    </Head>
    <main>
      <div className="title">
        <h1>Task</h1>
        <p>The task is to write an email.</p>
        <h1>Instructions </h1>
      </div>
      <div className="instructions">
        <p><span>&rsaquo;</span>Right arrow to accept suggestions.</p>
        <p><span>&rsaquo;</span>Continue writing to ignore suggestions.</p>
        <p><span>&rsaquo;</span>Tab to regenerate recommendation.</p>
      </div>
      <div className="container">
          <div className='inputContainer'>
            <div id="editableDiv"
              className="inputBox"
              contentEditable="true"
              // placeholder="Start typing here..."
              onClick={handleClick}
              ref={editableDivRef}></div>
          </div>
      </div>
      <div className="submit">
        <button className="submit-button" onClick={handleSubmit}>submit</button>
        {/* <button onClick={handleSessions}>session</button> */}
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
