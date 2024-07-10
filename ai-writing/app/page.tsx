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

// interface Conversation {
//   role: string
//   content: string
// }

// export default function Home() {
//   const [value, setValue] = React.useState<string>("")
//   const [conversation, setConversation] = React.useState<Conversation[]>([])
//   const inputRef = useRef<HTMLInputElement>(null)
//   const handleInput = React.useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setValue(e.target.value)
//     },
//     []
//   )
//   console.log(value)
//   // const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
//   //   if (e.key==="Enter") {
//   //     const chatHistory = [...conversation {role:"user",content: value}]
//   //   }
//   // }
//   return (
//     <div className='main'>
//       <div className="">
//         <h1>Task</h1>
//       </div>
//       <div>
//         <p>Start typing</p>
//         <input
//           placeholder="Type here"
//           value={value}
//           onChange={handleInput}
//           // onKeyDown={handleKeyDown}
//           />
//       </div>
//     </div>
//   )

// }

// interface 
export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [ChatResponse, setResponse] = useState('');
  const [setIntervalTime] = useState('')
  const contentEditableRef = useRef(null);

  // const handleChange = () => {
  //   setInputValue(event.target.value)
  // }
  const handleGenerate = async () => {
    var editableDiv = document.getElementById("editableDiv")
    var prompt = editableDiv.innerText
    // const prompt = inputValue
    console.log("sent", prompt)
    if (prompt) {
      try {
        const response = await fetch("/api/generate?prompt="+encodeURIComponent(prompt))
        const body = await response.json();
        console.log("response:",body.name)
        if (body.name) {
          editableDiv.innerHTML = `${prompt}<span style="color: #A6A6A6;">${body.name}</span>`;
        }
        // setInputValue(prompt+body.name)
      } catch(error) {
        console.error(error)
      }
    }
  }

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
                contentEditable="true"></div>
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
        <button className="submit-button" onClick={handleGenerate}>gen</button>
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
