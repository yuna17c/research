import React, { useState } from 'react';

interface SurveyFormProps {
    onComplete: (answers: string) => void;
    onBack: () => void;
}

const ProlificID: React.FC<SurveyFormProps> = ({ onComplete, onBack }) => {
    const [answers, setAnswers] = useState<string>("");
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onComplete(answers);
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswers(event.target.value);
    };

    return (
        <>
            <form id="survey-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="question1">What is your prolific ID?</label>
                    <input
                        type="text"
                        id="question1"
                        name="question1"
                        value={answers}
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

export default ProlificID;
