// src/components/admin/Header.tsx - PERBAIKAN
import React from 'react';
import '../../styles/AdminDashboard.css';

interface HeaderProps {
  toggleSidebar?: () => void;
  isMobile?: boolean;
  isSidebarCollapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  isMobile = false,
  isSidebarCollapsed = false 
}) => {
  // Header hanya untuk desktop
  if (isMobile) {
    return null;
  }

  return (
    <header style={{
      background: 'white',
      padding: '20px 20px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button
          onClick={toggleSidebar}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#f3f4f6',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#374151',
            transition: 'all 0.3s ease'
          }}
        >
          {isSidebarCollapsed ? '→' : '←'}
        </button>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: '800',
            color: '#111827'
          }}>
            Dashboard Admin
          </h1>
          <p style={{ 
            margin: '4px 0 0 0', 
            color: '#6b7280',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            Ringkasan aktivitas dan statistik sistem
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button style={{
          padding: '12px 20px',
          background: '#f8fafc',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          cursor: 'pointer',
          color: '#374151',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontSize: '18px' }}>🔔</span>
          <span>Notifikasi</span>
          <span style={{
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            3
          </span>
        </button>
        
        <button style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '14px',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          Super Admin
        </button>
      </div>
    </header>
  );
};

export default Header;