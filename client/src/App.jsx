import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Feed from "./components/Feed/Feed";
import Settings from "./components/Settings/Settings";
import Profil from "./components/Profil/Profil";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Navbar from "./components/Navbar/Navbar";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/profil/:id" element={<Profil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;