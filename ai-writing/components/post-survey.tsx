import React, { useState } from 'react';

interface SurveyFormProps {
    onPostSurveyComplete: (answers: Record<string, string>) => void;
}

const PostSurvey: React.FC<SurveyFormProps> = ({ onPostSurveyComplete }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onPostSurveyComplete(answers);
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
            <h1>Post-experiment survey</h1>
            <form id="survey-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="question1">Question 1: Rate this experience.</label>
                    <input
                        type="number"
                        id="question4"
                        name="question4"
                        value={answers.question4}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="question2">Question 2: </label>
                    <input
                        type="number"
                        id="question5"
                        name="question5"
                        value={answers.question5}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button className="submit-button">Submit</button>
            </form>
        </>
    );
};

export default PostSurvey;
