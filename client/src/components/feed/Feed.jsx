import logo from "../../assets/logo.svg";
import PostCard from "../postCards/postCards.jsx";
import sort from "../../assets/sort.svg";
import { useState, useEffect } from "react";
import axios from "axios";

function Feed() {
  const [dices, setdices] = useState([]);

  useEffect(() => {
    const getProtecteddices = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/dices");
        const dataToSet = response.data.data;

        if (Array.isArray(dataToSet)) {
          setdices(dataToSet);
        } else {
          console.error("Server did not return an array:", response.data);
        }
      } catch (error) {
        console.error("API Error:", error.response?.status);
        if (error.response?.status === 401) {
          alert("Session expired, please reconnect.");
        }
      }
    };

    getProtecteddices();
  }, []);

  return (
    <div className="flex flex-col w-full items-center m-0 mb-15 p-0">
      <div className="w-11/12 m-6  flex flex-row justify-between">
        <img src={logo} alt="Logo" className="h-5" />
        <a href="">
          <img src={sort} alt="Sort" className="h-5" />
        </a>
      </div>

      {dices && dices.length > 0 ? (
        dices.map((dice) => <PostCard key={dice.id} {...dice} />)
      ) : (
        <p>Loading cards...</p>
      )}
    </div>
  );
}

export default Feed;
