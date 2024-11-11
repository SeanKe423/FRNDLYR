// frontend/src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/signup'); // Redirects to signup page
    };

    const handleLogin = () => {
        navigate('/login'); // Redirects to login page
    };

    return (
        <div className="landing-container">
            <header className="header">
                <h1 className="app-name">FRNDLY</h1>
                <p className="tagline">Discover friendships that last.</p>
            </header>
            <div className="button-group">
                <button className="get-started-button" onClick={handleGetStarted}>
                    Get Started
                </button>
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
