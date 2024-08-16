import React, { useEffect, useRef, useState } from 'react';
import { setCursorPosition, getCursorPosition } from "@/components/cursor"
import { logEvent, getLogs, Action, Event } from "@/components/log";
import $ from 'jquery'

interface TextInputProps {
    onContentChange: (
        content: string, 
        actionNums:{[key:string]:number}, 
        userActions: Action[], 
        logs: Event[]
    ) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onContentChange }) => {
    const editableDivRef = useRef<HTMLDivElement>(null);
    const [userActions, setUserActions] = useState<Action[]>([])
    const [actionNums, setActionNums] =  useState<{[key:string]:number}>({'Generate':0, 'Accept':0, 'Regenerate':0, 'Ignore':0});
    const [loading, setLoading] = useState(false);
    const printable_keys = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?")
    let spaceBarTimer: NodeJS.Timeout | null = null;
    const [isTypeDisabled, setIsTypeDisabled] = useState(false);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const content = editableDivRef.current?.innerText || ''
        onContentChange(content, actionNums, userActions, getLogs());
    };

    const addToLastDiv = (divRef: HTMLDivElement, addText: string|undefined, isSuggestion: boolean) => {
        if (divRef) {
            const divs = divRef.querySelectorAll('div');
            const lastDiv = divs[divs.length - 1];
            const span = isSuggestion ? `<span class="suggestionText">${addText}</span>` : `${addText}`
            if (lastDiv) {
                lastDiv.innerHTML+=span;
            } else {
                divRef.innerHTML+=span;
            }
          }
    }

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
            const response = await fetch("/api/generate-pos",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({prompt: promptText})
            })
            // ?prompt="+encodeURIComponent(promptText))
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
                } else if (printable_keys.has(e.key) || e.key===" ") {
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
            } else if (e.key==' ') {
                // Space bar generates suggestion if waited more than a 1.5 second
                if (spaceBarTimer) {
                    clearTimeout(spaceBarTimer);
                }
                logEvent("text-insert", cursorPos, ' ')
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
                } else if (e.key=='Enter') {
                    logEvent("text-insert", cursorPos, '\n')
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
        <h1>Task</h1>
        <p id="task-desc">You ask your professor, William Smith, you took a class with a while ago to introduce you to someone who may be hiring in your chosen career path.</p>
        <h1>Instructions </h1>
        <div className="instructions">
            <p>The AI will generate suggestions for you once you pause for a bit after typing space. 
                The AI is given the following prompt to help make suggestions: 
                You are a helpful writing assistant that help users complete their emails. The email task is: You ask your professor, William Smith, you took a class with a while ago to introduce you to someone who may be hiring in your chosen career path.</p>
            <br />
            <p>Once the suggestion is generated, you can perform the following actions.</p>
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
        <div className="submit">
            <button className="submit-button" onClick={handleSubmit}>Next</button>
        </div>
        </>
    );
};

export default TextInput;
