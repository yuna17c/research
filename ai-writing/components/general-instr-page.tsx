import React from 'react';

interface CompleteProps {
    onComplete: (step: string) => void;
    onBack: () => void;
}

const GeneralInstructionPage: React.FC<CompleteProps> = ({ onComplete, onBack }) => {
    const handleSubmit = () => {
        onComplete('baseline');
    };
    
    return (
        <div>
            <h1 className='page-title'>General Instructions</h1>
            <p className='instructions'>In the following pages, you will be instructed to write several emails. When writing the emails, please:
            <p><span>&rsaquo;</span>Turn off writing-assistant plugins on your browser, for example, Grammarly</p>
            <p><span>&rsaquo;</span>Do not use additional AI tools, for example, ChatGPT</p>
            <br/>If you fail to follow these instructions, you might face denial of payment.
            </p>
            <div className='nav-buttons'>
                <button className="submit-button back-button" type="button" onClick={onBack}>Back</button>
                <button className="submit-button" onClick={handleSubmit}>Next</button>
            </div>
        </div>
    );
};

export default GeneralInstructionPage;
