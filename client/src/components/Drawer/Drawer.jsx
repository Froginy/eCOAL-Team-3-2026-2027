import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const COLORS = [
  { name: 'Obsidian',  hex: '#1a1a2e' },
  { name: 'Crimson',   hex: '#dc2626' },
  { name: 'Ember',     hex: '#ea580c' },
  { name: 'Amber',     hex: '#d97706' },
  { name: 'Citrine',   hex: '#ca8a04' },
  { name: 'Lime',      hex: '#65a30d' },
  { name: 'Emerald',   hex: '#16a34a' },
  { name: 'Teal',      hex: '#0d9488' },
  { name: 'Cyan',      hex: '#0891b2' },
  { name: 'Azure',     hex: '#2563eb' },
  { name: 'Indigo',    hex: '#4f46e5' },
  { name: 'Violet',    hex: '#7c3aed' },
  { name: 'Fuchsia',   hex: '#a21caf' },
  { name: 'Rose',      hex: '#e11d48' },
  { name: 'Ivory',     hex: '#f5f0e8' },
  { name: 'Slate',     hex: '#475569' },
];

function DiceIcon({ sizeMm, className }) {
  let label = 'M';
  let svgSize = 26;
  
  if (sizeMm < 18) {
    label = 'S';
    svgSize = 22;
  } else if (sizeMm > 28) {
    label = 'L';
    svgSize = 30;
  }

  return (
    <svg width={svgSize} height={svgSize} viewBox="0 0 100 100" fill="none" className={className}>
      <rect x="5" y="5" width="90" height="90" rx="20" stroke="currentColor" strokeWidth="8" />
      <text
        x="50" y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize="46"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >{label}</text>
    </svg>
  );
}

