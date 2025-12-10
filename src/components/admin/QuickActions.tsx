import React from 'react';

const QuickActions: React.FC = () => {
  return (
    <div style={{ padding: 16 }}>
      <h3>Quick Actions</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn">Tambah User</button>
        <button className="btn">Tambah Venue</button>
        <button className="btn">Export Laporan</button>
      </div>
    </div>
  );
};

export default QuickActions;
