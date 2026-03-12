import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const api_url = import.meta.env.VITE_API_URL; 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post(api_url + '/login', { email, password });
        
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                navigate('/settings');
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            setError('An error occurred during login.');
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
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your Roll It account</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
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
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-submit-btn">
                        Sign In
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link to="/register" className="auth-link text-black">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
