import { useState, useEffect } from "react";
import axios from "axios";
import UserAvatar from "../UserAvatar/UserAvatar";

function DiceCard({ name, images, color, collection, id, user_id }) {
  const serverURL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user_id) return;
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverURL}/users/${user_id}`);
        setUser(response.data.data);
      } catch (error) {
        console.error("API Error:", error.response?.status);
      }
    };
    fetchUser();
  }, [user_id]);

  return (
    <div className="bg-white/80 rounded-[3rem] border border-black/80 relative shrink-0" style={{ width: 300 }}>
      <div
        className="inverted bg-black/80 w-full h-full p-3.5"
        style={{
          filter: `drop-shadow(0 0 0.5rem ${color})`,
        }}
      >
        <div className="mb-3.5 flex items-center justify-center bg-[#f0f0f0] h-[50%] rounded-4xl">
          <img
            src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${images?.[0]?.image_url}`}
            alt={name}
            className="w-full h-full object-cover rounded-4xl"
          />
        </div>
        <div className="mb-2.5 text-[20px] font-semibold tracking-tight text-white">
          {name}
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10">
        <svg width="30" height="30" viewBox="0 0 23 23" fill="none">
          <path
            d="M2.69986 22.7328L-3.59763e-06 20.033L16.1992 3.83381L1.34993 3.83381L1.34993 2.24128e-06H22.7328V21.3829L18.899 21.3829L18.899 6.53367L2.69986 22.7328Z"
            fill="black"
          />
        </svg>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full bg-white shadow-md px-3.5 py-1.75">
        <UserAvatar
          name={user?.name}
          to={user ? `/profile/${user.id}` : "#"}
          size={32}
          showName
        />
      </div>
    </div>
  );
}

export default DiceCard;
