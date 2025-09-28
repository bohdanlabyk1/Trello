import { Authform } from "./component/Authform/Authform";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from "./component/Dashboard/Dashboard";
import Header from "./component/Header/Header";
import Project from "./component/Project/Project";
import React, { useState } from "react";

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

  // Хедер не показуємо тільки на сторінці авторизації
  const hideHeader = location.pathname === "/";

  return (
    <>
      {!hideHeader && <Header onCreateProject={() => setIsmodal(true)} />}
      <Routes>
  <Route path="/" element={<Authform />} />
  <Route path="/dashboard" element={<Project ismodal={ismodal} setIsmodal={setIsmodal} />} />
  <Route path="/project/:id" element={<Dashboard />} />
</Routes>

    </>
  );
}

export default App;
