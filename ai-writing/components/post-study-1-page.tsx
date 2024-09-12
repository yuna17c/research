import React, { useState } from 'react';
import LikertScale from './likert';
import { questions, labels } from './likert-multi';

interface SurveyFormProps {
    onPostSurveyComplete: (answers: (number|string)[], task_num: number) => void;
    task_num: number
}

const PostStudyPage1: React.FC<SurveyFormProps> = ({ onPostSurveyComplete, task_num }) => {
    const [answers, setAnswers] = useState<number[]>([]);
    const [explanations, setExplanations] = useState<string[]>([]);
    const labels_lwr = labels.lower
    const labels_upr = labels.upper

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        window.scrollTo(0, 0);
        var newArr = [];
        answers.forEach(element => {
            newArr.push(element)
        });
        for (let i=0; i<3; i++) {
            if (explanations[i]) {
                newArr.push(explanations[i])
            } else {
                newArr.push('')
            }
        }
        onPostSurveyComplete(newArr, task_num);
    };
    
    const handleLikertChange = (index: number, value: number) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };
    
    // Handles input changes in optional explanation questions
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setExplanations((prevAnswers) => ({
            ...prevAnswers,
            [name]: value,
        }));
    };

    return (
        <>
            <h1 className='page-title'>Post-task Evaluation</h1>
            <h2>Instructions</h2>
            <p>Based on your written email, please answer the following questions:</p><br/>
            <form id="post-survey-form" onSubmit={handleSubmit}>
                <div>
                    {questions.map((question, index) => (
                    <div key={question.text}>
                        <p>{question.text}</p>
                        <LikertScale
                            question={question.text}
                            options={[1, 2, 3, 4, 5, 6, 7]}
                            value={answers[index]}
                            onValueChange={(value) => handleLikertChange(index,value)}
                            label1={labels_lwr[index]}
                            label2={labels_upr[index]}
                        />
                        <div className='question'>
                            <p><label>Can you please explain why you give this rating? (Optional)</label></p>
                            <input
                                type="text"
                                name={index.toString()}
                                value={explanations[index]}
                                onChange={handleInputChange}
                            />
                        </div>
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
