"use client"

import "./style_main.css";
import Head from "next/head";
import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection } from "firebase/firestore";
import { getLogs, Action, Event } from "@/components/log";
import TextInput from "@/components/text-input";
import PreSurvey from "@/components/pre-survey";
import PostSurvey from "@/components/post-survey";

require('dotenv').config({path: '../.env'});

export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // Function to close pop up 
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [preSurveyAnswers, setPreSurveyAnswers] = useState<Record<string, string>>({});
  const [inputContent, setInputContent] = useState<string>();
  const [actionNumLog, setActionNumLog] = useState<{[key:string]:number}>();
  const [userActionLog, setUserActionLog] = useState<Action[]>([]);

  // Pre-experiment survey complete event
  const handleSurveyComplete = (answers: Record<string, string>) => {
    setCurrentStep(1)
    setPreSurveyAnswers(answers)
  };

  // Input complete event
  const handleContentChange = (content: string, actionNums: {[key:string]:number}, userActions: Action[], log: Event[]) => {
    setCurrentStep(2)
    setInputContent(content)
    setActionNumLog(actionNums)
    setUserActionLog(userActions)
  }

  // Post-experiment survey complete event
  const handleComplete = (answers: Record<string, string>) => {
    handleSubmit(answers)
  }

  // Submit to Firebase
  const handleSubmit = async (answers: Record<string, string>) => {
    setIsPopupVisible(true);
    try {
      // Write to Firebase DB
      const docRef = await addDoc(collection(db, "user-input"), {
        input: inputContent,
        timestamp: String(Date.now()),
        logs: getLogs(),
        numsActions: actionNumLog, 
        actionLog: userActionLog,
        preSurvey: preSurveyAnswers,
        postSurvey: answers
      });
      // Print the doc ID
      console.log("Added ", docRef.id)
    } catch(e) {
      console.error('error adding document: ', e)
    }
  };
  return (
    <>
      <Head>
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap&apos;);
        </style>
      </Head>
      <main>
        {currentStep===0 && <PreSurvey onSurveyComplete={handleSurveyComplete} />}
        {currentStep===1 && <TextInput onContentChange={handleContentChange}/>}
        {currentStep===2 && <PostSurvey onPostSurveyComplete={handleComplete}/>}
      </main>
      {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={handleClosePopup}>&times;</button>
              <h1>Thank you!</h1>
              <p>Your submission has been recorded.</p>
            </div>
          </div>
      )}
    </>
  );
}
