import React, { useState } from 'react';
import LikertScale from './likert';

interface SurveyFormProps {
    onComplete: (answers: Record<string, string|number>) => void;
    onBack: () => void;
}

const DemographicPage: React.FC<SurveyFormProps> = ({ onComplete, onBack }) => {
    const [answers, setAnswers] = useState<Record<string, string|number>>({});
    const [responses, setResponses] = useState<number[]>(new Array(4).fill(null));
    const questions = [
        '6.1 I am confident that I can write English in a way that is grammatically correct.',
        '6.2 I am confident that I can write English in a way that accurately express the meanings I want to express.',
        '6.3 I am confident that I can write English in a way that the receiver can understand my implied or inferred meanings.',
    ];

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onComplete(answers);
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [name]: value,
        }));
    };

    const handleLikertChange = (index: number, value: number) => {
        var new_idx: string = index===3 ? 'q7' : 'q6.' + (index+1).toString()
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [new_idx]: value,
        }));
        const newResponses = [...responses];
        newResponses[index] = value;
        setResponses(newResponses);
    };

    return (
        <>
            <h1 className='page-title'>Demographics Questionnaire</h1>
            <form id="demographics-form" onSubmit={handleSubmit}>
                <div className='question'>
                    <label>1. What is your highest level of education?</label>
                    <select
                    name="q1"
                    value={answers.q1}
                    defaultValue=""
                    onChange={handleInputChange}
                    required
                    >
                        <option value="">Select</option>
                        {["No formal education", "Some high school, no diploma", "High school diploma or equivalent", "Some college, no degree", "Associate's degree", "Bachelor's degree", "Master's degree", "Professional degree", "Doctorate degree", "Others (Please specify)"].map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                    {answers.q1==="Others (Please specify)" && (
                        <div>
                            <label>Please specify:</label>
                            <input
                                type="text"
                                name="q1other"
                                value={answers.q1other}
                                onChange={handleInputChange}
                                required={answers.q1==="Others (Please specify)"}
                            />
                        </div>
                    )}
                </div>
                <div className='question'>
                    <label>2. What is your native language?</label>
                    <input
                        type="text"
                        name="q2"
                        value={answers.q2}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='question'>
                    <label>3. Where is your country of birth?</label>
                    <input
                        type="text"
                        name="q3"
                        value={answers.q3}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='question'>
                    <label>4. Where is the country you spent the most time in?</label>
                    <input
                        type="text"
                        name="q4"
                        value={answers.q4}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='question'>
                    <label>5. Which country&apos;s culture do you identify with the most? It can (but does not have to) be your home country or where you spent most time?</label>
                    <input
                        type="text"
                        name="q5"
                        value={answers.q5}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='question'>
                    <h2>6. How would you rate your proficiency in English?</h2>
                    <div className='likerts'>
                    {questions.map((question, index) => (
                        <>
                            <h2 id='likert-question'>{question}</h2>
                            <LikertScale
                            key={index}
                            question={question}
                            options={[1,2,3,4,5,6,7]}
                            value={responses[index]}
                            onValueChange={(value) => handleLikertChange(index, value)}
                            label1='Not confident'
                            label2='Confident'
                            />
                        </>
                    ))}
                    </div>   
                </div>
                <div className='question'>
                    <label>7. How confident are you in using English for social communication?</label>
                    <LikertScale
                    key={3}
                    question="7. How confident are you in using English for social communication?"
                    options={[1,2,3,4,5,6,7]}
                    value={responses[3]}
                    onValueChange={(value) => handleLikertChange(3, value)}
                    label1='Not confident'
                    label2='Confident'
                    />
                </div>
                <div className='question'>
                    <label>8. Have you ever used AI tools (e.g. chatGPT, email generator, autocompletion) to assist you to write for social communication purposes? If so, please briefly describe your experience.</label>
                    <input
                        type="text"
                        name="q8"
                        value={answers.q8}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='nav-buttons'>
                    <button className="submit-button back-button" type="button" onClick={onBack}>Back</button>
                    <button className="submit-button" type="submit">Next</button>
                </div>
            </form>
        </>
    );
};

export default DemographicPage;
