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
  const [memoryText, setMemoryText] = useState([]);
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [randVerseNdx, setRandVerseNdx] = useState(0);
  const [versePool, setVersePool] = useState([]);
  const [finished, setFinished] = useState(false);

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

        setBook(book);
        setChapter(chapter);
        setMemoryText(items);
        setVersePool(pool);
        selectRandomVerse(pool);
        return items;
    });
  }

  function selectPassage(book, chapter) {
    loadPassage(book, chapter);
  }

  const restartQuiz = e => {
    var pool = [];
    console.log('restartQuiz; memoryText', memoryText);
    memoryText.forEach((item, ndx) => {
      pool.push(ndx);
    });
    setFinished(false);
    setVersePool(pool);
    selectRandomVerse(pool);
    console.log('Pool refreshed', pool);
  }

  function selectRandomVerse(pool) {
console.log('select random verse from', pool);
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
      if (versePool.length === 0) {
        setFinished(true);
      } else {
        selectRandomVerse(versePool);
      }
    }
  }

  return (
    <div className="container">
      <PassageSelect selectPassage={selectPassage} />
      {memoryText.length === 0 ? null : (
      <>

      <div className="memory-blocks">
        {memoryText[randVerseNdx].text}
      </div>

      { finished === false ? (
        <VerseBtnBlock>
          { memoryText.map((item, verseNdx) => {
              return <VerseBtnLg key={verseNdx} className="verse-number" data-verse={verseNdx + 1} onClick={handleIdentifyVerse}>{verseNdx + 1}</VerseBtnLg>;
            }) 
          }
        </VerseBtnBlock>

      ) : (
        <button className="btn btn-info" onClick={restartQuiz}>Restart</button>
      )}
        
      </>
      )}
    </div>
  )
}

export default Passage;
