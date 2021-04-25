import React, { useState, useRef } from 'react';

function BlockMenu(props) {
  const [ menuState, setState ] = useState({ show: false, displayClass: 'hide-menu' });
  const { setClickedMenu, markText, clearText, ndx } = props;

  const menuRef = useRef(null);

  function hideMenu() {
    setState({ show: false, displayClass: 'hide-menu' });
  }

  function handleMenuClick(e) {
    e.stopPropagation();
    var el = e.currentTarget;
    setState({ show: true, displayClass: 'show-menu' });
    setClickedMenu(menuRef, hideMenu);
  }

  return (
    <div ref={menuRef} onClick={handleMenuClick} className="block-menu-btn">
      <div ref={menuRef} className={'block-menu ' + menuState.displayClass}>
        <ul>
          <li onClick={(e) => { markText(ndx) }}>Mark Text</li>
          <li onClick={() => { clearText(ndx) }}>Clear</li>
        </ul>
      </div>
      =
    </div>
  );
}

export default BlockMenu;
