import { useState, useEffect, useRef } from "react";
import axios from "axios";
import EditDrawer from "../EditDrawer/EditDrawer";

export default function DiceGrid({ userId, isOwnProfile }) {
  const [dices, setDices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editDice, setEditDice] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const api_url = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    const fetchDices = async () => {
      try {
        let targetId = userId;
        if (!targetId) {
          const userRes = await axios.get(`${api_url}/user`, { headers });
          targetId = userRes.data.id;
        }
        const res = await axios.get(`${api_url}/users/${targetId}/dices`, {
          headers,
        });
        setDices(res.data.data);
      } catch {
        setDices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDices();
  }, [userId]);

  const handleDelete = async (diceId) => {
    const api_url = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${api_url}/dices/${diceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setDices((prev) => prev.filter((d) => d.id !== diceId));
    } catch {}
    setMenuOpenId(null);
  };

  if (loading) return <div className="dice-grid">Loading…</div>;
  if (!dices.length) return <div className="dice-grid">No dices yet.</div>;

  return (
    <div className="dice-grid">
      {dices.map((dice) => {
        const faces =
          dice.criterias?.find((c) => c.criteria_id === 1)?.value ?? "?";
        const isOpen = menuOpenId === dice.id;

        return (
          <div key={dice.id} className="dice-card">
            <div
              className="dice-thumb"
              style={{
                backgroundImage: dice.images?.[0]
                  ? `url(${import.meta.env.VITE_API_URL.replace("/api", "")}/${dice.images[0].image_url})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="dice-info">
              <span className="dice-name">{dice.name}</span>
              <span className="dice-faces">{faces}F</span>
            </div>

            {isOwnProfile && (
              <div className="dice-more" style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setMenuOpenId(isOpen ? null : dice.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.8332 7.93141C10.8332 7.67489 10.9351 7.42886 11.1165 7.24747C11.2978 7.06608 11.5439 6.96417 11.8004 6.96417C12.0569 6.96417 12.3029 7.06608 12.4843 7.24747C12.6657 7.42886 12.7676 7.67489 12.7676 7.93141C12.7676 8.18794 12.6657 8.43397 12.4843 8.61536C12.3029 8.79675 12.0569 8.89866 11.8004 8.89866C11.5439 8.89866 11.2978 8.79675 11.1165 8.61536C10.9351 8.43397 10.8332 8.18794 10.8332 7.93141ZM6.96418 7.93141C6.96418 7.67489 7.06609 7.42886 7.24748 7.24747C7.42888 7.06608 7.6749 6.96417 7.93143 6.96417C8.18796 6.96417 8.43398 7.06608 8.61537 7.24747C8.79676 7.42886 8.89867 7.67489 8.89867 7.93141C8.89867 8.18794 8.79676 8.43397 8.61537 8.61536C8.43398 8.79675 8.18796 8.89866 7.93143 8.89866C7.6749 8.89866 7.42888 8.79675 7.24748 8.61536C7.06609 8.43397 6.96418 8.18794 6.96418 7.93141ZM3.09521 7.93141C3.09521 7.67489 3.19712 7.42886 3.37851 7.24747C3.55991 7.06608 3.80593 6.96417 4.06246 6.96417C4.31899 6.96417 4.56501 7.06608 4.7464 7.24747C4.92779 7.42886 5.0297 7.67489 5.0297 7.93141C5.0297 8.18794 4.92779 8.43397 4.7464 8.61536C4.56501 8.79675 4.31899 8.89866 4.06246 8.89866C3.80593 8.89866 3.55991 8.79675 3.37851 8.61536C3.19712 8.43397 3.09521 8.18794 3.09521 7.93141Z"
                      fill="black"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    ref={menuRef}
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 6px)",
                      right: 0,
                      background: "white",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: 12,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      minWidth: 120,
                      zIndex: 50,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => { setEditDice(dice); setMenuOpenId(null); }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: 13,
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(dice.id)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: 13,
                        color: "#dc2626",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <EditDrawer
        open={!!editDice}
        dice={editDice}
        onClose={() => setEditDice(null)}
        onUpdated={(updated) => {
          setDices(prev => prev.map(d => d.id === updated.id ? updated : d));
          setEditDice(null);
        }}
      />
    </div>
  );
}
