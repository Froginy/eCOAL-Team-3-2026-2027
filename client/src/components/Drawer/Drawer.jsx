import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import axios from 'axios';

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

const SIZES = ['small', 'medium', 'large'];

const SIZE_CONFIG = {
  small:  { label: 'S', svgSize: 18 },
  medium: { label: 'M', svgSize: 26 },
  large:  { label: 'L', svgSize: 36 },
};

function DiceIcon({ sizeKey }) {
  const { label, svgSize } = SIZE_CONFIG[sizeKey];
  return (
    <svg width={svgSize} height={svgSize} viewBox="0 0 100 100" fill="none">
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


const SIZE_MM = { small: 16, medium: 22, large: 32 };

export default function NewDiceDrawer({ open, onClose, collectionId }) {
  const [color, setColor]         = useState(COLORS[0]);
  const [colorOpen, setColorOpen] = useState(false);
  const [faces, setFaces]         = useState(6);
  const [name, setName]           = useState('');
  const [desc, setDesc]           = useState('');
  const [images, setImages]       = useState([]);
  const [size, setSize]           = useState('medium');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(false);

  const drawerRef   = useRef(null);
  const backdropRef = useRef(null);
  const colorRef    = useRef(null);
  const fileRef     = useRef(null);
  const isAnimating = useRef(false);

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
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleImages = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    Promise.all(valid.map(f => new Promise(res => {
      const r = new FileReader();
      r.onload = e => res({ url: e.target.result, name: f.name, file: f });
      r.readAsDataURL(f);
    }))).then(imgs => setImages(prev => [...prev, ...imgs].slice(0, 6)));
  };

  const handleDrop = (e) => { e.preventDefault(); handleImages(e.dataTransfer.files); };
  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const api_url = import.meta.env.VITE_API_URL;
      const token   = localStorage.getItem('token');

      let imageUrls = [];
      if (images.length > 0) {
        const imgForm = new FormData();
        images.forEach((img) => {
          if (img.file) {
            imgForm.append('images[]', img.file);
          } else {
            const blob = dataURLtoBlob(img.url);
            imgForm.append('images[]', blob, img.name || 'image.jpg');
          }
        });
        const uploadRes = await axios.post(`${api_url}/dices`, imgForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });
        imageUrls = uploadRes.data?.urls ?? uploadRes.data ?? [];
      }

      const payload = {
        name:          name || null,
        description:   desc || null,
        images:        imageUrls,
        criterias: [
          { criteria_id: 1, value: faces },
          { criteria_id: 2, value: SIZE_MM[size] },
          { criteria_id: 3, value: null },
        ],
      };

      await axios.post(`${api_url}/dices`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setName(''); setDesc(''); setColor(COLORS[0]); setFaces(6); setSize('medium'); setImages([]);
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

  const fillPct = ((faces - 1) / 499) * 100;

  const inputCls = "w-full bg-transparent border border-black/15 rounded-lg text-black text-sm px-3.5 py-2.5 outline-none placeholder:text-black/25 focus:border-black/50 transition-colors duration-150";

  return (
    <>
      <div
        ref={backdropRef}
        onClick={onClose}
        style={{ display: 'none', opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
      />

      <div
        ref={drawerRef}
        style={{ display: 'none' }}
        className="fixed bottom-0 left-0 right-0 mx-2 md:mx-[10vw] lg:mx-[10vw] z-50 flex flex-col justify-center bg-white rounded-t-4xl border-t border-black/8 shadow-[0_-16px_60px_rgba(0,0,0,0.12)]"
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-black/15 rounded-full" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] w-[70%] overflow-y-auto mx-auto px-6 py-5 flex flex-col gap-4 mt-10"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-black/40 flex items-center gap-1.5">
              Images <span className="text-black/25 font-normal normal-case tracking-normal">(up to 6)</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border border-dashed border-black/20 rounded-xl py-6 px-4 flex flex-col items-center gap-1 cursor-pointer text-black/30 hover:border-black/40 hover:bg-black/[0.02] hover:text-black/50 transition-all duration-200 text-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V7M12 7l-3 3M12 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 17v1a3 3 0 003 3h12a3 3 0 003-3v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-[13px] m-0">
                Drop here or <span className="text-black/60 underline underline-offset-2">browse</span>
              </p>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleImages(e.target.files)} />
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-1">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-black/10 group">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 border border-black/10 text-black text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer leading-none"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              placeholder="My favorite dice…"
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
              rows={3}
              className={`${inputCls} resize-none leading-relaxed`}
            />
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
                  <ul className="absolute bottom-[calc(100%+6px)] left-0 right-0 bg-white border border-black/10 rounded-xl z-50 max-h-52 overflow-y-auto p-1.5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] list-none m-0">
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
                          {color.hex === c.hex && (
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="text-black/40 shrink-0">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-black/40 flex items-center gap-2">
                Faces
                <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-normal normal-case">{faces}</span>
              </label>
              <div className="flex items-center gap-2 h-10.5">
                <span className="text-[11px] text-black/30 w-3 text-center shrink-0">1</span>
                <div className="relative flex-1 h-0.75">
                  <div className="absolute inset-0 bg-black/10 rounded-full" />
                  <div className="absolute top-0 left-0 h-full bg-black rounded-full pointer-events-none" style={{ width: `${fillPct}%` }} />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full pointer-events-none shadow-sm border-2 border-white"
                    style={{ left: `${fillPct}%` }}
                  />
                  <input
                    type="range" min={1} max={500} value={faces}
                    onChange={e => setFaces(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-[11px] text-black/30 w-4 text-center shrink-0">500</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-black/40">Size</label>
            <div className="flex gap-2">
              {SIZES.map(s => {
                const active = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-semibold tracking-widest uppercase
                      transition-all duration-150 cursor-pointer
                      ${active
                        ? 'border-black bg-black text-white shadow-sm'
                        : 'border-black/12 bg-transparent text-black/35 hover:border-black/30 hover:text-black/60'
                      }
                    `}
                  >
                    <DiceIcon sizeKey={s} />
                    {s}
                  </button>
                );
              })}
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
              {loading ? (
                <>
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Saving…
                </>
              ) : success ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Create
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function dataURLtoBlob(dataURL) {
  const [header, data] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new Blob([array], { type: mime });
}