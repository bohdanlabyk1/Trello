import { Authform } from "./component/Authform/Authform";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Trello } from "./trello/Trello";

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Authform />} />
        <Route path="/dashboard" element={<Trello/>} />
      </Routes>
    </Router>
  );
}

export default App;
