import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header({ userId }) {
  const navigate = useNavigate();
  const [user, setUser] = useState();

useEffect(() => {
  const getProtectedUser = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
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
        className="icon-button" 
        type="button" 
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        ←
      </button>

      <h2 className="header-title text-black">{user?.name}</h2>
    </div>
  );
}