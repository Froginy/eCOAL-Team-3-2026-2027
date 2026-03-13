import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import add from "../../assets/add.svg";
import UserAvatar from "../UserAvatar/UserAvatar";

const HeartIcon = ({ filled }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {filled ? (
      <path
        d="M6.28399 7.40336C7.90415 5.70241 10.2143 5.75556 11.8004 7.1344C12.0658 7.36329 12.4046 7.4892 12.7551 7.4892C13.1055 7.4892 13.4443 7.36329 13.7097 7.1344C15.2948 5.7545 17.6071 5.70347 19.2251 7.40336C20.1681 8.60786 20.4966 9.71879 20.4625 10.7383C20.4275 11.7823 20.0097 12.8199 19.308 13.8447C17.8888 15.9209 15.4553 17.7463 13.4004 19.1953C13.2117 19.3289 12.9863 19.4007 12.7551 19.4007C12.5239 19.4007 12.2984 19.3289 12.1098 19.1953C10.0697 17.7537 7.63625 15.9273 6.21276 13.85C5.51005 12.823 5.08907 11.7833 5.05292 10.7394C5.01571 9.71879 5.34209 8.60679 6.28399 7.40336Z"
        fill="#1E1E1E"
      />
    ) : (
      <path
        d="M6.28399 7.40336C7.90415 5.70241 10.2143 5.75556 11.8004 7.1344C12.0658 7.36329 12.4046 7.4892 12.7551 7.4892C13.1055 7.4892 13.4443 7.36329 13.7097 7.1344C15.2948 5.7545 17.6071 5.70347 19.2251 7.40336C20.1681 8.60786 20.4966 9.71879 20.4625 10.7383C20.4275 11.7823 20.0097 12.8199 19.308 13.8447C17.8888 15.9209 15.4553 17.7463 13.4004 19.1953C13.2117 19.3289 12.9863 19.4007 12.7551 19.4007C12.5239 19.4007 12.2984 19.3289 12.1098 19.1953C10.0697 17.7537 7.63625 15.9273 6.21276 13.85C5.51005 12.823 5.08907 11.7833 5.05292 10.7394C5.01571 9.71879 5.34209 8.60679 6.28399 7.40336ZM12.7551 5.85337C10.5598 4.02058 7.31413 3.97593 5.09864 6.33601L5.07525 6.36153L5.05399 6.38811C3.89521 7.85518 3.40618 9.3382 3.45934 10.7957C3.51037 12.2362 4.08657 13.5661 4.89771 14.7504C6.50405 17.0978 9.17137 19.0719 11.1891 20.4976C12.13 21.162 13.3791 21.162 14.32 20.4986C16.3515 19.0656 19.021 17.0903 20.6241 14.7451C21.4342 13.5608 22.0072 12.232 22.0561 10.7925C22.105 9.33608 21.6139 7.85518 20.4551 6.38811L20.4338 6.36153L20.4104 6.33601C18.196 3.97593 14.9482 4.02058 12.7551 5.85337Z"
        fill="#1E1E1E"
      />
    )}
  </svg>
);

function PostBar({ user_id, dice_id, title, onEdit, onDelete }) {
  const serverURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const headers = { 
    Authorization: `Bearer ${token}`, 
    Accept: "application/json" 
  };

  const [user, setUser] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!user_id || !token) return;
    Promise.all([
      axios.get(`${serverURL}/users/${user_id}/followers`, { headers }),
      axios.get(`${serverURL}/user`, { headers }),
    ])
      .then(([followersRes, meRes]) => {
        const me = meRes.data?.data ?? meRes.data;
        const followers = followersRes.data?.data ?? followersRes.data ?? [];
        setIsFollowing(followers.some((f) => f.id === me.id));
      })
      .catch(() => {});
  }, [user_id]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`${serverURL}/users/${user_id}/subscribe`, {
          headers,
        });
        setIsFollowing(false);
      } else {
        await axios.post(
          `${serverURL}/users/${user_id}/subscribe`,
          {},
          { headers },
        );
        setIsFollowing(true);
      }
    } catch {}
  };
  useEffect(() => {
    if (!user_id) return;
    axios.get(`${serverURL}/users/${user_id}`)
      .then(res => setUser(res.data.data ?? res.data))
      .catch(() => {});
  }, [user_id, serverURL]);

  useEffect(() => {
    if (!dice_id) return;
    axios
      .get(`${serverURL}/dices/${dice_id}`, { headers })
      .then((res) => {
        const dice = res.data.data ?? res.data;
        
        setIsLiked(dice.is_liked_by_current_user ?? false);
        setLikesCount(dice.likes_count ?? 0);
      })
      .catch(() => {});
  }, [dice_id]);

  const handleLike = async () => {
    if (!token || loadingLike || !dice_id) return;
    setLoadingLike(true);
    try {
      if (isLiked) {
        await axios.delete(`${serverURL}/dices/${dice_id}/like`, { headers });
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await axios.post(`${serverURL}/dices/${dice_id}/like`, {}, { headers });
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Like Error:", error.response?.status);
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="flex flex-row justify-between items-center bg-white text-black w-56.25 md:w-75 h-10 mx-auto rounded-3xl absolute left-10 top-4 z-50 shadow-sm">
      <div className="flex justify-between w-full items-center relative text-black m-1.5">
        <Link
          to={`/profile/${user_id}`}
          className="flex items-center relative gap-2 text-black"
        >
          {user && (
            <UserAvatar
              src={user.avatar || user.profile_picture_url}
              name={user.name}
              size={32}
              to={false}
              showName
            />
          )}
        </Link>
        <div className="flex items-center gap-2 m-2.5">
          <button
            type="button"
            onClick={handleLike}
            disabled={loadingLike || !token}
            className="flex items-center gap-1 border-none bg-transparent cursor-pointer p-0"
            style={{
              transition: "transform 0.15s",
              transform: loadingLike ? "scale(0.85)" : "scale(1)",
            }}
          >
            <HeartIcon filled={isLiked} />
            {likesCount > 0 && (
              <span className="text-xs font-semibold">{likesCount}</span>
            )}
          </button>
          <button
            type="button"
            onClick={handleFollow}
            className="flex items-center border-none bg-transparent cursor-pointer p-0"
          >
            {isFollowing ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.59 16.58L5.42 12.41L4 13.82L9.59 19.41L21.59 7.41L20.18 6L9.59 16.58Z"
                  fill="black"
                />
              </svg>
            ) : (
              <img src={add} alt="add" className="h-6" />
            )}
          </button>
          
          {onEdit && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
              className="flex items-center border-none bg-transparent cursor-pointer p-0 opacity-50 hover:opacity-100 transition-opacity"
              title="Edit Dice"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {onDelete && (
             <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
              className="flex items-center border-none bg-transparent cursor-pointer p-0 opacity-50 hover:opacity-100 transition-opacity"
              title="Delete Dice"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostBar;
