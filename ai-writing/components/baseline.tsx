import React, { useRef } from 'react';

interface TextInputProps {
    onContentChange: (
        content: string
    ) => void;
}

const Baseline: React.FC<TextInputProps> = ({ onContentChange }) => {
    const editableDivRef = useRef<HTMLDivElement>(null);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const content = editableDivRef.current?.innerText || ''
        onContentChange(content);
    };

    return (
        <>
        <h1 className='page-title'>Baseline Writing Task</h1>
        <h2>Task</h2>
        <p>The following scenario describes a situation where you will be writing an email to someone to make a request. Imagine you are in that scenario (you may want to recall your experience if you have encountered a similar situation before) and write an email in the text box below, and feel free to fill in the details with your own situation or preferences. </p>
        <br/>
        <h2>Scenario</h2>
        <p>You ask your professor, William Smith, you took a class with a while ago to introduce you to someone who may be hiring in your chosen career path.</p>
        <div className="container">
            <div className='inputContainer'>
                <div id="editableDiv"
                unselectable="on"
                className="inputBox"
                contentEditable="true"
                ref={editableDivRef}
                >
                </div>
            </div>
        </div>
        <div className="next-button">
            <button className="submit-button" onClick={handleSubmit}>Next</button>
        </div>
        </>
    );
};

export default Baseline;
