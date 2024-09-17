import React, { useEffect, useRef, useState } from 'react';
import { setCursorPosition, getCursorPosition } from "@/components/cursor"
import { logEvent, getLogs, Action, Event, clearLogs } from "@/components/log";
import $ from 'jquery'
import { PRINTABLE_KEYS, WRITING_INFO_INSTR, WRITING_SCENARIO_TYPE, WRITING_TASK_INSTR } from './variables';
import { addToLastDiv, replace_newline } from '@/app/utils';

interface TextInputProps {
    onContentChange: (
        task_num: number,
        content: string, 
        actionNums:{[key:string]:number}, 
        userActions: Action[], 
        logs: Event[]
    ) => void;
    onBack: () => void;
    task_num: number;
    ai_type: string;
    scenario: WRITING_SCENARIO_TYPE
}

const TextInput: React.FC<TextInputProps> = ({ onContentChange, onBack, task_num, ai_type, scenario }) => {
    const editableDivRef = useRef<HTMLDivElement>(null);
    const [userActions, setUserActions] = useState<Action[]>([])
    const [actionNums, setActionNums] =  useState<{[key:string]:number}>({'Generate':0, 'Accept':0, 'Regenerate':0, 'Ignore':0});
    const [loading, setLoading] = useState(false);
    const [isTypeDisabled, setIsTypeDisabled] = useState(false);
    const ai_type_let = task_num===2 ? 'A' : 'B'
    const page_title = 'Writing Task ' + task_num.toString() + ' - with AI tool ' + ai_type_let
    const task = replace_newline(WRITING_TASK_INSTR)
    const info = replace_newline(scenario.info)
    let spaceBarTimer: NodeJS.Timeout | null = null;

    const handleSubmit = (event: React.FormEvent) => {
        logEvent('Click-next',0)
        event.preventDefault();
        window.scrollTo(0, 0);
        const content = editableDivRef.current?.innerText || ''
        onContentChange(task_num, content, actionNums, userActions, getLogs());
        clearLogs()
    };

    // Call API to generate suggestion from OpenAI model and move the cursor to cursorPosition
    const handleGenerate = async (cursorPosition: number, eventName: string) => {
        // Get prompt excluding the suggestion.
        const editableDiv = editableDivRef.current!;
        const suggestion = editableDiv.querySelector("span.suggestionText")
        const prompt: (string|null)[] = [];
        $('div').contents().each(function() {
            if (this.nodeType === 3) {
                prompt.push(this.nodeValue, ' ');
            } else if (this.nodeName === "BR") {
                prompt.push("\n");
            }
        });
        const promptText = prompt.join('');
        if (promptText) {
          try {
            // Get response from API
            const response = await fetch("/api/generate",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    prompt: promptText,
                    ai_type: ai_type,
                    scenario: scenario.text,
                })
            })
            const body = await response.json();
            if (body.response) {
                if (suggestion) suggestion.remove();
                const responseLines = body.response.replace(/\n/g, '<br>');
                addToLastDiv(editableDiv, responseLines, true)
                setCursorPosition(cursorPosition);
                logEvent(eventName, cursorPosition, body.response)
            }
          } catch(error) {
            console.error(error)
          } finally {
            setIsTypeDisabled(false);
            setLoading(false)
          }
        }
    }

    function update(key: string) {
        userActions.push({'action':key, 'timestamp':Date.now()})
        setUserActions(userActions)
        actionNums[key]+=1
        setActionNums(actionNums)
    }

    const handleSpaceBarAction = () => {
        setIsTypeDisabled(true);
        const cursorPos = getCursorPosition()
        setLoading(true)
        handleGenerate(cursorPos, "suggestion-generate");
        update("Generate")
    };

    useEffect(() => {
        // Handles keyboard actions
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTypeDisabled) {
                e.preventDefault();
                return;
            }
            const suggestion = editableDiv.querySelector("span.suggestionText")
            const suggestion_html = suggestion?.innerHTML
            const suggestion_text = suggestion?.textContent
            const cursorPos = getCursorPosition()
            if (suggestion_text) {
                if (e.key=="ArrowRight") {
                    // Accept suggestion
                    e.preventDefault()
                    suggestion.remove()
                    addToLastDiv(editableDiv, suggestion_html, false)
                    setCursorPosition(cursorPos+suggestion_text.length)
                    update("Accept")
                    logEvent("suggestion-accept", cursorPos)
                } else if (e.key=='Tab') {
                    // Regenerate suggestion
                    e.preventDefault()
                    setLoading(true)
                    handleGenerate(cursorPos, "suggestion-regenerate")
                    update("Regenerate")
                } else if (PRINTABLE_KEYS.has(e.key) || e.key===" ") {
                    // Continue writing removes suggestions
                    suggestion.remove()
                    update("Ignore")
                    logEvent("text-insert", cursorPos, e.key)
                } else if (e.key==="Backspace" || e.key==="Delete") {
                    // Close suggestions
                    e.preventDefault()
                    suggestion.remove()
                    update("Ignore")
                    logEvent("suggestion-close", cursorPos, e.key)
                } else if (e.key==="Enter") {
                    suggestion.remove()
                    update("Ignore")
                    logEvent("text-insert", cursorPos, '\n')
                }
            } else if (e.key==' ' || e.key=='Enter') {
                // Space bar generates suggestion if waited more than a 1.5 second
                if (spaceBarTimer) {
                    clearTimeout(spaceBarTimer);
                }
                const key = e.key==' ' ? ' ' : '\n'
                logEvent("text-insert", cursorPos, key)
                spaceBarTimer = setTimeout(() => {
                    e.preventDefault();
                    handleSpaceBarAction();
                }, 1500);
            } else {
                if (spaceBarTimer) {
                    clearTimeout(spaceBarTimer);
                    spaceBarTimer = null;
                }
                if (e.key=="ArrowRight") {
                    logEvent("cursor-forward", cursorPos)
                } else if (e.key=='ArrowLeft') {
                    logEvent("cursor-backward", cursorPos)
                } else if (e.ctrlKey==true) {
                    e.preventDefault()
                } else if (e.key=='Backspace') {
                    logEvent("text-delete", cursorPos)
                } else {
                    logEvent("text-insert", cursorPos, e.key)
                }
            }
        }
        const editableDiv = editableDivRef.current!;
        if (editableDiv) {
          editableDiv.addEventListener('keydown', handleKeyDown);
        }
        return () => {
          if (editableDiv) {
            editableDiv.removeEventListener('keydown', handleKeyDown);
          }
          if (spaceBarTimer) {
            clearTimeout(spaceBarTimer);
          }
        };
      }, [isTypeDisabled]);
   
    return (
        <>
        <h1 className='page-title'>{page_title}</h1>
        <h2>Task</h2>
        <p>{task}</p>
        <br/>
        <h2>Scenario</h2>
        <p>{scenario.text}<br/><br/>
        {WRITING_INFO_INSTR}<br/><br/>
        {info}
        </p>
        <h2>Instructions </h2>
        <div className="instructions">
            <p>Assume that the AI tool has already asked you to provide the scenario context so that it can give you customized suggestions.
                To use the AI tool:</p>
            <br/>
            <p>Once the suggestion is generated, you can perform the following actions.</p>
            <p><span>&rsaquo;</span>Initiate AI generation: press space bar and wait for a few seconds</p>
            <p><span>&rsaquo;</span>Right arrow to accept suggestions.</p>
            <p><span>&rsaquo;</span>Continue writing to ignore suggestions.</p>
            <p><span>&rsaquo;</span>Tab to regenerate recommendation.</p>
        </div>
        {loading ? (
            <div className='loadingMsg'>...GENERATING...</div>
        ) : (
            <div className='loadingMsg'></div>
        )}
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
        <div className="nav-buttons">
            <button className="submit-button back-button" type="button" onClick={onBack}>Back</button>
            <button className="submit-button" onClick={handleSubmit}>Next</button>
        </div>
        </>
    );
};

export default TextInput;
