"use client"
import Image from "next/image";
import Autocomplete from "../components/AutoComplete";
import "./style_main.css";
import Head from "next/head";
import { useState } from 'react';
import { db } from '../../firebase';

export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = async () => {
    setIsPopupVisible(true);
    console.log("logged,",inputValue)
    db.ref('inputValue').push({
      inputValue,
      timestamp: db.ServerValue.TIMESTAMP
    })
    setInputValue('');
    setIsPopupVisible(true);
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
        <h1>Instructions </h1>
      </div>
      <div className="instructions">
        <p><span>&rsaquo;</span>Tab to accept suggestions.</p>
        <p><span>&rsaquo;</span>Continue writing to ignore suggestions.</p>
        <p><span>&rsaquo;</span>Ctrl+Enter to regenerate recommendation.</p>
      </div>
      
      <div className="container">
          <div className='inputContainer'>
            <textarea
              className='inputBox'
              value={inputValue}
              // value={query}
              onChange={handleChange}
              placeholder="Type something..."
            />
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
