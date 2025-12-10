import React from 'react';

const QuickActions: React.FC = () => {
  return (
    <div style={{ padding: 16 }}>
      <h3>Quick Actions (Partner)</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn">Tambah Jadwal</button>
        <button className="btn">Konfirmasi Booking</button>
      </div>
    </div>
  );
};

export default QuickActions;
