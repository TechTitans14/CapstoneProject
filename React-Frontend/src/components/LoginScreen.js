import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaHospital, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginScreen.css';

// Import the background image
import LoginBackground from './LoginBackground.jpg';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(username, password);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div className="login-overlay">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <FaHospital className="logo-icon" />
              <h1>MediCare</h1>
            </div>
            <h2>Welcome</h2>
            <p className="login-subtitle"></p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <FaUser className="input-icon" />
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group password-group">
              <label>
                <FaLock className="input-icon" />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  Sign In
                  <FaArrowRight className="btn-arrow" />
                </>
              )}
            </button>

            
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;