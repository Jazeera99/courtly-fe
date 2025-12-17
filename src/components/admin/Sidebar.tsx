// src/components/admin/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../styles/AdminLayout.css';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, isMobileOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/users', icon: '👥', label: 'Pengguna' },
    { path: '/admin/venues', icon: '🏟️', label: 'Venue' },
    { path: '/admin/bookings', icon: '📅', label: 'Booking' },
    { path: '/admin/reports', icon: '📈', label: 'Laporan' },
    { path: '/admin/settings', icon: '⚙️', label: 'Pengaturan' },
  ];

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Header Sidebar */}
      <div className="sidebar-header" style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 style={{
          fontSize: isCollapsed ? '1.2rem' : '1.5rem',
          fontWeight: 'bold',
          marginBottom: '4px',
          transition: 'font-size 0.3s ease'
        }}>
          {isCollapsed ? '🏢' : 'Admin Panel'}
        </h1>
        {!isCollapsed && (
          <p style={{
            fontSize: '0.875rem',
            opacity: 0.9,
            marginBottom: '16px'
          }}>
            Courtly Sidoarjo
          </p>
        )}
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: isCollapsed ? '14px 12px' : '14px 24px',
                margin: '6px 12px',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                borderLeft: isActive ? '4px solid #ffffff' : 'none',
                boxShadow: isActive ? '0 4px 12px rgba(255, 255, 255, 0.1)' : 'none',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
              }}
            >
              <span style={{
                fontSize: '1.2rem',
                marginRight: isCollapsed ? '0' : '14px',
                transition: 'margin-right 0.3s ease',
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
              }}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span style={{
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  opacity: isActive ? 1 : 0.9
                }}>
                  {item.label}
                </span>
              )}
              {isActive && !isCollapsed && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  ✓
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      {!isCollapsed && (
        <div className="sidebar-footer" style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '12px' }}>
          <div style={{
            fontSize: '0.75rem',
            opacity: 0.8,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>🟢</span>
            <span>Status: Online</span>
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
            © 2025 Courtly
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
