import { useRef } from "react"

function createRange(node: any, targetPosition: number) {
    let range = document.createRange();
    range.setStart(node, 0);
    let pos = 0;
    const stack = [node];
    while (stack.length > 0) {
        const current = stack.pop();
        if (current.nodeType === Node.TEXT_NODE) {
            const len = current.textContent.length;
            if (pos + len >= targetPosition) {
                range.setStart(current, targetPosition - pos)
                // range.setEnd(current, targetPosition - pos);
                range.collapse(true);
                return range;
            }
            pos += len;
        } else if (current.childNodes && current.childNodes.length > 0) {
            for (let i = current.childNodes.length - 1; i >= 0; i--) {
                stack.push(current.childNodes[i]);
            }
        }
    }
    // The target position is greater than the length of the contenteditable element
    range.setEnd(node, node.childNodes.length);
    return range;
};

// Set the position of the cursor to targetPosition in container
export function setCursorPosition(targetPosition: number) {
    const editableDiv = document.getElementById('editableDiv')
    const range = createRange(editableDiv!.parentNode, targetPosition);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
};

// Get the position of the cursor
export function getCursorPosition(): number {
    const editableDiv = document.getElementById('editableDiv')
    const selection = window.getSelection()!;
    let charCount = -1;
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editableDiv!);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        charCount = preCaretRange.toString().length;
        console.log("char", charCount)
    }
    return charCount;
};
