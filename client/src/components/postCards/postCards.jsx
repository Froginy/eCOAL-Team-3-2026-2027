import PostBar from "../PostBar/PostBar.jsx";
import arrow from "../../assets/arrow.svg";
import dice1 from "../../assets/dice1.svg";
import dice2 from "../../assets/dice2.svg";
import dice3 from "../../assets/dice3.svg";
import { useEntranceAnimation } from "../../hooks/useEntranceAnimation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import gsap from "gsap";

function PostCard({ id, name, description, images, collection, onEdit, onDelete }) {
  const { user: currentUser } = useAuth();
  const serverURL = import.meta.env.VITE_API_URL;
  const server_base = serverURL ? serverURL.replace("/api", "").replace(/\/$/, "") : "";
  const [CurrentImage, setCurrentImage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const diceIcons = [dice1, dice2, dice3];
  const currentImageUrl = images && images.length > 0 ? images[CurrentImage].image_url : "";

  const cardRef    = useEntranceAnimation({ y: 40, scale: 0.95, duration: 0.6, ease: "elastic.out(1, 0.6)" });
  const imgRef     = useRef(null);
  const dragStartX = useRef(null);
  const dragDelta  = useRef(0);
  const isDragging = useRef(false);

  const goTo = (index) => {
    const next = (index + images.length) % images.length;
    const dir  = dragDelta.current < 0 ? -1 : 1;
    gsap.fromTo(imgRef.current,
      { x: dir * 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
    );
    setCurrentImage(next);
  };

  const nextImage = (e) => {
    e.preventDefault();
    if (!images?.length) return;
    dragDelta.current = -1;
    goTo(CurrentImage + 1);
  };

  const onPointerDown = (e) => {
    dragStartX.current = e.clientX;
    dragDelta.current  = 0;
    isDragging.current = false;
    imgRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (dragStartX.current === null) return;
    dragDelta.current = e.clientX - dragStartX.current;
    if (Math.abs(dragDelta.current) > 5) {
      isDragging.current = true;
      gsap.set(imgRef.current, { x: dragDelta.current * 0.3 });
    }
  };

  const onPointerUp = () => {
    if (dragStartX.current === null) return;
    const diff = dragDelta.current;
    if (isDragging.current && Math.abs(diff) > 40 && images?.length) {
      if (diff < 0) goTo(CurrentImage + 1);
      else goTo(CurrentImage - 1);
    } else {
      gsap.to(imgRef.current, { x: 0, duration: 0.3, ease: "power3.out" });
    }
    dragStartX.current = null;
    isDragging.current = false;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative w-75 md:w-115 mb-7.5 bg-white shadow-lg rounded-2xl md:rounded-3xl flex flex-col"
    >
      {currentUser?.id === collection?.user_id && (
        <div className="absolute top-2.5 right-2.5 z-60" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
            </svg>
          </button>
          
          {menuOpen && (
            <div className="absolute top-11 right-0 w-36 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden py-1.5 z-70 animate-in fade-in zoom-in duration-200 origin-top-right">
              <button
                onClick={() => { onEdit(); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-black/5 text-sm font-bold transition-colors border-none bg-transparent cursor-pointer flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <div className="h-px bg-black/5 mx-2 my-1" />
              <button
                onClick={() => { onDelete(id); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500 text-sm font-bold transition-colors border-none bg-transparent cursor-pointer flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <PostBar user_id={collection?.user_id} dice_id={id} title={collection?.title} />
      <img
        ref={imgRef}
        src={`${server_base}/${currentImageUrl}`}
        alt={`${name} - ${CurrentImage}`}
        className="aspect-square object-cover w-[120%] self-center rounded-3xl shadow-lg select-none"
        draggable={false}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ cursor: "grab", touchAction: "pan-y" }}
      />
      <button
        onClick={nextImage}
        className="absolute top-35 md:top-60 md:-right-5 aspect-square w-10 md:w-10 -right-4 flex justify-center items-center bg-white rounded-full shadow-xl"
      >
        <img src={arrow} alt="arrow" className="rotate-270 h-5 aspect-square scale-110" />
      </button>
      <div className="flex justify-center bg-black/80 rounded-full backdrop-blur-3xl p-2 absolute top-63 md:top-104 gap-1.25 ml-2.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className="bg-transparent border-none p-0 flex items-center justify-center cursor-pointer transition-transform hover:scale-115 active:scale-95"
            aria-label={`Go to image ${index + 1}`}
          >
            <img
              src={diceIcons[index % diceIcons.length]}
              alt={`dice-${index}`}
              className={`w-5 odd:rotate-15 even:rotate--15 transition-opacity ${CurrentImage === index ? "opacity-100" : "opacity-40"}`}
            />
          </button>
        ))}
      </div>
      <div className="p-4">
        <p className="text-left leading-5 w-75 p-4 text-xl font-bold">{name}</p>
        <p className="text-left leading-5 w-75 p-4">{description}</p>
      </div>
    </div>
  );
}

export default PostCard;