import { BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./Layout.js"
import WriteBox from "./WriteBox";
import Empty from "./Empty";

function App() {
 
  return(
    
    <BrowserRouter>
    
      <Routes >
        <Route element={<Layout />}>
          <Route path="/" element={<Empty />} />
          <Route path="/notes" element={<Empty />} />
          <Route
            path="/notes/:noteId/edit"
            element={<WriteBox edit={true} />}
          />
          <Route path="/notes/:noteId" element={<WriteBox edit={false} />} />
          {/* any other path */}
          <Route path="*" element={<Empty />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App;