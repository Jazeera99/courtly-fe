// src/components/mitra/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [notifications] = useState(3);

  return (
    <header className="mitra-header">
      <div className="header-left">
        <h1>Dashboard Mitra</h1>
      </div>
      
      <div className="header-actions">
        <button 
          className="btn-add-booking"
          onClick={() => navigate('/partner/bookings/new')}
        >
          <span>➕</span>
          <span>Booking Baru</span>
        </button>
        
        <div className="notification-badge">
          <button className="btn-notifications">
            🔔
            {notifications > 0 && (
              <span className="notification-count">{notifications}</span>
            )}
          </button>
        </div>
        
        <div className="user-menu">
          <div className="user-avatar">MP</div>
          <div className="user-info">
            <span className="user-name">Mitra Partner</span>
            <span className="user-role">Venue Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;