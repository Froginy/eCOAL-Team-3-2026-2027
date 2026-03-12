import { useState, useEffect } from "react";
import axios from "axios";

export default function Header({ userId }) {

  const [user, setUser] = useState();

useEffect(() => {
  const getProtectedUser = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
      // Change response.data.data to response.data
      setUser(response.data); 
    } catch (error) {
      console.error("API Error:", error.response?.status);
    }
  };

  getProtectedUser();
}, [userId]);

  return (
    <div className="header">
      <button className="icon-button" type="button" aria-label="Back">
        ←
      </button>

      <h2 className="header-title">{user?.name}</h2>

      <button className="icon-button" type="button" aria-label="More">
        ...
      </button>
    </div>
  );
}