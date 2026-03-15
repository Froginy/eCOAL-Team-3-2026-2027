import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Feed from "./components/feed/Feed";
import Settings from "./components/Settings/settings";
import Profile from "./components/Profile/Profile";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Navbar from "./components/Navbar/Navbar";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import axios from "axios";
import logo from "./assets/logo.svg";
import dice1 from "./assets/dice1.svg";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function SplashScreen({ onDone }) {
  const splashRef = useRef(null);
  const logoRef = useRef(null);
  const barFillRef = useRef(null);
  const diceRef = useRef(null);
  const barTrackRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(logoRef.current,
      { opacity: 0, y: 20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.6)" }
    );

    tl.fromTo(barFillRef.current,
      { width: "0%" },
      {
        width: "100%",
        duration: 1.4,
        ease: "power2.inOut",
      },
      "+=0.2"
    );

    tl.fromTo(diceRef.current,
      { left: "0%" },
      {
        left: "100%",
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: function () {
          const progress = this.progress();
          gsap.set(diceRef.current, {
            rotate: progress * 360,
          });
        },
      },
      "<"
    );

    tl.to(splashRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power3.in",
      onComplete: onDone,
    }, "+=0.3");
  }, []);

  return (
    <div
      ref={splashRef}
      className="fixed inset-0 z-9999 bg-white flex flex-col items-center justify-center gap-10"
    >
      <img
        ref={logoRef}
        src={logo}
        alt="Logo"
        className="h-10"
        style={{ opacity: 0 }}
      />

      <div className="relative w-64 flex flex-col gap-3">
        <div
          ref={barTrackRef}
          className="relative w-full h-1.5 bg-black/10 rounded-full overflow-visible"
        >
          <div
            ref={barFillRef}
            className="absolute top-0 left-0 h-full bg-black rounded-full"
            style={{ width: "0%" }}
          />
        </div>

        <img
          ref={diceRef}
          src={dice1}
          alt="dice"
          className="absolute w-7 h-7 invert-100"
          style={{
            top: "50%",
            left: "0%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
}

function App() {
  const { isLoading: authLoading } = useAuth();
  const [animDone, setAnimDone] = useState(false);
  const [homeCards, setHomeCards] = useState(null);
  const [cardsReady, setCardsReady] = useState(false);

  const ready = animDone && cardsReady && !authLoading;

  useEffect(() => {
    const api_url = import.meta.env.VITE_API_URL;
    axios.get(`${api_url}/dices`)
      .then(res => {
        const items = res.data?.data ?? [];
        setHomeCards(items);
      })
      .catch(() => setHomeCards([]))
      .finally(() => setCardsReady(true));
  }, []);

  return (
    <BrowserRouter>
      {!ready && <SplashScreen onDone={() => setAnimDone(true)} />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home initialCards={homeCards} />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;