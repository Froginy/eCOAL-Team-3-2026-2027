<<<<<<< HEAD
import { useState, useEffect } from 'react';
import axios from 'axios';
import add from '../../assets/add.svg'
import likeIcon from '../../assets/like.svg' 
import placeholder from '../../assets/placeholder_pp.jpg'

function PostBar({ user_id, liked, dice_id }) {
    const serverURL = import.meta.env.VITE_API_URL ;
    const imgURL = import.meta.env.VITE_SERVER_URL ; 
    const [user, setUser] = useState(); 
    const [isLiked, setIsLiked] = useState(liked);
    const [loading, setLoading] = useState(false);


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


    useEffect(() => {
        setIsLiked(liked);
    }, [liked]);


    const handleLikeClick = async (e) => {
        e.preventDefault();
        if (loading) return; 

        setLoading(true);
        try {
            if (isLiked) {
                
                await axios.delete(`${serverURL}/dices/${dice_id}/like`);
                setIsLiked(false);
            } else {
                
                await axios.post(`${serverURL}/dices/${dice_id}/like`);
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Like Error:", error);
            if (error.response?.status === 401) alert("You need to connect to like this post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-row justify-between items-center bg-white text-black w-56.25 md:w-75 h-10 mx-auto rounded-3xl absolute left-2.5 top-2.5 z-50 shadow-sm'>
            <div className='flex items-center relative text-black m-2.5'>
                <a href={`/profile/${user?.id}`} className="flex items-center relative gap-2 text-black ">
                    <img 
                        src={user?.profile_image ? `${imgURL}${user.profile_image}` : placeholder} 
                        alt="profile_picture" 
                        className='rounded-full w-7 aspect-square object-cover' 
                    />
                    <p className='text-black w-20 overflow-wrap-anywhere whitespace-normal text-xs font-bold leading-tight'>
                        {user ? user.name : "Loading..."} 
                    </p>
                </a>
            </div>
            
            <div className='flex gap-2 m-2.5'>
                <a href="#"><img src={add} alt="add" className="h-6"/></a>
                
              
                <button onClick={handleLikeClick} className="focus:outline-none transition-transform active:scale-90">
                    <img 
                        src={likeIcon} 
                        alt="like" 
                        className={`h-6 transition-all ${isLiked ? 'brightness-50 sepia(1) hue-rotate(-50deg) saturate(10)' : 'grayscale'}`}
                    />
                </button>
            </div>
        </div>
    );
=======
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
                ? `${serverURL.replace('api', '')}${user.profile_image}`
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
    </div>
  );
>>>>>>> 029a83413d069907e60dfc5188d817bf5fac2cb6
}

export default PostBar;
