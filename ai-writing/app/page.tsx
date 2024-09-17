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
import GeneralInstructionPage from "@/components/general-instr-page";
import { shuffle } from "./utils";
import { CONSENT_LST, PRE_STUDY_SCENARIOS, SCENARIOS_TYPE, WRITING_SCENARIO_TYPE, WRITING_SCENARIOS } from "@/components/variables";
import OptionsPage from "@/components/options-page";

require('dotenv').config({path: '../.env'});

export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // Function to close pop up 
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const [currentStep, setCurrentStep] = useState<string>('baseline');
  const [prolificId, setId] = useState<string>('');
  const [demoAnswers, setDemoAnswers] = useState<Record<string, string | number>>({});
  const [baselineText, setBaselineText] = useState<string>('');
  const [preStudyAnswers, setPreStudyAnswers] = useState<{[key:number]:number[]}>({});
  const [postStudyAnswers1, setPostStudyAnswers1] = useState<(number|string)[]>([]);
  const [postStudyAnswers2, setPostStudyAnswers2] = useState<number[]>([]);
  const [inputContent1, setInputContent1] = useState<string>('');
  const [inputContent2, setInputContent2] = useState<string>('');
  const [actionNumLog1, setActionNumLog1] = useState<{[key:string]:number}>({});
  const [actionNumLog2, setActionNumLog2] = useState<{[key:string]:number}>({});
  const [log1, setLog1] = useState<Event[]>([]);
  const [log2, setLog2] = useState<Event[]>([]);
  const [baselineDuration, setDuration] = useState<number>(0);
  const [writingScenarios, setWritingScenarios] = useState<WRITING_SCENARIO_TYPE[]>(WRITING_SCENARIOS);
  const [preStudyScenarios, setPreStudyScenarios] = useState<SCENARIOS_TYPE[]>(PRE_STUDY_SCENARIOS);
  const [aiTypeOrder, setAiTypeOrder] = useState<string[]>([]);

  const handleGoBack = () => {
    if (currentStep === "demo") {
      setCurrentStep("id");
    } else if (currentStep === "pre") {
      setCurrentStep("demo")
    } else if (currentStep === "instruction1") {
      setCurrentStep("options")
    } else if (currentStep ==="baseline") {
      setCurrentStep("pre")
    } else if (currentStep === "writing_task1") {
      setCurrentStep("instruction2");
    }
  };

  // Prolific id -> demographic questionnaire
  const handleIdComplete = (answer: string) => {
    setId(answer)
    setCurrentStep("demo")
    // Randomize the orders of pre study questions
    setPreStudyScenarios(shuffle(PRE_STUDY_SCENARIOS))
  }

  // Demographic questionnaire -> pre-study
  const handleDemoComplete = (answers: Record<string, string | number>) => {
    setCurrentStep("pre")
    setDemoAnswers(answers)
  }

  // Pre-study survey -> homepage 
  const handleSurveyComplete = (answers: {[key:number]:number[]}) => {
    // Pick the order of AI type
    setAiTypeOrder(['pos','neg']);
    // Randomize the orders of scenarios
    setWritingScenarios(shuffle(WRITING_SCENARIOS))
    setCurrentStep("instruction1")
    setPreStudyAnswers(answers)
  };

  const handleNextStep = (step: string) => {
    setCurrentStep(step)
  }

  // Baseline -> AI writing tool instruction
  const handleBaselineComplete = (content: string, duration: number) => {
    setCurrentStep("instruction2")
    setBaselineText(content)
    setDuration(duration)
  }

  // AI writing tool instruction -> text input
  const handleInstrComplete = () => {
    setCurrentStep("writing_task1")
  }

  // AI writing task input complete event
  const handleContentChange = (task_num: number, content: string, actionNums: {[key:string]:number}, userActions: Action[], log: Event[]) => {
    if (task_num===2) {
      setCurrentStep("post-1-1")
      setInputContent1(content)
      setActionNumLog1(actionNums)
      setLog1(log)
    } else if (task_num===3) {
      setCurrentStep("post-2-1")
      setInputContent2(content)
      setActionNumLog2(actionNums)
      setLog2(log)
    }
  }

  // Post evaluation tasks 1 (post-1-1 or post-2-1)
  const handlePostEvalComplete1 = (answers: (number|string)[], task_num: number) => {
    const curr_step = task_num===1 ? 'post-1-2' : 'post-2-2'
    setCurrentStep(curr_step)
    setPostStudyAnswers1(prevAnswers => [...prevAnswers, ...answers])
  }
  // Post evaluation tasks 1 (post-1-2 or post-2-2)
  const handlePostEvalComplete2 = (answers: number[], task_num: number) => {
    const curr_step = task_num===1 ? 'writing_task2' : ''
    setCurrentStep(curr_step)
    if (task_num===1) {
      setPostStudyAnswers2(prevAnswers => [...prevAnswers, ...answers])
    } else {
      handleSubmit(answers)
    }
  }

  // Submit to Firebase
  const handleSubmit = async (answers: number[]) => {
    setIsPopupVisible(true);
    const ai_task_1 = WRITING_SCENARIOS[1].id.toString() + '-' + aiTypeOrder[0]
    const ai_task_2 = WRITING_SCENARIOS[2].id.toString() + '-' + aiTypeOrder[1]
    const option_num = aiTypeOrder[0]=='pos' ? 1 : 2
    try {
      // Write to Firebase DB
      console.log(prolificId)
      const docRef = doc(collection(db, "user-input"), prolificId);
      await setDoc(docRef, {
        timestamp: Date.now(),
        consent: CONSENT_LST,
        option: option_num,
        demographicQuestions: demoAnswers,
        preStudyAnswers: preStudyAnswers,
        baselineText: baselineText,
        baselineDuration: baselineDuration,
        aiWritingText: { [ai_task_1]: inputContent1, [ai_task_2]: inputContent2 },
        numActions: { [ai_task_1]: actionNumLog1, [ai_task_2]: actionNumLog2 },
        postStudyAnswers: { set1: postStudyAnswers1, set2: [...postStudyAnswers2,...answers] },
        logs: { [ai_task_1]: log1, [ai_task_2]: log2 }
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
        {currentStep==="consent" && <ConsentPage onComplete={handleNextStep} />}
        {currentStep=="id" && <IdPage onComplete={handleIdComplete} />}
        {currentStep==="demo" && <DemographicPage onComplete={handleDemoComplete} onBack={handleGoBack} />}
        {currentStep==="pre" && <PreStudyPage onComplete={handleSurveyComplete} onBack={handleGoBack} scenarios={preStudyScenarios} />}
        {currentStep==="instruction1" && <GeneralInstructionPage onComplete={handleNextStep} />}
        {currentStep==="baseline" && <Baseline onContentChange={handleBaselineComplete} scenario={writingScenarios[0]}/>}
        {currentStep==="instruction2" && <InstructionPage onComplete={handleNextStep} />}
        {currentStep==="writing_task1" && <TextInput onContentChange={handleContentChange} onBack={handleGoBack} task_num={2} ai_type={aiTypeOrder[0]} scenario={writingScenarios[1]} />}
        {currentStep==="post-1-1" && <PostStudyPage1 onPostSurveyComplete={handlePostEvalComplete1} task_num={1} />}
        {currentStep==="post-1-2" && <PostStudyPage2 onPostSurveyComplete={handlePostEvalComplete2} task_num={1} />}
        {currentStep==="writing_task2" && <TextInput onContentChange={handleContentChange} onBack={handleGoBack} task_num={3} ai_type={aiTypeOrder[1]} scenario={writingScenarios[2]} />}
        {currentStep==="post-2-1" && <PostStudyPage1 onPostSurveyComplete={handlePostEvalComplete1} task_num={2} />}
        {currentStep==="post-2-2" && <PostStudyPage2 onPostSurveyComplete={handlePostEvalComplete2} task_num={2} />}
      </main>
      {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={handleClosePopup}>&times;</button>
              <h2>Thank you for your participation.</h2>
              <p>Please use the following link to go back to Prolific</p>
              <p><a href="https://app.prolific.com/submissions/complete?cc=CNLLNYAY">https://app.prolific.com/submissions/complete?cc=CNLLNYAY</a></p>
              <p>Or use this completion code - CNLLNYAY</p>
            </div>
          </div>
      )}
    </>
  );
}
