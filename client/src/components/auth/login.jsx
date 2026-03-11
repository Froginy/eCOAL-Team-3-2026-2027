import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            // Simulated backend call
            // const response = await fetch('/api/login', { ... })
            console.log('Login attempt:', email);

            // Mock success
            if (email.includes('@') && password.length >= 6) {
                // localStorage.setItem('token', 'mock_token')
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
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your eCOAL account</p>
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
                            placeholder="Entar your password"
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-submit-btn">
                        Sign In
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
