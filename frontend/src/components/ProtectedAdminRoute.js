import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedAdminRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsAdmin(false);
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setIsAdmin(response.data.role === 'admin');
                setLoading(false);
            } catch (error) {
                setIsAdmin(false);
                setLoading(false);
            }
        };

        checkAdmin();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAdmin ? children : <Navigate to="/" />;
};

export default ProtectedAdminRoute; 