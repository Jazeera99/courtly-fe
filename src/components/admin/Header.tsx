// src/components/admin/Header.tsx
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [notifications] = useState(5);

  return (
    <header className="admin-header">
      <div className="header-left">
        <div className="breadcrumb">
          <span>Dashboard</span>
          <span className="separator">/</span>
          <span className="current">Overview</span>
        </div>
      </div>
      
      <div className="header-actions">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="notification-badge">
          <button className="btn-notifications">
            🔔
            {notifications > 0 && (
              <span className="notification-count">{notifications}</span>
            )}
          </button>
        </div>
        
        <button className="btn-help">
          <span>❓</span>
          <span>Bantuan</span>
        </button>
      </div>
    </header>
  );
};

export default Header;