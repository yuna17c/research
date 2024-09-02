import React from 'react';

interface CompleteProps {
    onComplete: () => void;
}

const InstructionPage: React.FC<CompleteProps> = ({ onComplete }) => {
    return (
        <div>
            <h1>AI Writing tool instruction</h1>
            <div className='next-button' onClick={onComplete}>
                <button className="submit-button" type="submit">Next</button>
            </div>
        </div>
    );
};

export default InstructionPage;
