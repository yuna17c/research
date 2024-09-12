import React, { useState } from 'react';
import LikertScale from './likert';
import { POST_STUDY_QUESTIONS } from './variables';

interface SurveyFormProps {
    onPostSurveyComplete: (answers: number[], task_num: number) => void;
    task_num: number
}

const PostStudyPage2: React.FC<SurveyFormProps> = ({ onPostSurveyComplete, task_num }) => {
    const [answers, setAnswers] = useState<number[]>([]);
    const button_name = task_num===2 ? 'Submit' : 'Next'
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        window.scrollTo(0, 0);
        onPostSurveyComplete(answers, task_num);
    };
    
    const handleLikertChange = (index: number, value: number) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    return (
        <>
            <h1 className='page-title'>Post-task Evaluation</h1>
            <h2>Instructions</h2>
            <p>Based on your previously written email, please answer the following questions:</p><br/>
            <form id="survey-form" onSubmit={handleSubmit}>
                <div>
                    {POST_STUDY_QUESTIONS.map((question, index) => (
                    <div key={question}>
                        <p>{question}</p>
                        <LikertScale
                            question={question}
                            options={[1, 2, 3, 4, 5, 6, 7]}
                            value={answers[index]}
                            onValueChange={(value) => handleLikertChange(index,value)}
                            label1={"Strongly disagree"}
                            label2={"Strongly agree"}
                        />
                    </div>
                    ))}
                </div>
                <div className='next-button'>
                    <button className="submit-button">{button_name}</button>
                </div>
            </form>
        </>
    );
};

export default PostStudyPage2;
