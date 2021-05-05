import React, { useEffect, useState } from 'react';
import MediaQuery from 'react-responsive';
import { getTitles } from './memory-api';
import './passage-select.css';

function PassageSelect(props) {
  const [ state, setState ] = useState({ passage: '', showDropdown: false, title: '', refs: [] });

  const handleKey = async (e) => {
    var el = e.currentTarget;
    setState({ ...state, passage: el.value });
    if (el.value.length >= 3) {
      var res = await getTitles(el.value);
      setState({ ...state, passage: el.value, showDropdown: true, refs: res });
    }
  }

  const handleDropdown = (e) => {
    e.preventDefault();
    var el = e.currentTarget;
    var { refndx } = el.dataset;
    var select = state.refs[refndx];
    var title = select.chapter ? `${select.book} ${select.chapter}` : select;
    setState({ ...state, passage: '', title, showDropdown: false });
    if (select.chapter) {
      props.selectPassage(select.book, select.chapter);
    } else {
      props.selectPassage(select);
    }
  }

  const handleSelect = async (e) => {
    e.preventDefault();
    var el = e.currentTarget;
    var res = await getTitles(el.value);
    if (res.length === 1) {
      if (parseInt(res[0].chapter, 10)) {
        props.selectPassage(res[0].book, res[0].chapter);
      } else {
        props.selectPassage(res[0]);
      }
    }
  }

  return (
    <div className="passage-header">
      <div>
        <input value={state.passage} autoComplete="off" type="text" placeholder="Enter passage" id="passage-select" onChange={handleKey} onBlur={handleSelect} />
        <div className={'dropdown ' + (state.showDropdown ? 'show-dropdown' : 'hide-dropdown') }>
          <ul>
          { 
            state.refs.map((item, key) => {
              var title = item.chapter ? `${item.book} ${item.chapter}` : item;
              return <li key={key} onClick={handleDropdown} data-refndx={key}>{title}</li>;
            })
          }
          </ul>
        </div>
      </div>
      <MediaQuery query="(min-width:481px) and (max-width:4096px)">
      <div>
        <h2>{state.title}</h2>
      </div>
      </MediaQuery>
    </div>
  );
}

export default PassageSelect;
