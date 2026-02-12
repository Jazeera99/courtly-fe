import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_VENUE_PROFILE } from '../../graphql/queries';
import '../../styles/MitraLayout.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  // Ambil venueId dari localStorage (asumsi kamu menyimpannya saat login)
  const venueId = localStorage.getItem('venueId') || "";

  // 3Panggil data dari database
  const { data, loading } = useQuery(GET_VENUE_PROFILE, {
    variables: { venueId },
    skip: !venueId
  });

  const ownerName = data?.getVenueProfile?.ownerName || (loading ? "Memuat..." : "MItra");
  const city = data?.getVenueProfile?.city || "Sidoarjo";
  const province = data?.getVenueProfile?.province || "Jawa Timur";

  const menuItems = [
    { path: '/partner/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/partner/bookings', icon: '📅', label: 'Lihat Booking' },
    { path: '/partner/courts', icon: '🏟️', label: 'Lapangan' },
    { path: '/partner/schedule', icon: '🕒', label: 'Jadwal' },
    { path: '/partner/revenue', icon: '💰', label: 'Pendapatan' },
  ];

  return (
    <div className="mitra-sidebar">
      {/* Header Sidebar */}
      <div className="sidebar-header" style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          marginBottom: '4px'
        }}>
          🏸 Mitra Lapangan
        </h1>
        <p style={{ 
          fontSize: '0.875rem', 
          opacity: 0.9,
          marginBottom: '16px'
        }}>
          {city} {province}
        </p>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          display: 'inline-block'
        }}>
          Pemilik: {ownerName}
        </div>
      </div>

      {/* Menu Items */}
      <nav style={{ padding: '20px 0', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '14px 24px',
                margin: '6px 12px',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                borderLeft: isActive ? '4px solid #ffffff' : 'none',
                boxShadow: isActive ? '0 4px 12px rgba(255, 255, 255, 0.1)' : 'none',
                transform: isActive ? 'translateX(4px)' : 'none',
              })}
              className="sidebar-menu-item"
            >
              <span style={{ 
                fontSize: '1.2rem', 
                marginRight: '14px',
                transition: 'transform 0.3s ease',
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                opacity: isActive ? 1 : 0.9
              }}>
                {item.label}
              </span>
              {isActive && (
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
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }}>
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
          © 2025 SportHub Reservasi
        </div>
      </div>
    </div>
  );
};

export default Sidebar;