import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setIsAdmin(response.data.role === 'admin');
            } catch (error) {
                console.error('Error checking admin status:', error);
            }
        };

        checkAdminStatus();
    }, []);

    return (
        <nav className="navbar">
            {/* ... other nav items ... */}
            {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">
                    Admin Dashboard
                </Link>
            )}
        </nav>
    );
};

export default Navbar; 