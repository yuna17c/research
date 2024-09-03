import React, { useState } from 'react';
import LikertScale from './likert';
import { questions, labels } from './likert-multi';

interface SurveyFormProps {
    onPostSurveyComplete: (answers: number[], step: number, task_num: number) => void;
    task_num: number
}

const PostStudyPage1: React.FC<SurveyFormProps> = ({ onPostSurveyComplete, task_num }) => {
    const [answers, setAnswers] = useState<number[]>([]);
    const labels_lwr = labels.lower
    const labels_upr = labels.upper

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onPostSurveyComplete(answers, 1, task_num);
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
                    {questions.map((question, index) => (
                    <div key={question.text}>
                        <h2>{question.text}</h2>
                        <LikertScale
                            question={question.text}
                            options={[1, 2, 3, 4, 5, 6, 7]}
                            value={answers[index]}
                            onValueChange={(value) => handleLikertChange(index,value)}
                            label1={labels_lwr[index]}
                            label2={labels_upr[index]}
                        />
                    </div>
                    ))}
                </div>
                <div className='next-button'>
                    <button className="submit-button">Next</button>
                </div>
            </form>
        </>
    );
};

export default PostStudyPage1;
