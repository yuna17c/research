import { addToLastDiv } from '@/app/utils';
import React, { useEffect, useRef, useState } from 'react';
import { getCursorPosition, setCursorPosition } from './cursor';
import { PRINTABLE_KEYS } from './variables';
import $ from 'jquery'

interface CompleteProps {
    onComplete: (step: string) => void;
}

const InstructionPage: React.FC<CompleteProps> = ({ onComplete }) => {
    const editableDivRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [isTypeDisabled, setIsTypeDisabled] = useState(false);
    let spaceBarTimer: NodeJS.Timeout | null = null;

    const handleSubmit = () => {
        onComplete('writing_task1');
        window.scrollTo(0, 0);
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
            const response = await fetch("/api/generate_generic",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    prompt: promptText,
                })
            })
            const body = await response.json();
            if (body.response) {
                if (suggestion) suggestion.remove();
                const responseLines = body.response.replace(/\n/g, '<br>');
                addToLastDiv(editableDiv, responseLines, true)
                setCursorPosition(cursorPosition);
            }
          } catch(error) {
            console.error(error)
          } finally {
            setIsTypeDisabled(false);
            setLoading(false)
          }
        }
    }
    const handleSpaceBarAction = () => {
        setIsTypeDisabled(true);
        const cursorPos = getCursorPosition()
        setLoading(true)
        handleGenerate(cursorPos, "suggestion-generate");
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
                } else if (e.key=='Tab') {
                    // Regenerate suggestion
                    e.preventDefault()
                    setLoading(true)
                    handleGenerate(cursorPos, "suggestion-regenerate")
                } else if (PRINTABLE_KEYS.has(e.key) || e.key===" ") {
                    // Continue writing removes suggestions
                    suggestion.remove()
                } else if (e.key==="Backspace" || e.key==="Delete") {
                    // Close suggestions
                    e.preventDefault()
                    suggestion.remove()
                } else if (e.key==="Enter") {
                    suggestion.remove()
                }
            } else if (e.key==' ' || e.key=='Enter') {
                // Space bar generates suggestion if waited more than a 1.5 second
                if (spaceBarTimer) {
                    clearTimeout(spaceBarTimer);
                }
                const key = e.key==' ' ? ' ' : '\n'
                spaceBarTimer = setTimeout(() => {
                    e.preventDefault();
                    handleSpaceBarAction();
                }, 1500);
            } else {
                if (spaceBarTimer) {
                    clearTimeout(spaceBarTimer);
                    spaceBarTimer = null;
                }
                if (e.ctrlKey==true) {
                    e.preventDefault()
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
        <div>
            <h1>AI Writing tool instruction</h1>
            <p> For the following tasks, you will be asked to write emails with the help of an AI writing tool, which generates suggestions for completing a sentence or next sentence(s). The following video show how the system works:</p>
            <div className='instr-vid'>
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/0icTRscPokU" // Replace with your video URL
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <div id='testbox'>
                <h2>Test Box</h2>
                <p>In the following textbox, you can try out the AI tool and its functions. Your writing here will not be recorded.</p>
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
        </div>
            <div className='next-button' onClick={handleSubmit}>
                <button className="submit-button" type="submit">Next</button>
            </div>
        </div>
    );
};

export default InstructionPage;