export default function NewDiceDrawer({ open, onClose, onCreated }) {
  const { user: authUser } = useAuth();
  const [color, setColor]               = useState(COLORS[0]);
  const [colorOpen, setColorOpen]       = useState(false);
  const [faces, setFaces]               = useState(6);
  const [name, setName]                 = useState('');
  const [desc, setDesc]                 = useState('');
  const [images, setImages]             = useState([]);
  const [sizeMm, setSizeMm]             = useState(22);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [success, setSuccess]           = useState(false);
  
  const [categories, setCategories]     = useState([]);
  const [criterias, setCriterias]       = useState([]);
  const [userCollectionId, setUserCollectionId] = useState(null);
  
  const [cat1, setCat1]                 = useState(null);
  const [cat2, setCat2]                 = useState(null);
  const [catOpen1, setCatOpen1]         = useState(false);
  const [catOpen2, setCatOpen2]         = useState(false);
  const [search1, setSearch1]           = useState('');
  const [search2, setSearch2]           = useState('');

  const drawerRef   = useRef(null);
  const backdropRef = useRef(null);
  const colorRef    = useRef(null);
  const catRef1     = useRef(null);
  const catRef2     = useRef(null);
  const fileRef     = useRef(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      const api_url = import.meta.env.VITE_API_URL;
      const token   = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      setError(null);

      axios.get(`${api_url}/categories`)
        .then(res => {
          const data = res.data.data || res.data;
          setCategories(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error("Categories fetch failed:", err);
          setError(prev => prev || "Categories could not be loaded.");
        });

      axios.get(`${api_url}/criterias`)
        .then(res => {
          const data = res.data.data || res.data;
          setCriterias(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error("Criterias fetch failed:", err));

      if (token && token !== 'undefined') {
        const fetchUserData = () => {
          // Si on a l'utilisateur dans le contexte avec ses collections, on l'utilise
          if (authUser?.collections?.length > 0) {
            setUserCollectionId(authUser.collections[0].id);
            return;
          }

          // Sinon on fait le fetch
          axios.get(`${api_url}/user`, { headers })
            .then(res => {
              const userData = res.data.data || res.data;
              if (userData?.collections?.length > 0) {
                setUserCollectionId(userData.collections[0].id);
              } else {
                setError("You don't have a collection. Please check your account settings.");
              }
            })
            .catch(err => {
              console.error("User fetch failed:", err);
              if (err.response?.status === 401) {
                setError("Session expired or unauthorized. Please log in again.");
              } else {
                setError("Failed to verify account permissions.");
              }
            });
        };
        fetchUserData();
      } else {
        setError("You must be logged in to create a dice.");
      }
    };

    if (open) fetchData();
  }, [open, authUser]);

  useEffect(() => {
    if (isAnimating.current) return;
    const drawer   = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;

    isAnimating.current = true;

    if (open) {
      setError(null);
      setSuccess(false);
      gsap.set(drawer, { y: '100%', display: 'flex' });
      gsap.set(backdrop, { display: 'block' });
      gsap.to(backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(drawer, {
        y: '0%',
        duration: 0.5,
        ease: 'power4.out',
        onComplete: () => { isAnimating.current = false; },
      });
    } else {
      gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' });
      gsap.to(drawer, {
        y: '100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(drawer, { display: 'none' });
          gsap.set(backdrop, { display: 'none' });
          isAnimating.current = false;
        },
      });
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target)) setColorOpen(false);
      if (catRef1.current && !catRef1.current.contains(e.target)) setCatOpen1(false);
      if (catRef2.current && !catRef2.current.contains(e.target)) setCatOpen2(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleImages = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 3 - images.length);
    const newImgs = valid.map(f => ({
      url: URL.createObjectURL(f),
      name: f.name,
      file: f
    }));
    setImages(prev => [...prev, ...newImgs]);
  };

  const handleDrop = (e) => { e.preventDefault(); handleImages(e.dataTransfer.files); };
  const removeImage = (i) => {
    const img = images[i];
    URL.revokeObjectURL(img.url);
    setImages(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userCollectionId) {
      setError("Unable to find your collection. Please check your account.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const api_url = import.meta.env.VITE_API_URL;
      const token   = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('collection_id', userCollectionId);
      formData.append('name', name);
      formData.append('description', desc);
      
      if (cat1) formData.append('category_1_id', cat1.id);
      if (cat2) formData.append('category_2_id', cat2.id);

      formData.append('color[name]', color.name);
      formData.append('color[hex]', color.hex);

      const facesCrit = criterias.find(c => c.title.toLowerCase().includes('face'));
      const sizeCrit = criterias.find(c => c.title.toLowerCase().includes('size'));

      if (facesCrit) {
        formData.append('criterias[0][criteria_id]', facesCrit.id);
        formData.append('criterias[0][value]', faces);
      }
      if (sizeCrit) {
        formData.append('criterias[1][criteria_id]', sizeCrit.id);
        formData.append('criterias[1][value]', sizeMm);
      }

      images.forEach((img) => {
        formData.append('images[]', img.file);
      });

      await axios.post(`${api_url}/dices`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setSuccess(true);
      if (onCreated) onCreated();
      setTimeout(() => {
        onClose();
        setName(''); setDesc(''); setColor(COLORS[0]); setFaces(6); setSizeMm(22); setImages([]);
        setCat1(null); setCat2(null);
        setSuccess(false);
      }, 900);
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : null)
        || err.message
        || 'An error happened.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillPctFaces = ((faces - 1) / 99) * 100;
  const fillPctSize = ((sizeMm - 5) / 45) * 100;

  const inputCls = "w-full bg-transparent border border-black/15 rounded-lg text-black text-sm px-3.5 py-2.5 outline-none placeholder:text-black/25 focus:border-black/50 transition-colors duration-150";

  const renderCategorySelect = (selected, setSelected, open, setOpen, search, setSearch, label, ref) => {
    const filtered = (categories || []).filter(c => c?.title?.toLowerCase().includes(search.toLowerCase()));
    
    return (
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-[11px] font-semibold tracking-widest uppercase text-black/40">{label}</label>
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="w-full flex items-center justify-between border border-black/15 rounded-lg px-3.5 py-2.5 text-black text-sm hover:border-black/40 transition-colors duration-150 cursor-pointer bg-transparent"
          >
            <span className="truncate">{selected ? selected.title : "Select..."}</span>
            <svg className={`text-black/30 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {open && (
            <div className="absolute bottom-[calc(100%+6px)] left-0 right-0 bg-white border border-black/10 rounded-xl z-50 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] p-2">
              <input 
                type="text" 
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full mb-2 p-2 text-xs border border-black/10 rounded-lg outline-none focus:border-black/30"
              />
              <ul className="max-h-40 overflow-y-auto list-none m-0 p-0">
                {filtered.map(c => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => { setSelected(c); setOpen(false); setSearch(''); }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] transition-all hover:bg-black/4 ${selected?.id === c.id ? 'bg-black/5 font-semibold' : 'bg-transparent'}`}
                    >
                      {c.title}
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && <li className="text-[11px] text-black/30 text-center py-2">No results</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        ref={backdropRef}
        onClick={onClose}
        style={{ display: 'none', opacity: 0 }}
        className="fixed inset-0 z-2000 bg-black/20 backdrop-blur-sm"
      />

      <div
        ref={drawerRef}
        style={{ display: 'none' }}
        className="fixed bottom-0 left-0 right-0 w-[90%] md:w-[40vw] mx-auto z-2000 flex flex-col justify-center bg-white rounded-t-4xl border-t border-black/8 shadow-[0_-16px_60px_rgba(0,0,0,0.12)]"
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-black/15 rounded-full" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] w-full overflow-y-auto mx-auto px-6 py-5 flex flex-col gap-4 mt-6"
        >
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-black/40 flex items-center gap-1.5">Images</label>
            <div className="grid grid-cols-4 gap-2">
               <div
                onClick={() => images.length < 3 && fileRef.current?.click()}
                className={`aspect-square border border-dashed border-black/20 rounded-lg flex flex-col items-center justify-center text-black/30 transition-all ${images.length < 3 ? 'cursor-pointer hover:border-black/40 hover:bg-black/2' : 'opacity-30 cursor-not-allowed'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleImages(e.target.files)} disabled={images.length >= 3} />
              </div>
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-black/10 group">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 border border-black/10 text-black text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer leading-none">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              placeholder="Dice Name (e.g. Blue Sparkle D20)"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <textarea
              placeholder="Tell the story of this dice…"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={2}
              className={`${inputCls} resize-none leading-relaxed`}
            />
          </div>

          <div className="flex gap-3">
            {renderCategorySelect(cat1, setCat1, catOpen1, setCatOpen1, search1, setSearch1, "Primary Category", catRef1)}
            {renderCategorySelect(cat2, setCat2, catOpen2, setCatOpen2, search2, setSearch2, "Secondary", catRef2)}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-black/40">Color</label>
              <div className="relative" ref={colorRef}>
                <button
                  type="button"
                  onClick={() => setColorOpen(v => !v)}
                  className="w-full flex items-center gap-2 border border-black/15 rounded-lg px-3.5 py-2.5 text-black text-sm hover:border-black/40 transition-colors duration-150 cursor-pointer bg-transparent"
                >
                  <span className="shrink-0 rounded-sm border border-black/10" style={{ background: color.hex, width: 16, height: 16 }} />
                  <span className="flex-1 text-left truncate">{color.name}</span>
                  <svg className={`text-black/30 shrink-0 transition-transform duration-200 ${colorOpen ? 'rotate-180' : ''}`} width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {colorOpen && (
                  <ul className="absolute bottom-[calc(100%+6px)] left-0 right-0 bg-white border border-black/10 rounded-xl z-50 max-h-40 overflow-y-auto p-1.5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] list-none m-0">
                    {COLORS.map(c => (
                      <li key={c.hex}>
                        <button
                          type="button"
                          onClick={() => { setColor(c); setColorOpen(false); }}
                          className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-[13px] transition-all duration-100 cursor-pointer border-none ${
                            color.hex === c.hex ? 'bg-black/5 text-black' : 'bg-transparent text-black/60 hover:bg-black/4 hover:text-black'
                          }`}
                        >
                          <span className="shrink-0 rounded-sm border border-black/10" style={{ background: c.hex, width: 16, height: 16 }} />
                          <span className="flex-1 text-left">{c.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 ">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-black/40 flex items-center gap-2">
                Faces
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={faces}
                  onChange={e => setFaces(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="bg-black text-white text-[10px] font-bold px-1 py-0.5 rounded-md w-8 text-center border-none outline-none focus:ring-1 focus:ring-black/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </label>
              <div className="flex items-center gap-2 h-10.5">
                <div className="relative flex-1 h-0.75">
                  <div className="absolute inset-0 bg-black/10 rounded-full" />
                  <div className="absolute top-0 left-0 h-full bg-black rounded-full pointer-events-none" style={{ width: `${fillPctFaces}%` }} />
                  <input
                    type="range" min={1} max={100} value={faces}
                    onChange={e => setFaces(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full border border-white pointer-events-none shadow-sm"
                    style={{ left: `calc(${fillPctFaces}% - 4px)` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-black/40 flex items-center justify-between">
              Size (Millimeters)
              <span className="flex items-center gap-2">
                <span className="text-black/30 font-normal lowercase tracking-normal italic">avg. is 22mm</span>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={sizeMm}
                  onChange={e => setSizeMm(Math.max(5, Math.min(50, Number(e.target.value))))}
                  className="bg-black text-white text-[10px] font-bold px-1 py-0.5 rounded-md w-10 text-center border-none outline-none focus:ring-1 focus:ring-black/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </span>
            </label>
            <div className="flex items-center gap-4 h-12">
               <div className="relative flex-1 h-0.75">
                  <div className="absolute inset-0 bg-black/10 rounded-full" />
                  <div className="absolute top-0 left-0 h-full bg-black rounded-full pointer-events-none" style={{ width: `${fillPctSize}%` }} />
                  <input
                    type="range" min={5} max={50} value={sizeMm}
                    onChange={e => setSizeMm(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
                    style={{ left: `calc(${fillPctSize}% - 15px)` }}
                  >
                    <DiceIcon sizeMm={sizeMm} className="text-black bg-white rounded-md p-0.5 shadow-sm border border-black/10" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-black/30 w-8">50mm</span>
            </div>
          </div>

          {error && (
            <div className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1 pb-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-full text-sm font-medium bg-black/5 text-black/50 hover:bg-black/10 hover:text-black transition-all duration-150 cursor-pointer border-none disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-black text-white flex items-center justify-center gap-1.5 hover:bg-black/85 transition-all duration-150 cursor-pointer border-none disabled:opacity-60"
            >
              {loading ? "Saving…" : success ? "Saved!" : "Create Dice"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

