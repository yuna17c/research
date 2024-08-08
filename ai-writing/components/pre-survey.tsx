import React, { useState } from 'react';

interface SurveyFormProps {
    onSurveyComplete: (answers: Record<string, string>) => void;
}

const PreSurvey: React.FC<SurveyFormProps> = ({ onSurveyComplete }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSurveyComplete(answers);
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
            <h1>Pre-experiment survey</h1>
            <form id="survey-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="question1">Question 1: What is your name?</label>
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
                    <label htmlFor="question2">Question 2: How old are you?</label>
                    <input
                        type="number"
                        id="question2"
                        name="question2"
                        value={answers.question2}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="question3">Question 3: </label>
                    <input
                        type="text"
                        id="question3"
                        name="question3"
                        value={answers.question3}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button className="submit-button" type="submit">Next</button>
            </form>
        </>
    );
};

export default PreSurvey;
