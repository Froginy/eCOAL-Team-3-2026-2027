import { useState, useEffect } from "react";
import axios from "axios";

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
    <div className="header">
      <button
        className="icon-btn back-btn"
        aria-label="Go back"
        onClick={() => window.history.back()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 12H4m0 0l6-6m-6 6l6 6"
          />
        </svg>
      </button>

      <h2 className="header-title text-black">{user?.name}</h2>
    </div>
  );
}
