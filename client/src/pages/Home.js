import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import api from '../services/api';
import './Home.css';
import { LOGO } from '../constants/images';

const Home = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [lostResponse, foundResponse] = await Promise.all([
          api.get('/items?type=lost&limit=3'),
          api.get('/items?type=found&limit=3')
        ]);
        
        setLostItems(lostResponse.data);
        setFoundItems(foundResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <div className="hero-section">
        <div className="logo-container">
          <img src={LOGO} alt="BackTrack" className="home-logo" />
        </div>
        <h1>BackTrack</h1>
        <p>Connect with people who found your lost items</p>
        <div className="hero-buttons">
          <Link to="/post-item" className="btn btn-primary">Post Lost Item</Link>
          <Link to="/search" className="btn btn-secondary">Search Items</Link>
        </div>
      </div>

      <div className="recent-items">
        <div className="items-section">
          <div className="section-header">
            <h2>Recently Lost Items</h2>
            <Link to="/search?type=lost" className="view-all">View All</Link>
          </div>
          <div className="items-grid">
            {lostItems.length > 0 ? (
              lostItems.map(item => (
                <ItemCard key={item._id} item={item} />
              ))
            ) : (
              <p>No lost items found.</p>
            )}
          </div>
        </div>

        <div className="items-section">
          <div className="section-header">
            <h2>Recently Found Items</h2>
            <Link to="/search?type=found" className="view-all">View All</Link>
          </div>
          <div className="items-grid">
            {foundItems.length > 0 ? (
              foundItems.map(item => (
                <ItemCard key={item._id} item={item} />
              ))
            ) : (
              <p>No found items found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
