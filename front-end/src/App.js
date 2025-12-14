import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Authform } from "./component/Authform/Authform";
import Dashboard from "./component/Dashboard/Dashboard";
import Header from "./component/Header/Header";
import Project from "./component/Project/Project";
import { useProjectStore } from "./component/boards/apiboardc";
import "./app.css";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const [ismodal, setIsmodal] = useState(false);
  const theme = useProjectStore(state => state.theme);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const hideHeader = location.pathname === "/";

  return (
    <>
      {!hideHeader && <Header onCreateProject={() => setIsmodal(true)} />}
      <Routes>
        <Route path="/" element={<Authform />} />
        <Route
          path="/dashboard"
          element={<Project ismodal={ismodal} setIsmodal={setIsmodal} />}
        />
        <Route path="/project/:id" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
