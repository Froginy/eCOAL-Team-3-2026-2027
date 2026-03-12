import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PostCard from "../PostCards/PostCards";
import EditDiceDrawer from "../EditDrawer/EditDrawer";

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M21 6H3V9C3.53043 9 4.03914 9.21071 4.41421 9.58579C4.78929 9.96086 5 10.4696 5 11V15C5 17.828 5 19.243 5.879 20.121C6.757 21 8.172 21 11 21H13C15.829 21 17.243 21 18.121 20.121C19.001 19.243 19.001 17.828 19.001 15V11C19.001 10.4696 19.2117 9.96086 19.5868 9.58579C19.9619 9.21071 20.4706 9 21.001 9L21 6ZM10.5 11C10.5 10.7348 10.3946 10.4804 10.2071 10.2929C10.0196 10.1054 9.76522 10 9.5 10C9.23478 10 8.98043 10.1054 8.79289 10.2929C8.60536 10.4804 8.5 10.7348 8.5 11V16C8.5 16.2652 8.60536 16.5196 8.79289 16.7071C8.98043 16.8946 9.23478 17 9.5 17C9.76522 17 10.0196 16.8946 10.2071 16.7071C10.3946 16.5196 10.5 16.2652 10.5 16V11ZM15.5 11C15.5 10.7348 15.3946 10.4804 15.2071 10.2929C15.0196 10.1054 14.7652 10 14.5 10C14.2348 10 13.9804 10.1054 13.7929 10.2929C13.6054 10.4804 13.5 10.7348 13.5 11V16C13.5 16.2652 13.6054 16.5196 13.7929 16.7071C13.9804 16.8946 14.2348 17 14.5 17C14.7652 17 15.0196 16.8946 15.2071 16.7071C15.3946 16.5196 15.5 16.2652 15.5 16V11Z" fill="currentColor"/>
    <path d="M10.068 3.37003C10.182 3.26403 10.433 3.17003 10.783 3.10303C11.1847 3.03172 11.592 2.99724 12 3.00003C12.44 3.00003 12.868 3.03603 13.217 3.10303C13.566 3.17003 13.817 3.26403 13.932 3.37103" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_404_98)">
      <path d="M9.0856 2.91376L13.0862 6.91438L4.39904 15.6016L0.832161 15.9953C0.354661 16.0481 -0.0487768 15.6444 0.00434818 15.1669L0.401223 11.5975L9.0856 2.91376ZM15.5606 2.31813L13.6822 0.439697C13.0962 -0.14624 12.1459 -0.14624 11.56 0.439697L9.79279 2.20688L13.7934 6.20751L15.5606 4.44032C16.1465 3.85407 16.1465 2.90407 15.5606 2.31813Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_404_98">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export default function DiceGrid({ userId, isOwnProfile }) {
  const [dices, setDices]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editDice, setEditDice]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpenId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const api_url = import.meta.env.VITE_API_URL;
    const token   = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

    const fetchDices = async () => {
      try {
        let targetId = userId;
        if (!targetId) {
          const userRes = await axios.get(`${api_url}/user`, { headers });
          targetId = userRes.data?.id ?? userRes.data?.data?.id;
        }
        const res = await axios.get(`${api_url}/users/${targetId}/dices`, { headers });
        if (!cancelled) setDices(res.data.data);
      } catch {
        if (!cancelled) setDices([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDices();
    return () => { cancelled = true; };
  }, [userId]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const api_url = import.meta.env.VITE_API_URL;
    const token   = localStorage.getItem("token");
    setDeleting(true);
    try {
      await axios.delete(`${api_url}/dices/${deleteTarget}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setDices((prev) => prev.filter((d) => d.id !== deleteTarget));
    } catch {}
    setDeleting(false);
    setDeleteTarget(null);
  };

  if (loading) return <div className="dice-grid">Loading…</div>;
  if (!dices.length) return <div className="dice-grid">No dices yet.</div>;

  return (
    <>
      <div className="flex flex-col items-center gap-4 pb-24">
        {dices.map((dice) => (
          <div key={dice.id} className="relative">
            <PostCard
              id={dice.id}
              name={dice.name}
              description={dice.description}
              images={dice.images ?? []}
              collection={dice.collection}
            />

            {isOwnProfile && (
              <div ref={menuRef} style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
                <button
                  type="button"
                  onClick={() => setMenuOpenId(menuOpenId === dice.id ? null : dice.id)}
                  className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.8332 7.93141C10.8332 7.67489 10.9351 7.42886 11.1165 7.24747C11.2978 7.06608 11.5439 6.96417 11.8004 6.96417C12.0569 6.96417 12.3029 7.06608 12.4843 7.24747C12.6657 7.42886 12.7676 7.67489 12.7676 7.93141C12.7676 8.18794 12.6657 8.43397 12.4843 8.61536C12.3029 8.79675 12.0569 8.89866 11.8004 8.89866C11.5439 8.89866 11.2978 8.79675 11.1165 8.61536C10.9351 8.43397 10.8332 8.18794 10.8332 7.93141ZM6.96418 7.93141C6.96418 7.67489 7.06609 7.42886 7.24748 7.24747C7.42888 7.06608 7.6749 6.96417 7.93143 6.96417C8.18796 6.96417 8.43398 7.06608 8.61537 7.24747C8.79676 7.42886 8.89867 7.67489 8.89867 7.93141C8.89867 8.18794 8.79676 8.43397 8.61537 8.61536C8.43398 8.79675 8.18796 8.89866 7.93143 8.89866C7.6749 8.89866 7.42888 8.79675 7.24748 8.61536C7.06609 8.43397 6.96418 8.18794 6.96418 7.93141ZM3.09521 7.93141C3.09521 7.67489 3.19712 7.42886 3.37851 7.24747C3.55991 7.06608 3.80593 6.96417 4.06246 6.96417C4.31899 6.96417 4.56501 7.06608 4.7464 7.24747C4.92779 7.42886 5.0297 7.67489 5.0297 7.93141C5.0297 8.18794 4.92779 8.43397 4.7464 8.61536C4.56501 8.79675 4.31899 8.89866 4.06246 8.89866C3.80593 8.89866 3.55991 8.79675 3.37851 8.61536C3.19712 8.43397 3.09521 8.18794 3.09521 7.93141Z" fill="black"/>
                  </svg>
                </button>

                {menuOpenId === dice.id && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0,
                    background: "white", border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    minWidth: 130, overflow: "hidden",
                  }}>
                    <button
                      type="button"
                      onClick={() => { setEditDice(dice); setMenuOpenId(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
                    >
                      <EditIcon /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDeleteTarget(dice.id); setMenuOpenId(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#dc2626" }}
                    >
                      <TrashIcon /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <EditDiceDrawer
          open={!!editDice}
          dice={editDice}
          onClose={() => setEditDice(null)}
          onUpdated={(updated) => {
            setDices((prev) => prev.map((d) => d.id === updated.id ? updated : d));
            setEditDice(null);
          }}
        />
      </div>

      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", borderRadius: 20, padding: 24, width: 300, boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ background: "#fee2e2", borderRadius: 10, padding: 8, display: "flex" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Delete Dice</h3>
            </div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
              You are about to permanently delete this dice.{" "}
              <strong>This action is irreversible.</strong>
            </p>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Are you sure you want to continue?</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, padding: "10px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
              >
                Keep Dice
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", background: "#dc2626", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: deleting ? 0.6 : 1 }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}