import React from 'react';

interface OptionProps {
    onComplete: (option: number) => void;
}

const OptionsPage: React.FC<OptionProps> = ({ onComplete }) => {
    return (
        <>
        <h1 className='page-title'></h1>
        <p>Please select one of the options based on the instruction.</p>
        <div id='options'>
            <h2 onClick={() => onComplete(1)}>Option 1</h2>
            <h2 onClick={() => onComplete(2)}>Option 2</h2>
        </div>
        </>
    );
};

export default OptionsPage;
