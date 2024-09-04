import React, { useState } from 'react';
import Checkbox from './checkbox';

interface SurveyFormProps {
    onComplete: () => void;
}

const ConsentPage: React.FC<SurveyFormProps> = ({ onComplete }) => {
    const [checkboxes, setCheckboxes] = useState([false, false, false]);
    const [radioOption, setRadio] = useState('no');
    const allChecked = checkboxes.every(Boolean);

    // Handle checkbox changes
    const handleCheckboxChange = (index: number) => {
        const updatedCheckboxes = [...checkboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        setCheckboxes(updatedCheckboxes);
    };

    // Handle radio button changes
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadio(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (allChecked && radioOption==='yes') {
            // Proceed only if all checkboxes are checked and I consent is selected
            onComplete(); 
        }
    };

    return (
        <>
            <h1 className='page-title'>Consent Form</h1>
            <div id="consent-content">
                <p>Please review the following information letter:<br/>
                <a href="https://uwaterloo.ca1.qualtrics.com/CP/File.php?F=F_6lJ6Shjn3ZVZsQm" target='blank'>Information Letter</a>
                <br/><br/>
                By providing your consent, you are not waiving your legal rights or releasing the investigator(s) or involved institution(s) from their legal and professional responsibilities.
                <br/><br/>
                Project title: Interaction Techniques for Textual and Conversational Data
                <br/><br/>
                I have read the information letter about a study led by Dr. Jian Zhao, School of Computer Science, University of Waterloo. I have had the opportunity to ask questions related to the study and have received satisfactory answers to my questions and any additional details.
                I was informed that participation in the study is voluntary and that I can withdraw this consent by informing the researcher.  
                <br/><br/>
                This study has been reviewed and received ethics clearance through a University of Waterloo Research Ethics Board (REB #46163). If you have questions for the Board, contact the Office of Research Ethics, toll-free at 1-833-643-2379 (Canada and USA), 1-519-888-4440, or reb@uwaterloo.ca.
                If you have any questions regarding this study, or would like additional information to assist you in reaching a decision about participation, please contact Dr. Jian Zhao at jianzhao@uwaterloo.ca or by telephone at 519.888.4567 x32987.
                <br/><br/>
                </p>
            </div>
            <form id="consent-form" onSubmit={handleSubmit}>
                <Checkbox 
                label='I agree to participate in this study.' 
                checked={checkboxes[0]} 
                onChange={() => handleCheckboxChange(0)}/>
                <Checkbox 
                label='I am aware that my interactions with the study systems will be logged.' 
                checked={checkboxes[1]} 
                onChange={() => handleCheckboxChange(1)}/>
                <Checkbox 
                label='I agree to allow my study responses to be captured.' 
                checked={checkboxes[2]} 
                onChange={() => handleCheckboxChange(2)}/>
                <Checkbox 
                label='I agree to allow logs of my interactions to be used in teaching, scientific presentations, and/or publications.' 
                checked={checkboxes[3]} 
                onChange={() => handleCheckboxChange(3)}/>
                <Checkbox 
                label='I agree to the storage of my de-identified data in secure online servers.' 
                checked={checkboxes[4]} 
                onChange={() => handleCheckboxChange(4)}/>
                <Checkbox 
                label='I agree to the use of my de-identified data in any presentation or publication that comes from this research.' 
                checked={checkboxes[5]} 
                onChange={() => handleCheckboxChange(5)}/>
                <div id='consent-radio'>
                    <p>By selecting &apos;I consent&apos;, you agree to partcipate in the study.</p>
                    <label>
                        <input type="radio" name="choice" value="yes" onChange={handleOptionChange} />
                        I consent.
                    </label>
                    <label>
                        <input type="radio" name="choice" value="no" onChange={handleOptionChange} />
                        I do not consent.
                    </label>
                </div>
                <div className='next-button'>
                    <button className="submit-button" type="submit" disabled={!allChecked || radioOption==='no' }>Next</button>
                </div>
            </form>
        </>
    );
};

export default ConsentPage;
