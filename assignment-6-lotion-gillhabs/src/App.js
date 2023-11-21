import { useEffect, useState } from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import uuid from 'react-uuid';
import './App.css';
import Sidebar from './Sidebar';
import Layout from './Layout';
import Viewing from './Viewing';
import Editor from './Editor';
import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  const existing = localStorage.getItem("notes");

  const [notes, setNotes] = useState(existing ? JSON.parse(existing) : []);
  const [activeNote, setActiveNote] = useState(false);


  useEffect(() => {
  localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes]);



  const onAddNote = () => {
    var newNote = {
      id: uuid(),
      title: 'Untitled',
      body: '',
      lastModified: Date.now(),
    };
    setNotes([newNote, ...notes]);
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === activeNote) {
        return updatedNote;
      }
      return note;
    });
    setNotes(updatedNotesArr);
  };

  const onDeleteNote = (idToDelete) => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
      setNotes(notes.filter((note) => note.id !== idToDelete));
    }
  };

  const getActiveNote = () => {
    return notes.find((note) => note.id === activeNote);
  };

  const hideSidebar = () => {
    if (document.getElementsByName(Sidebar).style.display = 'flex') {
      document.getElementsByName(Sidebar).style.display = 'none';
    } else {
      document.getElementsByName(Sidebar).style.display = '';
    }
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route element = {<Layout notes={notes} onAddNote={onAddNote} activeNote={activeNote} setActiveNote={setActiveNote} onDeleteNote={onDeleteNote} onUpdateNote={onUpdateNote} hideSidebar = {hideSidebar} />}>
          <Route path="/" element={<Navigate to = "/notes"/>} />
          <Route path = "/notes/:activeNote/edit" element = {<Editor onDeleteNote={onDeleteNote} activeNote={getActiveNote()} onUpdateNote={onUpdateNote}/>} />
          <Route path = "/notes/:activeNote" element = {<Viewing onDeleteNote={onDeleteNote} activeNote={getActiveNote()} onUpdateNote={onUpdateNote}/>} />
          <Route path = "/notes" element = {<Viewing onDeleteNote={onDeleteNote} activeNote={getActiveNote()} onUpdateNote={onUpdateNote}/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );


  
}

export default App;