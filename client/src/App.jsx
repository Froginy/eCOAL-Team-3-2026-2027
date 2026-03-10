import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Feed from "./components/Feed/Feed";
import Settings from "./components/Settings/Settings";
import Profil from "./components/Profil/Profil";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dices" element={<Feed />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;