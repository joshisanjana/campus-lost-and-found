import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>
      
      <div className="profile-details">
        <div className="profile-field">
          <label>Name:</label>
          <span>{user?.name}</span>
        </div>
        
        <div className="profile-field">
          <label>Email:</label>
          <span>{user?.email}</span>
        </div>
        
        <div className="profile-field">
          <label>Role:</label>
          <span className="role-badge">{user?.role}</span>
        </div>
        
        <div className="profile-field">
          <label>Verification Status:</label>
          <span className={user?.isVerified ? 'status-verified' : 'status-unverified'}>
            {user?.isVerified ? 'Verified' : 'Not Verified'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
