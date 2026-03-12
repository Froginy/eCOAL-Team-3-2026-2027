import logo from "../../assets/logo.svg";
import PostCard from "../postCards/postCards";
import EditDrawer from "../EditDrawer/EditDrawer";
import sort from "../../assets/sort.svg";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

function Feed() {
  const [dices, setdices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDice, setEditingDice] = useState(null);

  const [formData, setFormData] = useState({
    color: "",
    facesMin: "",
    facesMax: "",
    sizeMin: "",
    sizeMax: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    color: "",
    facesMin: "",
    facesMax: "",
    sizeMin: "",
    sizeMax: "",
  });

  const colors = ["Red", "Blue", "Green", "Yellow", "Azure", "Crimson", "Obsidian"];

  const filteredDices = useMemo(() => {
    return dices.filter((dice) => {
      // Filter by color
      if (appliedFilters.color && dice.color?.name !== appliedFilters.color) {
        return false;
      }
      
      // Filter by faces range
      const faceCrit = dice.criterias?.find(c => c.title === "Faces");
      const faceValue = faceCrit ? parseInt(faceCrit.value) : null;

      if (appliedFilters.facesMin && (faceValue === null || faceValue < parseInt(appliedFilters.facesMin))) {
        return false;
      }
      if (appliedFilters.facesMax && (faceValue === null || faceValue > parseInt(appliedFilters.facesMax))) {
        return false;
      }

      // Filter by size range
      const sizeCrit = dice.criterias?.find(c => c.title === "Size");
      const sizeValue = sizeCrit ? parseInt(sizeCrit.value) : null;

      if (appliedFilters.sizeMin && (sizeValue === null || sizeValue < parseInt(appliedFilters.sizeMin))) {
        return false;
      }
      if (appliedFilters.sizeMax && (sizeValue === null || sizeValue > parseInt(appliedFilters.sizeMax))) {
        return false;
      }

      return true;
    });
  }, [dices, appliedFilters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters({ ...formData });
    setIsOpen(false);
  };

  const handleReset = () => {
    const emptyFilters = { 
      color: "", 
      facesMin: "", 
      facesMax: "", 
      sizeMin: "", 
      sizeMax: "" 
    };
    setFormData(emptyFilters);
    setAppliedFilters(emptyFilters);
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (dice) => {
    setEditingDice(dice);
    setIsEditOpen(true);
  };

  const handleUpdated = (updatedDice) => {
    setdices(prev => prev.map(d => d.id === updatedDice.id ? updatedDice : d));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce dé ?")) return;
    
    try {
      const api_url = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      await axios.delete(`${api_url}/dices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setdices(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("La suppression a échoué.");
    }
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
        console.error("API Error fetching dices:", error.response?.status);
      }
    };

    getProtecteddices();
  }, []);

  const hasActiveFilters = appliedFilters.color || appliedFilters.facesMin || appliedFilters.facesMax || appliedFilters.sizeMin || appliedFilters.sizeMax;

  const inputCls = "w-full bg-transparent border border-black/15 rounded-xl text-black text-sm px-3.5 py-2.5 outline-none placeholder:text-black/25 focus:border-black/50 transition-colors duration-150";
  const labelCls = "text-[11px] font-semibold tracking-widest uppercase text-black/40 mb-1.5 block";

  return (
    <div className="flex flex-col w-full items-center m-0 mb-15 p-0">
      <div className="w-11/12 m-6 flex flex-row justify-between items-center relative z-50">
        <img src={logo} alt="Logo" className="h-5" />
        <button onClick={modalHandler} className="cursor-pointer relative p-2 hover:bg-black/5 rounded-full transition-all">
          <img src={sort} alt="Sort" className="h-5" />
          {hasActiveFilters && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          )}
        </button>
        
        {isOpen && (
          <div className="fixed right-5 top-20 z-100 transition-all transform origin-top-right">
            <div className="bg-white rounded-3xl text-black p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 w-80 flex flex-col gap-4">
              {/* Drawer-like Handle */}
              <div className="flex justify-center -mt-2 mb-2">
                <div className="w-10 h-1 bg-black/10 rounded-full" />
              </div>

              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-bold tracking-tight">Filters</h2>
                <button onClick={handleReset} className="text-[10px] font-bold uppercase tracking-wider text-black/30 hover:text-black underline cursor-pointer">
                  Reset
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>Color</label>
                  <div className="relative">
                    <select
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className={inputCls + " appearance-none cursor-pointer"}
                    >
                      <option value="">Any color</option>
                      {colors.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-black/20">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Faces Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="facesMin"
                      value={formData.facesMin}
                      onChange={handleChange}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder="Min"
                      className={inputCls}
                    />
                    <span className="text-black/20 font-bold">—</span>
                    <input
                      type="number"
                      name="facesMax"
                      value={formData.facesMax}
                      onChange={handleChange}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder="Max"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Size Range (mm)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="sizeMin"
                      value={formData.sizeMin}
                      onChange={handleChange}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder="Min"
                      className={inputCls}
                    />
                    <span className="text-black/20 font-bold">—</span>
                    <input
                      type="number"
                      name="sizeMax"
                      value={formData.sizeMax}
                      onChange={handleChange}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder="Max"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-black/90 transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 text-black/40 hover:text-black text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center w-full gap-4">
        {filteredDices && filteredDices.length > 0 ? (
          filteredDices.map((dice) => (
            <PostCard 
              key={dice.id} 
              {...dice} 
              onEdit={() => handleEdit(dice)} 
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="flex flex-col items-center mt-20 text-black/20 italic">
            <p className="text-lg">No dice found in this range.</p>
            <button onClick={handleReset} className="mt-2 text-sm text-black/40 hover:text-black underline cursor-pointer not-italic">
              Clear filters
            </button>
          </div>
        )}
      </div>

      <EditDrawer 
        dice={editingDice}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}

export default Feed;
