import React from 'react';

interface CompleteProps {
    onComplete: (step: string) => void;
}

const GeneralInstructionPage: React.FC<CompleteProps> = ({ onComplete }) => {
    const handleSubmit = () => {
        onComplete('baseline');
    };
    
    return (
        <div>
            <h1 className='page-title'>General Instructions</h1>
            <div className='instructions'>
                <p>In the following pages, you will be instructed to write several emails. When writing the emails, please:</p>
                <p><span>&rsaquo;</span>Turn off writing-assistant plugins on your browser, for example, Grammarly</p>
                <p><span>&rsaquo;</span>Do not use additional AI tools, for example, ChatGPT</p>
                <br/>
                <p>If you fail to follow these instructions, you might face denial of payment.</p>
                <br/>
                <p>Your email will be reviewed by individuals who could realistically be the recipients. These reviewers will rate the email&apos;s social appropriateness and the likelihood of providing a favorable response. The top 10% participants with the highest ratings across three emails will receive an additional £3 reward.</p>
            </div>
            <div className='nav-buttons'>
                <button className="submit-button" onClick={handleSubmit}>Next</button>
            </div>
        </div>
    );
};

export default GeneralInstructionPage;
