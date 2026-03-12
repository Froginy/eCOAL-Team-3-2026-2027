import PostBar from "../PostBar/PostBar.jsx";
import arrow from "../../assets/arrow.svg";
import dice1 from "../../assets/dice1.svg";
import dice2 from "../../assets/dice2.svg";
import dice3 from "../../assets/dice3.svg";
import { useEntranceAnimation } from "../../hooks/useEntranceAnimation";
import { useState, useRef } from "react";
import gsap from "gsap";

function PostCard({ id, name, description, images, collection }) {
  const serverURL = import.meta.env.VITE_API_URL;
  const server_base = serverURL ? serverURL.replace("/api", "").replace(/\/$/, "") : "";
  const [CurrentImage, setCurrentImage] = useState(0);
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

  return (
    <div
      ref={cardRef}
      className="relative w-75 md:w-115 mb-7.5 bg-white shadow-lg rounded-2xl md:rounded-3xl flex flex-col"
    >
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
          <img
            key={index}
            src={diceIcons[index % diceIcons.length]}
            alt={`dice-${index}`}
            className={`w-5 odd:rotate-15 even:rotate--15 transition-opacity ${CurrentImage === index ? "opacity-100" : "opacity-40"}`}
          />
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