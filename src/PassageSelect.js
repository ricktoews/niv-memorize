import React, { useEffect, useState } from 'react';
import { getTitles } from './memory-api';
import './passage-select.css';

function PassageSelect(props) {
  const [ state, setState ] = useState({ passage: '', showDropdown: false, title: '', refs: [] });
console.log('PassageSelect function state', state);

  const handleKey = (e) => {
    var el = e.currentTarget;
    setState({ ...state, passage: el.value });
    if (el.value.length >= 3) {
      getTitles(el.value).then(res => {
        var refs = res;
        setState({ ...state, passage: el.value, showDropdown: true, refs: refs });
      });
    }
  }

  const handleDropdown = (e) => {
    e.preventDefault();
    var el = e.currentTarget;
    var { refndx } = el.dataset;
    var select = state.refs[refndx];
    var title = `${select.book} ${select.chapter}`;
    setState({ ...state, passage: '', title, showDropdown: false });
    props.selectPassage(select.book, select.chapter);
  }

  const handleSelect = (e) => {
    e.preventDefault();
    var el = e.currentTarget;
    getTitles(el.value).then(res => {
      if (res.length === 1) {
        props.selectPassage(res[0].book, res[0].chapter);
      }
    });
  }

  return (
    <div className="passage-header">
      <div>
        <input value={state.passage} type="text" placeholder="Enter passage" id="passage-select" onChange={handleKey} onBlur={handleSelect} />
        <div className={'dropdown ' + (state.showDropdown ? 'show-dropdown' : 'hide-dropdown') }>
          <ul>
          { 
            state.refs.map((item, key) => {
              var title = `${item.book} ${item.chapter}`;
              return <li key={key} onClick={handleDropdown} data-refndx={key}>{title}</li>;
            })
          }
          </ul>
        </div>
      </div>
      <div>
        <h2>{state.title}</h2>
      </div>
    </div>
  );
}

export default PassageSelect;
