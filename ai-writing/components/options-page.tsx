import React from 'react';

interface OptionProps {
    onComplete: (option: number) => void;
}

const OptionsPage: React.FC<OptionProps> = ({ onComplete }) => {
    return (
        <>
        <p>Please click on the link below to continue the study. </p>
        <div id='options'>
            <h2 onClick={() => onComplete(1)}>Continue</h2>
            {/* <h2 onClick={() => onComplete(2)}>Option 2</h2> */}
        </div>
        </>
    );
};

export default OptionsPage;
