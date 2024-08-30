import React, { useState } from 'react';

interface SurveyFormProps {
    onComplete: () => void;
    onBack: () => void;
}

const ConsentForm: React.FC<SurveyFormProps> = ({ onComplete, onBack }) => {
    const [checkboxes, setCheckboxes] = useState([false, false, false]);

    // Handle checkbox changes
    const handleCheckboxChange = (index: number) => {
        const updatedCheckboxes = [...checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        setCheckboxes(updatedCheckboxes);
    };

    // Determine if all checkboxes are checked
    const allChecked = checkboxes.every(Boolean);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (allChecked) {
            // Proceed only if all checkboxes are checked
            onComplete(); 
        }
    };

    return (
        <>
            <h1>Consent Form</h1>
            <div id="consent-content">
                <p>
                If you have any questions regarding this study, or would like additional information to assist you in reaching a decision about participation, please contact Dr. Jian Zhao at jianzhao@uwaterloo.ca or by telephone at 519.888.4567 x32987.
                </p>
            </div>
            <form id="consent-form" onSubmit={handleSubmit}>
                <div><label>
                    <input
                    type="checkbox"
                    checked={checkboxes[0]}
                    onChange={() => handleCheckboxChange(0)}
                    />
                    I agree to participate in this study.
                </label></div>
                <div><label>
                    <input
                    type="checkbox"
                    checked={checkboxes[1]}
                    onChange={() => handleCheckboxChange(1)}
                    />
                    I am aware that my interactions with the study systems will be logged.
                </label></div>
                <div><label>
                    <input
                    type="checkbox"
                    checked={checkboxes[2]}
                    onChange={() => handleCheckboxChange(2)}
                    />
                    I agree to allow my study responses to be captured.
                </label></div>
                <div><label>
                    <input
                    type="checkbox"
                    checked={checkboxes[3]}
                    onChange={() => handleCheckboxChange(3)}
                    />
                    I agree to allow my study responses to be captured.
                </label></div>
                <div><label>
                    <input
                    type="checkbox"
                    checked={checkboxes[4]}
                    onChange={() => handleCheckboxChange(4)}
                    />
                    I agree to allow logs of my interactions to be used in teaching, scientific presentations, and/or publications.
                </label></div>
                <div><label>
                    <input
                    type="checkbox"
                    checked={checkboxes[5]}
                    onChange={() => handleCheckboxChange(5)}
                    />
                    I agree to the storage of my de-identified data in secure online servers.
                </label></div>
                <div><label>
                    <input
                    type="checkbox"
                    checked={checkboxes[6]}
                    onChange={() => handleCheckboxChange(6)}
                    />
                    I agree to the use of my de-identified data in any presentation or publication that comes from this research.
                </label></div>

                <button className="submit-button back-button" type="button" onClick={onBack}>I do not consent</button>
                <button className="submit-button" type="submit" disabled={!allChecked}>
                I consent
                </button>
            </form>
        </>
    );
};

export default ConsentForm;
