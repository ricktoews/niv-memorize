import React, { useState, useEffect } from 'react';
import PassageSelect from './PassageSelect';
import Block from './Block';
import { getPassage } from './memory-api';
import { getWordList } from './memory-compare';
import './block-layout.css';

function Passage(props) {
  const [state, setState] = useState({ book: '', chapter: '', memoryText: [], currentIndex: 0 });
  const { setClickedMenu, markTextRef } = props;

  useEffect(() => {
  }, []);

  function loadPassage(book, chapter) {
    getPassage(book, chapter)
      .then(data => {
        var items = [];
        data.forEach((item, ndx) => {
          let text = item.text || item;
          let attention = false;
/*
This is just to provide a test scenario for attention text.
if (item.chapter == 17 && item.verse == 2) {
  text = 'With her the [kings of the earth] committed adultery and the inhabitants of the [earth] were intoxicated with the wine of her adulteries.';
  attention = true;
}
*/
          let label = item.book ? `${item.book} ${item.chapter}:${item.verse}` : `Block ${ndx+1}`;
          items.push({ text: text, label: label, attention });
        });

        setState({ ...state, currentIndex: 0, memoryText: items });

        return items;
    });
  }

  function getSelectedText(ndx) {
    var selection = window.getSelection && window.getSelection();
    var selectedText = selection.toString();
    if (selectedText) {
var blockText = state.memoryText[ndx].text;
      var sections = blockText.split(selectedText);
      var markedText = sections[0] + '<span class="marked">' + selectedText + '</span>' + sections[1];
      var localText = sections[0] + '[' + selectedText + ']' + sections[1];
      var el = markTextRef.current;
      var wrapper = el.querySelector('.content');
      wrapper.innerHTML = markedText;
      state.memoryText[ndx].text = localText;
      state.memoryText[ndx].attention = true;
      setState({ ...state, memoryText: state.memoryText })
    }
  }

  function markText(ndx) {
    var blockText = state.memoryText[ndx].text;
    var el = markTextRef.current;
    var wrapper = el.querySelector('.content');
    wrapper.innerHTML = blockText;
    wrapper.addEventListener('mouseup', function(e) { if (e.target.className === 'content') { getSelectedText(ndx); } });
    el.style.display = 'block';
  }

  function clearText(ndx) {
    var blockText = state.memoryText[ndx].text;
    blockText = blockText.replace(/\[/g, '');
    blockText = blockText.replace(/\]/g, '');
    var memoryText = state.memoryText;
    memoryText[ndx].text = blockText;
    memoryText[ndx].attention = false;
    setState({ ...state, memoryText: memoryText });
  }

  function selectPassage(book, chapter) {
    loadPassage(book, chapter);
  }

  function selectBlock(ndx) {
    if (ndx >= state.memoryText.length) {
      ndx = 0;
    }

    setState({ ...state, currentIndex: ndx });
  }

  return (
    <div className="content">
      <PassageSelect selectPassage={selectPassage} />
      <div className="memory-blocks">
      {state.memoryText.map((item, key) => {
        let selected = state.currentIndex === key;
        return <Block key={key} clearText={clearText} markText={markText} ndx={key} setClickedMenu={setClickedMenu} index={key} selected={selected} block={item} selectBlock={selectBlock} />
      })}
      </div>
    </div>
  )
}

export default Passage;
