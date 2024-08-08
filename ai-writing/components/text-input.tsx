import React, { useEffect, useRef, useState } from 'react';
import { setCursorPosition, getCursorPosition } from "@/components/cursor"
import { logEvent, getLogs, Action, Event } from "@/components/log";
import $ from 'jquery'

interface TextInputProps {
    onContentChange: (content: string, actionNums:{[key:string]:number}, 
        userActions: Action[], logs: Event[]) => void;
}

const TextInput: React.FC<TextInputProps> = ({onContentChange }) => {
    const editableDivRef = useRef<HTMLDivElement>(null);
    const userActions: Action[] = [];
    const actionNums:{[key:string]:number} = {'Generate':0, 'Accept':0, 'Regenerate':0, 'Ignore':0}
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
                prompt.push(this.nodeValue);
            } else if (this.nodeName === "BR") {
                prompt.push("\n");
            }
        });
        const promptText = prompt.join('');
        console.log("sent", promptText)
        if (promptText) {
          try {
            // Get response from API
            const response = await fetch("/api/generate?prompt="+encodeURIComponent(promptText))
            const body = await response.json();
            console.log("response:", body.response)
            if (body.response) {
                if (suggestion) suggestion.remove();
                const responseLines = body.response.replace(/\n/g, '<br>');
                addToLastDiv(editableDiv, responseLines, true)
                console.log(cursorPosition)
                setCursorPosition(cursorPosition);
                logEvent(eventName, cursorPosition, body.response)
            }
          } catch(error) {
            console.error(error)
          } finally {
            setIsTypeDisabled(false);
          }
        }
    }

    function update(key: string) {
        userActions.push({'action':key, 'timestamp':Date.now()})
        actionNums[key]+=1
    }

    const handleSpaceBarAction = () => {
        setIsTypeDisabled(true);
        const cursorPos = getCursorPosition()
        logEvent("text-insert", cursorPos, ' ')
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
          const prompt = editableDiv.innerText
          const suggestion = editableDiv.querySelector("span.suggestionText")
          const suggestion_html = suggestion?.innerHTML
          const suggestion_text = suggestion?.textContent
          const cursorPos = getCursorPosition()
          console.log('prompt: ', prompt, ' suggestion: ', suggestion)
          if (suggestion_text) {
            if (e.key=="ArrowRight") {
              // Accept suggestion
              e.preventDefault()
              console.log("accepted")
              suggestion.remove()
              addToLastDiv(editableDiv, suggestion_html, false)
              setCursorPosition(cursorPos+suggestion_text.length)
              update("Accept")
              logEvent("suggestion-accept", cursorPos)
            } else if (e.key=='Tab') {
              // Regenerate suggestion
              e.preventDefault();
              console.log('regenerating...')
              handleGenerate(cursorPos, "suggestion-regenerate");
              update("Regenerate")
            } else if (printable_keys.has(e.key) || e.key===" " || e.key==="Backspace" || e.key==="Enter" || e.key==="Delete") {
              // Continue writing removes suggestions
              suggestion.remove()
              update("Ignore")
              logEvent("text-insert", cursorPos, e.key)
            }
          } else if (e.key==' ') {
            // Space bar generates suggestion if waited more than a 1.5 second
            if (spaceBarTimer) {
              clearTimeout(spaceBarTimer);
            }
            spaceBarTimer = setTimeout(() => {
              e.preventDefault();
              handleSpaceBarAction();
            }, 2000);
          } else if (spaceBarTimer) {
              clearTimeout(spaceBarTimer);
              spaceBarTimer = null;
          } else if (e.key=="ArrowRight") {
            logEvent("cursor-forward", cursorPos)
          } else if (e.key=="Tab") {
            console.log("tabbed:", suggestion_text)
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
            <p><span>&rsaquo;</span>Right arrow to accept suggestions.</p>
            <p><span>&rsaquo;</span>Continue writing to ignore suggestions.</p>
            <p><span>&rsaquo;</span>Tab to regenerate recommendation.</p>
        </div>
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
