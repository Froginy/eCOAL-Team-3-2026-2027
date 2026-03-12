import PostBar from "../PostBar/PostBar.jsx";
import arrow from "../../assets/arrow.svg";
import dots from "../../assets/dots.svg";
import dice1 from "../../assets/dice1.svg";
import dice2 from "../../assets/dice2.svg";
import dice3 from "../../assets/dice3.svg";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function PostCard({ id, name, description, images, collection, onEdit, onDelete }) {
  const { user: currentUser } = useAuth();
  const serverURL = import.meta.env.VITE_API_URL;
  const server_base = serverURL
    ? serverURL.replace("/api", "").replace(/\/$/, "")
    : "";
  const [CurrentImage, setCurrentImage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const diceIcons = [dice1, dice2, dice3];
  
  const isOwner = currentUser && collection && currentUser.id === collection.user_id;

  const currentImageUrl =
    images && images.length > 0 ? images[CurrentImage].image_url : "";

  const nextImage = (e) => {
    e.preventDefault();
    if (images && images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
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
    <div className="relative w-75 md:w-115 mb-7.5 bg-white shadow-lg rounded-2xl md:rounded-3xl flex flex-col ">
      <PostBar user_id={collection?.user_id} dice_id={id} title={collection?.title} />

      {/* Overflow Menu Button (Owner Only) */}
      {isOwner && (
        <div className="absolute top-4 right-4 z-50" ref={menuRef}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full border border-black/5 shadow-sm hover:bg-white transition-colors cursor-pointer"
          >
            <img src={dots} alt="menu" className="w-4" />
          </button>

          {menuOpen && (
            <div className="absolute top-10 right-0 w-36 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden py-1.5 animate-in fade-in zoom-in duration-150 origin-top-right">
              <button 
                onClick={() => { 
                  setMenuOpen(false); 
                  if (typeof onEdit === "function") onEdit(); 
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-black hover:bg-black/5 transition-colors text-left border-none bg-transparent cursor-pointer font-medium"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button 
                onClick={() => { 
                  setMenuOpen(false); 
                  if (typeof onDelete === "function") onDelete(id); 
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left border-none bg-transparent cursor-pointer font-medium"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <img
        src={`${server_base}/${currentImageUrl}`}
        alt={`${name} - ${CurrentImage}`}
        className="aspect-square object-cover w-[120%] self-center rounded-3xl shadow-lg"
      />

      <button
        onClick={nextImage}
        className="absolute top-35 md:top-60 md:-right-5 aspect-square w-5 md:w-10 -right-3.5 flex justify-center items-center bg-white rounded-full p-1.25 md:p-4 shadow-xl"
      >
        <img src={arrow} alt="arrow" className="rotate-270 h-1.5 scale-200" />
      </button>

      <div className="flex justify-center bg-black/80 rounded-full backdrop-blur-3xl p-2 absolute top-63 md:top-104 gap-1.25 ml-2.5 z-10">
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
        <div className="flex flex-col">
          <p className="text-left leading-5 w-75 p-4 text-xl font-bold">{name}</p>
        </div>

        <div className="flex flex-col">
          <p className="text-left leading-5 w-75 p-4">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
