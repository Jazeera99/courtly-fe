// src/layouts/MitraLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/mitra/Sidebar';
import Header from '../components/mitra/Header';
import '../styles/MitraLayout.css';

const MitraLayout: React.FC = () => {
  return (
    <div className="mitra-layout">
      <Sidebar />
      <div className="mitra-main">
        <Header />
        <div className="mitra-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MitraLayout;