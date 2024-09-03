import React, { useState } from 'react';
import LikertScaleMulti from './likert-multi';
import { questions, labels } from './likert-multi'

interface SurveyFormProps {
    onComplete: (answers: {[key:number]:number}[]) => void;
    onBack: () => void;
}

const PreStudyPage: React.FC<SurveyFormProps> = ({ onComplete, onBack }) => {
    const scenarios = [
        { id:1, text:"1. You’re working on a project that involves coordinating with other teams. You ask a colleague from a different department, whom you’ve worked with occasionally and whose role includes handling interdepartmental communications, if they could help review and ensure that all necessary information is properly prepared before you finalize your report for submission to your supervisor."},
        { id:2, text:"2. You need to request a meeting with a team member in your department to discuss potential collaboration on a project. You’ve interacted a few times but haven’t worked closely together." },
        { id:3, text:"3. You’re enrolled in a course and have interacted with the course TA during office hours. You write an email to ask if the TA could clarify a specific concept from a recent class discussion or recommend some additional study materials related to the topic." },
        { id:4, text:"4. You are starting a research project and you recall a senior researcher in your department, with whom you’ve had several conversations during department events, whose expertise closely aligns with your topic. You believe they might be interested in collaborating but are uncertain about their availability." },
        { id:5, text:"5. You are working on a project with a colleague, and you’re at a stage where you need their part of the work to be completed in order to proceed with your own tasks. You write an email about their progress and find out if they can finish their part within the week to keep the project on schedule." },
        { id:6, text:"6. You’re working on a group project for a university course and have had a few discussions with your project advisor. You write an email to ask if the advisor could provide feedback on your current project outline or suggest any resources that might help improve your presentation." }
    ]
    const labels_lwr = labels.lower
    const labels_upr = labels.upper
    const [answers, setAnswers] = useState<{[key:number]:number}[]>([]);
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onComplete(answers);
    };

    const handleResponseChange = (scenarioId: number, questionId: number, value: number) => {
        setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [scenarioId]: {
            ...prevAnswers[scenarioId],
            [questionId]: value,
        },
        }));
    };

    return (
        <>
            <h1 className='page-title'>Pre-study Evaluations</h1>
            <form id="pre-study" onSubmit={handleSubmit}>
                <h2>Each of the following scenario describes a situation where you will be writing an email to someone to make a request. Imagine you are in that scenario (you may want to recall your experience if you have encountered a similar sitatuon before), give ratings on how you would perceive the email receiver.</h2>
                <br/>
                <div className='likerts'>
                {scenarios.map((scenario) => (
                    <div key={scenario.id}>
                        <h2>{scenario.text}</h2>
                        <br/>
                        {questions.map((question, index) => (
                        <div key={question.id}>
                            <p>{question.text}</p>
                            <LikertScaleMulti
                                scenarioId={scenario.id}
                                questionId={question.id}
                                options={[1,2,3,4,5,6,7]}
                                value={answers[scenario.id]?.[question.id] || 0}
                                onChange={handleResponseChange}
                                label1={labels_lwr[index]}
                                label2={labels_upr[index]}
                            />
                        </div>
                        ))}
                        <hr/><br/>
                    </div>
                ))}
                </div>
                <div className='nav-buttons'>
                    <button className="submit-button back-button" type="button" onClick={onBack}>Back</button>
                    <button className="submit-button" type="submit">Next</button>
                </div>
            </form>
        </>
    );
};

export default PreStudyPage;
