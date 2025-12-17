// src/layouts/MitraLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/mitra/Sidebar';
import Header from '../components/mitra/Header';
import '../styles/MitraLayout.css';

const MitraLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="mitra-layout">
      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`mitra-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <Sidebar onClose={isMobile ? closeSidebar : undefined} />
      </div>
      
      {/* Main Content */}
      <div className="mitra-main">
        <Header onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="mitra-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MitraLayout;