import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import "./Settings.css";

function Settings() {
  const { user, token } = useAuth();
  const [description, setDescription] = useState(user?.description || "");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const [isDescOpen, setIsDescOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState(user?.name || "");
  const [tempAvatar, setTempAvatar] = useState(user?.avatar || user?.profile_picture_url || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [email, setEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [imgAspectStyle, setImgAspectStyle] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const imgRef = useRef(null);
  const navigate = useNavigate();

  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      setTempEmail(user.email);
    }
  }, [user]);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  });

  const showStatus = (msg, isError = false) => {
    setSaveStatus({ msg, isError });
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    setDescription(user?.description || "");
    setTempName(user?.name || "");
    setTempAvatar(user?.avatar || user?.profile_picture_url || "");
  }, [token, user, navigate]);

  const putUser = async (body) => {
    const response = await fetch(`${api_url}/user`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Server error ${response.status}`);
    }

    return response.json();
  };

  const openEditProfile = () => {
    setTempName(user?.name || "");
    setTempAvatar(user?.avatar || user?.profile_picture_url || "");
    setAvatarError("");
    setAvatarFile(null);
    setCrop({ x: 0, y: 0 });
    setIsModalOpen(true);
  };

  const validateAndSetImage = (file) => {
    if (!file.type.startsWith("image/")) {
      setAvatarError("Only image files are allowed.");
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    setAvatarError("");
    img.onload = () => {
      const ratio = img.width / img.height;
      setImgAspectStyle(ratio > 1 ? { height: "100%", width: "auto" } : { width: "100%", height: "auto" });
      setAvatarFile(file);
      setTempAvatar(objectUrl);
      setCrop({ x: 0, y: 0 });
    };
    img.onerror = () => {
      setAvatarError("Failed to load image.");
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) validateAndSetImage(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) validateAndSetImage(e.target.files[0]);
  };

  const onDragStart = (clientX, clientY) => {
    setIsDraggingCrop(true);
    setStartDrag({ x: clientX - crop.x, y: clientY - crop.y });
  };

  const onDragMove = (clientX, clientY) => {
    if (!isDraggingCrop) return;
    setCrop({ x: clientX - startDrag.x, y: clientY - startDrag.y });
  };

  const handleMouseDown = (e) => onDragStart(e.clientX, e.clientY);
  const handleMouseMove = (e) => onDragMove(e.clientX, e.clientY);
  const handleMouseUp = () => setIsDraggingCrop(false);
  const handleTouchStart = (e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY);

  const getCroppedBase64 = () => {
    if (!avatarFile || !imgRef.current) return null;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      const clientW = imgRef.current.clientWidth;
      const clientH = imgRef.current.clientHeight;
      const natW = imgRef.current.naturalWidth;
      const natH = imgRef.current.naturalHeight;
      const scaleX = natW / clientW;
      const scaleY = natH / clientH;
      const containerSize = 200;
      const cropX_on_rendered = clientW / 2 - containerSize / 2 - crop.x;
      const cropY_on_rendered = clientH / 2 - containerSize / 2 - crop.y;
      ctx.drawImage(imgRef.current, cropX_on_rendered * scaleX, cropY_on_rendered * scaleY, containerSize * scaleX, containerSize * scaleY, 0, 0, 500, 500);
      return canvas.toDataURL("image/jpeg", 0.9);
    } catch (err) {
      console.error("Crop error:", err);
      return null;
    }
  };

  const handleSaveProfile = async () => {
    const croppedBase64 = getCroppedBase64();
    const body = { name: tempName };
    if (croppedBase64) body.profile_picture = croppedBase64;
    try {
      await putUser(body);
      setIsModalOpen(false);
      showStatus("Profile updated ✓");
    } catch (error) {
      showStatus(`Failed to save: ${error.message}`, true);
    }
  };

  const handleSaveDescription = async () => {
    try {
      await putUser({ description });
      setIsDescOpen(false);
      showStatus("Description updated ✓");
    } catch (error) {
      showStatus(`Failed to save: ${error.message}`, true);
    }
  };

  const handleSaveEmail = async () => {
    if (!tempEmail.trim()) {
      showStatus("Email cannot be empty.", true);
      return;
    }
    try {
      await putUser({ email: tempEmail });
      setEmail(tempEmail);
      setIsEmailOpen(false);
      showStatus("Email updated ✓");
    } catch (error) {
      showStatus(`Failed to save: ${error.message}`, true);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${api_url}/logout`, { method: "POST", headers: getAuthHeaders() });
    } catch (error) {
      console.warn("Logout endpoint error:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${api_url}/user`, { method: "DELETE", headers: getAuthHeaders() });
      if (response.status === 401) { handleUnauthorized(); return; }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${response.status}`);
      }
      showStatus("Account deleted ✓");
    } catch (error) {
      showStatus(`Failed to delete: ${error.message}`, true);
      return;
    }
    localStorage.removeItem("token");
    setTimeout(() => navigate("/login", { replace: true }), 1000);
  };

  if (loading) {
    return (
      <div className="settings-mobile-container">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white w-screen h-screen flex justify-center items-center">
      <div className="settings-mobile-container">
        <header className="settings-header">
          <button className="icon-btn back-btn" aria-label="Go back" onClick={() => window.history.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4m0 0l6-6m-6 6l6 6" />
            </svg>
          </button>
          <h1 className="settings-title">Settings</h1>
          <div className="header-spacer"></div>
        </header>

        {saveStatus && (
          <div style={{
            position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
            background: saveStatus.isError ? "#c0392b" : "#1c1c1e",
            color: "#fff", padding: "10px 20px", borderRadius: 20,
            fontSize: "0.85rem", fontWeight: 600, zIndex: 2000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)", animation: "fadeIn 0.2s ease-out"
          }}>
            {saveStatus.msg}
          </div>
        )}

        <main className="settings-content">
          <section className="account-section">
            <h2 className="section-title">Account</h2>

            <div className="profile-row">
              <div className="profile-info">
                <UserAvatar name={user?.name} src={user?.avatar || user?.profile_picture_url} size={48} hover={false} showName className="gap-4" />
              </div>
              <div className="profile-actions">
                <button className="dark-btn edit-profile-btn" onClick={openEditProfile}>Edit Profile</button>
                <button className="icon-btn logout-btn" aria-label="Log out" onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="description-row">
              <div className="description-info">
                <span className="description-label">Description</span>
                <span className="description-preview">{description ? description : "Add a description"}</span>
              </div>
              <button className="dark-btn change-description-btn" type="button" onClick={() => setIsDescOpen(true)}>Change</button>
            </div>

            <div className="email-row">
              <div className="email-info">
                <span className="email-label">Email</span>
                <span className="description-preview">{email || "Add an email"}</span>
              </div>
              <button className="dark-btn change-email-btn" type="button" onClick={() => { setTempEmail(email); setIsEmailOpen(true); }}>Change</button>
            </div>
          </section>
        </main>

        <footer className="settings-footer">
          <div className="delete-warning">
            <span className="warning-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#666">
                <path d="M12 2L1 21h22L12 2z" />
              </svg>
            </span>
            <span className="warning-text">This action cannot be<br />undone.</span>
          </div>
          <button className="danger-btn delete-account-btn" onClick={() => setIsDeleteModalOpen(true)}>Delete account</button>
        </footer>

        {isDescOpen && (
          <div className="modal-overlay" onClick={() => setIsDescOpen(false)}>
            <div className="modal-content description-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Edit Description</h3>
                <button className="close-modal-btn" onClick={() => setIsDescOpen(false)}>x</button>
              </div>
              <div className="modal-body">
                <textarea
                  className="description-modal-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={150}
                  rows={6}
                />
                <div className="description-counter">{(description || "").length} / 150</div>
              </div>
              <div className="modal-footer">
                <button className="dark-btn cancel-btn" onClick={() => setIsDescOpen(false)}>Cancel</button>
                <button className="dark-btn" onClick={handleSaveDescription}>Save</button>
              </div>
            </div>
          </div>
        )}

        {isEmailOpen && (
          <div className="modal-overlay" onClick={() => setIsEmailOpen(false)}>
            <div className="modal-content description-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Edit Email</h3>
                <button className="close-modal-btn" onClick={() => setIsEmailOpen(false)}>x</button>
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  className="text-input"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="Enter your email"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEmail()}
                />
              </div>
              <div className="modal-footer">
                <button className="dark-btn cancel-btn" onClick={() => setIsEmailOpen(false)}>Cancel</button>
                <button className="dark-btn" onClick={handleSaveEmail}>Save</button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Edit Profile</h3>
                <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Name</label>
                  <input type="text" className="text-input" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Enter your name" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="dark-btn cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="dark-btn" onClick={handleSaveProfile}>Save</button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
            <div className="modal-content delete-modal-premium" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-with-icon">
                  <div className="warning-icon-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="modal-title">Delete Account</h3>
                </div>
                <button className="close-modal-btn" onClick={() => setIsDeleteModalOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <p className="delete-confirmation-text">
                  You are about to permanently delete your account.{" "}
                  <strong>This action is irreversible and all your data will be lost.</strong>
                </p>
                <p className="delete-sub-text">Are you sure you want to continue?</p>
              </div>
              <div className="modal-footer">
                <button className="dark-btn cancel-btn-premium" onClick={() => setIsDeleteModalOpen(false)}>Keep Account</button>
                <button className="danger-btn delete-btn-premium" onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;