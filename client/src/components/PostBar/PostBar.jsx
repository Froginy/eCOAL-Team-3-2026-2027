import { useState, useEffect } from "react";
import axios from "axios";
import add from "../../assets/add.svg";
import like from "../../assets/like.svg";
import placeholder from "../../assets/placeholder_pp.jpg";
import { Link } from "react-router-dom";

function PostBar({ user_id }) {
  const serverURL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState();

  useEffect(() => {
    const getProtectedUser = async () => {
      if (!user_id) return;
      try {
        const response = await axios.get(`${serverURL}/users/${user_id}`);

        setUser(response.data.data);
      } catch (error) {
        console.error("API Error:", error.response?.status);
      }
    };

    getProtectedUser();
  }, [user_id]);

  return (
    <div className="flex flex-row justify-between items-center bg-white text-black w-56.25 md:w-75 h-10 mx-auto rounded-3xl absolute left-2.5 top-2.5 z-50 shadow-sm">
      <div className="flex items-center relative text-black m-2.5">
        <Link
          to={`/profile/${user?.id}`}
          className="flex items-center relative gap-2 text-black "
        >
          <img
            src={
              user?.profile_image
                ? `${serverURL}${user.profile_image}`
                : placeholder
            }
            alt="profile_picture"
            className="rounded-full w-7 aspect-square object-cover"
          />

          <p className="text-black w-20 overflow-wrap-anywhere whitespace-normal text-xs font-bold leading-tight">
            {user ? user.name : "Chargement..."}
          </p>
        </Link>
      </div>

      <div className="flex gap-2 m-2.5">
        <a href="#">
          <img src={add} alt="add" className="h-6" />
        </a>
        <a href="#">
          <img src={like} alt="like" className="h-6" />
        </a>
      </div>
    </div>
  );
}

export default PostBar;
