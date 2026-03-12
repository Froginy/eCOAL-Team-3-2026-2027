import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header({ userId }) {
  const [user, setUser] = useState();

  useEffect(() => {
    const getProtectedUser = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${userId}`,
        );

        setUser(response.data.data);
      } catch (error) {
        console.error("API Error:", error.response?.status);
      }
    };

    getProtectedUser();
  }, [userId]);

  return (
    <div className="flex items-center justify-between bg-white text-black h-12 px-4 m-4 rounded-full shadow-md border border-black/5 sticky top-4 z-50">
      <button
        className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full hover:bg-black/10 transition-colors cursor-pointer border-none"
        aria-label="Go back"
        onClick={() => window.history.back()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 12H5M12 19l-7-7 7-7"
          />
        </svg>
      </button>

      <h2 className="text-sm font-bold tracking-tight uppercase absolute left-1/2 -translate-x-1/2">{user?.name}</h2>
      
      <div className="w-8" />
    </div>
  );
}
