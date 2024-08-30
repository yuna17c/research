import React, { useState } from 'react';

interface SurveyFormProps {
    onComplete: (answers: Record<string, string>) => void;
    onBack: () => void;
}

const PreSurvey: React.FC<SurveyFormProps> = ({ onComplete, onBack }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onComplete(answers);
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [name]: value,
        }));
    };

    return (
        <>
            <h1>Pre-study Evaluations</h1>
            <h2>Each of the following scenario describes a situation where you will be writing an email to someone to make a request. Imagine you are in that scenario (you may want to recall your experience if you have encountered a similar sitatuon before), give ratings on how you would perceive the email receiver.</h2>
            <form id="survey-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="question1">1. What is your native language?</label>
                    <input
                        type="text"
                        id="question1"
                        name="question1"
                        value={answers.question1}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="question4">4. Please briefly describe a scenario where you used AI tools to assist you to write for social communication purposes (text messages, emails, etc)</label>
                    <input
                        type="text"
                        id="question4"
                        name="question4"
                        value={answers.question4}
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

export default PreSurvey;
