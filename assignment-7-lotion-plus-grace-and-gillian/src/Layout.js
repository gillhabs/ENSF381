import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import NoteList from "./NoteList";
import { v4 as uuidv4 } from "uuid";
import { currentDate } from "./utils";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const localStorageKey = "lotion-v1";

function Layout() {
  const navigate = useNavigate();
  const mainContainerRef = useRef(null);
  const [collapse, setCollapse] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentNote, setCurrentNote] = useState(-1);

  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([null]);
  const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem("isLoggedIn")) || false);
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  


  
  useEffect(() => {
    const fetchNotes = async () => {
      if (profile){
        const response = await fetch(`https://tqcpdh23lnr6ahro4gusojbjbe0uvymd.lambda-url.ca-central-1.on.aws?email=${email}`);
        const notes = await response.json();
        setNotes(notes);
      }
    };
    fetchNotes();
  }, [email]);


  const login = useGoogleLogin({
    onSuccess: (TokenResponse) => {
      setUser(TokenResponse);
      setIsLoggedIn(true);
    },
    
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({ "email": email,"id": profile.id, "body": notes.body, "title": notes.title, "when": notes.when}),

          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }

    
  }, [user]);

  const logOut = () => {
    googleLogout();
    setUser([]);
    setProfile([]);
    setIsLoggedIn(false);
    setNotes([]);
    localStorage.removeItem("localNotes");
    setName("");
    setEmail("");
  };

  useEffect(() => {
    const height = mainContainerRef.current?.offsetHeight;
    if (height) {
      mainContainerRef.current.style.maxHeight = `${height}px`;}
    const existing = localStorage.getItem(localStorageKey);
    if (existing) {
      try {
        setNotes(JSON.parse(existing));
      } 
      catch {
        setNotes([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (profile && profile.name !== undefined) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile])


  useEffect(() => {
    if (currentNote < 0) {
      return;
    }
    if (!editMode) {
      navigate(`/notes/${currentNote + 1}`);
      return;
    }
    navigate(`/notes/${currentNote + 1}/edit`);
  }, [notes]);




  useEffect(() => {
    localStorage.setItem("name", name);
  }, [name]
  );


  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]
  );


  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn))
  }, [isLoggedIn]
  );
  


  const saveNote = async(note, index) => {
    note.body = note.body.replaceAll("<p><br></p>", "");
    setNotes([
      ...notes.slice(0, index),
      { ...note },
      ...notes.slice(index + 1),
    ]);

    const res = await fetch(
      "https://3fbddmop47z44dikxrf2m6eyoy0igzye.lambda-url.ca-central-1.on.aws/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "email": email,"id": note.id, "body": note.body, "title": note.title, "when": note.when}),
      }
    );
    setCurrentNote(index);
    setEditMode(false);
  };

  
  const deleteNote = async(index, currentNote) => {
    setNotes([...notes.slice(0, index),
      ...notes.slice(index + 1)]);
      const res = await fetch(
      "https://dvzmpxhbbimqlam3icsp3zvcte0tgoyb.lambda-url.ca-central-1.on.aws/",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "email": email, "id": currentNote.id}),
      }
    );
    setCurrentNote(0);
    setEditMode(false);
  };

  



  const addNote = () => {
    setNotes([
      {
        id: uuidv4(),
        title: "Untitled",
        body: "",
        when: currentDate(),
      },
      ...notes,
    ]);
    setEditMode(true);
    setCurrentNote(0);
  };

  
  return (
    <div id="container">
      <header>
        <aside>
          <button id="menu-button" onClick={() => setCollapse(!collapse)}>
            &#9776;
          </button>
        </aside>
        <div id="app-header">
          <h1>
            <Link to="/notes">Lotion</Link>
          </h1>
          <h6 id="app-moto">Like Notion, but worse.</h6>
        </div>
        <aside>&nbsp;</aside>
        {profile && isLoggedIn ? (
          <div className = "login-info"><p>{name}
          <button onClick={logOut}>LogOut</button></p></div>
          ) : <div></div>}
      </header>
      
      

      <div id="main-container" ref={mainContainerRef}>
        {isLoggedIn? (
        <><aside id="sidebar" className={collapse || isLoggedIn === false ? "hidden" : null}>
            <header>
              <div id="notes-list-heading">
                <h2>Notes</h2>
                <button id="new-note-button" onClick={addNote}>
                  +
                </button>
              </div>
            </header>
            <div id="notes-holder">
              <NoteList notes={notes} />
            </div>
          </aside><div id="write-box">
              <Outlet context={[notes, saveNote, deleteNote]} />
            </div></>
        
        ) : 
        (<div class="login">
            <button className = "login-button" onClick={() => login()}>Sign in with Google 🚀 </button>
          </div>)}
        
      </div>
    </div>
  );
}



export default Layout;