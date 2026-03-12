import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './login.css';

const api_url = import.meta.env.VITE_API_URL;
console.log(api_url)

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            const response = await axios.post(api_url + '/register', { name, email, password });

            alert('Account created successfully! Please sign in.');
            navigate('/login');
        } catch (err) {
            console.log(err)
            setError('An error occurred during registration.', err);
        }
    }

    return (
        <div className="auth-container">
            <button
            className="fixed top-0 left-0 fill-black m-10 transition-all duration-300 hover:scale-110 hover:cursor-pointer"
            aria-label="Go back"
            onClick={() => window.history.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
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
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join Roll It today</p>
                </div>

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <input
                            type="text"
                            className="auth-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Confirm Password</label>
                        <input
                            type="password"
                            className="auth-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat your password"
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-submit-btn">
                        Sign Up
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
