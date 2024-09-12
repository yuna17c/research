// Shuffle array
export const shuffle = <T,>(array: T[]) => {
    let currentIndex = array.length;
  
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array
}

export const replace_newline = (s: string) => {
    const replaced = s.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ))
    return replaced
}

export const addToLastDiv = (divRef: HTMLDivElement, addText: string|undefined, isSuggestion: boolean) => {
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

export const changeToDic = (arr:number[][]) => {
    var dic: {[key:number]:number[]} = {}
    arr.forEach((answers,i) => {
        dic[i+1] = answers
    })
    return dic
}