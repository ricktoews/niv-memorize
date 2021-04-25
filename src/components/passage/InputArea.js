import React, { useState, useEffect, useRef } from 'react';
import "./input-area.css";
import { memCompare, isWordDivider, getWordList, isBlockFinished } from './memory-compare';
function InputArea(props) {
  const { memoryText, getNextBlock } = props;
  const memTextWords = getWordList(memoryText);
  const inputEl = useRef(null);

  const [wordState, setWordState] = useState({ textEl: null, entryStatus: [] });
  const [verseState, setVerseState] = useState(true);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  function entryStatus() {
    var statusLine;
    var wordArray = wordState.entryStatus.map((item, key) => {
      var className = item.correct ? 'correct' : 'incorrect';
      return <span key={key} className={className}>{item.word} </span>;
    })
    return wordArray;
  }

  function evaluate() {
    var { textEl } = wordState;
    var text = textEl && textEl.innerText || '';
    if (isWordDivider(text)) {
      var words = getWordList(text);
      var status = memCompare(words, memTextWords);
      var hasIncorrect = status.filter(s => !s.correct).length > 0;
      if (isBlockFinished(status, memTextWords)) {
        getNextBlock();
      }
      setVerseState(!hasIncorrect);
      setWordState({ ...wordState, entryStatus: status });
    }
  }

  function handleKey(e) {
    var textEl = e.target;
    setWordState({ ...wordState, textEl });
    evaluate();
  }

  return (
    <div>
{/*      <div className="entry-status" style={{display: 'none'}}>{entryStatus().map(w => w)}</div> */}
      <div ref={inputEl} onKeyUp={handleKey} className={'input-area ' + (!verseState ? 'incorrect' : '')} contentEditable="true" />
    </div>
  );
}

export default InputArea;
