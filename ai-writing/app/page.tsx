"use client"

import "./style_main.css";
import Head from "next/head";
import { FormEvent, useEffect, useState } from 'react';
import { db } from '../firebase';
import { Timestamp, addDoc, collection } from "firebase/firestore";
require('dotenv').config({path: '../.env.local'});
import React, { useRef } from "react"

export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [ChatResponse, setResponse] = useState('');
  const [setIntervalTime] = useState('')
  const editableDivRef = useRef<HTMLDivElement>(null);

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

  const setCursorPosition = (targetPosition: number) => {
      const range = createRange(editableDivRef.current.parentNode, targetPosition);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
  };

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

  const handleGenerate = async (cursorPosition: number) => {
    const editableDiv = editableDivRef.current;
    const div_text = editableDiv?.innerText
    const suggestion = editableDiv?.querySelector("span.suggestionText")
    const suggestion_text = suggestion?.textContent
    const prompt = suggestion_text ? div_text.replace(new RegExp(suggestion_text+'$'),'') : div_text

    console.log("sent", prompt)
    if (prompt) {
      try {
        const response = await fetch("/api/generate?prompt="+encodeURIComponent(prompt))
        const body = await response.json();
        console.log("response:",body.name)
        if (body.name) {
          editableDiv.innerHTML = `${prompt}<span class="suggestionText"">&nbsp;${body.name}</span>`;
          console.log(cursorPosition)
          setCursorPosition(cursorPosition);
        }
      } catch(error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const prompt = editableDiv?.innerText
      const suggestion = editableDiv?.querySelector("span.suggestionText")
      const suggestion_text = suggestion?.textContent
      console.log('prompt: ',prompt, ' suggestion: ',suggestion)
      console.log(e.key)
      const cursorPosition = getCursorPosition(editableDiv)
      if (e.key=="ArrowRight") {
        // accept suggestion if exists
        if (suggestion_text) {
          e.preventDefault();
          suggestion.classList.remove('suggestionText')
          setCursorPosition(cursorPosition+suggestion_text.length);
        }
      } else if (e.key=="Tab") {
        // regenerate suggestion
        if (suggestion_text) {
          e.preventDefault();
          console.log('regenerating...')
          handleGenerate(cursorPosition);
        }
      } else if (e.key=="." || e.key=="?" || e.key=="!") {
        // generate AI autocompletion at the end of the sentence
        editableDiv.innerHTML+=e.key + ' '
        handleGenerate(cursorPosition+1);
      } else {
        // continue writing removes suggestions
        if (suggestion_text) {
          suggestion.remove()
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
    setIsPopupVisible(true);
    console.log("logged,",inputValue)
    try {
      await addDoc(collection(db, "user-input"), {
        input: inputValue,
        timestamp: new Date(), 
      });
    } catch(e) {
      console.error('error adding document: ', e)
    }
    setInputValue('');
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

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
        <div className="container">
            <div className='inputContainer'>
              <div id="editableDiv"
                className="inputBox"
                contentEditable="true"
                placeholder="Start typing here..."
                ref={editableDivRef}></div>
          </div>
      </div>
      </div>
      <div className="submit">
        <button className="submit-button" onClick={handleSubmit}>submit</button>
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
