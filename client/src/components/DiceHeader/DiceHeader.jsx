import { useState, useEffect } from "react";
import axios from "axios";

export default function Header({ userId }) {

  const [user, setUser] = useState();

useEffect(() => {
  const getProtectedUser = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
      console.log(response.data.data)
      setUser(response.data.data); 
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

      <h2 className="header-title text-black">{user?.name}</h2>
    </div>
  );
}