// src/pages/mitra/Bookings.tsx
import React, { useEffect, useState } from 'react';
import '../../styles/PartnerDashboard.css';
import api from '@/utils/api';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data || []);
      } catch (err) {
        console.error('Failed to load bookings', err);
      }
    };
    load();
  }, []);

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1>📅 Kelola Booking</h1>
        <p style={{ color: '#6b7280' }}>Kelola semua booking lapangan</p>
      </div>

      <div className="bookings-table" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Lapangan</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Pelanggan</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Tanggal</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Waktu</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Harga</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', color: '#6b7280' }}>#{booking.id}</td>
                <td style={{ padding: '16px', fontWeight: '500' }}>{booking.court}</td>
                <td style={{ padding: '16px' }}>{booking.customer}</td>
                <td style={{ padding: '16px' }}>{booking.date}</td>
                <td style={{ padding: '16px' }}>{booking.time}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: booking.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
                    color: booking.status === 'confirmed' ? '#047857' : '#92400e'
                  }}>
                    {booking.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu'}
                  </span>
                </td>
                <td style={{ padding: '16px', fontWeight: '600' }}>Rp {booking.price.toLocaleString()}</td>
                <td style={{ padding: '16px' }}>
                  <button style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;