"use client"

import "./style_main.css";
import Head from "next/head";
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { getLogs, Action, Event } from "@/components/log";
import TextInput from "@/components/text-input";
import PreStudyPage from "@/components/pre-study-page";
import IdPage from "@/components/id-page";
import ConsentPage from "@/components/consent-page";
import DemographicPage from "@/components/demographic-page";
import Baseline from "@/components/baseline";
import InstructionPage from "@/components/instruction-page";
import PostStudyPage2 from "@/components/post-study-2-page";
import PostStudyPage1 from "@/components/post-study-1-page";

require('dotenv').config({path: '../.env'});

export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // Function to close pop up 
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const [currentStep, setCurrentStep] = useState<string>('id');
  const [prolificId, setId] = useState<string>('');
  const [demoAnswers, setDemoAnswers] = useState<Record<string, string | number>>({});
  const [baselineText, setBaselineText] = useState<string>('');
  const [preStudyAnswers, setPreStudyAnswers] = useState<{[key:number]:number}[]>([]);
  const [postStudyAnswers1, setPostStudyAnswers1] = useState<number[]>([]);
  const [postStudyAnswers2, setPostStudyAnswers2] = useState<number[]>([]);
  const [inputContent1, setInputContent1] = useState<string>('');
  const [inputContent2, setInputContent2] = useState<string>('');
  const [actionNumLog1, setActionNumLog1] = useState<{[key:string]:number}>({});
  const [actionNumLog2, setActionNumLog2] = useState<{[key:string]:number}>({});
  const [log1, setLog1] = useState<Event[]>([]);
  const [log2, setLog2] = useState<Event[]>([]);
  const [userActionLog, setUserActionLog] = useState<Action[]>([]);

  const handleGoBack = () => {
    if (currentStep === "demo") {
      setCurrentStep("id");
    } else if (currentStep === "pre") {
      setCurrentStep("demo")
    } else if (currentStep ==="baseline") {
      setCurrentStep("pre")
    } else if (currentStep === "writing_task1") {
      setCurrentStep("instruction");
    } else if (currentStep === "post1") {
      setCurrentStep("writing_task1");
    } else if (currentStep === "post2") {
      setCurrentStep("post1");
    }
  };

  // Consent form -> prolific id
  const handleConsentComplete = () => {
    setCurrentStep("id")
  }

  // Prolific id -> demographic questionnaire
  const handleIdComplete = (answer: string) => {
    setId(answer)
    setCurrentStep("demo")
  }

  // Demographic questionnaire -> pre-study
  const handleDemoComplete = (answers: Record<string, string | number>) => {
    setCurrentStep("pre")
    setDemoAnswers(answers)
  }

  // Pre-study survey -> baseline
  const handleSurveyComplete = (answers: {[key:number]:number}[]) => {
    setCurrentStep("baseline")
    setPreStudyAnswers(answers)
  };

  // Baseline -> AI writing tool instruction
  const handleBaselineComplete = (content: string) => {
    setCurrentStep("instruction")
    setBaselineText(content)
  }

  // AI writing tool instruction -> text input
  const handleInstrComplete = () => {
    setCurrentStep("writing_task1")
  }

  // AI writing task input complete event
  const handleContentChange = (task_num: number, content: string, actionNums: {[key:string]:number}, userActions: Action[], log: Event[]) => {
    if (task_num===1) {
      setCurrentStep("post-1-1")
      setInputContent1(content)
      setActionNumLog1(actionNums)
      setUserActionLog(userActions)
      setLog1(log)
    } else {
      setCurrentStep("post-2-1")
      setInputContent2(content)
      setActionNumLog2(actionNums)
      setLog2(log)
    }
  }

  // Post evaluation tasks
  const handlePostEvalComplete = (answers: number[], step: number, task_num: number) => {
    const curr_step = task_num===1 ? (step===1 ? 'post-1-2' : 'writing_task2') : (step===1 ? 'post-2-2' : '')
    setCurrentStep(curr_step)
    if (task_num===1) {
      setPostStudyAnswers1(prevAnswers => [...prevAnswers, ...answers])
    } else if (step===1) {
      setPostStudyAnswers2(prevAnswers => [...prevAnswers, ...answers])
    } else {
      handleSubmit(answers)
    }
  }

  // Submit to Firebase
  const handleSubmit = async (answers: number[]) => {
    setIsPopupVisible(true);
    try {
      // Write to Firebase DB
      console.log(prolificId)
      const docRef = doc(collection(db, "user-input"), prolificId);
      await setDoc(docRef, {
        timestamp: String(Date.now()),
        demographicQuestions: demoAnswers,
        preStudyAnswers: preStudyAnswers,
        baselineText: baselineText,
        aiWritingText: { task1: inputContent1, task2: inputContent2 },
        numActions: { task1: actionNumLog1, task2: actionNumLog2 },
        postStudyAnswers: { task1: postStudyAnswers1, task2: [...postStudyAnswers2,...answers] },
        logs: { task1: log1, task2: log2 }
      });
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
        {currentStep==="consent" && <ConsentPage onComplete={handleConsentComplete} />}
        {currentStep=="id" && <IdPage onComplete={handleIdComplete} />}
        {currentStep==="demo" && <DemographicPage onComplete={handleDemoComplete} onBack={handleGoBack} />}
        {currentStep==="pre" && <PreStudyPage onComplete={handleSurveyComplete} onBack={handleGoBack} />}
        {currentStep==="baseline" && <Baseline onContentChange={handleBaselineComplete} />}
        {currentStep==="instruction" && <InstructionPage onComplete={handleInstrComplete} />}
        {currentStep==="writing_task1" && <TextInput onContentChange={handleContentChange}  onBack={handleGoBack} ai_type="pos" />}
        {currentStep==="post-1-1" && <PostStudyPage1 onPostSurveyComplete={handlePostEvalComplete} task_num={1} />}
        {currentStep==="post-1-2" && <PostStudyPage2 onPostSurveyComplete={handlePostEvalComplete} task_num={1} />}
        {currentStep==="writing_task2" && <TextInput onContentChange={handleContentChange}  onBack={handleGoBack} ai_type="neg" />}
        {currentStep==="post-2-1" && <PostStudyPage1 onPostSurveyComplete={handlePostEvalComplete} task_num={2} />}
        {currentStep==="post-2-2" && <PostStudyPage2 onPostSurveyComplete={handlePostEvalComplete} task_num={2} />}
      </main>
      {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={handleClosePopup}>&times;</button>
              <h1>Thank you for your participation.</h1>
              <p>Please use the following link to go back to Prolific</p>
            </div>
          </div>
      )}
    </>
  );
}
