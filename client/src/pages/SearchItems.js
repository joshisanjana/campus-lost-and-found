import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import api from '../services/api';
import './SearchItems.css';

const SearchItems = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    category: '',
    location: '',
    status: ''
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        
        const response = await api.get(`/items?${queryParams.toString()}`);
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load items');
        setLoading(false);
      }
    };

    fetchItems();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      location: '',
      status: ''
    });
  };

  if (loading) {
    return <div className="loading">Searching items...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="search-items">
      <div className="search-header">
        <h2>Search Items</h2>
      </div>
      
      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="documents">Documents</option>
              <option value="keys">Keys</option>
              <option value="wallet">Wallet</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="matched">Matched</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Enter location"
            />
          </div>
          
          <div className="filter-actions">
            <button 
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="search-results">
        <div className="results-header">
          <h3>
            {items.length} item{items.length !== 1 ? 's' : ''} found
          </h3>
        </div>
        
        {items.length > 0 ? (
          <div className="items-grid">
            {items.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No items match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchItems;
