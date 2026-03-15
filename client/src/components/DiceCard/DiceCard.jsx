import { useState, useEffect } from "react";
import axios from "axios";
import UserAvatar from "../UserAvatar/UserAvatar";

function DiceCard({ name, images, color, collection, id, user_id }) {
  const serverURL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const clipId = `clip-${id}`;

  useEffect(() => {
    if (!user_id) return;
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverURL}/users/${user_id}`);
        setUser(response.data.data ?? response.data);
      } catch (error) {
        console.error("API Error:", error.response?.status);
      }
    };
    fetchUser();
  }, [user_id]);

  return (
<div
  className="bg-white/80 border border-black/80 relative shrink-0"
  style={{ 
    width: "clamp(200px, 42vw, 300px)",
    borderRadius: "3rem",
    overflow: "hidden"
  }}
>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="
              M0.1667,0
              H0.8333
              A0.1667,0.1176 0,0,1 1,0.1176
              V0.6941
              A0.1,0.0706 0,0,1 0.9,0.7647
              H0.7667
              A0.1,0.0706 0,0,0 0.6667,0.8353
              V0.9294
              A0.1,0.0706 0,0,1 0.5667,1
              H0.1667
              A0.1667,0.1176 0,0,1 0,0.8824
              V0.1176
              A0.1667,0.1176 0,0,1 0.1667,0
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      <div
        className="inverted bg-black/80 w-full h-full p-3.5 flex flex-col"
        style={{
          filter: `drop-shadow(0 0 0.5rem ${color})`,
          clipPath: `url(#${clipId})`,
          aspectRatio: "12 / 17",
        }}
      >
        <div
          className="mb-3.5 flex items-center justify-center bg-[#f0f0f0] rounded-4xl overflow-hidden"
          style={{ height: "55%" }}
        >
          <img
            src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${images?.[0]?.image_url}`}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div
          className="font-semibold tracking-tight text-white"
          style={{ fontSize: "clamp(14px, 3.5vw, 20px)" }}
        >
          {name}
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10">
        <svg
          style={{ width: "clamp(20px, 4vw, 30px)", height: "clamp(20px, 4vw, 30px)" }}
          viewBox="0 0 23 23"
          fill="none"
        >
          <path
            d="M2.69986 22.7328L-3.59763e-06 20.033L16.1992 3.83381L1.34993 3.83381L1.34993 2.24128e-06H22.7328V21.3829L18.899 21.3829L18.899 6.53367L2.69986 22.7328Z"
            fill="black"
          />
        </svg>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full bg-white shadow-md px-3.5 py-1.75">
        <UserAvatar
          src={user?.avatar || user?.profile_picture_url}
          name={user?.name}
          to={user ? `/profile/${user.id}` : false}
          size={32}
          showName
        />
      </div>
    </div>
  );
}

export default DiceCard;