// src/components/admin/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth?mode=login');
  };

  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/users', icon: '👥', label: 'Pengguna' },
    { path: '/admin/venues', icon: '🏟️', label: 'Venue' },
    { path: '/admin/bookings', icon: '📅', label: 'Booking' },
    { path: '/admin/reports', icon: '📈', label: 'Laporan' },
    { path: '/admin/settings', icon: '⚙️', label: 'Pengaturan' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">⚙️</span>
          <h2>Courtly Admin</h2>
        </div>
        
        <div className="admin-info">
          <div className="admin-avatar">AD</div>
          <div className="admin-details">
            <h4>Admin Courtly</h4>
            <span className="admin-role">Super Admin</span>
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