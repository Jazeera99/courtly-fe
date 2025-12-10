// src/components/mitra/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth?mode=login');
  };

  const menuItems = [
    { path: '/partner', icon: '📊', label: 'Dashboard' },
    { path: '/partner/bookings', icon: '📅', label: 'Kelola Booking' },
    { path: '/partner/courts', icon: '🏟️', label: 'Kelola Lapangan' },
    { path: '/partner/schedule', icon: '🕐', label: 'Jadwal & Ketersediaan' },
    { path: '/partner/revenue', icon: '💰', label: 'Pendapatan' },
    { path: '/partner/profile', icon: '👤', label: 'Profil Venue' },
  ];

  return (
    <div className="mitra-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🤝</span>
          <h2>Partner Area</h2>
        </div>
        
        <div className="partner-info">
          <div className="partner-avatar">MP</div>
          <div className="partner-details">
            <h4>Mitra Lapangan</h4>
            <span className="partner-venue">GOR Sidoarjo Sport Center</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => navigate('/')} className="btn-home">
          <span>🏠</span>
          <span>Landing Page</span>
        </button>
        <button onClick={handleLogout} className="logout-btn">
          <span>👋</span>
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;