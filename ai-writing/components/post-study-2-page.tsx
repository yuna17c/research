import React, { useState } from 'react';
import LikertScale from './likert';

interface SurveyFormProps {
    onPostSurveyComplete: (answers: number[], step: number, task_num: number) => void;
    task_num: number
}

const PostStudyPage2: React.FC<SurveyFormProps> = ({ onPostSurveyComplete, task_num }) => {
    const [answers, setAnswers] = useState<number[]>([]);
    const questions = [
        "1. I think that the email I wrote with the AI toolwritten message represents me authentically.",
        "2. I think the AI writing assistant sounded like I would write myself.",
        "3. I am confident that the message will be perceived positively by the receiver.",
        "4. I think AI suggestions are helpful.",
        "5. I think AI suggestions are appropriate to the social situation."
    ]
    const button_name = task_num===2 ? 'Submit' : 'Next'
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onPostSurveyComplete(answers, 2, task_num);
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
                    <div key={question}>
                        <h2>{question}</h2>
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
