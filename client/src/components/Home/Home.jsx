import axios from "axios";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import hero from "../../assets/hero.svg";
import ThreeModel from "../ThreeModel/ThreeModel";
import DiceCard from "../DiceCard/DiceCard";
import heroVideo from "../../assets/hero_video.mp4";
import "./Home.css";

const api_url = import.meta.env.VITE_API_URL;
gsap.registerPlugin(ScrollTrigger);

const CARD_W     = 300;
const CARD_GAP   = 24;
const CARD_STRIDE = CARD_W + CARD_GAP;
const MAX_CARDS  = 10;

function Home() {
  const [cards,   setCards]   = useState([]);
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  const heroRef    = useRef(null);
  const textRef    = useRef(null);
  const buttonsRef = useRef(null);
  const modelRef   = useRef(null);
  const ctaGRef    = useRef(null);
  const trackRef   = useRef(null);

useEffect(() => {
  axios.get(api_url + "/dices")
    .then(res => {
      if (Array.isArray(res.data.data)) {
        const items = res.data.data;
        if (items.length === 0) return;
        const filled = Array.from({ length: MAX_CARDS }, (_, i) => items[i % items.length]);
        setCards(filled);
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);

  useEffect(() => {
    axios.get(api_url + "/user", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (loading || cards.length === 0) return;

    const track = trackRef.current;
    if (!track) return;

    const SET_W   = cards.length * CARD_STRIDE;
    const BOUNCE  = 40;

    let offset     = 0;
    let vel        = 0;
    let lastX      = 0;
    let isDragging = false;
    let autoRaf    = null;
    let inertiaRaf = null;

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function maxOffset() {
      return Math.max(0, SET_W - window.innerWidth);
    }

    function rubberband(val, min, max) {
      if (val < min) return min - Math.sqrt(min - val) * BOUNCE * 0.5;
      if (val > max) return max + Math.sqrt(val - max) * BOUNCE * 0.5;
      return val;
    }

    function applyOffset() {
      const displayed = rubberband(offset, 0, maxOffset());
      gsap.set(track, { x: -displayed });
    }

    function updateArc() {
      const vw = window.innerWidth;
      track.querySelectorAll(".carousel-card").forEach(el => {
        const rect = el.getBoundingClientRect();
        const t = (rect.left + rect.width / 2 - vw / 2) / (vw / 2);
        gsap.set(el, {
          rotation: t * 10,
          y: t * t * 60,
          scale: 1 - Math.abs(t) * 0.06,
          transformOrigin: "bottom center",
        });
      });
    }

    function snapBack() {
      const max = maxOffset();
      const target = clamp(offset, 0, max);
      if (target === offset) return false;
      gsap.to({ val: offset }, {
        val: target,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
        onUpdate: function() { offset = this.targets()[0].val; applyOffset(); updateArc(); },
      });
      return true;
    }

    function startInertia() {
      cancelAnimationFrame(inertiaRaf);
      (function tick() {
        if (Math.abs(vel) < 0.5) {
          vel = 0;
          if (!snapBack()) updateArc();
          return;
        }
        const max = maxOffset();
        const friction = (offset < 0 || offset > max) ? 0.7 : 0.92;
        vel    *= friction;
        offset += vel;
        applyOffset();
        updateArc();
        inertiaRaf = requestAnimationFrame(tick);
      })();
    }

    function onDown(e) {
      isDragging = true;
      lastX = e.clientX;
      vel   = 0;
      cancelAnimationFrame(autoRaf);
      cancelAnimationFrame(inertiaRaf);
      track.setPointerCapture(e.pointerId);
    }

    function onMove(e) {
      if (!isDragging) return;
      const dx  = lastX - e.clientX;
      vel    = dx;
      offset += dx;
      applyOffset();
      updateArc();
      lastX = e.clientX;
    }

    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      if (offset < 0 || offset > maxOffset()) {
        vel = 0;
        snapBack();
      } else {
        startInertia();
      }
    }

    track.addEventListener("pointerdown",   onDown);
    track.addEventListener("pointermove",   onMove);
    track.addEventListener("pointerup",     onUp);
    track.addEventListener("pointerleave",  onUp);
    track.addEventListener("pointercancel", onUp);

    applyOffset();
    updateArc();

    return () => {
      cancelAnimationFrame(autoRaf);
      cancelAnimationFrame(inertiaRaf);
      track.removeEventListener("pointerdown",   onDown);
      track.removeEventListener("pointermove",   onMove);
      track.removeEventListener("pointerup",     onUp);
      track.removeEventListener("pointerleave",  onUp);
      track.removeEventListener("pointercancel", onUp);
    };
  }, [loading, cards]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(heroRef.current,    { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1,0.6)", delay: 0.1 })
      .fromTo(textRef.current,    { opacity: 0, y: 20 },      { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .fromTo(buttonsRef.current, { opacity: 0, y: 20 },      { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .fromTo(modelRef.current,   { opacity: 0, y: 30 },      { opacity: 1, y: 0, duration: 0.7 }, "-=0.3");
    return () => tl.kill();
  }, []);

  useEffect(() => {
    if (!ctaGRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ctaGRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ctaGRef.current, start: "top 85%", toggleActions: "play none none none" },
      });
    });
    return () => ctx.revert();
  }, []);

  const setW = cards.length * CARD_STRIDE;

  return (
    <div className="relative max-h-[300vh]">
      <div className="relative h-screen w-screen z-0">

        <div className="absolute top-4 md:top-1/2 left-1/2 -translate-x-1/2 translate-0 md:-translate-y-1/2 max-h-[90vh] max-w-[90vw] grid-dots-black rounded-4xl overflow-hidden">
          <video className="min-w-screen min-h-[80vh] md:min-h-screen object-cover" src={heroVideo} autoPlay loop muted playsInline preload="auto" />
        </div>

        <div className="flex justify-center items-center mb-10 h-[10vh]">
          <svg className="mix-blend-difference mt-25" width="66" height="28" viewBox="0 0 66 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.52637 0.123004C12.1558 0.123004 14.3984 1.07037 16.2529 2.96578C17.9989 4.72603 18.9276 6.83034 19.041 9.27828L14.8467 10.9482L14.7041 11.0097C13.2981 11.6568 12.6293 13.2982 13.208 14.7529L14.5186 18.0478C14.8789 18.9541 15.1368 19.602 14.8789 18.9541L16.9482 24.1533L17.0098 24.2968C17.3236 24.9778 17.8867 25.5127 18.583 25.791C19.2793 26.0691 20.0562 26.0692 20.7529 25.792L30.1533 22.0527L30.2959 21.9912C31.7019 21.3441 32.3707 19.7027 31.792 18.248L29.2549 11.8711V0.670856H34.9707V23.0771C34.9707 25.2862 33.1798 27.0771 30.9707 27.0771H29.2549L22.02 27.1386L14.7852 27.2002L7.93652 20.248C7.11711 19.4162 5.71582 20.0053 5.71582 21.1816V27.2002H0V9.79293C7.25328e-05 7.12402 0.927749 4.84822 2.78223 2.96578C4.64933 1.07065 6.89728 0.123108 9.52637 0.123004ZM9.52637 5.92476C8.47225 5.92487 7.57063 6.30573 6.82129 7.06636C6.08465 7.81413 5.71589 8.72289 5.71582 9.79293C5.71582 11.9291 7.42196 13.6609 9.52637 13.6611C10.5805 13.6611 11.4762 13.2876 12.2129 12.54C12.9623 11.7793 13.3379 10.8631 13.3379 9.79293C13.3378 8.72287 12.9623 7.81414 12.2129 7.06636C11.4762 6.30571 10.5806 5.92476 9.52637 5.92476Z" fill="white" />
            <path d="M35.7559 0.670856C38.9125 0.67112 41.4717 3.22994 41.4717 6.38668V27.0771H35.7559V0.670856Z" fill="white" />
            <path d="M53.7701 7.94218C53.8381 8.02754 53.8804 8.13423 53.8804 8.25175V27.0926H48.1637V8.25175C48.1637 8.15731 48.1904 8.06929 48.2359 7.99394L51.7486 9.50273L51.8092 9.52714C52.1077 9.63695 52.4379 9.62749 52.7301 9.50175C53.022 9.37598 53.255 9.14343 53.3804 8.85136L53.7701 7.94218Z" fill="white" />
            <path d="M61.6895 7.73633H65.5V13.5391H61.6895V17.4072C61.6896 18.4772 62.0574 19.3927 62.7939 20.1533C63.5434 20.9012 64.4457 21.2754 65.5 21.2754V27.0771C62.8707 27.0771 60.6221 26.1363 58.7549 24.2539C56.9004 22.3586 55.9737 20.0761 55.9736 17.4072V0H61.6895V7.73633Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M24.0635 8.18648C25.365 7.66866 26.8342 8.26632 27.4131 9.52437L27.4678 9.6523L30.8135 18.0644C31.3311 19.3659 30.7334 20.8341 29.4756 21.413L29.3477 21.4677L20.9365 24.8144C20.3131 25.0625 19.6182 25.0614 18.9951 24.8125C18.3723 24.5636 17.8687 24.0856 17.5879 23.4765L17.5322 23.3476L14.1865 14.9365C13.6688 13.635 14.2666 12.1669 15.5244 11.5878L15.6523 11.5322L24.0635 8.18648ZM26.1729 16.915C25.9118 16.8026 25.6166 16.7992 25.3525 16.9043C25.0886 17.0093 24.8771 17.2146 24.7646 17.4755C24.6522 17.7366 24.6479 18.0317 24.7529 18.2959C24.858 18.56 25.0641 18.7722 25.3252 18.8847C25.5862 18.997 25.8815 19.0015 26.1455 18.8964C26.4096 18.7913 26.6209 18.5852 26.7334 18.3242C26.8458 18.0631 26.8501 17.768 26.7451 17.5039C26.64 17.2397 26.434 17.0275 26.1729 16.915ZM22.9238 15.5156C22.6628 15.4032 22.3676 15.3988 22.1035 15.5039C21.8394 15.609 21.6281 15.8151 21.5156 16.0761C21.4032 16.3372 21.3989 16.6323 21.5039 16.8964C21.609 17.1606 21.8151 17.3728 22.0762 17.4853C22.3372 17.5976 22.6324 17.6011 22.8965 17.4961C23.1604 17.391 23.3719 17.1856 23.4844 16.9248C23.5968 16.6638 23.601 16.3685 23.4961 16.1045C23.391 15.8403 23.1849 15.6281 22.9238 15.5156ZM19.6748 14.1162C19.4138 14.0038 19.1185 13.9994 18.8545 14.1044C18.5905 14.2096 18.379 14.4157 18.2666 14.6767C18.1542 14.9378 18.1498 15.2329 18.2549 15.497C18.36 15.7612 18.566 15.9724 18.8271 16.0849C19.0883 16.1974 19.3833 16.2017 19.6475 16.0966C19.9116 15.9915 20.1229 15.7855 20.2354 15.5244C20.3477 15.2633 20.3521 14.9682 20.2471 14.7041C20.1419 14.44 19.9358 14.2286 19.6748 14.1162Z" fill="white" />
            <path d="M49.4569 3.04515C49.6683 2.55288 50.2269 2.31681 50.7239 2.49991L50.7735 2.51969L53.9547 3.8859C54.447 4.09731 54.6831 4.65593 54.5 5.15292L54.4803 5.20244L53.1142 8.38364C53.0129 8.61944 52.8251 8.80742 52.5894 8.90886C52.3537 9.0103 52.088 9.01746 51.8472 8.92888L51.7977 8.9091L48.6164 7.54289C48.1241 7.33147 47.888 6.77286 48.0711 6.27586L48.0908 6.22634L49.4569 3.04515ZM52.1654 5.05106C52.1225 5.15098 52.121 5.26385 52.1613 5.36484C52.2016 5.46584 52.2804 5.54669 52.3804 5.5896C52.4803 5.63251 52.5931 5.63397 52.6941 5.59366C52.7951 5.55335 52.876 5.47457 52.9189 5.37465C52.9618 5.27473 52.9632 5.16186 52.9229 5.06087C52.8826 4.95987 52.8038 4.87903 52.7039 4.83612C52.604 4.7932 52.4911 4.79174 52.3901 4.83205C52.2891 4.87236 52.2083 4.95114 52.1654 5.05106ZM50.9088 5.55259C50.8659 5.65251 50.8644 5.76538 50.9048 5.86638C50.9451 5.96737 51.0238 6.04822 51.1238 6.09113C51.2237 6.13405 51.3366 6.13551 51.4376 6.0952C51.5386 6.05489 51.6194 5.97611 51.6623 5.87619C51.7052 5.77627 51.7067 5.6634 51.6664 5.5624C51.626 5.46141 51.5473 5.38056 51.4473 5.33765C51.3474 5.29474 51.2345 5.29328 51.1336 5.33359C51.0326 5.3739 50.9517 5.45268 50.9088 5.55259ZM49.6522 6.05413C49.6093 6.15405 49.6079 6.26692 49.6482 6.36792C49.6885 6.46891 49.7673 6.54976 49.8672 6.59267C49.9671 6.63558 50.08 6.63704 50.181 6.59673C50.282 6.55642 50.3628 6.47764 50.4057 6.37772C50.4486 6.27781 50.4501 6.16493 50.4098 6.06394C50.3695 5.96294 50.2907 5.8821 50.1908 5.83919C50.0908 5.79628 49.978 5.79481 49.877 5.83512C49.776 5.87543 49.6951 5.95421 49.6522 6.05413Z" fill="white" />
            <path d="M51.617 4.88206C51.6431 4.35124 52.0945 3.94205 52.6254 3.96812C53.1562 3.99419 53.5654 4.44564 53.5393 4.97646L53.5321 5.12346C53.506 5.65428 53.0546 6.06346 52.5237 6.03739C51.9929 6.01133 51.5837 5.55988 51.6098 5.02905L51.617 4.88206Z" fill="white" />
            <path d="M48.6409 5.97646C48.667 5.44564 49.1185 5.03646 49.6493 5.06252C50.1801 5.08859 50.5893 5.54004 50.5632 6.07087L50.556 6.21786C50.5299 6.74868 50.0785 7.15787 49.5476 7.1318C49.0168 7.10573 48.6076 6.65428 48.6337 6.12346L48.6409 5.97646Z" fill="white" />
          </svg>
        </div>

        <section className="flex flex-col gap-2 justify-center items-center h-auto w-full">
          <article className="h-[50vh] flex flex-col justify-center items-center pointer-events-none overflow-none mt-10">
            <img ref={heroRef} src={hero} alt="Hero" className="mb-5 invert-100 mix-blend-difference" style={{ opacity: 0 }} />
            <p ref={textRef} className="text-xl md:text-2xl text-white mix-blend-difference" style={{ opacity: 0 }}>
              We made this platform for you. 😊
            </p>
            <article ref={buttonsRef} className="flex justify-center items-center gap-2 w-full mt-7 pointer-events-auto" style={{ opacity: 0 }}>
              <Link className="text-center py-2 px-12 rounded-full border border-black bg-white text-black transition-transform duration-200 hover:scale-105 hover:-rotate-2" to="/feed">Discover</Link>
              {user
                ? <Link className="text-center py-2 px-10 rounded-full bg-black text-white transition-transform duration-200 hover:scale-105 hover:-rotate-2" to="/profile">Profile</Link>
                : <Link className="text-center py-2 px-10 rounded-full bg-black text-white transition-transform duration-200 hover:scale-105 hover:-rotate-2" to="/register">Sign up</Link>
              }
            </article>
          </article>

          <article ref={modelRef} className="h-[80vh] relative mx-auto mt-20 w-full" style={{ opacity: 0, overflow: "visible" }}>
            <div className="absolute left-1/2 -translate-x-1/2 z-1 pointer-events-none">
              <ThreeModel />
            </div>
            <div className="absolute mt-60 min-h-150 mb-10 z-10 w-full" style={{ cursor: "grab", userSelect: "none", overflow: "hidden" }}>
              ⁄
              <div ref={trackRef} className="flex" style={{ gap: CARD_GAP, width: setW }}>
                {loading ? (
                  <p>Loading Cards...</p>
                ) : (
                  cards.map((card, i) => (
                    <div key={`${card.id}-${i}`} className="carousel-card" style={{ flexShrink: 0, width: CARD_W }}>
                      <DiceCard {...card} user_id={card.collection?.user_id} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>

          <article ref={ctaGRef} className="mx-auto flex flex-col gap-12 justify-center items-center h-[50vh] relative z-20" style={{ opacity: 0 }}>
            <svg width="321" height="54" viewBox="0 0 321 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M38.4015 28.15C37.8015 26.77 36.8815 25.69 35.6415 24.91C34.4215 24.11 32.9815 23.71 31.3215 23.71C29.7615 23.71 28.3615 24.07 27.1215 24.79C25.8815 25.51 24.9015 26.54 24.1815 27.88C23.4615 29.2 23.1015 30.74 23.1015 32.5C23.1015 34.26 23.4615 35.81 24.1815 37.15C24.9015 38.49 25.8815 39.52 27.1215 40.24C28.3615 40.96 29.7615 41.32 31.3215 41.32C32.7815 41.32 34.0915 41.01 35.2515 40.39C36.4315 39.75 37.3715 38.85 38.0715 37.69C38.7915 36.51 39.2015 35.14 39.3015 33.58H30.4815V31.87H41.5215V33.4C41.4215 35.24 40.9215 36.91 40.0215 38.41C39.1215 39.89 37.9115 41.06 36.3915 41.92C34.8915 42.78 33.2015 43.21 31.3215 43.21C29.3815 43.21 27.6215 42.76 26.0415 41.86C24.4615 40.94 23.2115 39.67 22.2915 38.05C21.3915 36.41 20.9415 34.56 20.9415 32.5C20.9415 30.44 21.3915 28.6 22.2915 26.98C23.2115 25.34 24.4615 24.07 26.0415 23.17C27.6215 22.25 29.3815 21.79 31.3215 21.79C33.5615 21.79 35.5215 22.35 37.2015 23.47C38.8815 24.59 40.1015 26.15 40.8615 28.15H38.4015ZM52.5383 43.24C50.9983 43.24 49.6083 42.9 48.3683 42.22C47.1483 41.52 46.1783 40.54 45.4583 39.28C44.7583 38 44.4083 36.51 44.4083 34.81C44.4083 33.11 44.7683 31.63 45.4883 30.37C46.2083 29.09 47.1883 28.11 48.4283 27.43C49.6683 26.73 51.0583 26.38 52.5983 26.38C54.1383 26.38 55.5283 26.73 56.7683 27.43C58.0283 28.11 59.0083 29.09 59.7083 30.37C60.4283 31.63 60.7883 33.11 60.7883 34.81C60.7883 36.49 60.4283 37.97 59.7083 39.25C58.9883 40.53 57.9983 41.52 56.7383 42.22C55.4783 42.9 54.0783 43.24 52.5383 43.24ZM67.3463 28.39V38.56C67.3463 39.56 67.5363 40.25 67.9163 40.63C68.2963 41.01 68.9663 41.2 69.9263 41.2H71.8463V43H69.5963C68.1163 43 67.0163 42.66 66.2963 41.98C65.5763 41.28 65.2163 40.14 65.2163 38.56V28.39H62.9363V26.62H65.2163V22.51H67.3463V26.62H71.8463V28.39H67.3463ZM133.328 26.62V43H131.228V40.12C130.748 41.14 130.008 41.92 129.008 42.46C128.008 43 126.888 43.27 125.648 43.27C123.688 43.27 122.088 42.67 120.848 41.47C119.608 40.25 118.988 38.49 118.988 36.19V26.62H121.058V35.95C121.058 37.73 121.498 39.09 122.378 40.03C123.278 40.97 124.498 41.44 126.038 41.44C127.618 41.44 128.878 40.94 129.818 39.94C130.758 38.94 131.228 37.47 131.228 35.53V26.62H133.328Z" fill="black" />
              <path d="M162.694 49.5102C162.729 49.5102 163.219 49.465 165.942 48.9007C168.204 48.4319 172.209 47.3901 174.837 46.8235C177.466 46.2569 178.585 46.1453 178.083 47.1015C176.225 50.6402 173.087 52.3134 173.113 52.4648C173.137 52.6025 173.647 52.3571 177.323 50.9856C180.999 49.6142 187.943 46.9946 191.718 45.6118C195.493 44.2289 195.889 44.1621 194.877 45.0832C193.866 46.0043 191.435 47.9152 190.097 48.9872C188.57 50.2108 188.327 50.5748 188.321 50.785C188.319 50.88 188.654 50.7698 191.214 50.0875C193.775 49.4053 198.637 48.1079 201.696 47.3754C204.755 46.6428 205.863 46.5143 207.185 46.382" stroke="#060606" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <a className="px-12 py-2 bg-black text-white rounded-full text-lg" href="">Gotcha !</a>
          </article>
        </section>
      </div>
      <Navbar />
    </div>
  );
}

export default Home;