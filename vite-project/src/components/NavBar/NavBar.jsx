import React from 'react';
import './NavBar.css';

function NavBar({displayModal}) {
  return (
      <div className="NavBar">
        <p > My Task</p>
        <button onClick={displayModal}>Add New Task</button>
      </div>
     )
}

export default NavBar
