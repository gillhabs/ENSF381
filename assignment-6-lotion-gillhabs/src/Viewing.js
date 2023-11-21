import React from 'react';
import ReactDOM from 'react-dom';
import {useNavigate} from "react-router-dom";

function Viewing({onDeleteNote, activeNote, onUpdateNote }) {
    const onEditField = (key, value) => {
        onUpdateNote({
            ...activeNote,
            [key]: value,
            lastModified: Date.now(),
        });
    };

    const navigate = useNavigate();
    const editNote = (activeNoteId) => {
        navigate(`/notes/${activeNoteId}/edit`);
    }

    const deleteNote = (activeNoteId) => {
        onDeleteNote(activeNoteId);
        navigate(`/`);
    }


    if(!activeNote) {return <div className='no-active-note'>Select a note, or create a new one.</div>; }

    return (
        <div className='app-main'>
            <div className='app-main-note-edit'>
                <h1 id = "title">{activeNote.title}</h1>
                <button id='save' onClick={() => editNote(activeNote.id)}>Edit</button>
                <button id='delete' onClick={() => deleteNote(activeNote.id)}>Delete</button>

            </div>

            <div className = "app-main-note-edit-bar">


            </div>
            <div classList = "viewing" dangerouslySetInnerHTML={{ __html: activeNote.body}} />
        </div>
    );
}

export default Viewing;
