// src/components/admin/QuickActions.tsx
import React from 'react';
import '../../styles/AdminDashboard.css';

const QuickActions: React.FC = () => {
  const actions = [
    { icon: '➕', label: 'Tambah Venue', onClick: () => console.log('Add Venue') },
    { icon: '👥', label: 'Tambah Pengguna', onClick: () => console.log('Add User') },
    { icon: '📅', label: 'Buat Booking', onClick: () => console.log('Create Booking') },
    { icon: '📊', label: 'Generate Report', onClick: () => console.log('Generate Report') },
    { icon: '🔔', label: 'Kirim Notifikasi', onClick: () => console.log('Send Notification') },
    { icon: '⚙️', label: 'Pengaturan', onClick: () => console.log('Settings') },
  ];

  return (
    <div className="actions-grid">
      {actions.map((action, index) => (
        <button
          key={index}
          className="action-btn"
          onClick={action.onClick}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;