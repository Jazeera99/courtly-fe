// src/layouts/AdminLayout.tsx - PERBAIKAN
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import '../styles/AdminLayout.css';

const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      // Jika berpindah dari desktop ke mobile, reset state
      if (mobile) {
        setIsSidebarCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  // Di mobile, konten tetap di tempat, hanya overlay yang muncul
  return (
    <div className="admin-layout">
      {/* Hamburger Menu Button - hanya tampil di mobile */}
      {isMobile && (
        <button 
          className="hamburger-menu"
          onClick={toggleSidebar}
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isMobileOpen ? 'mobile-open' : ''}`}
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isCollapsed={!isMobile && isSidebarCollapsed}
        isMobileOpen={isMobile && isMobileOpen}
        onClose={closeMobileSidebar}
      />
      
      {/* Main content */}
      <div className={`admin-main ${isSidebarCollapsed && !isMobile ? 'sidebar-collapsed' : ''}`}>
        {/* Header - di desktop ada toggle button, di mobile tidak */}
        {!isMobile && (
          <Header 
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        )}
        
        {/* Content area */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;