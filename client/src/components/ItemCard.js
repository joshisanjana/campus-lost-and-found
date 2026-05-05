import React from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css';

const ItemCard = ({ item }) => {
  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'matched': return 'status-matched';
      case 'returned': return 'status-returned';
      default: return '';
    }
  };

  return (
    <div className="item-card">
      {item.image && (
        <img 
          src={item.image} 
          alt={item.title} 
          className="item-image"
        />
      )}
      
      <h3 className="item-title">{item.title}</h3>
      
      <div className="item-meta">
        <span className="item-category">{item.category}</span>
        <span className="item-location">{item.location}</span>
      </div>
      
      <div className="item-meta">
        <span className="item-date">
          {new Date(item.date).toLocaleDateString()}
        </span>
        <span className={`status-badge ${getStatusClass(item.status)}`}>
          {item.status}
        </span>
      </div>
      
      <p className="item-description">
        {item.description.length > 100 
          ? `${item.description.substring(0, 100)}...` 
          : item.description}
      </p>
      
      <div className="item-actions">
        <Link to={`/items/${item._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
