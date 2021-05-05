import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PassageSelect from './PassageSelect';
import Block from './Block';
import { getPassage } from './memory-api';
import { getWordList } from './memory-compare';
import { getExcerpt } from './excerpt';
import './block-layout.css';

const VerseBtnBlock = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const VerseBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #09f;
    color: white;
    cursor: pointer;
    margin: 3px;
`;

const VerseBtnLg = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #09f;
    color: white;
    cursor: pointer;
    margin: 3px;
`;

function Passage(props) {
  const [state, setState] = useState({ book: '', chapter: '', memoryText: [], currentIndex: 0 });
  const [randVerseNdx, setRandVerseNdx] = useState(0);
  const [versePool, setVersePool] = useState([]);

  useEffect(() => {
  }, []);

  function loadPassage(book, chapter) {
    getPassage(book, chapter)
      .then(data => {
        var items = [], pool = [];
        data.forEach((item, ndx) => {
          let text = item.text || item;
          let label = item.book ? `${item.book} ${item.chapter}:${item.verse}` : `Block ${ndx+1}`;
          items.push({ text: text, label: label });
          pool.push(ndx);
        });

        setState({ ...state, currentIndex: 0, memoryText: items });
        setVersePool(pool);
        selectRandomVerse(pool);
        return items;
    });
  }

  function selectPassage(book, chapter) {
    loadPassage(book, chapter);
  }

  function selectRandomVerse(pool) {
console.log('select random verse from', pool);
    if (pool.length === 0) {
console.log('You are finished.');
      return;
    }
    var poolNdx = Math.floor(Math.random() * pool.length);
    var verseNdx = pool[poolNdx];
    pool.splice(poolNdx, 1);
    setVersePool(pool);
    setRandVerseNdx(verseNdx);
  }

  const handleIdentifyVerse = e => {
    var el = e.target;
    var currentVerse = randVerseNdx + 1;
    var selectedVerse;
    if (el.value) {
      selectedVerse = el.value;
    } else {
      selectedVerse = el.dataset.verse;
    }
    console.log('handleIdentifyVerse', selectedVerse, currentVerse);
    if (selectedVerse == currentVerse) {
      selectRandomVerse(versePool);
    }
  }

  return (
    <div className="container">
      <PassageSelect selectPassage={selectPassage} />
      {state.memoryText.length === 0 ? null : (
      <>
      <div className="memory-blocks">
        {state.memoryText[randVerseNdx].text}
      </div>

      <VerseBtnBlock>
        { state.memoryText.map((item, verseNdx) => {
            return <VerseBtnLg key={verseNdx} className="verse-number" data-verse={verseNdx + 1} onClick={handleIdentifyVerse}>{verseNdx + 1}</VerseBtnLg>;
          }) 
        }
      </VerseBtnBlock>
      </>
      )}
    </div>
  )
}

export default Passage;
