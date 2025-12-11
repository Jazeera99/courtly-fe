// src/components/mitra/QuickActions.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PartnerDashboard.css';

const QuickActions: React.FC = () => {
  const actions = [
    { icon: '➕', label: 'Tambah Booking', path: '/mitra/bookings?action=new' },
    { icon: '📝', label: 'Atur Jadwal', path: '/mitra/schedule' },
    { icon: '🏟️', label: 'Kelola Lapangan', path: '/mitra/courts' },
    { icon: '📊', label: 'Laporan', path: '/mitra/revenue' },
    { icon: '🔔', label: 'Notifikasi', path: '/mitra/bookings' },
    { icon: '⚙️', label: 'Pengaturan', path: '/mitra/profile' },
  ];

  return (
    <div>
      <h2>⚡ Aksi Cepat</h2>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <Link key={index} to={action.path} className="action-button">
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;