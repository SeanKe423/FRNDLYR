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
        location: '',
        age: '',
        profilePicture: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const interests = [
        'Sports', 'Music', 'Travel', 'Reading', 
        'Gaming', 'Cooking', 'Movies', 'Technology', 'Art'
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            setProfile(response.data || { bio: '', interests: [], location: '', age: '', profilePicture: null });
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleInterestsChange = (e) => {
        const { value, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            interests: checked 
                ? [...prev.interests, value]
                : prev.interests.filter(interest => interest !== value)
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(prev => ({ ...prev, profilePicture: file }));
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const formData = new FormData();
            formData.append('bio', profile.bio);
            formData.append('location', profile.location);
            formData.append('age', profile.age);
            formData.append('interests', JSON.stringify(profile.interests));
            
            if (profile.profilePicture) {
                formData.append('profilePicture', profile.profilePicture);
            }

            const response = await axios.put(
                'http://localhost:5000/api/auth/profile',
                formData,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data) {
                alert('Profile updated successfully!');
                navigate('/matches');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || 'Error updating profile';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <h2 className="profile-title">Your Profile</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group profile-picture-group">
                    <label className="form-label">Profile Picture</label>
                    <div className="profile-picture-container">
                        <div className="profile-picture-preview">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile preview" />
                            ) : (
                                <div className="profile-picture-placeholder">
                                    <i className="fas fa-user"></i>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="profile-picture-input"
                        />
                        <label 
                            htmlFor="profilePicture" 
                            className="profile-picture-label"
                        >
                            Choose Photo
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="age">Age</label>
                    <input
                        className="form-input"
                        id="age"
                        type="number"
                        name="age"
                        value={profile.age}
                        onChange={handleChange}
                        placeholder="Enter your age"
                        min="18"
                        max="120"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="bio">Bio</label>
                    <textarea
                        className="form-textarea"
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Write a short bio about yourself"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Interests</label>
                    <div className="interests-grid">
                        {interests.map((interest) => (
                            <div key={interest} className="interest-item">
                                <input
                                    type="checkbox"
                                    id={interest}
                                    className="interest-checkbox"
                                    name="interests"
                                    value={interest}
                                    checked={profile.interests.includes(interest)}
                                    onChange={handleInterestsChange}
                                />
                                <label 
                                    className="interest-label" 
                                    htmlFor={interest}
                                >
                                    {interest}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="location">Location</label>
                    <input
                        className="form-input"
                        id="location"
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        placeholder="Enter your location"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="profile-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
