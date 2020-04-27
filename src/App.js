import React, { useEffect, useRef } from 'react';
import Passage from './Passage';
import './App.css';

function App() {
  const markRef = useRef(null);

  var menus = [];

  function handleAppClick(e) {
    if (e.target.className === 'mark-text-overlay') {
      markRef.current.style.display = 'none';
    }
    menus.forEach(m => {
      if (!m.ref.current.contains(e.target)) {
        m.handler();
      }
    });
  }

  useEffect(() => {
    document.addEventListener('click', handleAppClick);
  }, []);

  function setClickedMenu(ref, handler) {
    menus.push({ ref, handler });
  }

  function acceptMarked(e) {
    console.log('accept')
  }

  function rejectMarked(e) {
    console.log('reject')
  }

  return (
    <div className="App">
      <div ref={markRef} className={'mark-text-overlay'}>
        <div className="mark-text-wrapper">
          <div className="content"></div>
          <span onClick={acceptMarked} className="accept"></span>
          <span onClick={rejectMarked} className="reject"></span>
        </div>
      </div>

      <div className="content">
        <Passage markTextRef={markRef} setClickedMenu={setClickedMenu} />
      </div>
    </div>
  );
}

export default App;
