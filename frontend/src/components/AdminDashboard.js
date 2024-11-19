import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/reports', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching reports');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (reportId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/admin/reports/${reportId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchReports();
        } catch (error) {
            setError('Error updating report status');
        }
    };

    const handleBanUser = async (userId, reason) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/admin/ban-user/${userId}`,
                { reason },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchReports();
        } catch (error) {
            setError('Error banning user');
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="reports-container">
                {reports.map(report => (
                    <div key={report._id} className="report-card">
                        <div className="report-header">
                            <h3>Report #{report._id.slice(-6)}</h3>
                            <span className={`status ${report.status.toLowerCase()}`}>
                                {report.status}
                            </span>
                        </div>
                        
                        <div className="report-details">
                            <p><strong>Reporter:</strong> {report.reporter.username}</p>
                            <p><strong>Reported User:</strong> {report.reportedUser.username}</p>
                            <p><strong>Reason:</strong> {report.reason}</p>
                            <p><strong>Description:</strong> {report.description}</p>
                            <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="report-actions">
                            <select 
                                onChange={(e) => handleUpdateStatus(report._id, e.target.value)}
                                value={report.status}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Resolved">Resolved</option>
                            </select>

                            <button 
                                className="ban-button"
                                onClick={() => {
                                    const reason = window.prompt('Enter ban reason:');
                                    if (reason) {
                                        handleBanUser(report.reportedUser._id, reason);
                                    }
                                }}
                            >
                                Ban User
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard; 