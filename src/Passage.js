import React, { useState, useEffect } from 'react';
import PassageSelect from './PassageSelect';
import Block from './Block';
import { getPassage } from './memory-api';
import { getWordList } from './memory-compare';
import './block-layout.css';

function Passage() {
  const [state, setState] = useState({ book: '', chapter: '', memoryText: [], currentIndex: 0 });

  useEffect(() => {
  }, []);

  function loadPassage(book, chapter) {
    getPassage(book, chapter)
      .then(data => {
        var items = [];
        data.forEach(item => {
          items.push({ text: item.text, label: `${item.book} ${item.chapter}:${item.verse}` });
        });
        setState({ ...state, currentIndex: 0, memoryText: items });

        return items;
    });
  }

  function selectPassage(book, chapter) {
    console.log('select passage', book, chapter);
    //setState({ ...state, book, chapter });
    loadPassage(book, chapter);
  }

  function selectBlock(ndx) {
    if (ndx >= state.memoryText.length) {
      ndx = 0;
    }
console.log('selected block', ndx);
    setState({ ...state, currentIndex: ndx });
  }

  return (
    <div className="content">
      <PassageSelect selectPassage={selectPassage} />
      <div className="memory-blocks">
      {state.memoryText.map((item, key) => {
        let selected = state.currentIndex === key;
        return <Block key={key} index={key} selected={selected} block={item} selectBlock={selectBlock} />
      })}
      </div>
    </div>
  )
}

export default Passage;
