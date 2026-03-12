import logo from "../../assets/logo.svg";
import PostCard from "../postCards/postCards.jsx";
import sort from "../../assets/sort.svg";
import { useState, useEffect } from "react";
import axios from "axios";

function Feed() {
  const [dices, setdices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    color: "",
    face: "",
    height: "",
  });

  const colors = ["Red", "Blue", "Green", "Yellow"];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function modalHandler() {
    setIsOpen(!isOpen);
  }
  useEffect(() => {
    const api_url = import.meta.env.VITE_API_URL;
    const getProtecteddices = async () => {
      try {
        const response = await axios.get(`${api_url}/dices`);
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
        <button onClick={modalHandler}>
          <img src={sort} alt="Sort" className="h-5" />
        </button>
        {isOpen && (
          <div className="fixed right-5 flex items-center justify-center z-100 bg-opacity-50">
            <div className="bg-gray-600 opacity-85 rounded-2xl text-white p-6 rounded shadow-lg w-80">
              <h2 className="text-xl font-bold mb-4">Select Options</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold">Colors:</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  >
                    <option value="">Select a color</option>
                    {colors.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Height:</label>
                  <input
                    type="number"
                    name="faces"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Enter the number of faces"
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Height:</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Enter height in cm"
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-800 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 opacity-100 py-2 bg-black text-white rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
