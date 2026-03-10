import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './settings.css'

function Settings() {
    // Initial mockup state
    const [email, setEmail] = useState('john.doe@gmail.com')
    const [name, setName] = useState('John Doe')
    const [description, setDescription] = useState('I like dices')
    const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?u=johndoe')
    const [loading, setLoading] = useState(true)

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tempName, setTempName] = useState('')
    const [tempAvatar, setTempAvatar] = useState('')
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarError, setAvatarError] = useState('')
    const [isDragging, setIsDragging] = useState(false)

    // Crop states
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [isDraggingCrop, setIsDraggingCrop] = useState(false)
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 })
    const [imgAspectStyle, setImgAspectStyle] = useState({})
    const imgRef = useRef(null)
    const navigate = useNavigate()

    // Fetch user data when the component loads
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user', {
                    headers: {
                        'Accept': 'application/json',
                        // Se usares tokens: 'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })

                if (response.ok) {
                    const userData = await response.json()
                    // Update state if backend has data
                    if (userData.email) setEmail(userData.email)
                    if (userData.name) setName(userData.name)
                    if (userData.description) setDescription(userData.description)
                    if (userData.profile_picture_url) setAvatar(userData.profile_picture_url)
                }
            } catch (error) {
                // This will trigger silently for now since the backend isn't ready
                console.warn('Backend API not ready, falling back to mockup data.', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const openEditProfile = () => {
        setTempName(name)
        setTempAvatar(avatar)
        setAvatarError('')
        setAvatarFile(null)
        setCrop({ x: 0, y: 0 })
        setIsModalOpen(true)
    }

    const validateAndSetImage = (file) => {
        if (!file.type.startsWith('image/')) {
            setAvatarError('Only image files are allowed.')
            return
        }

        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        setAvatarError('')

        img.onload = () => {
            const ratio = img.width / img.height
            if (ratio > 1) {
                setImgAspectStyle({ height: '100%', width: 'auto' })
            } else {
                setImgAspectStyle({ width: '100%', height: 'auto' })
            }

            setAvatarFile(file)
            setTempAvatar(objectUrl)
            setCrop({ x: 0, y: 0 })
        }

        img.onerror = () => {
            setAvatarError('Failed to load image.')
            URL.revokeObjectURL(objectUrl)
        }

        img.src = objectUrl
    }

    const handleFileDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetImage(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetImage(e.target.files[0])
        }
    }

    const onDragStart = (clientX, clientY) => {
        setIsDraggingCrop(true)
        setStartDrag({ x: clientX - crop.x, y: clientY - crop.y })
    }

    const onDragMove = (clientX, clientY) => {
        if (!isDraggingCrop) return
        setCrop({
            x: clientX - startDrag.x,
            y: clientY - startDrag.y
        })
    }

    const handleMouseDown = (e) => onDragStart(e.clientX, e.clientY)
    const handleMouseMove = (e) => onDragMove(e.clientX, e.clientY)
    const handleMouseUp = () => setIsDraggingCrop(false)

    const handleTouchStart = (e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY)
    const handleTouchMove = (e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)

    const handleSaveProfile = async () => {
        let finalAvatar = tempAvatar;

        if (avatarFile && imgRef.current) {
            try {
                const canvas = document.createElement('canvas')
                canvas.width = 500
                canvas.height = 500
                const ctx = canvas.getContext('2d')

                const clientW = imgRef.current.clientWidth
                const clientH = imgRef.current.clientHeight
                const natW = imgRef.current.naturalWidth
                const natH = imgRef.current.naturalHeight

                const scaleX = natW / clientW
                const scaleY = natH / clientH

                const containerSize = 200 // MUST MATCH CSS (.crop-container width/height)
                const center = containerSize / 2

                const cropX_on_rendered = (clientW / 2) - center - crop.x
                const cropY_on_rendered = (clientH / 2) - center - crop.y

                const sourceX = cropX_on_rendered * scaleX
                const sourceY = cropY_on_rendered * scaleY
                const sourceWidth = containerSize * scaleX
                const sourceHeight = containerSize * scaleY

                ctx.drawImage(
                    imgRef.current,
                    sourceX,
                    sourceY,
                    sourceWidth,
                    sourceHeight,
                    0, 0, 500, 500
                )

                finalAvatar = canvas.toDataURL('image/jpeg', 0.9)
            } catch (err) {
                console.error("Erro no recorte de imagem:", err)
            }
        }

        setName(tempName)
        setAvatar(finalAvatar)
        setIsModalOpen(false)
        console.log('Profile updated locally.')
    }

    const handleSaveDescription = async (e) => {
        if (e && e.preventDefault) e.preventDefault()

        try {
            // On the future this will send the updated description to the backend APi
            const response = await fetch('/api/user/description', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ description })
            })

            if (response.ok) {
                console.log('Your description was updated.')
            } else {
                console.warn('Backend returned an error. Form updated locally only.')
            }
        } catch (error) {
            console.warn('Backend API not ready. Action simulated locally.', error)
        }
    }

    const handleLogout = async () => {
        try {
            // Future backend API call
            await fetch('/api/logout', { method: 'POST' })
        } catch (error) {
            console.warn('Backend API not ready. Action simulated locally.', error)
        }

        // Clear local session data if any: localStorage.removeItem('token')
        console.log('User logged out successfully.')
        navigate('/login', { replace: true })
    }

    const handleSaveEmail = async (e) => {
        if (e && e.preventDefault) e.preventDefault()

        try {
            // On the future this will send the updated email to the backend APi
            const response = await fetch('/api/user/email', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email: email })
            })

            if (response.ok) {
                console.log('Your email was updated.')
            } else {
                console.warn('Backend returned an error. Form updated locally only.')
            }
        } catch (error) {
            console.warn('Backend API not ready. Action simulated locally.', error)
        }
    }

    if (loading) {
        return <div className="settings-mobile-container"><div className="loading-state">Loading...</div></div>
    }

    return (
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

            <main className="settings-content">
                <section className="account-section">
                    <h2 className="section-title">Account</h2>

                    <div className="profile-row">
                        <div className="profile-info">
                            <img src={avatar} alt={name} className="avatar" />
                            <span className="profile-name">{name}</span>
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
                            <form className="description-form" onSubmit={handleSaveDescription}>
                                <input
                                    type="text"
                                    className="description-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter your description"
                                    maxLength={150}
                                />
                            </form>
                            <span className="description-counter">
                                {description.length} / 150
                            </span>
                        </div>
                        <button className="dark-btn change-description-btn" type="button" onClick={handleSaveDescription}>Change</button>
                    </div>

                    <div className="email-row">
                        <div className="email-info">
                            <span className="email-label">Email</span>
                            <form className="email-form" onSubmit={handleSaveEmail}>
                                <input
                                    type="email"
                                    className="email-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </form>
                        </div>
                        <button className="dark-btn change-email-btn" type="button" onClick={handleSaveEmail}>Change</button>
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
                <button className="danger-btn delete-account-btn">Delete account</button>
            </footer>

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
                            {avatarFile ? (
                                <div className="crop-workspace">
                                    <p className="crop-instructions">Drag image to adjust position</p>
                                    <div
                                        className="crop-container"
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleMouseUp}
                                    >
                                        <img
                                            ref={imgRef}
                                            src={tempAvatar}
                                            className="crop-image"
                                            style={{
                                                ...imgAspectStyle,
                                                transform: `translate(calc(-50% + ${crop.x}px), calc(-50% + ${crop.y}px))`
                                            }}
                                            draggable="false"
                                            alt="Crop preview"
                                        />
                                    </div>
                                    <button type="button" className="cancel-btn dark-btn" onClick={() => { setAvatarFile(null); setTempAvatar(avatar); setCrop({ x: 0, y: 0 }) }}>Remove Image</button>
                                </div>
                            ) : (
                                <div className="modal-avatar-preview">
                                    <img src={tempAvatar} alt={tempName} className="avatar-preview-img" onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?u=fallback' }} />
                                    <div className="avatar-upload-container">
                                        <label className="input-label">Profile Picture</label>
                                        <div
                                            className={`upload-area ${isDragging ? 'drag-over' : ''}`}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleFileDrop}
                                            onClick={() => document.getElementById('avatar-upload').click()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="upload-icon">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            <p className="upload-text"><span>Click to upload</span> or drag and drop</p>
                                        </div>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            className="file-input-hidden"
                                            onChange={handleFileSelect}
                                        />
                                        {avatarError && <p className="error-text">{avatarError}</p>}
                                    </div>
                                </div>
                            )}
                            <div className="input-group">
                                <label className="input-label">Name</label>
                                <input
                                    type="text"
                                    className="text-input"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="dark-btn cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="dark-btn" onClick={handleSaveProfile}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Settings
