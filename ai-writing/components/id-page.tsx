import React, { useState } from 'react';

interface SurveyFormProps {
    onComplete: (answers: string) => void;
}

const IdPage: React.FC<SurveyFormProps> = ({ onComplete }) => {
    const [answers, setAnswers] = useState<string>("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onComplete(answers);
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswers(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
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
            <div className='buttons'>
                <button className="submit-button" type="submit">Next</button>
            </div>
        </form>
    );
};

export default IdPage;
