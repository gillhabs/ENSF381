import React from 'react';
import ReactDOM from 'react-dom';
import {useNavigate} from "react-router-dom";
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from 'react';


function Editor({onDeleteNote, activeNote, onUpdateNote }) {

    const [content, setContent] = useState(activeNote.body);

    const onEditField = (key, value) => {
        onUpdateNote({
            ...activeNote,
            [key]: value,
            lastModified: Date.now(),
        });
    };


    const navigate = useNavigate();
    const saveNote = (activeNoteId) => {
        activeNote.body = content;
        if(document.getElementById('dt').value !== ""){
            activeNote.lastModified = document.getElementById('dt').value;
        }
        navigate(`/notes/${activeNoteId}`);
    }

    const deleteNote = (activeNoteId) => {
        onDeleteNote(activeNoteId);
        navigate(`/`);
    }


    if(!activeNote) {return <div className='no-active-note'>Select a note, or create a new one.</div>; }

    return (
        <div className='app-main'>
            <div className='app-main-note-edit'>
                <input type='text' id='title' placeholder='Untitled' value={activeNote.title} onChange={(e) => onEditField('title', e.target.value)} autoFocus/>
                <input type="datetime-local" id = "dt" />
 
                <button id='save' onClick={() => saveNote(activeNote.id)}>Save</button>
                <button id='delete' onClick={() => deleteNote(activeNote.id)}>Delete</button>

            </div>

            <div className = "app-main-note-edit-bar">


            </div>
            <div className='app-main-body'>
            <ReactQuill
            style = {{ height: "500px"}}
            theme = "snow"
            id="body"
            classList = "text-area"
            placeholder="Your Note Here"
            value={content}
            onChange = {setContent}

            

            />
            </div>

        </div>
    );
}

export default Editor;
