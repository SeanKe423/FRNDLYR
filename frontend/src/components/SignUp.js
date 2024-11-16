// frontend/src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const { username, email, password } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 1. Sign up the user
            const signupResponse = await axios.post('http://localhost:5000/api/auth/signup', {
                username,
                email,
                password
            });
            
            // 2. Store the token
            const token = signupResponse.data.token;
            localStorage.setItem('token', token);
            
            // 3. Set the default authorization header for all future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // 4. Navigate to profile page
            navigate('/profile');
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Signup failed';
            alert(errorMessage);
            console.error('Signup error:', error.response?.data);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Join FRNDLY</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="signup-button" disabled={isLoading}>
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default SignUp;
