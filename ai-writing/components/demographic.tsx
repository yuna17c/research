import React, { useState } from 'react';
import LikertScale from './likert';

interface SurveyFormProps {
    onComplete: (answers: Record<string, string>) => void;
    onBack: () => void;
}

const Demographic: React.FC<SurveyFormProps> = ({ onComplete, onBack }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [responses, setResponses] = useState<number[]>(new Array(4).fill(null));
    const handleSubmit = (event: React.FormEvent) => {
        console.log(answers)
        console.log(responses)
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
    const handleLikert = (value: number) => {
        const newResponses = [...responses];
        newResponses[3] = value;
        setResponses(newResponses)
    }
    const handleLikertChange = (index: number, value: number) => {
        const newResponses = [...responses];
        newResponses[index] = value;
        setResponses(newResponses);
    };
    const questions = [
        'I am confident that I can write English in a way that is grammatically correct.',
        'I am confident that I can write English in a way that accurately express the meanings I want to express.',
        'I am confident that I can write English in a way that the receiver can understand my implied or inferred meanings.',
    ];

    return (
        <>
            <h1>Demographics Questionnaire</h1>
            <form id="demographics-form" onSubmit={handleSubmit}>
                <div className='question'>
                    <label htmlFor="question1">1. What is your highest level of education?</label>
                    <select
                        name="question1"
                        value={answers.question1}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select</option>
                        {["No formal education", "Some high school, no diploma", "High school diploma or equivalent", "Some college, no degree", "Associate's degree", "Bachelor's degree", "Master's degree", "Professional degree", "Doctorate degree", "Others (Please specify)"].map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                        ))}
                    </select>
                    {answers.question1==="Others (Please specify)" && (
                        <div>
                            <label htmlFor="otherAnswer">Please specify:</label>
                            <input
                                type="text"
                                id="otherAnswer"
                                name="otherAnswer"
                                value={answers.otherAnswer}
                                onChange={handleInputChange}
                                required={answers.question1==="Others (Please specify)"}
                            />
                        </div>
                    )}
                </div>
                <div className='question'>
                    <label htmlFor="question2">2. What is your native language?</label>
                    <input
                        type="text"
                        name="question2"
                        value={answers.question2}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='question'>
                    <label htmlFor="question3">3. Where is your country of birth?</label>
                    <input
                        type="text"
                        name="question3"
                        value={answers.question3}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='question'>
                    <label htmlFor="question4">4. Where is the country you spent the most time in?</label>
                    <input
                        type="text"
                        name="question4"
                        value={answers.question4}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='question'>
                    <label htmlFor="question5">5. Which country's culture do you identify with the most? It can (but does not have to) be your home country or where you spent most time?</label>
                    <input
                        type="text"
                        name="question5"
                        value={answers.question5}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='likertQuestion question'>
                    <h2>6. How would you rate your proficiency in English?</h2>
                    {questions.map((question, index) => (
                        <LikertScale
                        key={index}
                        question={question}
                        options={[1,2,3,4,5,6,7]}
                        value={responses[index]}
                        onValueChange={(value) => handleLikertChange(index, value)}
                        />
                    ))}
                    
                </div>
                <div className='likertQuestion question'>
                    <label htmlFor="question7">7. How confident are you in using English for social communication?</label>
                    <div className="likert">
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                        <label key={value}>
                            <input
                                type="radio"
                                name="question7"
                                value={responses[3]}
                                checked={responses[3]===value}
                                onChange={()=>handleLikertChange(3,value)}
                                required
                            />
                            {value}
                        </label>
                    ))}
                    </div>
                </div>
                <div className='question'>
                    <label htmlFor="question8">8. Have you ever used AI tools (e.g. chatGPT, email generator, autocompletion) to assist you to write for social communication purposes? If so, please briefly describe your experience.</label>
                    <input
                        type="text"
                        id="question8"
                        name="question8"
                        value={answers.question8}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button className="submit-button back-button" type="button" onClick={onBack}>Back</button>
                <button className="submit-button" type="submit">Next</button>
            </form>
        </>
    );
};

export default Demographic;
