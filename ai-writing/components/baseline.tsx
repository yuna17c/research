import React, { useEffect, useRef, useState } from 'react';
import { WRITING_INFO_INSTR, WRITING_SCENARIO_TYPE } from './variables';
import { replace_newline } from '@/app/utils';

interface TextInputProps {
    onContentChange: (
        content: string,
        duration: number,
        logs: string[]
    ) => void;
    scenario: WRITING_SCENARIO_TYPE
}

const Baseline: React.FC<TextInputProps> = ({ onContentChange, scenario }) => {
    const [startTime,setStartTime] = useState<number>(0)
    const [logs, setLogs] = useState<string[]>([])
    const editableDivRef = useRef<HTMLDivElement>(null);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const content = editableDivRef.current?.innerText || ''
        onContentChange(content, Date.now()-startTime, logs);
        console.log(logs)
        window.scrollTo(0, 0);
    };
    const info = replace_newline(scenario.info)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // add the start time
            if (startTime==0) setStartTime(Date.now());
            // add baseline logs
            logs.push(e.key)
            setLogs(logs)
        }
        const editableDiv = editableDivRef.current!;
        if (editableDiv) {
            editableDiv.addEventListener('keydown', handleKeyDown);
          }
        return () => {
            if (editableDiv) {
              editableDiv.removeEventListener('keydown', handleKeyDown);
            }
        };
    })

    return (
        <>
        <h1 className='page-title'>Writing task 1 - without AI</h1>
        <h2>Task</h2>
        <p>The following scenario describes a situation where you will be writing an email to someone to make a request. Imagine you are in that scenario (you may want to recall your experience if you have encountered a similar situation before) and write an email in the text box below, and feel free to fill in the details with your own situation or preferences. </p>
        <br/>
        <h2>Scenario</h2>
        <p>{scenario.text}<br/><br/>
        {WRITING_INFO_INSTR}<br/><br/>
        {info}
        </p>
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
