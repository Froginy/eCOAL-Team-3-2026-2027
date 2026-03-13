import PostBar from "../PostBar/PostBar.jsx";
import arrow from "../../assets/arrow.svg";
import dice1 from "../../assets/dice1.svg";
import dice2 from "../../assets/dice2.svg";
import dice3 from "../../assets/dice3.svg";
import { useEntranceAnimation } from "../../hooks/useEntranceAnimation";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import axios from "axios";
import "./postCard.css";
import UserAvatar from "../UserAvatar/UserAvatar.jsx";

function PostCard({ id, name, description, images, collection, primary_category, secondary_category, criterias }) {
  const serverURL = import.meta.env.VITE_API_URL;
  const server_base = serverURL
    ? serverURL.replace("/api", "").replace(/\/$/, "")
    : "";
  const [CurrentImage, setCurrentImage] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const diceIcons = [dice1, dice2, dice3];
  const currentImageUrl =
    images && images.length > 0 ? images[CurrentImage].image_url : "";

  const cardRef = useEntranceAnimation({
    y: 40,
    scale: 0.95,
    duration: 0.6,
    ease: "elastic.out(1, 0.6)",
  });
  const imgRef = useRef(null);
  const dragStartX = useRef(null);
  const dragDelta = useRef(0);
  const isDragging = useRef(false);
  const drawerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${serverURL}/dices/${id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setComments(r.data?.data ?? r.data))
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!drawerRef.current) return;
    if (drawerOpen) {
      window.dispatchEvent(new CustomEvent("drawer:open"));
      gsap.fromTo(
        drawerRef.current,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.4, ease: "power3.out" },
      );
      setTimeout(() => inputRef.current?.focus(), 400);
    } else {
      window.dispatchEvent(new CustomEvent("drawer:close"));
      gsap.to(drawerRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [drawerOpen]);
  const postComment = async () => {
    if (!commentInput.trim()) return;
    setPosting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${serverURL}/dices/${id}/comments`,
        { content: commentInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      setComments((prev) => [res.data?.data ?? res.data, ...prev]);
      setCommentInput("");
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  const goTo = (index) => {
    const next = (index + images.length) % images.length;
    const dir = dragDelta.current < 0 ? -1 : 1;
    gsap.fromTo(
      imgRef.current,
      { x: dir * 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
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
    dragDelta.current = 0;
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

  const firstComment = comments[0];

  return (
    <>
      <div
        ref={cardRef}
        className="relative w-75 md:w-115 mb-7.5 bg-white shadow-lg rounded-2xl md:rounded-3xl flex flex-col"
      >
        <PostBar
          user_id={collection?.user_id}
          dice_id={id}
          title={collection?.title}
        />
        <div className="relative w-[90%] self-center">
          <div
            ref={imgRef}
            className="inverted-img aspect-square"
            draggable={false}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{
              cursor: "grab",
              touchAction: "pan-y",
              backgroundImage: `url(${server_base}/${currentImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <button
            onClick={() => setDrawerOpen(true)}
            className="absolute bottom-0 right-0 flex items-center gap-1.5 bg-black backdrop-blur-sm text-white text-xs font-semibold aspect-ratio[1/1] p-4.5 md:p-6 rounded-full cursor-pointer hover:bg-black/80 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 18C3.45 18 2.97933 17.8043 2.588 17.413C2.19667 17.0217 2.00067 16.5507 2 16V4C2 3.45 2.196 2.97933 2.588 2.588C2.98 2.19667 3.45067 2.00067 4 2H20C20.55 2 21.021 2.196 21.413 2.588C21.805 2.98 22.0007 3.45067 22 4V19.575C22 20.025 21.796 20.3377 21.388 20.513C20.98 20.6883 20.6173 20.6173 20.3 20.3L18 18H4Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <button
          onClick={nextImage}
          className="absolute top-35 md:top-60 md:-right-5 aspect-square w-10 -right-4 flex justify-center items-center bg-white rounded-full shadow-xl"
        >
          <img
            src={arrow}
            alt="arrow"
            className="rotate-270 h-5 aspect-square scale-110"
          />
        </button>
        <div className="flex justify-center bg-black/80 rounded-full backdrop-blur-3xl p-2 absolute top-63 md:top-92 gap-1.25 ml-8">
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
          <div className="flex gap-2 px-4 flex-wrap">
            {primary_category && (
              <span className="text-xs font-semibold bg-black/90 text-white rounded-full px-3 py-1">
                {primary_category.title}
              </span>
            )}
            {secondary_category && (
              <span className="text-xs font-semibold bg-black/90 text-white rounded-full px-3 py-1">
                {secondary_category.title}
              </span>
            )}

            {criterias?.map((c) => (
              <div
                key={c.id}
                className="flex gap-2 items-center bg-black/90 rounded-2xl px-3 py-1 min-w-12"
              >
                <span className="text-xs text-white font-bold">{c.value}</span>
                <span className="text-[10px] text-white/90 uppercase tracking-wide">
                  {c.title}
                </span>
              </div>
            ))}
          </div>
          <p className="text-left leading-5 w-75 p-4 text-xl font-bold">
            {name}
          </p>
          <p className="text-left leading-5 w-75 p-4">{description}</p>
          

          {firstComment && (
            <p className="text-sm text-black/60 px-4 pb-3">
              <span className="font-semibold text-black">
                {firstComment.user?.name}
              </span>{" "}
              {firstComment.content}
            </p>
          )}
          {comments.length > 1 && (
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-xs text-black/30 hover:text-black/50 transition-colors px-4 pb-3 cursor-pointer"
            >
              View all {comments.length} comments
            </button>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div
        ref={drawerRef}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-75 md:w-115 z-50 bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] flex flex-col mx-auto"
        style={{ maxHeight: "75vh", transform: "translateY(100%)", opacity: 0 }}
      >
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 bg-black/10 rounded-full" />
        </div>

        <div className="flex justify-between items-center px-5 pb-3 shrink-0">
          <h3 className="font-bold text-base">Comments</h3>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-black/30 hover:text-black transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="w-full h-px bg-black/5 shrink-0" />

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {comments.length === 0 ? (
            <p className="text-sm text-black/30 text-center mt-8">
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex flex-col gap-1">
                <UserAvatar
                  showName
                  name={c.user?.name}
                  size={20}
                  to={false}
                  hover={false}
                />
                <span className="text-sm text-black/70">{c.content}</span>
              </div>
            ))
          )}
        </div>

        <div className="w-full h-px bg-black/5 shrink-0" />

        <div className="flex items-center gap-3 px-5 py-4 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && postComment()}
            placeholder="Add a comment…"
            className="flex-1 text-sm bg-black/5 rounded-full px-4 py-2.5 outline-none placeholder:text-black/30"
          />
          <button
            onClick={postComment}
            disabled={posting || !commentInput.trim()}
            className="text-sm font-bold text-black disabled:opacity-30 transition-opacity cursor-pointer"
          >
            Post
          </button>
        </div>
      </div>
    </>
  );
}

export default PostCard;
