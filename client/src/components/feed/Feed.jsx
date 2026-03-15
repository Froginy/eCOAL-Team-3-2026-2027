import logo from "../../assets/logo.svg";
import PostCard from "../postCards/postCards";
import EditDrawer from "../EditDrawer/EditDrawer";
import sort from "../../assets/sort.svg";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";

let _dicesCache = null;

function Feed() {
  const [dices, setDices] = useState(_dicesCache ?? []);
  const [loading, setLoading] = useState(_dicesCache === null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDice, setEditingDice] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ users: [], dices: [] });
  const [searchOpen, setSearchOpen] = useState(false);
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
  const searchRef = useRef(null);
  const api_url = import.meta.env.VITE_API_URL;
  const server_base = api_url
    ? api_url.replace("/api", "").replace(/\/$/, "")
    : "";

  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Azure",
    "Crimson",
    "Obsidian",
  ];

  const filteredDices = useMemo(() => {
    return dices.filter((dice) => {
      if (appliedFilters.color && dice.color?.name !== appliedFilters.color)
        return false;
      const faceCrit = dice.criterias?.find((c) => c.title === "Faces");
      const faceValue = faceCrit ? parseInt(faceCrit.value) : null;
      if (
        appliedFilters.facesMin &&
        (faceValue === null || faceValue < parseInt(appliedFilters.facesMin))
      )
        return false;
      if (
        appliedFilters.facesMax &&
        (faceValue === null || faceValue > parseInt(appliedFilters.facesMax))
      )
        return false;
      const sizeCrit = dice.criterias?.find((c) => c.title === "Size");
      const sizeValue = sizeCrit ? parseInt(sizeCrit.value) : null;
      if (
        appliedFilters.sizeMin &&
        (sizeValue === null || sizeValue < parseInt(appliedFilters.sizeMin))
      )
        return false;
      if (
        appliedFilters.sizeMax &&
        (sizeValue === null || sizeValue > parseInt(appliedFilters.sizeMax))
      )
        return false;
      return true;
    });
  }, [dices, appliedFilters]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${api_url}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => {
        setAllUsers(r.data?.data ?? r.data);
      })
      .catch((e) =>
        console.error(
          "users fetch error",
          e.response?.status,
          e.response?.data,
        ),
      );
  }, []);
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], dices: [] });
      setSearchOpen(false);
      return;
    }

    const q = searchQuery.toLowerCase();
    const matchedUsers = allUsers.filter((u) =>
      u.name?.toLowerCase().includes(q),
    );
    const matchedDices = dices.filter((d) => d.name?.toLowerCase().includes(q));

    setSearchResults({ users: matchedUsers, dices: matchedDices });
    setSearchOpen(matchedUsers.length > 0 || matchedDices.length > 0);
  }, [searchQuery, dices, allUsers]);
  const handleReset = () => {
    const empty = {
      color: "",
      facesMin: "",
      facesMax: "",
      sizeMin: "",
      sizeMax: "",
    };
    setFormData(empty);
    setAppliedFilters(empty);
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters({ ...formData });
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
    setDices((prev) =>
      prev.map((d) => (d.id === updatedDice.id ? updatedDice : d)),
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce dé ?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${api_url}/dices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDices((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("La suppression a échoué.");
    }
  };

  useEffect(() => {
    const getProtectedDices = async () => {
      try {
        const response = await axios.get(`${api_url}/dices`);
        const dataToSet = response.data.data;
        if (Array.isArray(dataToSet)) {
          _dicesCache = dataToSet;
          setDices(dataToSet);
        }
      } catch (error) {
        console.error("API Error fetching dices:", error.response?.status);
      } finally {
        setLoading(false);
      }
    };
    getProtectedDices();
  }, []);

  const hasActiveFilters =
    appliedFilters.color ||
    appliedFilters.facesMin ||
    appliedFilters.facesMax ||
    appliedFilters.sizeMin ||
    appliedFilters.sizeMax;
  const hasResults =
    searchResults.users.length > 0 || searchResults.dices.length > 0;

  const inputCls =
    "w-full bg-transparent border border-black/15 rounded-xl text-black text-sm px-3.5 py-2.5 outline-none placeholder:text-black/25 focus:border-black/50 transition-colors duration-150";
  const labelCls =
    "text-[11px] font-semibold tracking-widest uppercase text-black/40 mb-1.5 block";

  return (
    <div className="flex flex-col w-full items-center m-0 mb-15 p-0">
      <div className="w-11/12 m-6 flex flex-row justify-between items-center relative z-50 gap-1.5">
        <button
          className="icon-btn back-btn shrink-0"
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

        <div className="flex justify-end items-center gap-3">
          <div ref={searchRef} className="relative flex-1 max-w-48">
            <div
              className="flex items-center gap-2 bg-white border border-black/10 px-3 py-2 shadow-sm"
              style={{
                borderRadius:
                  searchOpen && hasResults ? "16px 16px 0 0" : "999px",
                borderBottom:
                  searchOpen && hasResults
                    ? "1px solid rgba(0,0,0,0.06)"
                    : undefined,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="text-black/30 shrink-0"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (hasResults) setSearchOpen(true);
                }}
                className="flex-1 bg-transparent text-sm text-black outline-none placeholder:text-black/25 min-w-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchOpen(false);
                  }}
                  className="text-black/30 hover:text-black shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 1l10 10M11 1L1 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {searchOpen && hasResults && (
              <div
                className="absolute top-full left-0 right-0 bg-white border border-black/10 border-t-0 overflow-hidden z-50"
                style={{
                  borderRadius: "0 0 16px 16px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                  maxHeight: 320,
                  overflowY: "auto",
                }}
              >
                {searchResults.users.length > 0 && (
                  <div>
                    <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-black/30">
                      Users
                    </div>
                    {searchResults.users.map((user) => (
                      <a
                        key={user.id}
                        href={`/profile/${user.id}`}
                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-black/4 transition-colors"
                        onClick={() => setSearchOpen(false)}
                      >
                        <UserAvatar
                          name={user.name}
                          showName
                          src={user.profile_picture_url}
                          size={28}
                          to={false}
                          hover={false}
                        />
                      </a>
                    ))}
                  </div>
                )}

                {searchResults.dices.length > 0 && (
                  <div>
                    <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-black/30">
                      Dices
                    </div>
                    {searchResults.dices.map((dice) => {
                      const img = dice.images?.[0]?.image_url;
                      return (
                        <div
                          key={dice.id}
                          className="flex items-center gap-2.5 px-3 py-2 hover:bg-black/4 transition-colors cursor-pointer"
                        >
                          {img ? (
                            <img
                              src={`${server_base}/${img}`}
                              alt={dice.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-black/5"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-black/5 shrink-0" />
                          )}
                          <span className="text-sm font-medium text-black truncate">
                            {dice.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!hasResults && (
                  <div className="px-3 py-4 text-sm text-black/30 text-center">
                    No results
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer relative p-2 hover:bg-black/5 rounded-full transition-all shrink-0"
          >
            <img src={sort} alt="Sort" className="h-5" />
            {hasActiveFilters && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>

          {isOpen && (
            <div className="fixed right-5 top-20 z-100 transition-all transform origin-top-right">
              <div className="bg-white rounded-3xl text-black p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 w-80 flex flex-col gap-4">
                <div className="flex justify-center -mt-2 mb-2">
                  <div className="w-10 h-1 bg-black/10 rounded-full" />
                </div>
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-xl font-bold tracking-tight">Filters</h2>
                  <button
                    onClick={handleReset}
                    className="text-[10px] font-bold uppercase tracking-wider text-black/30 hover:text-black underline cursor-pointer"
                  >
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
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-black/20">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 4l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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
      </div>

      <div className="flex flex-col items-center w-full gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="w-11/12 max-w-sm rounded-3xl bg-black/5 animate-pulse" style={{ height: 420 }} />
          ))
        ) : filteredDices && filteredDices.length > 0 ? (
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
            <button
              onClick={handleReset}
              className="mt-2 text-sm text-black/40 hover:text-black underline cursor-pointer not-italic"
            >
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
