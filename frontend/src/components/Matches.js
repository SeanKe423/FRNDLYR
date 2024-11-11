// frontend/src/components/Matches.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Matches.css';

const Matches = ({ userId }) => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/match/find-matches`, {
                    params: { userId }
                });
                setMatches(response.data);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };

        fetchMatches();
    }, [userId]);

    return (
        <div className="matches-container">
            <h2 className="matches-title">Your Matches</h2>
            {matches.length > 0 ? (
                <div className="matches-grid">
                    {matches.map((match) => (
                        <div key={match._id} className="match-card">
                            <h3>{match.username}</h3>
                            <p><strong>Bio:</strong> {match.bio}</p>
                            <p><strong>Location:</strong> {match.location}</p>
                            <p><strong>Interests:</strong> {match.interests.join(', ')}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-matches">No matches yet 😢</p>
            )}
            <button className="home-button" onClick={() => window.location.href = '/'}>Go to Home</button>
        </div>
    );
};

export default Matches;
