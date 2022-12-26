import React, { useState, useEffect, useRef } from 'react';
import InputArea from './InputArea';
import BlockMenu from './BlockMenu';

function Block(props) {
  const { index, selected, selectBlock, block } = props;
  const { label, text, attention } = block;

  const { setClickedMenu, markText, clearText, ndx } = props;
  var attentionValues = [];

  function handleBlockClick(e) {
    var el = e.currentTarget;
    var label = el.querySelector('.block-label').innerText;
    var text = el.querySelector('.block-text').innerText;
    selectBlock(index);
  }

  function getNextBlock() {
    selectBlock(index+1);
  }

  function getPrevBlock() {
    selectBlock(index - 1);
  }

  // Right now, this mainly verifies the text to be checked.
  function attentionFocus(e) {
    var el = e.currentTarget;
    var ndx = el.dataset.ndx;
    console.log('attentionFocus', attentionValues[ndx]);
  }

  // This will check the input against the expected text.
  function attentionBlur(e) {
    var el = e.currentTarget;
    var ndx = el.dataset.ndx;
    var expected = attentionValues[ndx];
    var entry = el.value;
    console.log('attentionChange', expected, entry);
  }

  // This function is looking too long and clunky. Its purpose is to convert the block needing attention into text with fields inserted for the problem spots.
  // It also collects the expected text for those fields.
  function attentionPrompt(blockText) {
    let safety = 5;
    let re = /\[(.+?)\]/;
    let fields = [];
    let attentionText = blockText;
    let match;
    let ndx = 0;
    while ((match = re.exec(attentionText)) && safety > 0) {
      let placeholder = match[0];
      let attention = match[1];
      attentionValues[ndx] = attention;
      let field = <input onFocus={attentionFocus} onBlur={attentionBlur} type="text" data-ndx={ndx} data-text={attention} />;
      fields.push(field)
      attentionText = attentionText.replace(placeholder, '|');
      safety--;
      ndx++;
    }
    let attentionPieces = attentionText.split('|');
    let blockPieces = attentionPieces.map((piece, ndx) => {
      let fragment = fields[ndx] ? <span key={ndx}>{piece}{fields[ndx]}</span> : <span key={ndx}>{piece}</span>;
      return fragment;
    });
    return blockPieces;
  }

  function showTextOrInput(blockText) {
    var blockPieces;
    var input;
    if (attention) {
      blockPieces = attentionPrompt(blockText);
      input = blockPieces.map(b => b);
    } else {
      input = <div className='block-text show-input'><InputArea memoryText={blockText} getPrevBlock={getPrevBlock} getNextBlock={getNextBlock} /></div>
    }
    if (selected) {
      return input
    } else {
      return <div className='block-text show-text'>{blockText}</div>
    }
  }

  var selectedClass = selected ? 'show-input' : 'show-text';
  return (
    <div onClick={handleBlockClick} className="block-layout">
      <div className="block-label">{label}</div>
      <div className={'block-text ' + selectedClass}>{showTextOrInput(text)}</div>
    </div>
    
  )
}

export default Block;
