import { useState, useEffect } from "react";
import axios from "axios";
import add from "../../assets/add.svg";
import like from "../../assets/like.svg";
import UserAvatar from "../UserAvatar/UserAvatar";

function PostBar({ user_id, dice_id }) {
  const serverURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

  const [user, setUser] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);

  // Fetch User Info
  useEffect(() => {
    if (!user_id) return;
    axios.get(`${serverURL}/users/${user_id}`)
      .then(res => setUser(res.data.data ?? res.data))
      .catch(() => {});
  }, [user_id]);

  useEffect(() => {
    if (!dice_id) return;
    axios.get(`${serverURL}/dices/${dice_id}`, { headers })
      .then(res => {
        const dice = res.data.data ?? res.data;
        setIsLiked(dice.is_liked_by_current_user ?? false);
        setLikesCount(dice.likes_count ?? 0);
      })
      .catch(() => {});
  }, [dice_id]);

  const handleLike = async () => {
    if (!token || loadingLike) return;
    setLoadingLike(true);
    try {
      if (isLiked) {
        await axios.delete(`${serverURL}/dices/${dice_id}/like`, { headers });
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await axios.post(`${serverURL}/dices/${dice_id}/like`, {}, { headers });
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch {}
    setLoadingLike(false);
  };

  return (
    <div className="flex flex-row justify-between items-center bg-white text-black w-56.25 md:w-75 h-10 mx-auto rounded-3xl absolute left-2.5 top-2.5 z-50 shadow-sm">
      <div className="flex justify-between w-full items-center relative text-black m-1.5">
        {user && (
          <UserAvatar
            src={user.avatar || user.profile_picture_url}
            name={user.name}
            size={32}
            showName
            to={`/profile/${user.id}`}
            className="flex items-center relative gap-2 text-black"
          />
        )}
        
        <div className="flex items-center gap-2 m-2.5">
          <button
            type="button"
            onClick={handleLike}
            disabled={loadingLike || !token}
            className="flex items-center gap-1 border-none bg-transparent cursor-pointer p-0"
          >
            <img
              src={like}
              alt="like"
              className="h-6"
              style={{ opacity: isLiked ? 1 : 0.4, transition: "opacity 0.2s" }}
            />
          )}
        </Link>
        <div className="flex items-center gap-2 m-2.5">
          <button
            type="button"
            onClick={handleLike}
            disabled={loadingLike || !token}
            className="flex items-center gap-1 border-none bg-transparent cursor-pointer p-0"
          >
            <img
              src={like}
              alt="like"
              className="h-6"
              style={{ opacity: isLiked ? 1 : 0.4, transition: "opacity 0.2s" }}
            />
            {likesCount > 0 && (
              <span className="text-xs text-black/60">{likesCount}</span>
            )}
          </button>
          <a href="#">
            <img src={add} alt="add" className="h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default PostBar;
