import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './Sidebar';
import Viewing from './Viewing';
import { useEffect, useState } from 'react';
import {Outlet} from 'react-router-dom';

function Layout({notes, onAddNote, activeNote, setActiveNote, onDeleteNote, activeNoteFunct, onUpdateNote, hideSidebar }) {

    const[visible, setVisible] = useState(true);

    function headerButton() {
        setVisible(!visible);
    }

    return (
        <div className="App">
            <div className='top-bar'>

                <button id='menu' onClick={headerButton}>&#9776;</button>
                <h1 id='head'>Lotion</h1>
                <p id='subhead'>Like Notion, but worse.</p>
        </div>
        <Sidebar notes={notes} onAddNote={onAddNote} activeNote={activeNote} setActiveNote={setActiveNote}/>

        <Outlet />
    </div> 
    );
}

export default Layout;