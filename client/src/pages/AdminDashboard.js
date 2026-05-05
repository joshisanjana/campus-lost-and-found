import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, itemsResponse] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/items')
        ]);
        
        setUsers(usersResponse.data);
        setItems(itemsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerifyUser = async (userId, isVerified) => {
    try {
      await api.put(`/admin/users/${userId}/verify`, { isVerified });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isVerified } : user
      ));
    } catch (err) {
      setError('Failed to update user verification status');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/admin/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button 
          className={activeTab === 'items' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('items')}
        >
          Items ({items.length})
        </button>
      </div>
      
      {activeTab === 'users' && (
        <div className="users-table">
          <h3>User Management</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={user.isVerified ? 'status-verified' : 'status-unverified'}>
                      {user.isVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`btn btn-${user.isVerified ? 'secondary' : 'success'}`}
                      onClick={() => handleVerifyUser(user._id, !user.isVerified)}
                    >
                      {user.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'items' && (
        <div className="items-table">
          <h3>Item Management</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Posted By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>
                    <span className={`type-badge type-${item.type}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.postedBy?.name || 'Unknown'}</td>
                  <td>
                    <span className={`status-badge status-${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
