"use client"

import "./style_main.css";
import Head from "next/head";
import { FormEvent, useEffect, useState } from 'react';
import { db } from '../firebase';
import { Timestamp, addDoc, collection } from "firebase/firestore";
require('dotenv').config({path: '../.env.local'});
import React, { useRef } from "react"
import $ from 'jquery'

export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [ChatResponse, setResponse] = useState('');
  const [setIntervalTime] = useState('')
  const editableDivRef = useRef<HTMLDivElement>(null);
  const userActions: [string, number][] = [];
  const actionNums: { [key:string]:number } = {'Generate':0, 'Accept':0, 'Regenerate':0, 'Ignore':0}

  const createRange = (node, targetPosition: number) => {
    let range = document.createRange();
    // range.selectNode(node);
    range.setStart(node, 0);

    let pos = 0;
    const stack = [node];
    while (stack.length > 0) {
        const current = stack.pop();

        if (current.nodeType === Node.TEXT_NODE) {
            const len = current.textContent.length;
            if (pos + len >= targetPosition) {
              range.setStart(current, targetPosition - pos)
                // range.setEnd(current, targetPosition - pos);
                range.collapse(true);
              return range;
            }
            pos += len;
        } 
        else if (current.childNodes && current.childNodes.length > 0) {
            for (let i = current.childNodes.length - 1; i >= 0; i--) {
                stack.push(current.childNodes[i]);
            }
        }
    }

    // The target position is greater than
    // the length of the contenteditable element
    range.setEnd(node, node.childNodes.length);
    return range;
  };

  // Set the position of the cursor to targetPosition
  const setCursorPosition = (targetPosition: number) => {
      const range = createRange(editableDivRef.current.parentNode, targetPosition);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
  };

  // Get the position of the cursor
  const getCursorPosition = (container: HTMLElement): number => {
    const selection = window.getSelection();
    let charCount = -1;
    if (selection?.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(container);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      charCount = preCaretRange.toString().length;
      console.log("char", charCount)
    }
    return charCount;
  };

  // Call API to generate suggestion from OpenAI model and move the cursor to cursorPosition
  const handleGenerate = async (cursorPosition: number) => {
    const editableDiv = editableDivRef.current;
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
        console.log("response:",body.response)
        if (body.response) {
          editableDiv.innerHTML = `${prompt}<span class="suggestionText"">&nbsp;${body.response}</span>`;
          console.log(cursorPosition)
          setCursorPosition(cursorPosition);
        }
      } catch(error) {
        console.error(error)
      }
    }
  }

  // Update the logs
  function update(key:string) {
    userActions.push([key, Date.now()])
    actionNums[key]+=1
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const prompt = editableDiv?.innerText
      const suggestion = editableDiv?.querySelector("span.suggestionText")
      const suggestion_text = suggestion?.textContent
      console.log('prompt: ',prompt, ' suggestion: ',suggestion)
      const cursorPosition = getCursorPosition(editableDiv)
      if (e.key=="ArrowRight") {
        // Accept suggestion
        if (suggestion_text) {
          console.log("accepted")
          e.preventDefault()
          suggestion.remove()
          editableDiv.innerText+=suggestion_text
          setCursorPosition(cursorPosition+suggestion_text.length)
          update("Accept")
        }
      } else if (e.key=="Tab") {
        console.log("tabbed:", suggestion_text)
        // Regenerate suggestion
        if (suggestion_text) {
          e.preventDefault();
          console.log('regenerating...')
          handleGenerate(cursorPosition);
          update("Regenerate")
        }
      } else if (e.key=="." || e.key=="?" || e.key=="!") {
        // Generate suggestion
        editableDiv.innerText+=e.key
        handleGenerate(cursorPosition+1);
        update("Generate")
      } else {
        // Continue writing removes suggestions
        if (suggestion_text) {
          suggestion.remove()
          update("Ignore")
        }
      }
    }
    const editableDiv = editableDivRef.current;
    if (editableDiv) {
      editableDiv.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (editableDiv) {
        editableDiv.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  // useEffect(() => {
  //   const intervalTime = setInterval(() => {
  //       handleGenerate();
  //   }, 5000);

  //     return () => clearInterval(intervalTime);
  // }, [inputValue]);

  const handleSubmit = async () => {
    const text = editableDivRef.current?.innerText
    setIsPopupVisible(true);
    console.log("logged,",inputValue)
    try {
      await addDoc(collection(db, "user-input"), {
        input: text,
        timestamp: new Date(), 
        actions: userActions,
        nums: actionNums,
      });
    } catch(e) {
      console.error('error adding document: ', e)
    }
    setInputValue('');
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleSessions = async () => {
    console.log("session submitted")
    console.log(userActions)
    console.log(actionNums)
  }

  return (
   <>
    <Head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
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
              placeholder="Start typing here..."
              ref={editableDivRef}></div>
          </div>
      </div>
      <div className="submit">
        <button className="submit-button" onClick={handleSubmit}>submit</button>
        <button onClick={handleSessions}>session</button>
      </div>
      {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={handleClosePopup}>&times;</button>
              <img src="/favicon.ico" />
              <h1>Thank you!</h1>
              <p>Your submission has been recorded.</p>
            </div>
          </div>
        )}
    </main>
    </>
  );
}
