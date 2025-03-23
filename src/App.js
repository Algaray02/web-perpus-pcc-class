import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Admin from "./Admin";
import Home from "./Home"; // Halaman utama perpustakaan
import NotFound from "./NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/web-perpus-pcc-class/" element={<Home />} />
        <Route path="/web-perpus-pcc-class/login" element={<Login />} />
        <Route path="/web-perpus-pcc-class/admin" element={<Admin />} />
        <Route path="/web-perpus-pcc-class/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
