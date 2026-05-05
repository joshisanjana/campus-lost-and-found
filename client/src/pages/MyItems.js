import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import api from '../services/api';
import './MyItems.css';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const response = await api.get('/items/myitems');
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your items');
        setLoading(false);
      }
    };

    fetchMyItems();
  }, []);

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  if (loading) {
    return <div className="loading">Loading your items...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="my-items">
      <div className="my-items-header">
        <h2>My Items</h2>
        <Link to="/post-item" className="btn btn-primary">
          Post New Item
        </Link>
      </div>
      
      <div className="filter-section">
        <label>Filter by type:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Items</option>
          <option value="lost">Lost Items</option>
          <option value="found">Found Items</option>
        </select>
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="items-grid">
          {filteredItems.map(item => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="no-items">
          <p>You haven't posted any items yet.</p>
          <Link to="/post-item" className="btn btn-primary">
            Post Your First Item
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyItems;
