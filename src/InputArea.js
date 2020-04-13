import React, { useState, useEffect, useRef } from 'react';
import "./input-area.css";
import { memCompare, isWordDivider, getWordList, isBlockFinished } from './memory-compare';
function InputArea(props) {
  const { memoryText, getNextBlock } = props;
  const memTextWords = getWordList(memoryText);
  const inputEl = useRef(null);

  const [state, setState] = useState({ textEl: null, entryStatus: [] });

  useEffect(() => {
console.log('Should focus on inputEl', inputEl);
    inputEl.current.focus();
  }, []);

  function entryStatus() {
    var statusLine;
    var wordArray = state.entryStatus.map((item, key) => {
      var className = item.correct ? 'correct' : 'incorrect';
      return <span key={key} className={className}>{item.word} </span>;
    })
    return wordArray;
  }

  function evaluate() {
    var { textEl } = state;
    var text = textEl && textEl.innerText || '';
    if (isWordDivider(text)) {
      var words = getWordList(text);
      var status = memCompare(words, memTextWords);
      if (isBlockFinished(status, memTextWords)) {
        getNextBlock();
      }
      setState({ ...state, entryStatus: status });
    }
  }

  function handleKey(e) {
    var textEl = e.target;
    setState({ ...state, textEl });
    evaluate();
  }

  return (
    <div>
      <div className="entry-status">{entryStatus().map(w => w)}</div>
      <div ref={inputEl} onKeyUp={handleKey} contentEditable="true" className="input-area" />
    </div>
  );
}

export default InputArea;
