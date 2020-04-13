import React from 'react';
import InputArea from './InputArea';

function Block(props) {
  const { index, selected, selectBlock, block } = props;
  const { label, text } = block;

  function handleBlockClick(e) {
    var el = e.currentTarget;
    var label = el.querySelector('.block-label').innerText;
    var text = el.querySelector('.block-text').innerText;
    selectBlock(index);
  }

  function getNextBlock() {
    selectBlock(index+1);
  }

  function showTextOrInput() {
    if (selected) {
      return <div className='block-text show-input'><InputArea memoryText={text} getNextBlock={getNextBlock} /></div>
    } else {
      return <div className='block-text show-text'>{text}</div>
    }
  }

  var selectedClass = selected ? 'show-input' : 'show-text';
  return (
    <div onClick={handleBlockClick} className="block-layout">
      <div className="block-label">{label}</div>
      <div className={'block-text ' + selectedClass}>{showTextOrInput()}</div>
    </div>
    
  )
}

export default Block;
