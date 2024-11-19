import React, { useState } from 'react';
import axios from 'axios';
import './ReportModal.css';

const ReportModal = ({ isOpen, onClose, reportedUserId, reportedUsername }) => {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reasons = [
        'Inappropriate Content',
        'Harassment',
        'Spam',
        'Fake Profile',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/report/submit',
                {
                    reportedUserId,
                    reason,
                    description
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSuccess('Report submitted successfully');
            setTimeout(() => {
                onClose();
                setReason('');
                setDescription('');
                setSuccess('');
            }, 2000);

        } catch (error) {
            setError(error.response?.data?.message || 'Error submitting report');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="report-modal-overlay">
            <div className="report-modal">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Report User</h2>
                <p className="report-user-info">Reporting: {reportedUsername}</p>
                
                <form onSubmit={handleSubmit} className="report-form">
                    <div className="form-group">
                        <label htmlFor="reason">Reason for Report</label>
                        <select
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        >
                            <option value="">Select a reason</option>
                            {reasons.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Please provide details about your report..."
                            rows="4"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button 
                        type="submit" 
                        className="submit-report-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportModal; 