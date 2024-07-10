"use client"

import "./style_main.css";
import Head from "next/head";
import { FormEvent, useEffect, useState } from 'react';
import { db } from '../firebase';
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { timeStamp } from "console";
import axios from 'axios'
require('dotenv').config({path: '../.env.local'});
import React, { useRef } from "react"

export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [ChatResponse, setResponse] = useState('');
  const [setIntervalTime] = useState('')

  // const handleChange = () => {
  //   setInputValue(event.target.value)
  // }
  
  const handleGenerate = async () => {
    var prompt = editableDiv.innerText
    // const prompt = inputValue
    console.log("sent", prompt)
    if (prompt) {
      try {
        const response = await fetch("/api/generate?prompt="+encodeURIComponent(prompt))
        const body = await response.json();
        console.log("response:",body.name)
        if (body.name) {
          editableDiv.innerHTML = `${prompt}<span class="suggestionText"">${body.name}</span>`;
        }
        // setInputValue(prompt+body.name)
      } catch(error) {
        console.error(error)
      }
    }
  }

  const editableDivRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const prompt = editableDiv?.innerText
      const suggestion = editableDiv?.querySelector("span.suggestionText")
      const suggestion_text = suggestion?.textContent
      console.log('prompt: ',prompt, ' suggestion: ',suggestion)
      console.log(e.key)
      // accept suggestion if exists
      if (e.key=="Tab") {
        e.preventDefault();
        if (suggestion_text) {
          suggestion.classList.remove('suggestionText')
        }
      } else if (e.key=="." || e.key=="?") {
        // generate AI autocompletion at the end of the sentence.
        handleGenerate();
      } else {
        if (suggestion_text) {
          console.log("remove")
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

  // const handleKeyDown = (event:KeyboardEvent) => {
  //   const editableDiv = document.getElementById('editableDiv')
  //   const prompt = editableDiv?.innerText
  //   const suggestion = editableDiv?.querySelector(".suggestionText")
  //   console.log("pressed ", event.key)
  //   if (event.key==='Period')
  //   if (event.key==='Tab') 
  //     console.log('tab pressed')
  //     event.preventDefault()
  //     if (suggestion) {
  //       suggestion.classList.remove('suggestionText')
  //       suggestion.classList.add('blackText')
  //   } 
    // else {
    //   if (suggestion) {
    //     suggestion.remove()
    //     editableDiv.innerText=prompt?.trim()
    //   } 
    //   editableDiv.innerText+=event.key
    // }
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
        <p>The task is to do this.</p>
        <h1>Instructions </h1>
      </div>
      <div className="instructions">
        <p><span>&rsaquo;</span>Tab to accept suggestions.</p>
        <p><span>&rsaquo;</span>Continue writing to ignore suggestions.</p>
        <p><span>&rsaquo;</span>Ctrl+Enter to regenerate recommendation.</p>
      </div>
      <div className="container">
        <div className="container">
            <div className='inputContainer'>
              <div id="editableDiv"
                className="inputBox"
                contentEditable="true"
                ref={editableDivRef}></div>
              {/* <textarea
              ref={contentEditableRef}
                className='inputBox'
                value={inputValue}
                name={'txt'}
                onChange={handleChange}
                placeholder="Type something..."
              /> */}
          </div>
      </div>
      </div>
      <div className="submit">
        <button className="submit-button" onClick={handleSubmit}>submit</button>
        {/* <button className="submit-button" onClick={handleGenerate}>gen</button> */}
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
