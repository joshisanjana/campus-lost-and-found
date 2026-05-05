import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './ItemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);
  const [showMatches, setShowMatches] = useState(false);
  const [matching, setMatching] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load item details');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        navigate('/my-items');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete item';
        setError(errorMessage);
        // Log out user if token is invalid
        if (err.response?.status === 401) {
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    }
  };

  const handleFindMatches = async () => {
    setMatching(true);
    try {
      const response = await api.post('/items/match', { itemId: id });
      setMatches(response.data);
      setShowMatches(true);
    } catch (err) {
      setError('Failed to find matches');
    } finally {
      setMatching(false);
    }
  };

  const handleMarkAsMatched = async (matchedItemId) => {
    try {
      await api.put(`/items/${id}/match`, { matchedWithId: matchedItemId });
      alert('Items marked as matched successfully!');
      setShowMatches(false);
      // Refresh item data
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
    } catch (err) {
      setError('Failed to mark items as matched');
    }
  };

  if (loading) {
    return <div className="loading">Loading item details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!item) {
    return <div className="error-message">Item not found</div>;
  }

  const isOwner = user && item.postedBy._id === user._id;
  const canEdit = isOwner || user?.role === 'admin';

  return (
    <div className="item-details">
      <div className="item-header">
        <h2>{item.title}</h2>
        <div className="item-meta">
          <span className={`type-badge type-${item.type}`}>
            {item.type.toUpperCase()}
          </span>
          <span className={`status-badge status-${item.status}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="item-content">
        <div className="item-image-section">
          {item.image && (
            <img 
              src={item.image} 
              alt={item.title} 
              className="item-detail-image"
            />
          )}
        </div>

        <div className="item-info">
          <div className="info-group">
            <label>Category:</label>
            <span>{item.category}</span>
          </div>

          <div className="info-group">
            <label>Location:</label>
            <span>{item.location}</span>
          </div>

          <div className="info-group">
            <label>Date:</label>
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>

          <div className="info-group">
            <label>Posted by:</label>
            <span>{item.postedBy.name}</span>
          </div>

          <div className="info-group">
            <label>Description:</label>
            <p className="item-description">{item.description}</p>
          </div>

          {item.status === 'matched' && item.matchedWith && (
            <div className="info-group">
              <label>Matched with:</label>
              <Link to={`/items/${item.matchedWith}`} className="matched-link">
                View matched item
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="item-actions">
        {canEdit && (
          <>
            <Link to={`/edit-item/${id}`} className="btn btn-primary">
              Edit
            </Link>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}

        {item.type === 'lost' && item.status === 'pending' && (
          <button 
            className="btn btn-secondary"
            onClick={handleFindMatches}
            disabled={matching}
          >
            {matching ? 'Finding Matches...' : 'Find Matches'}
          </button>
        )}
      </div>

      {showMatches && matches.length > 0 && (
        <div className="matches-section">
          <h3>Potential Matches</h3>
          <div className="matches-grid">
            {matches.map(match => (
              <div key={match._id} className="match-card">
                <h4>{match.title}</h4>
                <p>{match.description.substring(0, 100)}...</p>
                <div className="match-meta">
                  <span>{match.location}</span>
                  <span>{new Date(match.date).toLocaleDateString()}</span>
                </div>
                <button 
                  className="btn btn-success"
                  onClick={() => handleMarkAsMatched(match._id)}
                >
                  Mark as Match
                </button>
              </div>
            ))}
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowMatches(false)}
          >
            Close Matches
          </button>
        </div>
      )}

      {showMatches && matches.length === 0 && (
        <div className="no-matches">
          <p>No potential matches found.</p>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowMatches(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
