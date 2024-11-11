// frontend/src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        bio: '',
        interests: [],
        location: ''
    });

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);  // Load the profile data
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleInterestsChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setProfile({ ...profile, interests: [...profile.interests, value] });
        } else {
            setProfile({
                ...profile,
                interests: profile.interests.filter((interest) => interest !== value),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/auth/profile', profile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Profile updated successfully!');
            navigate('/matches');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile, please try again.');
        }
    };

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Write a short bio about yourself"
                    required
                />

                <label>Interests</label>
                <div className="checkbox-group">
                    {['Sports', 'Music', 'Travel', 'Reading', 'Gaming', 'Cooking', 'Movies', 'Technology', 'Art'].map((interest) => (
                        <div key={interest}>
                            <input
                                type="checkbox"
                                id={interest}
                                name="interests"
                                value={interest}
                                checked={profile.interests.includes(interest)}
                                onChange={handleInterestsChange}
                            />
                            <label htmlFor={interest}>{interest}</label>
                        </div>
                    ))}
                </div>

                <label htmlFor="location">Location</label>
                <input
                    id="location"
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                />

                <button type="submit" className="profile-button">Save Profile</button>
            </form>
        </div>
    );
};

export default Profile;
